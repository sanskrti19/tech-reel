// Centralized API client for TechReel.
// All client-side requests to the backend should go through here so the
// base URL is defined in exactly one place (driven by env var, with a
// localhost fallback for local development).

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Low-level fetch wrapper. Prefixes relative paths with API_BASE_URL,
 * sets JSON headers by default, and throws on non-2xx responses so
 * callers can use try/catch instead of checking res.ok everywhere.
 */
async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Some endpoints (e.g. view tracking) may return no body.
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Posts / feed
  getPosts: ({ page = 1, limit = 10, exclude = [] } = {}) => {
    const excludeParam = Array.isArray(exclude) ? exclude.join(",") : exclude;
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      exclude: excludeParam || "",
    });
    return request(`/api/posts?${params.toString()}`);
  },

  searchPosts: (q) => {
    const params = new URLSearchParams({ q });
    return request(`/api/posts/search?${params.toString()}`);
  },

  incrementView: (postId) =>
    request(`/api/posts/${postId}/view`, { method: "POST" }),

  // Auth
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (email, password) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export default api;