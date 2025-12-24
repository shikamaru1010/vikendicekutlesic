
// Fullscreen Lightbox za galeriju
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.gallery-track img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  // Otvori lightbox sa određenom slikom
  function openLightbox(index) {
    currentIndex = index;
    const img = slides[index];
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.dataset.desc || img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // spreči scroll
  }

  // Zatvori lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Navigacija
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    openLightbox(currentIndex);
  });

  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    openLightbox(currentIndex);
  });

  lightboxClose.addEventListener('click', closeLightbox);

  // Klik van slike zatvara
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Tastatura (ESC, strelice)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // Klik na bilo koju sliku u galeriji otvara lightbox
  slides.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(index));
  });
});