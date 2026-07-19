// River AI TCG — scroll-driven landing page behavior.
// Everything degrades gracefully: no Lenis → native scroll; no IO → shown state.

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Lenis smooth scrolling (loaded from CDN; optional) ----
  if (!reduced && typeof window.Lenis === 'function') {
    const lenis = new Lenis({ lerp: 0.11 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ---- Nav gains a backdrop once the hero is scrolled ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Mouse-follow glow orb ----
  const orb = document.querySelector('.orb');
  if (orb && !reduced && window.matchMedia('(hover: hover)').matches) {
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, active = false;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        x = tx; y = ty;
        orb.classList.add('on');
        requestAnimationFrame(follow);
      }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => orb.classList.remove('on'));
    document.documentElement.addEventListener('mouseenter', () => { if (active) orb.classList.add('on'); });
    function follow() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      orb.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      requestAnimationFrame(follow);
    }
  }

  // ---- Particle fields (hero, closing, footer) ----
  // Fine ice-blue motes: a pre-rendered glow sprite, slow upward drift,
  // time-based sway (no per-frame jitter), gentle twinkle.
  const canvases = document.querySelectorAll('[data-particles]');
  if (canvases.length && !reduced) {
    // one shared sprite: bright core fading into a soft halo
    const SPRITE = 64;
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SPRITE;
    const sctx = sprite.getContext('2d');
    const grad = sctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    grad.addColorStop(0, 'rgba(225, 240, 255, 1)');
    grad.addColorStop(0.18, 'rgba(190, 224, 255, 0.55)');
    grad.addColorStop(0.5, 'rgba(124, 192, 255, 0.12)');
    grad.addColorStop(1, 'rgba(124, 192, 255, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, SPRITE, SPRITE);

    canvases.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      let w = 0, h = 0, dots = [], running = false, rafId = 0;

      function size() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.max(1, rect.width);
        h = Math.max(1, rect.height);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const target = Math.round(Math.min(55, (w * h) / 30000));
        dots = Array.from({ length: target }, () => spawn(true));
      }

      function spawn(anywhere) {
        const depth = Math.random();                 // 0 = far, 1 = near
        return {
          x: Math.random() * w,
          y: anywhere ? Math.random() * h : h + 10,
          size: 2.5 + depth * 5,                     // sprite draw size (halo included)
          vy: (0.02 + depth * 0.05),                 // px per ms-ish (scaled below)
          swayAmp: 4 + Math.random() * 10,
          swaySpeed: 0.00015 + Math.random() * 0.00025, // rad per ms — slow
          phase: Math.random() * Math.PI * 2,
          a: 0.12 + depth * 0.3,
          twSpeed: 0.0004 + Math.random() * 0.0008,
          twPhase: Math.random() * Math.PI * 2,
        };
      }

      let last = 0;
      function frame(t) {
        if (!running) return;
        const dt = last ? Math.min(50, t - last) : 16;
        last = t;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          d.y -= d.vy * dt * 0.6;
          if (d.y < -10) { dots[i] = spawn(false); continue; }
          const px = d.x + Math.sin(t * d.swaySpeed + d.phase) * d.swayAmp;
          const tw = 0.75 + 0.25 * Math.sin(t * d.twSpeed + d.twPhase);
          ctx.globalAlpha = d.a * tw;
          ctx.drawImage(sprite, px - d.size / 2, d.y - d.size / 2, d.size, d.size);
        }
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(frame);
      }

      function start() {
        if (running) return;
        running = true;
        last = 0;
        rafId = requestAnimationFrame(frame);
      }
      function stop() {
        running = false;
        cancelAnimationFrame(rafId);
      }

      size();
      window.addEventListener('resize', size);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else if (visible) start();
      });

      // only animate while the section is on screen
      let visible = false;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            visible = e.isIntersecting;
            if (visible) start(); else stop();
          });
        }).observe(canvas.parentElement);
      } else {
        visible = true;
        start();
      }
    });
  }

  // ---- Split display headlines into words for staggered reveal ----
  const headlines = document.querySelectorAll('[data-words]');
  headlines.forEach((h) => {
    const words = h.textContent.trim().split(/\s+/);
    h.textContent = '';
    words.forEach((word, i) => {
      const w = document.createElement('span');
      w.className = 'w';
      const wi = document.createElement('span');
      wi.className = 'wi';
      wi.textContent = word;
      wi.style.transitionDelay = (i * 70) + 'ms';
      w.appendChild(wi);
      h.appendChild(w);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  const hasIO = 'IntersectionObserver' in window;

  // ---- Reveal on scroll: word headlines + fade-up blocks ----
  const revealables = [...document.querySelectorAll('[data-words]'), ...document.querySelectorAll('.reveal')];
  if (!hasIO || reduced) {
    revealables.forEach((el) => el.classList.add('shown', 'visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add(e.target.hasAttribute('data-words') ? 'shown' : 'visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach((el) => io.observe(el));
  }

  // ---- Scan story: scroll progress drives the active step ----
  // Step 0 shows the real scanner screenshot; steps 1+ crossfade to the
  // card-detail screenshot; the final step adds the "Added" toast.
  const scanScroll = document.querySelector('.scan-scroll');
  const scanPhone = document.querySelector('.scan-phone');
  if (scanScroll && scanPhone) {
    const stepItems = scanScroll.querySelectorAll('.step-item');
    const counter = scanScroll.querySelector('.step-counter .cur');
    const ovAdded = scanScroll.querySelector('.ov-added');
    let current = -1;

    function setStep(idx) {
      if (idx === current) return;
      current = idx;
      scanPhone.dataset.step = idx;
      stepItems.forEach((s, i) => s.classList.toggle('on', i === idx));
      if (counter) counter.textContent = '0' + (idx + 1);
      ovAdded && ovAdded.classList.toggle('show', idx === 3);
    }

    function onScanScroll() {
      const rect = scanScroll.getBoundingClientRect();
      const total = scanScroll.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      setStep(Math.min(3, Math.floor(progress * 4)));
    }
    setStep(0);
    onScanScroll();
    window.addEventListener('scroll', onScanScroll, { passive: true });
    window.addEventListener('resize', onScanScroll);
  }
})();
