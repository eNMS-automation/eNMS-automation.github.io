// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Nav scroll effect
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Screenshot tabs
const tabs = document.querySelectorAll('.screenshot-tab');
const slides = document.querySelectorAll('.screenshot-slide');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const index = tab.dataset.index;
    tabs.forEach(t => t.classList.remove('active'));
    slides.forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.screenshot-slide[data-index="${index}"]`).classList.add('active');
  });
});

// Scroll reveal with IntersectionObserver
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// Stagger animation for grid items
document.querySelectorAll('.features-grid .feature-card, .pricing-grid .pricing-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

// Smooth scroll for anchor links (fallback for browsers without CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
