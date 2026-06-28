"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookmarksPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const removeBookmark = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://localhost:5000/api/bookmarks/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) setPosts((prev) => prev.filter((post) => String(post._id) !== String(postId)));
  };

  const openPost = (postId) => router.push(`/explore?focus=${postId}`);

  return (
    <div className="min-h-screen bg-black text-white px-5 py-24">
      <div className="max-w-4xl mx-auto rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-8">
        <h1 className="text-4xl font-extralight tracking-tight">Bookmarks</h1>
        {loading ? (
          <p className="mt-6 text-white/60">Loading bookmarks...</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-white/60">No saved posts yet.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
                <button onClick={() => openPost(post._id)} className="flex items-center gap-4 flex-1 text-left">
                  <img src={post.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"} alt={post.title} className="h-16 w-16 rounded-2xl object-cover" />
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-white/60">{post.source}</p>
                  </div>
                </button>
                <button onClick={() => removeBookmark(post._id)} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
