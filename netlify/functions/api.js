// netlify/functions/api.js
// VibeKit Studio - Complete API Handler
// All routes handled via path matching

// Load .env from project root (two levels up from netlify/functions/)
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// ─── DB Pool ─────────────────────────────────────────────────────────────────
let pool;
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Create a .env file in the project root with DATABASE_URL=postgresql://user:password@host:5432/dbname'
      );
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const BCRYPT_ROUNDS = 12;

// ─── CORS Headers ─────────────────────────────────────────────────────────────
function getCorsHeaders(origin) {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:8888',
  ].filter(Boolean);

  const responseOrigin =
    allowedOrigins.includes(origin) || !origin
      ? origin || allowedOrigins[0]
      : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': responseOrigin || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };
}

// ─── Response helpers ─────────────────────────────────────────────────────────
const ok = (headers, data, status = 200) => ({
  statusCode: status,
  headers,
  body: JSON.stringify(data),
});
const err = (headers, message, status = 400) => ({
  statusCode: status,
  headers,
  body: JSON.stringify({ error: message }),
});

// ─── Auth helpers ─────────────────────────────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function extractToken(event) {
  // Try Authorization header first
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);

  // Try cookie
  const cookie = event.headers?.cookie || '';
  const match = cookie.match(/vk_token=([^;]+)/);
  return match ? match[1] : null;
}

async function requireAuth(event, headers) {
  const token = extractToken(event);
  if (!token) throw { status: 401, message: 'Unauthorized' };
  const payload = verifyToken(token);
  if (!payload) throw { status: 401, message: 'Token invalid or expired' };
  return payload;
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'untitled';
}

async function uniqueSlug(db, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 0;
  while (true) {
    const query = excludeId
      ? 'SELECT id FROM pages WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM pages WHERE slug = $1';
    const params = excludeId ? [slug, excludeId] : [slug];
    const { rows } = await db.query(query, params);
    if (rows.length === 0) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

// ─── Input validation ─────────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Route handlers ───────────────────────────────────────────────────────────

// POST /auth/signup
async function signup(event, headers) {
  const db = getPool();
  const { email, password, name } = JSON.parse(event.body || '{}');

  if (!email || !password) return err(headers, 'Email and password required');
  if (!validateEmail(email)) return err(headers, 'Invalid email format');
  if (password.length < 8) return err(headers, 'Password must be at least 8 characters');

  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) return err(headers, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const id = uuidv4();
  const now = new Date();

  const { rows } = await db.query(
    'INSERT INTO users (id, email, password_hash, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, created_at',
    [id, email.toLowerCase(), passwordHash, name || null, now, now]
  );

  const user = rows[0];
  const token = signToken({ userId: user.id, email: user.email });

  return {
    statusCode: 201,
    headers: {
      ...headers,
      'Set-Cookie': `vk_token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`,
    },
    body: JSON.stringify({ user: { id: user.id, email: user.email, name: user.name }, token }),
  };
}

// POST /auth/login
async function login(event, headers) {
  const db = getPool();
  const { email, password } = JSON.parse(event.body || '{}');

  if (!email || !password) return err(headers, 'Email and password required');

  const { rows } = await db.query(
    'SELECT id, email, name, password_hash FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  if (rows.length === 0) return err(headers, 'Invalid credentials', 401);

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return err(headers, 'Invalid credentials', 401);

  const token = signToken({ userId: user.id, email: user.email });

  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Set-Cookie': `vk_token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`,
    },
    body: JSON.stringify({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    }),
  };
}

// POST /auth/logout
async function logout(event, headers) {
  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Set-Cookie': 'vk_token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0',
    },
    body: JSON.stringify({ message: 'Logged out' }),
  };
}

// GET /auth/me
async function me(event, headers) {
  const db = getPool();
  const payload = await requireAuth(event, headers);
  const { rows } = await db.query(
    'SELECT id, email, name, created_at FROM users WHERE id = $1',
    [payload.userId]
  );
  if (rows.length === 0) return err(headers, 'User not found', 404);
  return ok(headers, { user: rows[0] });
}

// GET /pages
async function listPages(event, headers) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const { rows } = await db.query(
    `SELECT id, title, slug, theme, status, view_count, created_at, updated_at
     FROM pages WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  );
  return ok(headers, { pages: rows });
}

// POST /pages
async function createPage(event, headers) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const { title = 'Untitled Page', theme = 'minimal', content } = JSON.parse(event.body || '{}');

  const base = slugify(title);
  const slug = await uniqueSlug(db, base);

  const defaultContent = content || {
    hero: {
      title: title || 'Welcome to My Page',
      subtitle: 'A beautiful page built with VibeKit Studio',
      buttonText: 'Get Started',
      buttonUrl: '#contact',
    },
    features: [
      { id: uuidv4(), title: 'Feature One', description: 'Describe your first amazing feature here.' },
      { id: uuidv4(), title: 'Feature Two', description: 'Describe your second amazing feature here.' },
      { id: uuidv4(), title: 'Feature Three', description: 'Describe your third amazing feature here.' },
    ],
    gallery: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', alt: 'Gallery 1' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1615414050946-39b55a7f86ea?w=800&q=80', alt: 'Gallery 2' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&q=80', alt: 'Gallery 3' },
    ],
    contact: { title: 'Get In Touch', subtitle: 'We would love to hear from you.' },
    sectionOrder: ['hero', 'features', 'gallery', 'contact'],
  };

  const pageId = uuidv4();
  const now = new Date();
  const { rows } = await db.query(
    `INSERT INTO pages (id, user_id, title, slug, theme, content, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [pageId, userId, title, slug, theme, JSON.stringify(defaultContent), now, now]
  );

  return ok(headers, { page: rows[0] }, 201);
}

// GET /pages/:id
async function getPage(event, headers, pageId) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const { rows } = await db.query(
    'SELECT * FROM pages WHERE id = $1 AND user_id = $2',
    [pageId, userId]
  );
  if (rows.length === 0) return err(headers, 'Page not found', 404);
  return ok(headers, { page: rows[0] });
}

// PUT /pages/:id
async function updatePage(event, headers, pageId) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const body = JSON.parse(event.body || '{}');
  const { title, theme, content } = body;

  // Verify ownership
  const existing = await db.query('SELECT id, title FROM pages WHERE id = $1 AND user_id = $2', [pageId, userId]);
  if (existing.rows.length === 0) return err(headers, 'Page not found', 404);

  const updates = [];
  const params = [];
  let idx = 1;

  if (title !== undefined) { updates.push(`title = $${idx++}`); params.push(title); }
  if (theme !== undefined) { updates.push(`theme = $${idx++}`); params.push(theme); }
  if (content !== undefined) { updates.push(`content = $${idx++}`); params.push(JSON.stringify(content)); }

  if (updates.length === 0) return err(headers, 'No fields to update');

  params.push(pageId, userId);
  const { rows } = await db.query(
    `UPDATE pages SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
    params
  );

  return ok(headers, { page: rows[0] });
}

// POST /pages/:id/publish
async function publishPage(event, headers, pageId) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const { rows } = await db.query(
    `UPDATE pages SET status = 'PUBLISHED' WHERE id = $1 AND user_id = $2 RETURNING *`,
    [pageId, userId]
  );
  if (rows.length === 0) return err(headers, 'Page not found', 404);
  return ok(headers, { page: rows[0] });
}

// POST /pages/:id/unpublish
async function unpublishPage(event, headers, pageId) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const { rows } = await db.query(
    `UPDATE pages SET status = 'DRAFT' WHERE id = $1 AND user_id = $2 RETURNING *`,
    [pageId, userId]
  );
  if (rows.length === 0) return err(headers, 'Page not found', 404);
  return ok(headers, { page: rows[0] });
}

// POST /pages/:id/duplicate
async function duplicatePage(event, headers, pageId) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);

  const existing = await db.query('SELECT * FROM pages WHERE id = $1 AND user_id = $2', [pageId, userId]);
  if (existing.rows.length === 0) return err(headers, 'Page not found', 404);

  const orig = existing.rows[0];
  const newTitle = `${orig.title} (Copy)`;
  const slug = await uniqueSlug(db, slugify(newTitle));

  const newPageId = uuidv4();
  const now = new Date();
  const { rows } = await db.query(
    `INSERT INTO pages (id, user_id, title, slug, theme, content, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'DRAFT', $7, $8) RETURNING *`,
    [newPageId, userId, newTitle, slug, orig.theme, JSON.stringify(orig.content), now, now]
  );

  return ok(headers, { page: rows[0] }, 201);
}

// DELETE /pages/:id
async function deletePage(event, headers, pageId) {
  const db = getPool();
  const { userId } = await requireAuth(event, headers);
  const { rows } = await db.query(
    'DELETE FROM pages WHERE id = $1 AND user_id = $2 RETURNING id',
    [pageId, userId]
  );
  if (rows.length === 0) return err(headers, 'Page not found', 404);
  return ok(headers, { message: 'Page deleted' });
}

// GET /public/pages/:slug
async function getPublicPage(event, headers, slug) {
  const db = getPool();
  const { rows } = await db.query(
    `SELECT id, title, slug, theme, content, view_count, created_at
     FROM pages WHERE slug = $1 AND status = 'PUBLISHED'`,
    [slug]
  );
  if (rows.length === 0) return err(headers, 'Page not found', 404);
  return ok(headers, { page: rows[0] });
}

// POST /public/pages/:slug/view
async function trackView(event, headers, slug) {
  const db = getPool();
  await db.query(
    `UPDATE pages SET view_count = view_count + 1 WHERE slug = $1 AND status = 'PUBLISHED'`,
    [slug]
  );
  return ok(headers, { message: 'View tracked' });
}

// POST /public/pages/:slug/contact
async function submitContact(event, headers, slug) {
  const db = getPool();
  const { name, email, message } = JSON.parse(event.body || '{}');

  if (!name || !email || !message) return err(headers, 'Name, email, and message are required');
  if (!validateEmail(email)) return err(headers, 'Invalid email format');
  if (message.length > 5000) return err(headers, 'Message too long');

  const page = await db.query(
    `SELECT id FROM pages WHERE slug = $1 AND status = 'PUBLISHED'`,
    [slug]
  );
  if (page.rows.length === 0) return err(headers, 'Page not found', 404);

  await db.query(
    `INSERT INTO contact_submissions (page_id, page_slug, name, email, message)
     VALUES ($1, $2, $3, $4, $5)`,
    [page.rows[0].id, slug, name, email, message]
  );

  return ok(headers, { message: 'Message sent successfully!' }, 201);
}

// GET /pages/:id/slug-check?slug=...
async function checkSlug(event, headers, pageId) {
  const db = getPool();
  await requireAuth(event, headers);
  const params = new URLSearchParams(event.rawQuery || '');
  const slug = params.get('slug');
  if (!slug) return err(headers, 'slug query param required');
  const existing = await db.query(
    'SELECT id FROM pages WHERE slug = $1 AND id != $2',
    [slug, pageId]
  );
  return ok(headers, { available: existing.rows.length === 0, slug: slugify(slug) });
}

// ─── Main handler ─────────────────────────────────────────────────────────────
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const origin = event.headers?.origin || event.headers?.Origin || '';
  const headers = getCorsHeaders(origin);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Extract path (strip the netlify function prefix)
  const rawPath = event.path || '';
  const path = rawPath
    .replace('/.netlify/functions/api', '')
    .replace('/api', '')
    .replace(/\/$/, '') || '/';
  const method = event.httpMethod;

  try {
    // ── Auth routes ──────────────────────────────────────────────────────────
    if (path === '/auth/signup' && method === 'POST') return await signup(event, headers);
    if (path === '/auth/login' && method === 'POST') return await login(event, headers);
    if (path === '/auth/logout' && method === 'POST') return await logout(event, headers);
    if (path === '/auth/me' && method === 'GET') return await me(event, headers);

    // ── Authenticated page routes ────────────────────────────────────────────
    if (path === '/pages' && method === 'GET') return await listPages(event, headers);
    if (path === '/pages' && method === 'POST') return await createPage(event, headers);

    // Parameterized page routes
    const pageMatch = path.match(/^\/pages\/([a-f0-9-]{36})(.*)$/);
    if (pageMatch) {
      const [, pageId, sub] = pageMatch;
      if (sub === '' && method === 'GET') return await getPage(event, headers, pageId);
      if (sub === '' && method === 'PUT') return await updatePage(event, headers, pageId);
      if (sub === '' && method === 'DELETE') return await deletePage(event, headers, pageId);
      if (sub === '/publish' && method === 'POST') return await publishPage(event, headers, pageId);
      if (sub === '/unpublish' && method === 'POST') return await unpublishPage(event, headers, pageId);
      if (sub === '/duplicate' && method === 'POST') return await duplicatePage(event, headers, pageId);
      if (sub === '/slug-check' && method === 'GET') return await checkSlug(event, headers, pageId);
    }

    // ── Public routes ────────────────────────────────────────────────────────
    const publicMatch = path.match(/^\/public\/pages\/([^/]+)(.*)$/);
    if (publicMatch) {
      const [, slug, sub] = publicMatch;
      if (sub === '' && method === 'GET') return await getPublicPage(event, headers, slug);
      if (sub === '/view' && method === 'POST') return await trackView(event, headers, slug);
      if (sub === '/contact' && method === 'POST') return await submitContact(event, headers, slug);
    }

    return err(headers, `Route not found: ${method} ${path}`, 404);
  } catch (e) {
    if (e.status) return err(headers, e.message, e.status);
    console.error('API Error:', e);
    return err(headers, 'Internal server error', 500);
  }
};