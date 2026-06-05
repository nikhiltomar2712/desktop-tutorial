// utils.js — Helper functions

/**
 * Capitalizes the first letter of a string
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Formats a date to DD/MM/YYYY
 */
const formatDate = (date = new Date()) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

/**
 * Truncates a string to a max length
 */
const truncate = (str, max = 50) =>
  str.length > max ? str.slice(0, max) + '...' : str;

/**
 * Debounce function
 */
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

module.exports = { capitalize, formatDate, truncate, debounce };
