// In dev, Vite proxies /api to the PathPoint backend (see vite.config.js).
// For other setups, set VITE_API_URL to the backend origin, e.g. https://api.example.com
const API_URL = import.meta.env.VITE_API_URL || "";

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the PathPoint server. Is it running?");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // The dev proxy answers with an empty 5xx when the backend is down.
    const fallback =
      res.status >= 500 ? "Cannot reach the PathPoint server. Is it running?" : `Request failed (${res.status})`;
    const error = new Error(data.message || fallback);
    error.status = res.status;
    throw error;
  }

  return data;
}

export function login(username, password) {
  return apiRequest("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getCurrentAdmin(token) {
  return apiRequest("/api/auth/me", { token });
}
