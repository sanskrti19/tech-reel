"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState, useCallback } from "react";
import ReelCard from "./ReelCard";
import SkeletonReel from "../SkeletonReel";

export default function SwipeContainer() {
  const viewedPosts = useRef(new Set());
  const initialExcludeIds = useRef([]);
  const containerRef = useRef(null);

  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States required by the prompt
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch facts function
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

  // Initial load on mount
  useEffect(() => {
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem("viewedPostIds") || "[]");
      initialExcludeIds.current = stored;
    } catch (e) {
      console.error(e);
    }
    fetchFacts(1, true);
  }, []);

  // Handle scroll events to detect near bottom
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

  const markViewed = useCallback(async (postId) => {
    if (!postId) return;

    console.log("VIEW:", postId);

    if (viewedPosts.current.has(postId)) {
      return;
    }

    viewedPosts.current.add(postId);

    // Save to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("viewedPostIds") || "[]");
      if (!stored.includes(postId)) {
        stored.push(postId);
        localStorage.setItem("viewedPostIds", JSON.stringify(stored));
      }
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }

    try {
      await fetch(
        `http://localhost:5000/api/posts/${postId}/view`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (loading) {
    return <SkeletonReel />;
  }

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
        <ReelCard
          key={fact._id}
          fact={fact}
          markViewed={markViewed}
        />
      ))}
      {loadingMore && <SkeletonReel />}
    </div>
  );
}