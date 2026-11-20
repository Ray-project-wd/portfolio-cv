(function () {
  'use strict';
  var root = document.getElementById('certCarousel');
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll('.cert-item'));
  var n = items.length;
  if (!n) return;

  var idx = 0;
  var titleEl = document.getElementById('certTitle');
  var issuerEl = document.getElementById('certIssuer');
  var countEl = document.getElementById('certCount');
  var prevBtn = document.getElementById('certPrev');
  var nextBtn = document.getElementById('certNext');

  // Jarak melingkar terpendek item i terhadap item aktif → carousel tak berujung
  function offset(i) {
    var d = (i - idx) % n;
    var half = Math.floor(n / 2);
    if (d > half) d -= n;
    if (d < -half) d += n;
    return d;
  }

  var X = [0, 0.82, 1.42];          // geser horizontal (kelipatan lebar kartu)
  var SCALE = [1.22, 0.86, 0.66];
  var OPACITY = [1, 0.8, 0.45];

  function render() {
    items.forEach(function (el, i) {
      var d = offset(i), a = Math.abs(d), sign = d < 0 ? -1 : 1;
      if (a > 2) {
        el.style.opacity = '0'; el.style.pointerEvents = 'none'; el.style.zIndex = '0';
        el.style.transform = 'translate(-50%, -50%) translateX(' + (sign * 160) + '%) scale(.5)';
        return;
      }
      el.style.opacity = OPACITY[a];
      el.style.pointerEvents = 'auto';
      el.style.zIndex = String(10 - a);
      el.style.filter = a === 0 ? 'none' : 'brightness(' + (a === 1 ? 0.7 : 0.5) + ')';
      el.style.transform = 'translate(-50%, -50%) translateX(' + (sign * X[a] * 100) + '%) scale(' + SCALE[a] + ')';
      el.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');
    });
    var cur = items[idx];
    titleEl.textContent = cur.dataset.title;
    issuerEl.textContent = [cur.dataset.issuer, cur.dataset.date].filter(Boolean).join(' · ');
    countEl.textContent = (idx + 1) + ' / ' + n;
  }

  function go(to) { idx = ((to % n) + n) % n; render(); }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  items.forEach(function (el, i) {
    el.addEventListener('click', function () {
      if (moved) return;
      if (offset(i) === 0) openModal(i); else go(i);
    });
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'Enter') { openModal(idx); }
  });

  // Geser (swipe / drag)
  var startX = null, moved = false;
  var stage = root.querySelector('.carousel-stage');
  stage.addEventListener('pointerdown', function (e) { startX = e.clientX; moved = false; });
  stage.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) { moved = true; if (dx < 0) next(); else prev(); setTimeout(function () { moved = false; }, 50); }
  });
  stage.addEventListener('pointerleave', function () { startX = null; });

  /* ---------- Modal ---------- */
  var modal = document.getElementById('certModal');
  var mImg = document.getElementById('modalImg');
  var mTitle = document.getElementById('modalTitle');
  var mMeta = document.getElementById('modalMeta');
  var mLink = document.getElementById('modalLink');
  var lastFocus = null;

  function fillModal() {
    var cur = items[idx];
    mImg.src = cur.dataset.src;
    mImg.alt = 'Sertifikat ' + cur.dataset.title;
    mTitle.textContent = cur.dataset.title;
    mMeta.textContent = [cur.dataset.issuer, cur.dataset.date].filter(Boolean).join(' · ');
    var url = cur.dataset.url;
    if (url && /^https?:\/\//i.test(url)) { mLink.href = url; mLink.hidden = false; } else { mLink.hidden = true; }
  }
  function openModal(i) {
    lastFocus = document.activeElement;
    idx = i; render(); fillModal();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalPrev').addEventListener('click', function () { prev(); fillModal(); });
  document.getElementById('modalNext').addEventListener('click', function () { next(); fillModal(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') { prev(); fillModal(); }
    if (e.key === 'ArrowRight') { next(); fillModal(); }
  });

  render();
})();
