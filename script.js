(() => {
  const menuButton = document.querySelector('.menu-pill');
  const menu = document.querySelector('.site-menu');
  const menuShell = document.querySelector('.menu-shell');
  const menuContent = document.querySelector('.menu-content');
  const header = document.querySelector('.site-header');

  // Keep the content at its expanded width while its outer shell animates.
  // Measuring wrapped text at the closed button width overestimates the height.
  function syncMenuContentWidth() {
    const shellStyle = getComputedStyle(menuShell);
    const inset = parseFloat(shellStyle.right);
    const padding = parseFloat(shellStyle.paddingLeft) + parseFloat(shellStyle.paddingRight);
    menuContent.style.width = `${header.clientWidth - inset * 2 - padding}px`;
  }
  syncMenuContentWidth();
  new ResizeObserver(syncMenuContentWidth).observe(header);
  let menuOpen = false;
  let menuTimer;

  function setMenu(nextOpen, returnFocus = false) {
    if (!menuButton || !menu || !menuShell || nextOpen === menuOpen) return;
    menuOpen = nextOpen;
    clearTimeout(menuTimer);

    menuButton.setAttribute('aria-expanded', String(nextOpen));
    menuButton.setAttribute('aria-label', nextOpen ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!nextOpen));
    menu.inert = !nextOpen;

    if (nextOpen) {
      syncMenuContentWidth();
      const targetHeight = menuContent.offsetHeight;
      menuShell.classList.remove('closing');
      menu.style.height = '0px';
      menuShell.classList.add('open');
      requestAnimationFrame(() => {
        if (menuOpen) menu.style.height = `${targetHeight}px`;
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
    requestAnimationFrame(() => { if (!menuOpen) menu.style.height = '0px'; });
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

  const features = {
    collection: { image: 'collections', alt: 'River collections overview with portfolio value and binders', label: 'YOUR COLLECTION, AT A GLANCE' },
    scan: { image: 'scanner', alt: 'River scanner identifying an Ash-Greninja-EX card', label: 'FIND THE EXACT CARD IN FRONT OF YOU' },
    price: { image: 'configure-graded', alt: 'River graded pricing configuration with a PSA 10 value', label: 'THE RIGHT PRICE FOR YOUR CARD' }
  };
  const tabs = [...document.querySelectorAll('[data-feature]')];
  const preview = document.querySelector('#feature-preview');
  const previewImage = document.querySelector('#feature-image');
  function selectFeature(tab) {
    const feature = features[tab.dataset.feature];
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    previewImage.src = `screens/${feature.image}-660.webp`;
    previewImage.alt = feature.alt;
    document.querySelector('#preview-label').textContent = feature.label;
    preview.setAttribute('aria-labelledby', tab.id);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectFeature(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectFeature(tabs[next]); }
    });
  });
})();
