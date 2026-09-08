import { createLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const galerija = document.querySelector('.kvadovi-galerija');
  const grid = document.querySelector('.kvadovi-grid');
  const items = Array.from(document.querySelectorAll('.kvadovi-item'));
  const lightbox = document.getElementById('kvadoviLightbox');
  const lightboxImg = document.getElementById('kvadoviLightboxImg');
  const lightboxVideo = document.getElementById('kvadoviLightboxVideo');
  const closeBtn = lightbox?.querySelector('.lightbox-close') ?? null;
  const prevBtn = document.getElementById('kvadoviPrev');
  const nextBtn = document.getElementById('kvadoviNext');
  const telefon = window.matchMedia('(max-width: 767px)');

  if (
    !lightbox ||
    !(lightboxImg instanceof HTMLImageElement) ||
    items.length === 0
  ) {
    return;
  }

  createLightbox({
    overlay: lightbox,
    image: lightboxImg,
    video: lightboxVideo instanceof HTMLVideoElement ? lightboxVideo : null,
    items,
    prevBtn,
    nextBtn,
    closeBtn: closeBtn instanceof HTMLElement ? closeBtn : null,
    enableNav: true,
  });

  if (!(galerija instanceof HTMLElement) || !(grid instanceof HTMLElement)) {
    return;
  }

  let indeks = 0;
  let prevukao = false;
  let dodirX = 0;
  /** @type {HTMLButtonElement[]} */
  const dugmad = [];

  /**
   * @param {Element} item
   * @returns {string}
   */
  function izvorSlicice(item) {
    const video = item.querySelector('video');
    if (video instanceof HTMLVideoElement) {
      return video.getAttribute('poster') ?? '';
    }
    const mali = item.querySelector('source[media*="max-width"]');
    const srcset = mali?.getAttribute('srcset');
    if (srcset) return srcset;
    const img = item.querySelector('img');
    return img instanceof HTMLImageElement ? img.getAttribute('src') ?? '' : '';
  }

  /**
   * @param {Element} item
   * @returns {string}
   */
  function natpis(item, i) {
    if (item.classList.contains('kvadovi-video-item')) {
      return 'Video snimak vožnje';
    }
    const img = item.querySelector('img');
    if (img instanceof HTMLImageElement && img.alt) return img.alt;
    return `Kadar ${i + 1}`;
  }

  function pauzirajVideo() {
    items.forEach((item) => {
      const video = item.querySelector('video');
      if (video instanceof HTMLVideoElement) {
        video.pause();
      }
    });
  }

  /**
   * @param {number} i
   */
  function izaberi(i) {
    indeks = (i + items.length) % items.length;
    pauzirajVideo();

    items.forEach((item, j) => {
      item.classList.toggle('kvadovi-aktivan', j === indeks);
    });

    dugmad.forEach((btn, j) => {
      const aktivan = j === indeks;
      btn.classList.toggle('kvadovi-izbor-aktivan', aktivan);
      btn.setAttribute('aria-selected', aktivan ? 'true' : 'false');
      btn.tabIndex = aktivan ? 0 : -1;
    });
  }

  const traka = document.createElement('div');
  traka.className = 'kvadovi-izbor';
  traka.setAttribute('role', 'tablist');
  traka.setAttribute('aria-label', 'Izbor slike ili snimka');

  items.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kvadovi-izbor-btn';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', natpis(item, i));
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.tabIndex = i === 0 ? 0 : -1;

    const thumb = document.createElement('img');
    thumb.src = izvorSlicice(item);
    thumb.alt = '';
    thumb.setAttribute('aria-hidden', 'true');
    thumb.decoding = 'async';
    btn.appendChild(thumb);

    if (item.classList.contains('kvadovi-video-item')) {
      btn.classList.add('kvadovi-izbor-video');
      const play = document.createElement('span');
      play.className = 'kvadovi-izbor-play';
      play.setAttribute('aria-hidden', 'true');
      play.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      btn.appendChild(play);
    }

    btn.addEventListener('click', () => izaberi(i));
    dugmad.push(btn);
    traka.appendChild(btn);
  });

  grid.after(traka);
  galerija.classList.add('kvadovi-galerija-spremna');

  traka.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const sled = e.key === 'ArrowRight' ? indeks + 1 : indeks - 1;
    izaberi(sled);
    dugmad[indeks]?.focus();
  });

  grid.addEventListener(
    'touchstart',
    (e) => {
      dodirX = e.touches[0].clientX;
      prevukao = false;
    },
    { passive: true }
  );

  grid.addEventListener('touchend', (e) => {
    if (!telefon.matches) return;
    const diff = dodirX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      prevukao = true;
      izaberi(indeks + (diff > 0 ? 1 : -1));
    }
  });

  grid.addEventListener(
    'click',
    (e) => {
      if (!prevukao) return;
      e.stopPropagation();
      prevukao = false;
    },
    true
  );

  izaberi(0);
});
