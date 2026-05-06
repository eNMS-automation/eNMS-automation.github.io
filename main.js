// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

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

// Active nav link tracking
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-link'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active-link');
    }
  });
}, { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Screenshot tabs with smart prefetch
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
document.querySelectorAll('.features-grid .feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.pricing-grid .pricing-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.06}s`;
});

// Network topology canvas animation
(function() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload device icons
  const icons = {};
  const iconSrcs = { router: 'img/router.gif', switch: 'img/switch.gif', device: 'img/server.gif' };
  for (const [type, src] of Object.entries(iconSrcs)) {
    const img = new Image();
    img.src = src;
    icons[type] = img;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  // Node positions as fractions of width/height
  const nodeDefs = [
    { x: 0.08, y: 0.25, r: 6, type: 'router' },
    { x: 0.15, y: 0.55, r: 7, type: 'switch' },
    { x: 0.22, y: 0.18, r: 7, type: 'switch' },
    { x: 0.30, y: 0.42, r: 7, type: 'router' },
    { x: 0.12, y: 0.82, r: 6, type: 'device' },
    { x: 0.32, y: 0.76, r: 7, type: 'switch' },
    { x: 0.70, y: 0.20, r: 7, type: 'router' },
    { x: 0.78, y: 0.45, r: 7, type: 'switch' },
    { x: 0.85, y: 0.22, r: 6, type: 'device' },
    { x: 0.90, y: 0.60, r: 6, type: 'router' },
    { x: 0.75, y: 0.75, r: 6, type: 'device' },
    { x: 0.88, y: 0.82, r: 7, type: 'switch' },
    { x: 0.65, y: 0.68, r: 6, type: 'device' },
    { x: 0.05, y: 0.65, r: 6, type: 'device' },
    { x: 0.95, y: 0.40, r: 6, type: 'device' },
  ];

  const links = [
    [0, 2], [0, 1], [1, 3], [2, 3], [1, 4], [3, 5], [1, 13],
    [6, 7], [6, 8], [7, 9], [7, 12], [9, 10], [9, 11], [9, 14],
    [3, 6], [5, 10],
  ];

  // Packets traveling along links
  const packets = [];
  function spawnPacket() {
    const linkIdx = Math.floor(Math.random() * links.length);
    const reverse = Math.random() > 0.5;
    packets.push({ link: linkIdx, t: 0, speed: 0.006 + Math.random() * 0.006, reverse });
  }
  for (let i = 0; i < 12; i++) spawnPacket();

  function getNodePos(i) {
    const rw = canvas.width / devicePixelRatio;
    const rh = canvas.height / devicePixelRatio;
    return { x: nodeDefs[i].x * rw, y: nodeDefs[i].y * rh };
  }

  let animId;
  function draw() {
    const rw = canvas.width / devicePixelRatio;
    const rh = canvas.height / devicePixelRatio;
    ctx.clearRect(0, 0, rw, rh);

    // Draw links
    links.forEach(([a, b]) => {
      const pa = getNodePos(a);
      const pb = getNodePos(b);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      const [a, b] = links[p.link];
      const pa = getNodePos(p.reverse ? b : a);
      const pb = getNodePos(p.reverse ? a : b);
      const x = pa.x + (pb.x - pa.x) * p.t;
      const y = pa.y + (pb.y - pa.y) * p.t;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.fill();
      p.t += p.speed;
      if (p.t > 1) {
        packets.splice(i, 1);
        spawnPacket();
      }
    }

    // Draw nodes as device icons (on top of packets)
    const time = Date.now() * 0.001;
    nodeDefs.forEach((node, i) => {
      const pos = getNodePos(i);
      const icon = icons[node.type];
      if (!icon || !icon.complete) return;
      const size = node.r * 5;
      const pulse = 1 + Math.sin(time * 1.5 + i * 0.7) * 0.05;
      const s = size * pulse;
      // Mask to hide packets behind icon
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.fillRect(pos.x - s / 2, pos.y - s / 2, s, s);
      // Draw icon
      ctx.globalAlpha = 0.6;
      ctx.drawImage(icon, pos.x - s / 2, pos.y - s / 2, s, s);
      ctx.globalAlpha = 1;
    });

    animId = requestAnimationFrame(draw);
  }

  // Only animate when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      draw();
    } else {
      cancelAnimationFrame(animId);
    }
  });
  heroObserver.observe(canvas.parentElement);
})();

// Re-scroll to hash after fonts/images load so position is accurate
window.addEventListener('load', () => {
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView();
      });
    }
  }
});

