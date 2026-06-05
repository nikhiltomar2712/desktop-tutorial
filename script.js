// script.js — Desktop Tutorial

document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded successfully!');

  const greet = (name) => {
    return `Hello, ${name}! Welcome to the Desktop Tutorial.`;
  };

  console.log(greet('Nikhil'));

  // Toggle dark mode example
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  const btn = document.getElementById('darkToggle');
  if (btn) {
    btn.addEventListener('click', toggleDarkMode);
  }
});
