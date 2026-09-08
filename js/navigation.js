document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (!hamburger || !navLinks) {
    return;
  }

  let scrollPosition = 0;

  function closeMenu(restoreScroll = true) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    body.classList.remove('menu-open');
    body.style.top = '';
    if (restoreScroll) {
      window.scrollTo(0, scrollPosition);
    }
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Otvori glavni meni');
  }

  function goToTop(e) {
    e.preventDefault();
    if (navLinks.classList.contains('active')) {
      closeMenu(false);
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function openMenu() {
    scrollPosition = window.pageYOffset;
    body.style.top = `-${scrollPosition}px`;
    body.classList.add('menu-open');
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Zatvori glavni meni');
  }

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu();
    else openMenu();
    zakaziOznaku();
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('.logo, .footer-logo-link').forEach((link) => {
    link.addEventListener('click', goToTop);
  });

  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target) &&
      !e.target.closest('.logo')
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* Podvučena je sekcija u kojoj čitalac stvarno jeste, ne poslednja kliknuta */
  const sekcije = Array.from(navLinks.querySelectorAll('a[href^="#"]'))
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      const cilj = id ? document.getElementById(id) : document.querySelector('.hero');
      return cilj ? { link, cilj } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.cilj.offsetTop - b.cilj.offsetTop);

  if (sekcije.length === 0) {
    return;
  }

  const visinaHeadera =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;

  function oznaciTekucu() {
    const y = body.classList.contains('menu-open') ? scrollPosition : window.scrollY;
    const merac = y + visinaHeadera + 8;
    const naDnu =
      !body.classList.contains('menu-open') &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    let tekuca = sekcije[0];
    if (naDnu) {
      tekuca = sekcije[sekcije.length - 1];
    } else {
      sekcije.forEach((stavka) => {
        if (stavka.cilj.offsetTop <= merac) {
          tekuca = stavka;
        }
      });
    }

    sekcije.forEach(({ link }) => {
      if (link === tekuca.link) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  let zakazano = false;
  function zakaziOznaku() {
    if (zakazano) {
      return;
    }
    zakazano = true;
    requestAnimationFrame(() => {
      zakazano = false;
      oznaciTekucu();
    });
  }

  window.addEventListener('scroll', zakaziOznaku, { passive: true });
  window.addEventListener('resize', zakaziOznaku);
  window.addEventListener('hashchange', zakaziOznaku);
  oznaciTekucu();
});
