"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePostModal from "@/components/creator/CreatePostModal";

export default function CreatePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      setToken(localStorage.getItem("token"));
    } catch {
      setToken(null);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-24 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-8 text-center">
          <h1 className="text-4xl font-extralight tracking-tight">Sign in to create</h1>
          <p className="mt-4 text-white/65 leading-7">Creating reels is available to authenticated creators only.</p>
          <button onClick={() => router.back()} className="mt-6 rounded-full bg-white text-black px-5 py-3 font-medium">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatePostModal
        open
        onClose={() => router.back()}
        onCreated={(post) => router.push(`/explore?focus=${post._id}`)}
      />
    </div>
  );
}
