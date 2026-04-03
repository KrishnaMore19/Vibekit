// src/lib/api.js — Frontend API client

const BASE = '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem('vk_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new ApiError(msg, res.status);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  signup: (email, password, name) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

// ─── Pages ────────────────────────────────────────────────────────────────────
export const pages = {
  list: () => request('/pages'),
  create: (data) => request('/pages', { method: 'POST', body: JSON.stringify(data) }),
  get: (id) => request(`/pages/${id}`),
  update: (id, data) => request(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/pages/${id}`, { method: 'DELETE' }),
  publish: (id) => request(`/pages/${id}/publish`, { method: 'POST' }),
  unpublish: (id) => request(`/pages/${id}/unpublish`, { method: 'POST' }),
  duplicate: (id) => request(`/pages/${id}/duplicate`, { method: 'POST' }),
  checkSlug: (id, slug) => request(`/pages/${id}/slug-check?slug=${encodeURIComponent(slug)}`),
};

// ─── Public ───────────────────────────────────────────────────────────────────
export const publicApi = {
  getPage: (slug) => request(`/public/pages/${slug}`),
  trackView: (slug) => request(`/public/pages/${slug}/view`, { method: 'POST' }),
  contact: (slug, data) =>
    request(`/public/pages/${slug}/contact`, { method: 'POST', body: JSON.stringify(data) }),
};

export { ApiError };
