// src/lib/api.js

const BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const auth = {
  me:     ()                            => request('GET',  '/auth/me'),
  login:  (email, password)             => request('POST', '/auth/login',  { email, password }),
  signup: (email, password, name)       => request('POST', '/auth/signup', { email, password, name }),
  logout: ()                            => request('POST', '/auth/logout'),
};

export const pages = {
  list:      ()                         => request('GET',    '/pages'),
  create:    (data)                     => request('POST',   '/pages', data),
  get:       (id)                       => request('GET',    `/pages/${id}`),
  update:    (id, data)                 => request('PUT',    `/pages/${id}`, data),
  remove:    (id)                       => request('DELETE', `/pages/${id}`),
  publish:   (id)                       => request('POST',   `/pages/${id}/publish`),
  unpublish: (id)                       => request('POST',   `/pages/${id}/unpublish`),
  duplicate: (id)                       => request('POST',   `/pages/${id}/duplicate`),
  checkSlug: (id, slug)                 => request('GET',    `/pages/${id}/slug-check?slug=${encodeURIComponent(slug)}`),
};

export const publicApi = {
  getPage:       (slug)                 => request('GET',  `/public/pages/${slug}`),
  trackView:     (slug)                 => request('POST', `/public/pages/${slug}/view`),
  submitContact: (slug, data)           => request('POST', `/public/pages/${slug}/contact`, data),
};