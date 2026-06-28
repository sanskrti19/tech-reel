"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Edit3, Grid3x3, Bookmark, X } from "lucide-react";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";

export default function ProfileView({ userId: userIdProp = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = userIdProp || searchParams.get("userId") || "";
  const resolvedUserId = userId;

  const [profileData, setProfileData] = useState(null);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", avatar: "" });

  const isOwner = useMemo(() => profileData?.isOwner, [profileData]);

  useEffect(() => {
    try {
      setToken(localStorage.getItem("token"));
    } catch {
      setToken(null);
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const controller = new AbortController();

    const loadProfile = async () => {
      setLoading(true);
      try {
        const isPublicCreatorView = Boolean(resolvedUserId);
        const url = isPublicCreatorView
          ? `http://localhost:5000/api/users/creator/${encodeURIComponent(resolvedUserId)}`
          : "http://localhost:5000/api/users/profile";

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");

        setProfileData(data.profile);
        setCreatedPosts(data.createdPosts || []);
        setSavedPosts(data.savedPosts || []);
        setEditForm({
          name: data.profile?.name || "",
          bio: data.profile?.bio || "",
          avatar: data.profile?.avatar || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    return () => controller.abort();
  }, [resolvedUserId, token, authReady]);

  useEffect(() => {
    if (!editOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setEditOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editOpen]);

  const openReel = (postId) => {
    router.push(`/explore?focus=${postId}`);
  };

  const toggleFollow = async () => {
    if (!token || !profileData?.id) return;

    setFollowLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/creator/${profileData.id}/follow`, {
        method: profileData.isFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update follow state");

      setProfileData(data.profile);
      setCreatedPosts(data.createdPosts || []);
      setSavedPosts(data.savedPosts || []);
      window.dispatchEvent(new Event("techreel-auth-changed"));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleAvatarUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditForm((prev) => ({ ...prev, avatar: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      setProfileData(data.profile);
      setCreatedPosts(data.createdPosts || []);
      setSavedPosts(data.savedPosts || []);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.profile?.id,
          email: profileData?.email,
          name: data.profile?.name,
          avatar: data.profile?.avatar,
          bio: data.profile?.bio,
        })
      );
      setEditOpen(false);
      window.dispatchEvent(new Event("techreel-auth-changed"));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Profile not found</div>;
  }

  const activePosts = activeTab === "created" ? createdPosts : savedPosts;

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.85))]" />
      <div className="relative z-10 max-w-5xl mx-auto px-5 py-6 sm:py-10">
        <div className="rounded-[40px] border border-white/10 bg-white/8 backdrop-blur-3xl p-6 sm:p-8 shadow-[0_18px_64px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 justify-between">
            <div className="flex items-center gap-5">
              <img
                src={profileData.avatar || DEFAULT_AVATAR}
                alt={profileData.name}
                className="h-24 w-24 rounded-[28px] object-cover border border-white/15"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">Creator profile</p>
                <h1 className="mt-2 text-4xl sm:text-5xl font-extralight tracking-tight">{profileData.name}</h1>
                <p className="mt-2 text-sm text-white/55">@{profileData.name}</p>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-7">
                  {profileData.bio || "Minimal creator profile for short-form technical content."}
                </p>
              </div>
            </div>

            {isOwner ? (
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl"
              >
                <Edit3 size={16} /> Edit profile
              </button>
            ) : token ? (
              <button
                onClick={toggleFollow}
                disabled={followLoading}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2 text-sm text-black backdrop-blur-xl disabled:opacity-70"
              >
                {followLoading ? "Updating..." : profileData.isFollowing ? "Unfollow" : "Follow"}
              </button>
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold">{profileData.postsCount || 0}</p>
              <p className="text-xs text-white/60 mt-1">Posts</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold">{profileData.followersCount || 0}</p>
              <p className="text-xs text-white/60 mt-1">Followers</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold">{profileData.followingCount || 0}</p>
              <p className="text-xs text-white/60 mt-1">Following</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold">{profileData.savedPostsCount || 0}</p>
              <p className="text-xs text-white/60 mt-1">Saved</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <button onClick={() => setActiveTab("created")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border ${activeTab === "created" ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/75"}`}>
              <Grid3x3 size={16} /> Created
            </button>
            {isOwner && (
              <button onClick={() => setActiveTab("saved")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border ${activeTab === "saved" ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/75"}`}>
                <Bookmark size={16} /> Saved
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePosts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/65">
                No posts to show yet.
              </div>
            ) : (
              activePosts.map((post) => (
                <button
                  key={post._id}
                  onClick={() => openReel(post._id)}
                  className="group text-left rounded-[28px] border border-white/10 bg-white/5 overflow-hidden transition hover:bg-white/10"
                >
                  <img src={post.image || DEFAULT_AVATAR} alt={post.title} className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition" />
                  <div className="p-4">
                    <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                    <p className="mt-2 text-xs text-white/60 line-clamp-1">{post.creator?.name ? `@${post.creator.name}` : post.source || "TechReel"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <div onClick={() => setEditOpen(false)} className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-5">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-[40px] border border-white/12 bg-white/10 backdrop-blur-3xl p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-extralight">Edit profile</h3>
              <button onClick={() => setEditOpen(false)} className="text-white/60"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-white/55">Display name</span>
                <input value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-white/55">Bio</span>
                <textarea value={editForm.bio} onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none resize-none" />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-white/55">Avatar URL or upload</span>
                <input value={editForm.avatar} onChange={(e) => setEditForm((prev) => ({ ...prev, avatar: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
              </label>

              <label className="block rounded-[28px] border border-dashed border-white/15 bg-white/5 px-4 py-4 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files?.[0])} />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"><Camera size={16} /></div>
                  <div>
                    <p className="text-sm font-medium">Upload a new avatar</p>
                    <p className="text-xs text-white/60">Drag-and-drop not required here; quick upload only.</p>
                  </div>
                </div>
              </label>

              {editForm.avatar && <img src={editForm.avatar} alt="Avatar preview" className="h-24 w-24 rounded-[24px] object-cover border border-white/10" />}

              <button onClick={saveProfile} disabled={saving} className="w-full rounded-2xl bg-white py-3.5 text-black font-medium">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
