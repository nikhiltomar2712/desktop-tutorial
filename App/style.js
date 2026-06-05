// app.js — Main Application Logic

import { capitalize, formatDate, truncate, debounce } from './utils.js';
import config from './config.json';

// ─── App State ───────────────────────────────────────────────────────────────
const state = {
  theme: config.theme || 'light',
  currentPage: 'home',
  user: null,
  notifications: [],
};

// ─── Theme Management ────────────────────────────────────────────────────────
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  state.theme = theme;
  console.log(`Theme set to: ${theme}`);
};

const toggleTheme = () => {
  applyTheme(state.theme === 'light' ? 'dark' : 'light');
};

const loadSavedTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) applyTheme(saved);
};

// ─── Navigation ──────────────────────────────────────────────────────────────
const navigate = (page) => {
  state.currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');
  window.history.pushState({ page }, '', `/${page}`);
  console.log(`Navigated to: ${page}`);
};

window.addEventListener('popstate', (e) => {
  if (e.state?.page) navigate(e.state.page);
});

// ─── Notifications ───────────────────────────────────────────────────────────
const addNotification = (message, type = 'info') => {
  const id = Date.now();
  const notification = { id, message, type, timestamp: new Date() };
  state.notifications.push(notification);
  renderNotification(notification);
  setTimeout(() => removeNotification(id), 4000);
};

const removeNotification = (id) => {
  state.notifications = state.notifications.filter(n => n.id !== id);
  const el = document.getElementById(`notif-${id}`);
  if (el) el.remove();
};

const renderNotification = ({ id, message, type }) => {
  const container = document.getElementById('notifications');
  if (!container) return;
  const el = document.createElement('div');
  el.id = `notif-${id}`;
  el.className = `notification notification--${type}`;
  el.textContent = message;
  container.appendChild(el);
};

// ─── Form Handling ───────────────────────────────────────────────────────────
const handleFormSubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  console.log('Form submitted:', data);
  addNotification('Form submitted successfully!', 'success');
  form.reset();
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateForm = (fields) => {
  const errors = {};
  if (!fields.name || fields.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters.';
  if (!validateEmail(fields.email))
    errors.email = 'Enter a valid email address.';
  return errors;
};

// ─── Search ──────────────────────────────────────────────────────────────────
const searchData = [
  { title: 'Home', url: '/index.html' },
  { title: 'About', url: '/about.html' },
  { title: 'Contact', url: '/contact.html' },
];

const search = debounce((query) => {
  const q = query.toLowerCase();
  const results = searchData.filter(item =>
    item.title.toLowerCase().includes(q)
  );
  renderSearchResults(results);
}, 300);

const renderSearchResults = (results) => {
  const container = document.getElementById('search-results');
  if (!container) return;
  container.innerHTML = results.length
    ? results.map(r => `<a href="${r.url}">${r.title}</a>`).join('')
    : '<p>No results found.</p>';
};

// ─── Init ────────────────────────────────────────────────────────────────────
const init = () => {
  loadSavedTheme();

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', (e) => search(e.target.value));

  document.querySelectorAll('form').forEach(form =>
    form.addEventListener('submit', handleFormSubmit)
  );

  document.querySelectorAll('[data-nav]').forEach(link =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.nav);
    })
  );

  console.log(`${config.appName} v${config.version} initialized on ${formatDate()}`);
  addNotification(`Welcome to ${config.appName}!`, 'info');
};

document.addEventListener('DOMContentLoaded', init);
