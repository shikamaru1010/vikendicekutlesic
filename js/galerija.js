document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.gallery-container');
  const track = document.querySelector('.gallery-track');
  const slajdovi = track ? Array.from(track.querySelectorAll('.gallery-slide')) : [];
  const slides = track ? Array.from(track.querySelectorAll('.gallery-slide img')) : [];
  const caption = document.querySelector('.gallery-caption');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');

  if (
    !(container instanceof HTMLElement) ||
    !(track instanceof HTMLElement) ||
    slides.length === 0 ||
    slajdovi.length === 0 ||
    !caption ||
    !prev ||
    !next
  ) {
    return;
  }

  let index = 0;
  let prikazId = 0;

  function sirinaSlajda() {
    return container.getBoundingClientRect().width;
  }

  function pomeriTraku() {
    const w = sirinaSlajda();
    slajdovi.forEach((slajd) => {
      if (!(slajd instanceof HTMLElement)) return;
      slajd.style.width = `${w}px`;
      slajd.style.flex = `0 0 ${w}px`;
    });
    track.style.transform = `translate3d(-${index * w}px, 0, 0)`;
  }

  function cekajSliku(img) {
    const spremna = img.complete && img.naturalWidth > 0;
    const ucitana = spremna
      ? Promise.resolve()
      : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });

    return ucitana.then(() => {
      if (typeof img.decode === 'function') {
        return img.decode().catch(() => undefined);
      }
      return undefined;
    });
  }

  function preducitaj(i) {
    const img = slides[(i + slides.length) % slides.length];
    if (!img || img.classList.contains('gallery-slika-ucitana')) return;
    cekajSliku(img).then(() => {
      img.classList.add('gallery-slika-ucitana');
    });
  }

  async function showSlide(i) {
    const ovajPrikaz = ++prikazId;
    index = (i + slides.length) % slides.length;
    const img = slides[index];

    pomeriTraku();

    if (!img.classList.contains('gallery-slika-ucitana')) {
      await cekajSliku(img);
      if (ovajPrikaz !== prikazId) return;
      img.classList.add('gallery-slika-ucitana');
    }

    caption.textContent = img.dataset.desc || img.alt || '';

    preducitaj(index + 1);
    preducitaj(index - 1);
  }

  prev.addEventListener('click', () => showSlide(index - 1));
  next.addEventListener('click', () => showSlide(index + 1));

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showSlide(index + 1);
      else showSlide(index - 1);
    }
  });

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(() => {
      pomeriTraku();
    }).observe(container);
  } else {
    window.addEventListener('resize', pomeriTraku);
  }

  window.addEventListener('orientationchange', () => {
    window.setTimeout(pomeriTraku, 80);
  });

  showSlide(0);
});
