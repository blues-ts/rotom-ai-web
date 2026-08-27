(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mix = (from, to, progress) => from + (to - from) * progress;
  const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value), 3);

  if (!reduced && typeof window.Lenis === 'function') {
    const lenis = new Lenis({ lerp: 0.11 });
    const smooth = (time) => { lenis.raf(time); requestAnimationFrame(smooth); };
    requestAnimationFrame(smooth);
  }

  const menuButton = document.querySelector('.menu-pill');
  const menu = document.querySelector('.site-menu');
  const menuShell = document.querySelector('.menu-shell');
  let menuOpen = false;
  let menuTimer;

  function setMenu(nextOpen, returnFocus = false) {
    if (!menuButton || !menu || !menuShell || nextOpen === menuOpen) return;
    menuOpen = nextOpen;
    clearTimeout(menuTimer);

    menuButton.setAttribute('aria-expanded', String(nextOpen));
    menuButton.setAttribute('aria-label', nextOpen ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!nextOpen));

    if (nextOpen) {
      menuShell.classList.remove('closing');
      menu.style.height = '0px';
      menuShell.classList.add('open');
      requestAnimationFrame(() => {
        if (menuOpen) menu.style.height = `${menu.scrollHeight}px`;
      });
      menuTimer = setTimeout(() => {
        if (menuOpen) menu.style.height = 'auto';
      }, 460);
      return;
    }

    menu.style.height = `${menu.getBoundingClientRect().height}px`;
    menuShell.classList.add('closing');
    menu.offsetHeight;
    menuShell.classList.remove('open');
    requestAnimationFrame(() => { menu.style.height = '0px'; });
    menuTimer = setTimeout(() => menuShell.classList.remove('closing'), 460);
    if (returnFocus) menuButton.focus();
  }

  if (menuButton && menu && menuShell) {
    menuButton.addEventListener('click', () => setMenu(!menuOpen));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    addEventListener('pointerdown', (event) => {
      if (menuOpen && !menuShell.contains(event.target)) setMenu(false);
    });
    addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuOpen) setMenu(false, true);
    });
  }

  const hero = document.querySelector('.hero');
  const heroCopy = document.querySelector('.hero-copy');
  const navCta = document.querySelector('.nav-cta');
  const wheel = document.querySelector('.card-stream');
  const cards = wheel ? [...wheel.querySelectorAll('.float-card')] : [];
  const tooltip = document.querySelector('.wheel-tooltip');
  let wheelAngle = Math.PI;
  let wheelSpeed = reduced ? 0 : 0.1;
  let scrollBoost = 0;
  let introSpinStarted = false;
  let previousScroll = scrollY;
  let hoveredCard = null;
  let frameStart = null;
  let previousFrame = null;
  let wheelRadius = 320;

  function sizeWheel() {
    if (!wheel) return;
    wheelRadius = Math.min(Math.max(wheel.offsetHeight * .32, 220), wheel.offsetWidth * .55, 410);
  }
  sizeWheel();

  cards.forEach((card) => {
    card.addEventListener('mouseenter', (event) => {
      hoveredCard = card;
      wheel.classList.add('has-hover');
      card.classList.add('hovered');
      if (tooltip) {
        tooltip.querySelector('b').textContent = card.dataset.label || '';
        tooltip.classList.add('show');
        tooltip.style.transform = `translate3d(${event.clientX + 16}px,${event.clientY + 18}px,0)`;
      }
    });
    card.addEventListener('mousemove', (event) => {
      if (tooltip) tooltip.style.transform = `translate3d(${event.clientX + 16}px,${event.clientY + 18}px,0)`;
    });
    card.addEventListener('mouseleave', () => {
      hoveredCard = null;
      wheel.classList.remove('has-hover');
      card.classList.remove('hovered');
      tooltip?.classList.remove('show');
    });
  });

  function animateWheel(time) {
    if (frameStart === null) frameStart = time;
    const delta = Math.min(64, time - (previousFrame || time)) / 1000;
    previousFrame = time;
    const elapsed = reduced ? Infinity : (time - frameStart - 800) / 1000;
    if (!introSpinStarted && elapsed >= 0) { scrollBoost = 3; introSpinStarted = true; }
    const scrollDelta = Math.abs(scrollY - previousScroll);
    previousScroll = scrollY;
    scrollBoost = Math.min(5, scrollBoost + scrollDelta * .004) * Math.exp(-delta * 1.6);
    const targetSpeed = hoveredCard ? 0 : .1;
    wheelSpeed += (targetSpeed - wheelSpeed) * (1 - Math.exp(-delta * 3.2));
    wheelAngle -= (wheelSpeed + (hoveredCard ? 0 : scrollBoost)) * delta;
    const ringGrow = elapsed === Infinity ? 1 : .45 + .55 * easeOutCubic(elapsed / 1.9);
    const step = Math.PI * 2 / Math.max(cards.length, 1);
    cards.forEach((card, index) => {
      const progress = elapsed === Infinity ? 1 : easeOutCubic((elapsed - index * .08) / .85);
      if (progress <= 0) { card.style.visibility = 'hidden'; return; }
      const angle = wheelAngle + index * step;
      const radius = wheelRadius * ringGrow;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const tiltX = Math.sin(angle) * 4;
      const tiltY = Math.cos(angle) * 10;
      const fan = Math.atan2(Math.sin(angle - Math.PI), Math.cos(angle - Math.PI)) * 180 / Math.PI * .14;
      card.style.visibility = 'visible';
      card.style.opacity = progress.toFixed(3);
      card.style.transform = `translate(50%,-50%) translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) rotateZ(${fan.toFixed(2)}deg) scale(${(.7 + .3 * progress).toFixed(3)})`;
      card.style.zIndex = hoveredCard === card ? '100' : String(Math.round((1 - Math.cos(angle)) * 40));
    });
    requestAnimationFrame(animateWheel);
  }
  if (cards.length) requestAnimationFrame(animateWheel);

  const demoSection = document.querySelector('.catalog-demo');
  const demoCard = document.querySelector('.catalog-card');
  const demoWindow = document.querySelector('.app-demo-window');
  const demoLabel = document.querySelector('.demo-label');
  const demoScreens = [...document.querySelectorAll('[data-demo-screen]')];
  const demoCopies = [...document.querySelectorAll('[data-demo-copy]')];
  const demoSteps = [...document.querySelectorAll('[data-demo-step]')];
  let activeDemo = 0;

  function setDemoStep(nextStep) {
    const next = Math.min(Math.max(Number(nextStep) || 0, 0), Math.max(demoScreens.length - 1, 0));
    activeDemo = next;
    demoScreens.forEach((screen, index) => {
      const selected = index === next;
      screen.classList.toggle('active', selected);
      screen.setAttribute('aria-hidden', String(!selected));
    });
    demoCopies.forEach((copy, index) => {
      const selected = index === next;
      copy.classList.toggle('active', selected);
      copy.setAttribute('aria-hidden', String(!selected));
    });
    demoSteps.forEach((step, index) => {
      const selected = index === next;
      step.classList.toggle('active', selected);
      step.setAttribute('aria-selected', String(selected));
      step.tabIndex = selected ? 0 : -1;
    });
    demoWindow?.style.setProperty('--demo-step', String(next));
  }

  demoSteps.forEach((step, index) => {
    step.addEventListener('click', () => setDemoStep(index));
    step.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = (index + direction + demoSteps.length) % demoSteps.length;
      setDemoStep(next);
      demoSteps[next]?.focus();
    });
  });
  if (demoScreens.length) setDemoStep(0);
  const manifesto = document.querySelector('[data-manifesto]');
  if (manifesto) {
    const words = manifesto.textContent.trim().split(/\s+/);
    manifesto.textContent = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + (index < words.length - 1 ? ' ' : '');
      if (index >= words.length - 4) span.classList.add('highlight');
      manifesto.appendChild(span);
    });
  }

  const story = document.querySelector('.experience');
  const copies = [...document.querySelectorAll('.experience-copy article')];
  const bars = [...document.querySelectorAll('.progress i')];
  const shot = document.querySelector('#story-shot');
  const phone = document.querySelector('.phone');
  const shots = ['screens/binder-scan.webp', 'screens/configure-raw.webp', 'screens/vending.webp', 'screens/collections.webp'];
  const shotAlts = ['River binder scanner', 'River raw card pricing configuration', 'River vending dashboard', 'River collections dashboard'];
  let active = 0;

  const finalCta = document.querySelector('.final-cta');
  const fan = document.querySelector('[data-fan]');
  if (fan && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries, observer) => {
      if (entries[0]?.isIntersecting) { fan.classList.add('revealed'); observer.disconnect(); }
    }, { rootMargin: '-80px' }).observe(fan);
  } else fan?.classList.add('revealed');

  function updateScrollAnimations() {
    const viewportHeight = innerHeight;
    if (hero && heroCopy) {
      const heroOpacity = 1 - clamp(scrollY / (hero.offsetHeight * .5));
      heroCopy.style.opacity = String(heroOpacity);
      if (wheel && scrollY > 0) wheel.style.opacity = String(heroOpacity);
      if (navCta) {
        const showNavCta = scrollY > hero.offsetHeight * .5;
        navCta.classList.toggle('show', showNavCta);
        navCta.setAttribute('aria-hidden', String(!showNavCta));
        navCta.tabIndex = showNavCta ? 0 : -1;
      }
    }

    if (demoSection && demoCard && demoWindow) {
      const start = demoSection.offsetTop;
      const distance = Math.max(1, demoSection.offsetHeight - viewportHeight);
      const progress = clamp((scrollY - start) / distance);
      const mobile = innerWidth < 768;
      const padding = innerWidth >= 1024 ? 40 : innerWidth >= 640 ? 32 : 20;
      const fullWidth = Math.min(innerWidth, 1440) - padding * 2;
      const stageWidth = mobile ? 456 : 1120;
      const stageHeight = mobile ? 780 : 700;
      const fullHeight = Math.min(viewportHeight - 120, Math.round(fullWidth * stageHeight / stageWidth));
      const top = Math.max(mobile ? 96 : 64, Math.round((viewportHeight - fullHeight) / 2));
      const peekWidth = mobile ? fullWidth : Math.min(400, fullWidth);
      const peekHeight = Math.min(260, fullHeight);
      const peekY = viewportHeight - 50 - top;
      const growth = easeOutCubic(progress / .18);
      const width = mobile ? fullWidth : mix(peekWidth, fullWidth, growth);
      const height = mobile ? fullHeight : mix(peekHeight, fullHeight, growth);
      const y = mix(peekY, 0, growth);
      const scale = Math.min(width / stageWidth, height / stageHeight, 1.1);
      const demoProgress = clamp((progress - .22) / .72);
      const hintIn = clamp((progress - .18) / .04);
      const hintOut = 1 - clamp((progress - .94) / .03);
      demoCard.style.setProperty('--card-top', `${top}px`);
      demoCard.style.setProperty('--card-width', `${width}px`);
      demoCard.style.setProperty('--card-height', `${height}px`);
      demoCard.style.setProperty('--card-y', `${y}px`);
      demoCard.style.setProperty('--demo-scale', String(scale));
      demoCard.style.setProperty('--hint-opacity', String(hintIn * hintOut));
      demoCard.style.setProperty('--progress-opacity', String(hintIn));
      demoCard.style.setProperty('--progress-angle', `${demoProgress * 360}deg`);
      const nextDemo = Math.floor(clamp(demoProgress, 0, .999) * Math.max(demoScreens.length, 1));
      if (nextDemo !== activeDemo) setDemoStep(nextDemo);
      if (demoLabel) {
        demoLabel.style.setProperty('--caption-y', `${top + y - 44}px`);
        demoLabel.style.setProperty('--caption-opacity', String(1 - clamp(progress / .1)));
      }
    }

    if (manifesto) {
      const rect = manifesto.getBoundingClientRect();
      const progress = clamp((viewportHeight * .85 - rect.top) / (viewportHeight * .55));
      const words = [...manifesto.children];
      words.forEach((word, index) => {
        const local = clamp(progress * words.length - index);
        word.style.opacity = String(mix(.12, 1, local));
      });
    }

    if (story && copies.length) {
      const rect = story.getBoundingClientRect();
      const entry = clamp((viewportHeight - rect.top) / viewportHeight);
      const exit = clamp((viewportHeight - rect.bottom) / viewportHeight);
      story.style.setProperty('--panel-scale', String(.75 + .25 * entry - .25 * exit));
      story.style.setProperty('--panel-radius', `${56 * (1 - entry) + 56 * exit}px`);
      story.style.setProperty('--panel-origin', exit > 0 ? 'center bottom' : 'center top');
      document.documentElement.classList.toggle('scrollbar-on-dark', entry > .999 && exit < .001);
      const distance = Math.max(1, story.offsetHeight - viewportHeight);
      const progress = clamp((scrollY - story.offsetTop) / distance, 0, .999);
      const next = Math.floor(progress * copies.length);
      if (next !== active) {
        active = next;
        copies.forEach((item, i) => item.classList.toggle('active', i === active));
        bars.forEach((item, i) => item.classList.toggle('on', i === active));
        if (shot && phone) {
          phone.style.opacity = '.55'; phone.style.transform = 'translateY(28px) scale(.93)';
          setTimeout(() => { shot.src = shots[active]; shot.alt = shotAlts[active]; phone.style.opacity = '1'; phone.style.transform = 'none'; }, 180);
        }
      }
    }

    if (finalCta) {
      const rect = finalCta.getBoundingClientRect();
      const endTop = (viewportHeight - rect.height) / 2;
      const progress = clamp((viewportHeight - rect.top) / Math.max(1, viewportHeight - endTop));
      finalCta.style.transform = `translateY(${40 * (1 - progress)}px) scale(${.93 + .07 * progress})`;
    }
  }

  const benefits = document.querySelector('.benefits');
  const preview = document.querySelector('.benefit-preview');
  const previewImage = preview?.querySelector('img');
  if (benefits && preview && !reduced) {
    let targetX = 0, targetY = 0, x = 0, y = 0, velocity = 0, previewRunning = false;
    const follow = () => {
      const oldX = x; x += (targetX - x) * .18; y += (targetY - y) * .18; velocity += ((x - oldX) - velocity) * .2;
      preview.style.left = `${x}px`; preview.style.top = `${y}px`; preview.style.setProperty('--preview-rotate', `${clamp(velocity * .45, -8, 8)}deg`);
      if (previewRunning) requestAnimationFrame(follow);
    };
    benefits.addEventListener('mousemove', (event) => { const rect = benefits.getBoundingClientRect(); targetX = event.clientX - rect.left + 35; targetY = event.clientY - rect.top - 80; });
    benefits.querySelectorAll('.benefit-row').forEach((row) => {
      row.addEventListener('mouseenter', (event) => {
        const rect = benefits.getBoundingClientRect(); x = targetX = event.clientX - rect.left + 35; y = targetY = event.clientY - rect.top - 80;
        if (previewImage) previewImage.src = row.dataset.preview;
        preview.classList.add('show'); if (!previewRunning) { previewRunning = true; requestAnimationFrame(follow); }
      });
      row.addEventListener('mouseleave', () => { preview.classList.remove('show'); previewRunning = false; });
    });
  }

  if (!reduced) {
    const magneticLinks = [...document.querySelectorAll('.pill')].map((element) => ({
      element, x: 0, y: 0, velocityX: 0, velocityY: 0, targetX: 0, targetY: 0
    }));
    let magneticFrame = 0;
    let previousMagneticTime = 0;

    const animateMagneticLinks = (time) => {
      const delta = Math.min((time - (previousMagneticTime || time)) / 1000, .032);
      previousMagneticTime = time;
      let moving = false;

      magneticLinks.forEach((state) => {
        const accelerationX = (state.targetX - state.x) * 220 - state.velocityX * 17;
        const accelerationY = (state.targetY - state.y) * 220 - state.velocityY * 17;
        state.velocityX += accelerationX * delta;
        state.velocityY += accelerationY * delta;
        state.x += state.velocityX * delta;
        state.y += state.velocityY * delta;

        if (Math.abs(state.targetX - state.x) < .01 && Math.abs(state.velocityX) < .01) {
          state.x = state.targetX; state.velocityX = 0;
        }
        if (Math.abs(state.targetY - state.y) < .01 && Math.abs(state.velocityY) < .01) {
          state.y = state.targetY; state.velocityY = 0;
        }

        state.element.style.setProperty('--mag-x', `${state.x.toFixed(3)}px`);
        state.element.style.setProperty('--mag-y', `${state.y.toFixed(3)}px`);
        if (state.x !== state.targetX || state.y !== state.targetY || state.velocityX || state.velocityY) moving = true;
      });

      if (moving) magneticFrame = requestAnimationFrame(animateMagneticLinks);
      else { magneticFrame = 0; previousMagneticTime = 0; }
    };

    const startMagneticAnimation = () => {
      if (!magneticFrame) magneticFrame = requestAnimationFrame(animateMagneticLinks);
    };

    magneticLinks.forEach((state) => {
      state.element.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const rect = state.element.getBoundingClientRect();
        state.targetX = (event.clientX - rect.left - rect.width / 2) * .35;
        state.targetY = (event.clientY - rect.top - rect.height / 2) * .45;
        startMagneticAnimation();
      });
      state.element.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'mouse') return;
        state.targetX = 0;
        state.targetY = 0;
        startMagneticAnimation();
      });
    });
  }

  document.querySelectorAll('details').forEach((detail) => detail.addEventListener('toggle', () => {
    const mark = detail.querySelector('summary span'); if (mark) mark.textContent = detail.open ? '×' : '＋';
  }));

  addEventListener('scroll', updateScrollAnimations, { passive: true });
  addEventListener('resize', () => { sizeWheel(); updateScrollAnimations(); });
  updateScrollAnimations();
})();
