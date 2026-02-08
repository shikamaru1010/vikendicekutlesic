document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.gallery-track');
  const slides = document.querySelectorAll('.gallery-track img');
  const caption = document.querySelector('.gallery-caption');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');

  let index = 0;

  function showSlide(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    const desc = slides[index].dataset.desc || slides[index].alt;
    caption.textContent = `${index + 1} / ${slides.length} — ${desc}`;
  }

  prev.addEventListener('click', () => showSlide(index - 1));
  next.addEventListener('click', () => showSlide(index + 1));

  // Touch/swipe support
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

  showSlide(0);
});
