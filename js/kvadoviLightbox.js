// Lightbox za Kvadovi sekciju
document.addEventListener('DOMContentLoaded', () => {
  const slike = document.querySelectorAll('.kvadovi-item:not(.kvadovi-video-item) img');
  const lightbox = document.getElementById('kvadoviLightbox');
  const lightboxImg = document.getElementById('kvadoviLightboxImg');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = document.getElementById('kvadoviPrev');
  const nextBtn = document.getElementById('kvadoviNext');

  let trenutniIndex = 0;
  const listaSlika = Array.from(slike);

  function otvoriLightbox(index) {
    trenutniIndex = index;
    const img = listaSlika[index];
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function zatvoriLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prikaziPrethodni() {
    trenutniIndex = (trenutniIndex - 1 + listaSlika.length) % listaSlika.length;
    otvoriLightbox(trenutniIndex);
  }

  function prikaziSledeci() {
    trenutniIndex = (trenutniIndex + 1) % listaSlika.length;
    otvoriLightbox(trenutniIndex);
  }

  prevBtn.addEventListener('click', prikaziPrethodni);
  nextBtn.addEventListener('click', prikaziSledeci);
  closeBtn.addEventListener('click', zatvoriLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) zatvoriLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') zatvoriLightbox();
    if (e.key === 'ArrowLeft') prikaziPrethodni();
    if (e.key === 'ArrowRight') prikaziSledeci();
  });

  // Touch/swipe podrška
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) prikaziSledeci();
      else prikaziPrethodni();
    }
  });

  listaSlika.forEach((img, i) => {
    img.addEventListener('click', () => otvoriLightbox(i));
  });
});
