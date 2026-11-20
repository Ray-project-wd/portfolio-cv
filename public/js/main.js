(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- Dark / light mode ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Hamburger menu ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav-links a, .nav-cta').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Bahasa ID / EN ---------- */
  var EN = {
    'nav.about': 'About Me', 'nav.education': 'Education', 'nav.experience': 'Experience',
    'nav.organization': 'Organization', 'nav.certificates': 'Certificates', 'nav.skills': 'Skills',
    'nav.projects': 'Projects', 'nav.contact': 'Contact Me',
    'hero.hello': 'Hi, I am', 'hero.cv': 'View CV', 'hero.download': 'Download PDF', 'hero.scroll': 'Scroll down',
    'about.status': 'Status', 'about.grad': 'Graduated', 'about.core': 'Core competencies', 'about.featured': 'Featured skill',
    'edu.title': 'Education', 'exp.title': 'Experience', 'org.title': 'Organization',
    'cert.title': 'Certificates & Achievements', 'cert.sub': 'Click the centered certificate to enlarge it.',
    'skills.title': 'Skills', 'proj.title': 'Projects', 'proj.detail': 'Details',
    'contact.title': "Let's talk.", 'contact.sub': 'Open to internships, project collaboration, and career opportunities.',
    'footer.desc': 'Informatics Engineering student building clean, useful digital products.',
    'empty.data': 'No data yet.', 'empty.profile': 'Complete your profile in the admin dashboard.'
  };
  var langBtns = document.querySelectorAll('.lang-toggle button');
  function applyLang(lang) {
    root.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!el.hasAttribute('data-id')) el.setAttribute('data-id', el.textContent);
      var key = el.getAttribute('data-i18n');
      el.textContent = (lang === 'en' && EN[key]) ? EN[key] : el.getAttribute('data-id');
    });
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-id')) el.setAttribute('data-id', el.textContent);
      var en = el.getAttribute('data-en');
      el.textContent = (lang === 'en' && en) ? en : el.getAttribute('data-id');
    });
    langBtns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-lang') === lang); });
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }
  langBtns.forEach(function (b) { b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); }); });
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved === 'en') applyLang('en');

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Hitung naik angka statistik (sekali) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce || target === 0) { el.textContent = target; return; }
    var start = null, dur = 900;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }
})();
