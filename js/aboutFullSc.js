document.addEventListener('DOMContentLoaded', () => {
  const picture = document.querySelector('.about picture');
  const fallbackImg = picture.querySelector('img.smestaj-slika');
  const overlay = document.getElementById('fsOverlay');
  const fsImage = document.getElementById('fsImage');
  const closeBtn = document.getElementById('fsClose');

  picture.addEventListener('click', () => {
    const currentSrc = fallbackImg.currentSrc || fallbackImg.src;
    fsImage.src = currentSrc;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeOverlay() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === fsImage) {
      closeOverlay();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeOverlay();
    }
  });
});
