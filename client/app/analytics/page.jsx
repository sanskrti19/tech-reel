"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading analytics...</div>;
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-24">
        <div className="max-w-4xl mx-auto rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-8">
          <p className="text-xl font-extralight">Create your first post to see analytics.</p>
          <button onClick={() => router.push("/create")} className="mt-6 rounded-full bg-white text-black px-5 py-3">
            Create post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-24">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">Analytics</p>
          <h1 className="mt-2 text-4xl font-extralight tracking-tight">Creator dashboard</h1>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Total posts" value={analytics.totalPosts || 0} />
            <Stat label="Total views" value={analytics.totalViews || 0} />
            <Stat label="Total saves" value={analytics.totalSaves || 0} />
          </div>
        </div>

        <div className="rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-8">
          <h2 className="text-2xl font-extralight">Per-post analytics</h2>
          {analytics.posts?.length ? (
            <div className="mt-6 space-y-3">
              {analytics.posts.map((post) => (
                <div key={post._id} className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <img src={post.image || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"} alt={post.title} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium line-clamp-1">{post.title}</p>
                    <p className="text-sm text-white/60">{post.source || "Creator"}</p>
                  </div>
                  <div className="text-right text-sm text-white/75">
                    <p>{post.views || 0} views</p>
                    <p className="text-white/50">{Array.isArray(post.tags) ? post.tags.join(", ") : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-white/60">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">{label}</p>
    </div>
  );
}
