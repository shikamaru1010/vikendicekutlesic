import { createLightbox } from './lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.gallery-track img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = lightbox?.querySelector('.lightbox-close') ?? null;
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox || !(lightboxImg instanceof HTMLImageElement) || slides.length === 0) {
    return;
  }

  createLightbox({
    overlay: lightbox,
    image: lightboxImg,
    caption: lightboxCaption,
    items: slides,
    prevBtn: lightboxPrev,
    nextBtn: lightboxNext,
    closeBtn: lightboxClose instanceof HTMLElement ? lightboxClose : null,
    enableNav: true,
  });
});
