
document.addEventListener('DOMContentLoaded', () => {
  const picture = document.querySelector('picture'); // ili specifičniji selektor ako imaš više picture tagova
  const fallbackImg = picture.querySelector('img.smestaj-slika');
  const overlay = document.getElementById('fsOverlay');
  const fsImage = document.getElementById('fsImage');
  const closeBtn = document.getElementById('fsClose');

  // Postavi kursor da pokazuje da je clickable
  picture.style.cursor = 'zoom-in';
  fallbackImg.style.cursor = 'zoom-in';

  // Klik na picture ili sliku otvara fullscreen
  picture.addEventListener('click', () => {
    // Uzimamo trenutno učitanu sliku (ona koja je prikazana korisniku)
    const currentSrc = fallbackImg.currentSrc || fallbackImg.src;
    
    fsImage.src = currentSrc;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // spreči scroll stranice
  });

  // Zatvaranje
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Klik na pozadinu ili na samu sliku zatvara
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === fsImage) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ESC tipka zatvara
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});
