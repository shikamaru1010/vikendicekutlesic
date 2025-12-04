document.addEventListener('DOMContentLoaded', () =>{
  const track = document.querySelector('.gallery-track');
  const slides = document.querySelectorAll('.gallery-track img');
  const caption = document.querySelector('.gallery-caption');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');

  let index = 0;
  
 function showSlide(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    caption.textContent = slides[index].dataset.desc || slides[index].alt;
  }
  prev.addEventListener('click', () => showSlide(index - 1));
  next.addEventListener('click', () => showSlide(index + 1));

  showSlide(0);

  /*setInterval(() => showSlide(index + 1), 6000);*/
})