"use client";

import { useEffect, useRef, useState } from "react";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";

export default function CreatePostModal({ open, onClose, onCreated }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    source: "",
    tags: "",
    url: "",
    image: "",
    category: "Tutorial",
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const setImageFromFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      onCreated?.(data.post);
      setForm({
        title: "",
        description: "",
        source: "",
        tags: "",
        url: "",
        image: "",
        category: "Tutorial",
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] max-h-[82vh] overflow-hidden rounded-[40px] border border-white/12 bg-white/10 backdrop-blur-3xl text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col"
      >
        <div className="flex items-center justify-between px-7 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/55">Create</p>
            <h2 className="text-2xl font-extralight tracking-tight mt-1">New reel</h2>
          </div>

          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 px-7 pb-7 flex-1 overflow-y-auto space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/55">Title</span>
            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="What are you sharing?" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/55">Description / Content</span>
            <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none resize-none" placeholder="Write something concise and useful..." />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/55">Source Name</span>
              <input value={form.source} onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="Your name or publication" />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-white/55">Category</span>
              <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="Tutorial, AI, DevOps..." />
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/55">Tags</span>
            <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="react, nextjs, ai" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/55">External Link</span>
            <input value={form.url} onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="https://... (optional)" />
          </label>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              setImageFromFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-[28px] border border-dashed px-5 py-5 transition-colors ${dragActive ? "border-white/40 bg-white/12" : "border-white/15 bg-white/5"}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFromFile(e.target.files?.[0])} />
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center">
                {form.image ? <ImageIcon size={18} /> : <UploadCloud size={18} />}
              </div>
              <div>
                <p className="text-sm font-medium">Drag & drop a cover image</p>
                <p className="text-xs text-white/60">Or click to upload, or use a base64 preview URL.</p>
              </div>
            </div>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/55">Cover Image URL</span>
            <input value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" placeholder="https://... or upload above" />
          </label>

          {form.image && (
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
              <img src={form.image} alt="Cover preview" className="h-48 w-full object-cover" />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-white text-black py-4 font-medium active:scale-[0.99] transition-all disabled:opacity-70"
          >
            {submitting ? "Publishing..." : "Publish reel"}
          </button>
        </form>
      </div>
    </div>
  );
}
