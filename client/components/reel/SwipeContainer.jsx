"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ReelCard from "./ReelCard";
import SkeletonReel from "../SkeletonReel";

export default function SwipeContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const focusId = searchParams.get("focus");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPosts, setHistoryPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const viewedPosts = useRef(new Set());
  const initialExcludeIds = useRef([]);
  const containerRef = useRef(null);
  const cardRefs = useRef({});

  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States required by the prompt
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener("techreel-auth-changed", syncUser);
    return () => window.removeEventListener("techreel-auth-changed", syncUser);
  }, []);

  
  const fetchFacts = async (pageNum, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const excludeParam = initialExcludeIds.current.join(",");
      const url = `http://localhost:5000/api/posts?page=${pageNum}&limit=10&exclude=${excludeParam}`;
      const response = await fetch(url);
      const data = await response.json();

      const newPosts = data.posts || [];
      setFacts((prev) => (isInitial ? newPosts : [...prev, ...newPosts]));
      setHasMore(data.hasMore ?? false);
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const todayKey = () => new Date().toISOString().slice(0, 10);

  const readTodayHistory = useCallback(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("viewedHistory") || "{}");
      if (raw.date !== todayKey()) {
        return [];
      }
      return Array.isArray(raw.posts) ? raw.posts : [];
    } catch {
      return [];
    }
  }, []);

  const writeTodayHistory = useCallback((post) => {
    try {
      const raw = JSON.parse(localStorage.getItem("viewedHistory") || "{}");
      const base = raw.date === todayKey() && Array.isArray(raw.posts) ? raw.posts : [];
      const deduped = base.filter((item) => item._id !== post._id);
      const updated = [post, ...deduped];

      localStorage.setItem(
        "viewedHistory",
        JSON.stringify({
          date: todayKey(),
          posts: updated,
        })
      );

      setHistoryPosts(updated);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadSavedPosts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSavedPosts([]);
      return;
    }

    setSavedLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSavedPosts(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavedLoading(false);
    }
  }, []);

  useEffect(() => {
    let stored = [];
    try {
      stored = JSON.parse(sessionStorage.getItem("viewedPostIds") || "[]");
      initialExcludeIds.current = stored;
    } catch (e) {
      console.error(e);
    }
    setHistoryPosts(readTodayHistory());
    loadSavedPosts();
    fetchFacts(1, true);
  }, [loadSavedPosts, readTodayHistory]);

  useEffect(() => {
    if (!focusId || loading) return;
    const el = cardRefs.current[focusId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusId, loading, facts]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowSaved(false);
        setShowHistory(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!showSearch) return;

    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/posts/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSearchResults(data.posts || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery, showSearch]);
 
  const handleScroll = (e) => {
    if (loading || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchFacts(nextPage, false);
        return nextPage;
      });
    }
  };

  const markViewed = useCallback(async (post) => {
    if (!post?._id) return;
    const postId = post._id;

    console.log("VIEW:", postId);

    if (viewedPosts.current.has(postId)) {
      return;
    }

    viewedPosts.current.add(postId);

    // Save to localStorage
    try {
      const stored = JSON.parse(sessionStorage.getItem("viewedPostIds") || "[]");
      if (!stored.includes(postId)) {
        stored.push(postId);
        sessionStorage.setItem("viewedPostIds", JSON.stringify(stored));
      }
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/view`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok && data?.post) {
        setFacts((prev) =>
          prev.map((item) =>
            String(item._id) === String(postId)
              ? { ...item, views: data.post.views }
              : item
          )
        );
      }
    } catch (err) {
      console.log(err);
    }

    writeTodayHistory({
      _id: post._id,
      title: post.title,
      source: post.source,
      image: post.image,
      description: post.description,
      url: post.url,
    });
  }, [writeTodayHistory]);

  const savedIdSet = useMemo(
    () => new Set(savedPosts.map((post) => String(post._id))),
    [savedPosts]
  );

  const navigateToReel = useCallback((post) => {
    const id = typeof post === "string" ? post : post?._id;
    if (!id) return;

    const exists = facts.some((item) => String(item._id) === String(id));

    if (!exists && typeof post === "object") {
      setFacts((prev) => {
        if (prev.some((item) => String(item._id) === String(id))) {
          return prev;
        }
        return [post, ...prev];
      });
    }

    setTimeout(() => {
      const el = cardRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, exists ? 0 : 140);
  }, [facts]);

  const handleToggleSave = useCallback(async (fact) => {
    const token = localStorage.getItem("token");
    if (!token || !fact?._id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookmarks/${fact._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return;

      setSavedPosts((prev) => {
        if (data.saved) {
          if (prev.some((item) => String(item._id) === String(fact._id))) {
            return prev;
          }
          return [fact, ...prev];
        }
        return prev.filter((item) => String(item._id) !== String(fact._id));
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemoveSaved = useCallback(async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookmarks/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;
      setSavedPosts((prev) => prev.filter((item) => String(item._id) !== String(postId)));
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (loading) {
    return <SkeletonReel />;
  }

  const isAuthenticated = Boolean(currentUser);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
        h-screen
        overflow-y-scroll
        snap-y
        snap-mandatory
      "
    >
      {facts.map((fact) => (
        <div
          key={fact._id}
          ref={(el) => {
            if (el) {
              cardRefs.current[fact._id] = el;
            }
          }}
        >
          <ReelCard
            fact={fact}
            markViewed={markViewed}
            isSaved={savedIdSet.has(String(fact._id))}
            onToggleSave={handleToggleSave}
            showFooterActions={false}
            onOpenProfile={(userId) => {
              if (!userId) return;
              router.push(`/profile?userId=${userId}`);
            }}
            onOpenSearch={() => {
              setShowSearch(true);
              setSearchQuery("");
              setSearchResults([]);
            }}
            onOpenSaved={async () => {
              await loadSavedPosts();
              setShowSaved(true);
            }}
            onOpenHistory={() => {
              setHistoryPosts(readTodayHistory());
              setShowHistory(true);
            }}
            onGridMenu={() => {
              // TODO: Wire top-right grid menu actions in a future Explore release.
              console.log("Coming soon");
            }}
          />
        </div>
      ))}

      {showSearch && (
        <div
          onClick={() => setShowSearch(false)}
          className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-[32px] bg-white/10 border border-white/15 backdrop-blur-2xl p-5 text-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-250"
          >
            <input
              autoFocus
              type="text"
              placeholder="Search title, source, description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 outline-none"
            />

            <div className="mt-4 max-h-[48vh] overflow-y-auto space-y-2">
              {searchLoading && <p className="text-sm text-white/70">Searching...</p>}

              {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                <p className="text-sm text-white/60">No results found.</p>
              )}

              {searchResults.map((post) => (
                <button
                  key={post._id}
                  onClick={() => {
                    setShowSearch(false);
                    navigateToReel(post);
                  }}
                  className="w-full text-left rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
                >
                  <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                  <p className="text-xs text-white/70 mt-1 line-clamp-2">
                    {post.source} • {post.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSaved && (
        <div
          onClick={() => setShowSaved(false)}
          className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl h-[72vh] rounded-[32px] bg-white/10 border border-white/15 backdrop-blur-2xl p-5 text-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-250 flex flex-col"
          >
            <h3 className="text-2xl font-light tracking-tight">Saved Posts</h3>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3">
              {savedLoading && <p className="text-sm text-white/70">Loading saved posts...</p>}

              {!savedLoading && savedPosts.length === 0 && (
                <p className="text-sm text-white/60">No saved posts yet.</p>
              )}

              {savedPosts.map((post) => (
                <div
                  key={post._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 flex gap-3"
                >
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"}
                    alt={post.title}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <button
                    onClick={() => {
                      setShowSaved(false);
                      navigateToReel(post);
                    }}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs text-white/65 mt-1 line-clamp-1">{post.source}</p>
                  </button>
                  <button
                    onClick={() => handleRemoveSaved(post._id)}
                    className="text-xs text-white/70 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl h-[72vh] rounded-[32px] bg-white/10 border border-white/15 backdrop-blur-2xl p-5 text-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-250 flex flex-col"
          >
            <h3 className="text-2xl font-light tracking-tight">Today&apos;s History</h3>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3">
              {historyPosts.length === 0 && (
                <p className="text-sm text-white/60">No viewed reels today.</p>
              )}

              {historyPosts.map((post) => (
                <button
                  key={post._id}
                  onClick={() => {
                    setShowHistory(false);
                    navigateToReel(post);
                  }}
                  className="w-full text-left rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
                >
                  <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                  <p className="text-xs text-white/65 mt-1 line-clamp-1">{post.source}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loadingMore && <SkeletonReel />}
    </div>
  );
}