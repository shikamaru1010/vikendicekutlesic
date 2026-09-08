document.addEventListener('DOMContentLoaded', () => {
  const telefon = window.matchMedia('(max-width: 767px)');
  const smanjeno = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selektor = [
    '.about h2',
    '.about h3',
    '.about p',
    '#gallery > h2',
    '#pogodnosti-naslov',
    '.pogodnosti-uvod',
    '.pogodnosti-grupa > h3',
    '#kvadovi > h2',
    '.kvadovi-opis',
    '.sekcija-kontakt > h2',
    '.kontakt-uvod',
    '.kontakt-forma h3',
    '.lokacija-title',
  ].join(',');

  /** @type {IntersectionObserver | null} */
  let observer = null;
  /** @type {HTMLElement[]} */
  let elementi = [];

  function ocisti() {
    observer?.disconnect();
    observer = null;
    elementi.forEach((el) => {
      el.classList.remove('prica-ceka', 'prica-vidljivo');
      el.style.removeProperty('--prica-kasnjenje');
    });
    elementi = [];
  }

  function pokreni() {
    ocisti();
    if (!telefon.matches || smanjeno.matches) return;

    elementi = [...document.querySelectorAll(selektor)].filter(
      (el) => el instanceof HTMLElement
    );

    observer = new IntersectionObserver(
      (unosi) => {
        unosi.forEach((unos) => {
          if (!unos.isIntersecting || !(unos.target instanceof HTMLElement)) return;
          unos.target.classList.add('prica-vidljivo');
          unos.target.classList.remove('prica-ceka');
          observer?.unobserve(unos.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
    );

    elementi.forEach((el, i) => {
      el.style.setProperty('--prica-kasnjenje', `${(i % 3) * 90}ms`);
      el.classList.add('prica-ceka');
      observer?.observe(el);
    });
  }

  pokreni();
  telefon.addEventListener('change', pokreni);
  smanjeno.addEventListener('change', pokreni);
});
