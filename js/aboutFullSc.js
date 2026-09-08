import { createLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const picture = document.querySelector('.about picture');
  const fallbackImg = picture?.querySelector('img.smestaj-slika') ?? null;
  const overlay = document.getElementById('fsOverlay');
  const fsImage = document.getElementById('fsImage');
  const closeBtn = document.getElementById('fsClose');

  if (
    !picture ||
    !(fallbackImg instanceof HTMLImageElement) ||
    !overlay ||
    !(fsImage instanceof HTMLImageElement)
  ) {
    return;
  }

  createLightbox({
    overlay,
    image: fsImage,
    items: [fallbackImg],
    closeBtn: closeBtn instanceof HTMLElement ? closeBtn : null,
    enableNav: false,
  });
});
