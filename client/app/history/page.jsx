"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = JSON.parse(localStorage.getItem("viewedHistory") || "{}");
      if (raw.date === today && Array.isArray(raw.posts)) {
        setPosts(raw.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-5 py-24">
      <div className="max-w-4xl mx-auto rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-8">
        <h1 className="text-4xl font-extralight tracking-tight">History</h1>
        {loading ? (
          <p className="mt-6 text-white/60">Loading history...</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-white/60">No viewed reels today.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {posts.map((post) => (
              <button key={post._id} onClick={() => router.push(`/explore?focus=${post._id}`)} className="w-full flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4 text-left">
                <img src={post.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"} alt={post.title} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-white/60">{post.source}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
