// Главный скрипт — burger, navbar scroll, scroll-reveal, form validation
import { initCarousel } from './three-carousel.js';

// ── Burger menu ──
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

// ── Navbar scrolled state ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 16);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ── IntersectionObserver scroll-reveal ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
}

// ── Form validation ──
const forms = document.querySelectorAll('form[data-validate]');
forms.forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const errEl = form.querySelector(`[data-error="${input.name}"]`);
      let inputValid = !!input.value.trim();
      if (input.type === 'email' && inputValid) {
        inputValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      }
      input.classList.toggle('error', !inputValid);
      if (errEl) errEl.classList.toggle('visible', !inputValid);
      if (!inputValid) valid = false;
    });
    if (valid) {
      const success = form.querySelector('.alert-success');
      if (success) success.classList.add('visible');
      form.reset();
    }
  });
  // Live-clear errors on input
  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = form.querySelector(`[data-error="${input.name}"]`);
      if (errEl) errEl.classList.remove('visible');
    });
  });
});

// ── Amount preset buttons (donate widget) ──
const amountBtns = document.querySelectorAll('.amount-btn');
amountBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    amountBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const custom = document.querySelector('input[name="customAmount"]');
    if (custom) custom.value = '';
  });
});

// ── Category filter chips ──
const tags = document.querySelectorAll('.tag[data-filter]');
tags.forEach((tag) => {
  tag.addEventListener('click', () => {
    tags.forEach((t) => t.classList.remove('active'));
    tag.classList.add('active');
    const filter = tag.dataset.filter;
    document.querySelectorAll('[data-category]').forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ── Init 3D carousel only if section exists ──
const carouselSection = document.querySelector('.carousel-canvas');
if (carouselSection) {
  initCarousel().catch((e) => console.error('3D carousel init failed:', e));
}
