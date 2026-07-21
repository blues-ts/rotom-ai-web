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

  // ---- Particle stream (hero, closing, footer) ----
  // Motes drift left-to-right along a shared sine band rather than falling:
  // three summed waves give the ribbon its organic shape, each mote fades in
  // and out over its own lifetime, and drawing is additive so overlaps bloom.
  const canvases = document.querySelectorAll('[data-particles]');
  if (canvases.length) {
    canvases.forEach((canvas) => {
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const host = canvas.parentElement;
      const centerY = parseFloat(canvas.dataset.center) || 0.5;   // band position
      const amp = parseFloat(canvas.dataset.amp) || 0.15;         // band height
      const density = parseFloat(canvas.dataset.density) || 90;   // motes per 1000px
      const fadeY = canvas.dataset.fade ? parseFloat(canvas.dataset.fade) : null;
      const FADE_R = 0.09, FADE_CEIL = 0.22; // dim the band where text sits

      let w = 0, h = 0, dots = [], rafId = null, last = 0;
      let onScreen = false, pageVisible = !document.hidden;

      function spawn(scattered) {
        const life = 4 + Math.random() * 5;
        // mostly accent blue, a few bright ice-white sparkles
        const hue = Math.random() > 0.78 ? 0.55 + Math.random() * 0.45 : Math.random() * 0.45;
        return {
          x: Math.random() * (w + 80) - 40,
          yOffset: (Math.random() - 0.5) * 90,
          phase: Math.random() * Math.PI * 2,
          speed: 14 + Math.random() * 32,      // px per second, rightward
          size: 0.6 + Math.random() * 1.8,
          life: life,
          age: scattered ? Math.random() * life : 0,
          twinkle: 1.6 + Math.random() * 3.2,
          hue: hue,
        };
      }

      // #3B9DF2 accent → #E1F0FF ice white as hue goes 0 → 1
      function rgba(d, a) {
        const r = Math.round(59 + 166 * d.hue);
        const g = Math.round(157 + 83 * d.hue);
        const b = Math.round(242 + 13 * d.hue);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      }

      // three summed sines — the band's shape at a given x and time
      function band(x, t) {
        return (0.55 * Math.sin(0.0042 * x + 0.18 * t) +
                0.32 * Math.sin(0.011 * x + 0.42 * t + 1.7) +
                0.13 * Math.sin(0.022 * x + 0.65 * t + 3.1)) * amp * h;
      }

      function size() {
        const rect = host.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const target = Math.max(8, Math.floor((w / 1000) * density));
        while (dots.length < target) dots.push(spawn(true));
        while (dots.length > target) dots.pop();
      }

      function draw(now) {
        const dt = Math.min(0.05, (now - (last || now)) / 1000);
        last = now;
        const t = now / 1000;
        const mid = centerY * h;

        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          d.x += d.speed * dt;
          d.age += dt;
          if (d.x > w + 20 || d.age > d.life) { dots[i] = spawn(false); continue; }

          const y = mid + band(d.x + 50 * d.phase, t) +
                    d.yOffset * (0.4 + 0.6 * Math.sin(d.phase + 0.3 * t));

          // fade in over life, twinkle, and never exceed half opacity
          let a = Math.min(0.5, Math.max(0,
            Math.sin(Math.PI * (d.age / d.life)) *
            (0.55 + 0.45 * Math.sin(t * d.twinkle + 4 * d.phase)) * 0.5));

          // keep the band quiet where headline text sits
          if (fadeY !== null) {
            const dist = Math.abs(y / h - fadeY) / FADE_R;
            if (dist < 1) {
              const ceil = FADE_CEIL + (1 - FADE_CEIL) * dist;
              if (a > ceil) a = ceil;
            }
          }
          if (a < 0.01) continue;

          const halo = 6 * d.size;
          const g = ctx.createRadialGradient(d.x, y, 0, d.x, y, halo);
          g.addColorStop(0, rgba(d, a * 0.55));
          g.addColorStop(1, rgba(d, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(d.x, y, halo, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = rgba(d, Math.min(1, a * 1.1));
          ctx.beginPath();
          ctx.arc(d.x, y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        rafId = requestAnimationFrame(draw);
      }

      function start() {
        if (reduced || rafId !== null || !onScreen || !pageVisible) return;
        last = 0;
        rafId = requestAnimationFrame(draw);
      }
      function stop() {
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      }

      // reduced motion: one still frame of the band, no animation
      function paintStill() {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        const mid = centerY * h;
        dots.forEach((d) => {
          const y = mid + band(d.x, 0) + 0.5 * d.yOffset;
          ctx.fillStyle = rgba(d, 0.5);
          ctx.beginPath();
          ctx.arc(d.x, y, d.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = 'source-over';
      }

      size();
      if (reduced) {
        paintStill();
      } else if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          onScreen = !!(entries[0] && entries[0].isIntersecting);
          if (onScreen) start(); else stop();
        }, { threshold: 0 }).observe(canvas);
      } else {
        onScreen = true;
        start();
      }

      document.addEventListener('visibilitychange', () => {
        pageVisible = !document.hidden;
        if (pageVisible) start(); else stop();
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { size(); if (reduced) paintStill(); }, 150);
      });
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
    const STEPS = stepItems.length;
    let current = -1;

    function setStep(idx) {
      if (idx === current) return;
      current = idx;
      scanPhone.dataset.step = idx;
      stepItems.forEach((s, i) => s.classList.toggle('on', i === idx));
      if (counter) counter.textContent = '0' + (idx + 1);
      ovAdded && ovAdded.classList.toggle('show', idx === STEPS - 1);
    }

    function onScanScroll() {
      const rect = scanScroll.getBoundingClientRect();
      const total = scanScroll.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      setStep(Math.min(STEPS - 1, Math.floor(progress * STEPS)));
    }
    setStep(0);
    onScanScroll();
    window.addEventListener('scroll', onScanScroll, { passive: true });
    window.addEventListener('resize', onScanScroll);
  }
})();
