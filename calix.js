/* ═══════════════════════════════════════════
     THEME TOGGLE
  ═══════════════════════════════════════════ */
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('calix-theme');
  if (stored) html.setAttribute('data-theme', stored);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) html.setAttribute('data-theme', 'dark');
  function updateThemeBtn() {
    themeBtn.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }
  updateThemeBtn();
  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('calix-theme', next);
    updateThemeBtn();
  });

  /* ═══════════════════════════════════════════
     TOAST
  ═══════════════════════════════════════════ */
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ═══════════════════════════════════════════
     COPY TO CLIPBOARD
  ═══════════════════════════════════════════ */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async () => {
      const val = el.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(val);
        showToast('✓ Roblox username copied: ' + val);
      } catch {
        showToast('Roblox: ' + val);
      }
    });
  });

  /* ═══════════════════════════════════════════
     HERO CANVAS PARTICLES
  ═══════════════════════════════════════════ */
  (function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display = 'none'; return; }
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], animId;
    const COUNT = window.innerWidth <= 768 ? 32 : 55;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function randomParticle() {
      const isDark = html.getAttribute('data-theme') === 'dark';
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5
          ? (isDark ? 'rgba(224,163,173,' : 'rgba(157,92,99,')
          : 'rgba(184,134,11,'
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, randomParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = html.getAttribute('data-theme') === 'dark';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.a + ')';
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 120) * 0.06;
            ctx.strokeStyle = isDark
              ? `rgba(224,163,173,${alpha})`
              : `rgba(157,92,99,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', () => { resize(); }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    });
  })();

  /* ═══════════════════════════════════════════
     HERO TYPING EFFECT
  ═══════════════════════════════════════════ */
  (function() {
    const el = document.getElementById('heroName');
    if (!el) return;
    const text = 'calixx_22';
    el.setAttribute('aria-label', text);
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = text; return; }
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.appendChild(cursor);
    let i = 0;
    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(type, i === 1 ? 300 : 80 + Math.random() * 50);
      }
    }
    setTimeout(type, 200);
  })();

  /* ═══════════════════════════════════════════
     PROGRESS BAR
  ═══════════════════════════════════════════ */
  const bar = document.getElementById('progress-bar');
  function updateProgress() {
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ═══════════════════════════════════════════
     HEADER SCROLL
  ═══════════════════════════════════════════ */
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionIds = ['hero-section','about','skills','experience','awards','gallery','current-service','traits','contact'];
  let lastActive = '';

  function onScroll() {
    updateProgress();
    const sy = window.scrollY;
    header.classList.toggle('scrolled', sy > 50);
    document.getElementById('back-top').classList.toggle('visible', sy > 400);
    const offset = (header.offsetHeight || 88) + 52;
    let active = sectionIds[0];
    for (const id of sectionIds) {
      const sec = id === 'hero-section' ? document.querySelector('.hero') : document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top + window.scrollY - offset <= sy) active = id;
    }
    if (active !== lastActive) {
      lastActive = active;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + active || (active === 'hero-section' && l.getAttribute('href') === '#')));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ═══════════════════════════════════════════
     BACK TO TOP
  ═══════════════════════════════════════════ */
  document.getElementById('back-top').addEventListener('click', () => {
    const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
  });

  /* ═══════════════════════════════════════════
     SMOOTH SCROLL
  ═══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function closeMobileNav() {
    mobileNav.classList.remove('open'); hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false'); mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
  function syncMobileNav() {
    const open = mobileNav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', String(open)); mobileNav.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); }
      else {
        const target = href.length > 1 ? document.querySelector(href) : null;
        if (target) { e.preventDefault(); const off = (header.offsetHeight || 88) + 8; window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: reduceMotion ? 'auto' : 'smooth' }); }
      }
      closeMobileNav();
    });
  });
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open'); mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    syncMobileNav();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMobileNav(); });

  /* ═══════════════════════════════════════════
     INTERSECTION OBSERVER REVEALS
  ═══════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      el.querySelectorAll('.skill-bar-fill').forEach(fill => {
        const target = fill.closest('.skill-card')?.style.getPropertyValue('--target') || '0%';
        setTimeout(() => { fill.style.width = target; }, 350);
      });
      el.querySelectorAll('[data-count]').forEach(counter => animateCounter(counter));
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObs.observe(el));

  const skillsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-card').forEach((card, i) => {
        const fill = card.querySelector('.skill-bar-fill');
        const target = card.style.getPropertyValue('--target') || '0%';
        setTimeout(() => { if (fill) fill.style.width = target; }, 400 + i * 80);
      });
      skillsObs.unobserve(e.target);
    });
  }, { threshold: 0.05 });
  const skillsSec = document.getElementById('skills');
  if (skillsSec) skillsObs.observe(skillsSec);

  /* ═══════════════════════════════════════════
     COUNTER ANIMATION
  ═══════════════════════════════════════════ */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.textContent.includes('+') ? '+' : '';
    let start = 0; const dur = 1600; const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(start + (target - start) * ease) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  const aboutObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      aboutObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  const aboutSec = document.getElementById('about');
  if (aboutSec) aboutObs.observe(aboutSec);

  /* ═══════════════════════════════════════════
     GALLERY IMAGE LOADER — OPTIMIZED
     Cloudinary f_auto/q_auto + lazy decoding.
  ═══════════════════════════════════════════ */
  function optCloud(src, w) {
    if (!src || src.indexOf('res.cloudinary.com') === -1 || src.indexOf('/image/upload/') === -1) return src;
    if (/\/image\/upload\/[a-zA-Z0-9_,\-/]+=*\//.test(src.replace('/image/upload/v', '/image/upload/XXXv')) && /f_auto/.test(src)) return src;
    return src.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_' + (w || 800) + '/');
  }
  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    const raw = item.getAttribute('data-src');
    if (!raw) return;
    const src = optCloud(raw, 800);
    const ph = item.querySelector('.gallery-placeholder');

    const img = document.createElement('img');
    img.alt = item.getAttribute('data-caption') || '';
    img.loading = 'lazy'; img.decoding = 'async';
    img.style.cssText = 'opacity:0;transition:opacity 0.5s ease;width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;';
    item.insertBefore(img, item.firstChild); // add to DOM first

    img.onload  = () => { ph?.remove(); img.style.opacity = '1'; };
    img.onerror = () => img.remove();
    img.src = src; // set src after DOM insertion
  });

  /* ═══════════════════════════════════════════
     LIGHTBOX
  ═══════════════════════════════════════════ */
  (function() {
    const lb     = document.getElementById('lightbox');
    const img    = document.getElementById('lbImg');
    const prev   = document.getElementById('lbPrev');
    const next   = document.getElementById('lbNext');
    const counter= document.getElementById('lbCounter');
    const caption= document.getElementById('lbCaption');
    const zoomIn = document.getElementById('lbZoomIn');
    const zoomOut= document.getElementById('lbZoomOut');
    const zoomRst= document.getElementById('lbZoomReset');
    const zoomLbl= document.getElementById('lbZoomLabel');
    const dots   = document.getElementById('lbDots');
    const stage  = document.getElementById('lbStage');
    const spin   = document.getElementById('lbSpinner');

    let items = [], cur = 0, scale = 1, panX = 0, panY = 0;
    let dragging = false, ds = {}, ps = {};
    const STEP = 0.4, MIN = 1, MAX = 4;

    function collect() {
      items = [];
      document.querySelectorAll('.gallery-item').forEach(el => {
        const i = el.querySelector('img');
        const src = i ? i.src : el.getAttribute('data-src');
        if (src) items.push({ src, caption: el.getAttribute('data-caption') || '' });
      });
    }

    function buildDots() {
      dots.innerHTML = '';
      items.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'lb-dot' + (i === cur ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dots.appendChild(d);
      });
    }

    function open(idx, customItems) {
      if (customItems) items = customItems.map(it => typeof it === 'string' ? { src: it, caption: '' } : it);
      else collect();
      if (!items.length) return;
      cur = Math.max(0, Math.min(idx || 0, items.length - 1));
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
      resetZoom(); load(); buildDots();
    }

    function close() {
      lb.classList.remove('open'); document.body.style.overflow = '';
      img.src = '';
    }

    function goTo(idx) {
      cur = Math.max(0, Math.min(idx, items.length - 1));
      resetZoom(); load();
      dots.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    function load() {
      const item = items[cur];
      spin.classList.add('visible'); img.style.opacity = '0';
      counter.textContent = (cur + 1) + ' / ' + items.length;
      caption.textContent = item.caption || '';
      prev.disabled = cur === 0; next.disabled = cur === items.length - 1;
      img.onload = () => { spin.classList.remove('visible'); img.style.opacity = '1'; apply(); };
      img.onerror = () => spin.classList.remove('visible');
      img.src = item.src;
    }

    function apply() {
      img.style.transform = `translate(${panX}px,${panY}px) scale(${scale})`;
      zoomLbl.textContent = Math.round(scale * 100) + '%';
      zoomIn.disabled = scale >= MAX; zoomOut.disabled = scale <= MIN;
    }

    function zoomTo(s) { scale = Math.max(MIN, Math.min(MAX, s)); if (scale === MIN) { panX = 0; panY = 0; } apply(); }
    function resetZoom() { scale = 1; panX = 0; panY = 0; apply(); }

    zoomIn.addEventListener('click', () => zoomTo(scale + STEP));
    zoomOut.addEventListener('click', () => zoomTo(scale - STEP));
    zoomRst.addEventListener('click', resetZoom);

    stage.addEventListener('wheel', e => { e.preventDefault(); zoomTo(scale + (e.deltaY < 0 ? STEP : -STEP)); }, { passive: false });
    stage.addEventListener('mousedown', e => { if (scale <= 1) return; dragging = true; stage.classList.add('grabbing'); ds = { x: e.clientX, y: e.clientY }; ps = { x: panX, y: panY }; });
    window.addEventListener('mousemove', e => { if (!dragging) return; panX = ps.x + (e.clientX - ds.x); panY = ps.y + (e.clientY - ds.y); apply(); });
    window.addEventListener('mouseup', () => { dragging = false; stage.classList.remove('grabbing'); });

    let touchCount = 0, initDist = 0, initScale = 1, swX = 0, swY = 0, swMoved = false, lastTap = 0;
    stage.addEventListener('touchstart', e => {
      touchCount = e.touches.length;
      if (touchCount === 1) {
        swX = e.touches[0].clientX; swY = e.touches[0].clientY; swMoved = false;
        if (scale > 1) { dragging = true; ds = { x: e.touches[0].clientX, y: e.touches[0].clientY }; ps = { x: panX, y: panY }; }
      }
      if (touchCount === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initDist = Math.sqrt(dx*dx+dy*dy); initScale = scale; dragging = false;
      }
    }, { passive: true });
    stage.addEventListener('touchmove', e => {
      if (e.touches.length === 2) { e.preventDefault(); const dx = e.touches[0].clientX-e.touches[1].clientX, dy = e.touches[0].clientY-e.touches[1].clientY; zoomTo(initScale*(Math.sqrt(dx*dx+dy*dy)/initDist)); }
      else if (e.touches.length === 1) {
        if (Math.abs(e.touches[0].clientX-swX)>5||Math.abs(e.touches[0].clientY-swY)>5) swMoved=true;
        if (dragging&&scale>1) { e.preventDefault(); panX=ps.x+(e.touches[0].clientX-ds.x); panY=ps.y+(e.touches[0].clientY-ds.y); apply(); }
      }
    }, { passive: false });
    stage.addEventListener('touchend', e => {
      dragging = false;
      const diffX = swX - e.changedTouches[0].clientX;
      if (swMoved && Math.abs(diffX) > 50 && Math.abs(e.changedTouches[0].clientY - swY) < 80 && scale <= 1) {
        diffX > 0 ? goTo(cur + 1) : goTo(cur - 1);
      }
      const now = Date.now();
      if (now - lastTap < 300) { scale > 1 ? resetZoom() : zoomTo(2); }
      lastTap = now;
    }, { passive: true });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key==='Escape') close();
      if (e.key==='ArrowLeft') goTo(cur-1);
      if (e.key==='ArrowRight') goTo(cur+1);
      if (e.key==='+') zoomTo(scale+STEP);
      if (e.key==='-') zoomTo(scale-STEP);
    });
    document.getElementById('lbClose').addEventListener('click', close);
    prev.addEventListener('click', () => goTo(cur-1));
    next.addEventListener('click', () => goTo(cur+1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target === stage) close(); });

    document.querySelectorAll('.gallery-item').forEach((el, i) => {
      el.addEventListener('click', () => {
        collect();
        const src = el.querySelector('img')?.src || el.getAttribute('data-src');
        const idx = items.findIndex(it => it.src === src);
        if (idx !== -1) open(idx);
      });
    });

    window.openLightbox = open;
  })();

  /* ═══════════════════════════════════════════
     CAROUSEL FACTORY
  ═══════════════════════════════════════════ */
  function makeCarousel({ track, prev, next, dotsWrap, visCount = 1, label = 'page' }) {
    const items = Array.from(track.children);
    const total = items.length;
    let cur = 0;
    const pages = Math.ceil(total / visCount);
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to ' + label + ' ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
    function goTo(idx) {
      cur = Math.max(0, Math.min(idx, pages - 1));
      track.style.transform = `translateX(-${cur * 100}%)`;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => { d.classList.toggle('active', i === cur); d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      prev.disabled = cur === 0; next.disabled = cur >= pages - 1;
    }
    prev.addEventListener('click', () => goTo(cur - 1));
    next.addEventListener('click', () => goTo(cur + 1));
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 40) d > 0 ? goTo(cur+1) : goTo(cur-1); }, { passive: true });
    goTo(0);
  }

  /* ═══════════════════════════════════════════
     GALLERY CAROUSEL
  ═══════════════════════════════════════════ */
  (function() {
    const track = document.getElementById('galleryTrack');
    const prev  = document.getElementById('galPrev');
    const next  = document.getElementById('galNext');
    const dw    = document.getElementById('galleryDots');
    const items = Array.from(track.children);
    const total = items.length;
    let cur = 0;

    function visible() { return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3; }
    function maxIdx()  { return Math.max(0, total - visible()); }

    function buildDots() {
      dw.innerHTML = '';
      for (let i = 0; i <= maxIdx(); i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to gallery page ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dw.appendChild(d);
      }
    }

    function goTo(idx) {
      cur = Math.max(0, Math.min(idx, maxIdx()));
      const vis = visible();
      if (vis >= total) { track.style.transform = 'translateX(0)'; }
      else {
        const iw = items[0]?.offsetWidth || 0;
        const gap = parseFloat(getComputedStyle(track).gap) || 18;
        track.style.transform = `translateX(-${cur * (iw + gap)}px)`;
      }
      dw.querySelectorAll('.carousel-dot').forEach((d, i) => { d.classList.toggle('active', i === cur); d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      prev.disabled = cur === 0; next.disabled = cur >= maxIdx();
    }

    prev.addEventListener('click', () => goTo(cur - 1));
    next.addEventListener('click', () => goTo(cur + 1));
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 40) d > 0 ? goTo(cur+1) : goTo(cur-1); }, { passive: true });
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { buildDots(); goTo(0); }, 150); }, { passive: true });
    buildDots(); goTo(0);
  })();

  /* ═══════════════════════════════════════════
     MAGNETIC BUTTONS
  ═══════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-3px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ═══════════════════════════════════════════
     BACKGROUND MUSIC — l5ta60yfryc (Ikaw at Ako)
     Explore click = user gesture, so audible play is allowed.
  ═══════════════════════════════════════════ */
  (function() {
    var VIDEO_ID = 'l5ta60yfryc';
    var STORAGE_KEY = 'calix-music';
    var btn = document.getElementById('musicToggle');
    var pill = document.getElementById('sound-pill');
    var wantPlay = true;
    try { var s = localStorage.getItem(STORAGE_KEY); if (s === 'off') wantPlay = false; } catch (e) {}
    var player = null, ready = false, soundOn = false, pendingStart = false, retryTimer = null;

    function updateBtn() {
      if (!btn) return;
      btn.textContent = (!wantPlay) ? '🔇' : (soundOn ? '🎵' : '🔈');
      btn.classList.toggle('is-off', !wantPlay);
    }
    function updatePill() {
      if (!pill) return;
      pill.classList.toggle('show', !!(ready && wantPlay && !soundOn));
    }
    updateBtn(); updatePill();

    function toast(msg) { try { if (typeof showToast === 'function') showToast(msg); } catch (e) {} }

    function confirmSound() {
      try {
        if (player && player.getPlayerState && player.getPlayerState() === 1 && player.isMuted && !player.isMuted()) {
          soundOn = true; pendingStart = false;
          if (retryTimer) { clearInterval(retryTimer); retryTimer = null; }
          updateBtn(); updatePill();
          return true;
        }
      } catch (e) {}
      return false;
    }

    function doAudiblePlay() {
      if (!player || !ready) return false;
      try {
        player.unMute();
        player.setVolume(100);
        player.playVideo();
        return true;
      } catch (e) { return false; }
    }

    function startRetryLoop() {
      if (retryTimer) return;
      var tries = 0;
      retryTimer = setInterval(function() {
        tries++;
        if (!pendingStart || soundOn) { clearInterval(retryTimer); retryTimer = null; return; }
        if (doAudiblePlay()) {
          if (confirmSound()) { toast('Music on 🎵 — Ikaw at Ako'); }
          else if (tries > 20) { clearInterval(retryTimer); retryTimer = null; toast('Tap 🎵 para tumunog'); updatePill(); }
        }
        if (tries > 40) { clearInterval(retryTimer); retryTimer = null; }
      }, 500);
    }

    // THE gesture entry point — call synchronously inside Explore click.
    function startAudible() {
      wantPlay = true;
      try { localStorage.setItem(STORAGE_KEY, 'on'); } catch (e) {}
      soundOn = false; pendingStart = true;
      updateBtn(); updatePill();
      if (doAudiblePlay()) {
        setTimeout(function() {
          if (confirmSound()) toast('Music on 🎵 — Ikaw at Ako');
          else startRetryLoop();
        }, 600);
      } else {
        startRetryLoop();
      }
    }

    function unlockSound() {
      if (!player || !ready || !wantPlay || soundOn) return;
      doAudiblePlay();
      setTimeout(confirmSound, 500);
    }

    ['pointerdown', 'touchstart', 'keydown'].forEach(function(ev) {
      window.addEventListener(ev, unlockSound, { passive: true });
    });
    if (pill) pill.addEventListener('click', function(e) { e.stopPropagation(); pendingStart = true; unlockSound(); startRetryLoop(); });

    if (btn) btn.addEventListener('click', function(e) {
      e.stopPropagation();
      wantPlay = !wantPlay;
      try { localStorage.setItem(STORAGE_KEY, wantPlay ? 'on' : 'off'); } catch (err) {}
      if (!player || !ready) { updateBtn(); updatePill(); return; }
      try {
        if (wantPlay) { startAudible(); }
        else { pendingStart = false; soundOn = false; player.pauseVideo(); updateBtn(); updatePill(); toast('Music off 🔇'); }
      } catch (err) {}
    });

    function createPlayer() {
      if (player) return;
      try {
        var opts = {
          width: '4', height: '4',
          videoId: VIDEO_ID,
          host: 'https://www.youtube-nocookie.com',
          playerVars: { autoplay: 0, mute: 0, loop: 1, playlist: VIDEO_ID, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, rel: 0 },
          events: {
            onReady: function(ev) {
              ready = true;
              updateBtn(); updatePill();
              if (pendingStart && wantPlay) doAudiblePlay();
              else if (wantPlay && !window.__calixEntered) { try { ev.target.cueVideoById(VIDEO_ID); } catch (e) {} }
              if (pendingStart) startRetryLoop();
            },
            onStateChange: function(ev) {
              if (ev.data === 1 && wantPlay) { confirmSound(); updatePill(); }
              if (ev.data === 0 && wantPlay) { try { ev.target.playVideo(); } catch (e) {} }
            },
            onError: function(ev) {
              var code = ev && ev.data ? ev.data : '?';
              try { console.log('[calix-music] YT error', code); } catch (e) {}
              if (code === 153 || code === 101 || code === 150) {
                var local = false;
                try { local = (location.protocol === 'file:'); } catch (e) {}
                if (local) toast('Error 153: i-host mo muna (file:// blocked ni YouTube)');
                else toast('Music error 153 — tap 🎵 to retry');
                // Fallback: pill opens YouTube directly so music still plays.
                if (pill) {
                  pill.classList.add('show');
                  pill.innerHTML = '<span class="dot"></span><span>🎵 Play on YouTube — Ikaw at Ako</span>';
                  pill.onclick = function() { try { window.open('https://www.youtube.com/watch?v=' + VIDEO_ID + '&list=RD' + VIDEO_ID + '&start_radio=1', '_blank'); } catch (e) {} };
                }
              } else {
                toast('Music error (' + code + ') — tap 🎵 to retry');
              }
              updatePill();
            }
          }
        };
        try {
          if (location.protocol.indexOf('http') === 0 && location.origin && location.origin !== 'null') {
            opts.playerVars.origin = location.origin;
          }
        } catch (e) {}
        player = new YT.Player('yt-player', opts);
      } catch (e) { toast('Music blocked — tap 🎵 to retry'); }
    }

    window.onYouTubeIframeAPIReady = (function(prev) {
      return function() {
        if (typeof prev === 'function') { try { prev(); } catch (e) {} }
        createPlayer();
      };
    })(window.onYouTubeIframeAPIReady);
    // If API already cached/loaded:
    if (window.YT && window.YT.Player) { try { createPlayer(); } catch (e) {} }

    window.__unlockCalixMusic = unlockSound;
    window.__calixMusicStart = startAudible;

    if (!window.__ytApiTag) {
      window.__ytApiTag = true;
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = function() { toast('No internet — music disabled'); };
      document.head.appendChild(tag);
    }
  })();

  /* ═══════════════════════════════════════════
     WELCOME OVERLAY — Explore starts music with sound
  ═══════════════════════════════════════════ */
  (function() {
    var overlay = document.getElementById('welcome-overlay');
    var explore = document.getElementById('exploreBtn');
    if (!overlay || !explore) return;
    window.__calixEntered = false;
    document.body.classList.add('welcome-locked');
    function enter() {
      if (window.__calixEntered) return;
      window.__calixEntered = true;
      overlay.classList.add('hidden');
      document.body.classList.remove('welcome-locked');
      try {
        if (typeof window.__calixMusicStart === 'function') window.__calixMusicStart();
      } catch (e) {}
      setTimeout(function() { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 600);
    }
    explore.addEventListener('click', enter);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) enter(); });
    document.addEventListener('keydown', function(e) { if ((e.key === 'Enter' || e.key === ' ') && !window.__calixEntered) enter(); });
  })();
