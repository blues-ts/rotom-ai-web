(() => {
  const menu = document.querySelector('#site-menu');
  const toggle = document.querySelector('.menu-toggle');
  function closeMenu(returnFocus = false) {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  matchMedia('(min-width: 761px)').addEventListener('change', () => closeMenu());

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
  const plans = {
    weekly: ['$3.99', ' / week', 'Billed weekly. All Pro features included.'],
    monthly: ['$9.99', ' / month', 'Billed monthly. All Pro features included.'],
    yearly: ['$79.99', ' / year', 'Billed yearly. Equivalent to $6.66 per month.']
  };
  function updatePlan(value) {
    const [price, period, billing] = plans[value];
    document.querySelector('#plan-price').textContent = price;
    document.querySelector('#plan-period').textContent = period;
    document.querySelector('#plan-billing').textContent = billing;
  }
  document.querySelectorAll('[name="billing"]').forEach(input => {
    input.addEventListener('change', () => updatePlan(input.value));
  });
  updatePlan(document.querySelector('[name="billing"]:checked').value);
})();
