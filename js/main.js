// Burger, navbar scroll, reveal-on-scroll, form validation
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 16);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Reveal — guaranteed: if JS works, fade in; otherwise CSS keeps content visible
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
}

// Form validation
document.querySelectorAll('form[data-validate]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((inp) => {
      const err = form.querySelector(`[data-error="${inp.name}"]`);
      let v = !!inp.value.trim();
      if (inp.type === 'email' && v) v = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
      inp.classList.toggle('error', !v);
      if (err) err.classList.toggle('visible', !v);
      if (!v) ok = false;
    });
    if (ok) {
      const a = form.querySelector('.alert-success');
      if (a) a.classList.add('visible');
      form.reset();
    }
  });
  form.querySelectorAll('input, textarea, select').forEach((inp) => {
    inp.addEventListener('input', () => {
      inp.classList.remove('error');
      const err = form.querySelector(`[data-error="${inp.name}"]`);
      if (err) err.classList.remove('visible');
    });
  });
});

// Donate amount presets
document.querySelectorAll('.amount-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const custom = document.querySelector('input[name="customAmount"]');
    if (custom) custom.value = '';
  });
});

// Catalog filter chips
const tags = document.querySelectorAll('.tag[data-filter]');
tags.forEach((tag) => {
  tag.addEventListener('click', () => {
    tags.forEach((t) => t.classList.remove('active'));
    tag.classList.add('active');
    const f = tag.dataset.filter;
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
    });
  });
});

// 3D carousel — dynamic import so its failure doesn't break the rest of the page
if (document.querySelector('.carousel-canvas')) {
  import('./three-carousel.js')
    .then((m) => m.initCarousel())
    .catch((err) => {
      console.warn('3D carousel disabled:', err);
      const c = document.querySelector('.carousel');
      if (c) c.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,0.6);text-align:center;padding:24px;">3D-карусель отключена<br>(нужен HTTPS-сервер для подгрузки GLB)</div>';
    });
}
