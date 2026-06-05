// api.js — API Service Layer

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  try {
    const res = await fetch(url, {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err.message);
    throw err;
  }
};

// ─── Generic CRUD ─────────────────────────────────────────────────────────────
const api = {
  get:    (endpoint)       => request(endpoint),
  post:   (endpoint, body) => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (endpoint, body) => request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (endpoint, body) => request(endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (endpoint)       => request(endpoint, { method: 'DELETE' }),
};

// ─── Posts ────────────────────────────────────────────────────────────────────
export const PostsService = {
  getAll:    ()         => api.get('/posts'),
  getById:   (id)       => api.get(`/posts/${id}`),
  create:    (data)     => api.post('/posts', data),
  update:    (id, data) => api.put(`/posts/${id}`, data),
  patch:     (id, data) => api.patch(`/posts/${id}`, data),
  delete:    (id)       => api.delete(`/posts/${id}`),
  getByUser: (userId)   => api.get(`/posts?userId=${userId}`),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const UsersService = {
  getAll:  ()   => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create:  (data) => api.post('/users', data),
  update:  (id, data) => api.put(`/users/${id}`, data),
  delete:  (id) => api.delete(`/users/${id}`),
};

// ─── Comments ─────────────────────────────────────────────────────────────────
export const CommentsService = {
  getAll:      ()       => api.get('/comments'),
  getById:     (id)     => api.get(`/comments/${id}`),
  getByPost:   (postId) => api.get(`/comments?postId=${postId}`),
};

// ─── Todos ────────────────────────────────────────────────────────────────────
export const TodosService = {
  getAll:       ()       => api.get('/todos'),
  getById:      (id)     => api.get(`/todos/${id}`),
  getByUser:    (userId) => api.get(`/todos?userId=${userId}`),
  getCompleted: ()       => api.get('/todos?completed=true'),
  getPending:   ()       => api.get('/todos?completed=false'),
  create:       (data)   => api.post('/todos', data),
  toggle:       (id, completed) => api.patch(`/todos/${id}`, { completed }),
  delete:       (id)     => api.delete(`/todos/${id}`),
};

// ─── Cache Layer ──────────────────────────────────────────────────────────────
const cache = new Map();

export const cachedGet = async (endpoint, ttl = 60000) => {
  const cached = cache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`[Cache HIT] ${endpoint}`);
    return cached.data;
  }
  const data = await api.get(endpoint);
  cache.set(endpoint, { data, timestamp: Date.now() });
  console.log(`[Cache MISS] ${endpoint}`);
  return data;
};

export const clearCache = () => {
  cache.clear();
  console.log('[Cache] Cleared');
};

export default api;
