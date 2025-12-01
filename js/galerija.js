import galleryData from "./data/gallery-data.js";

let currentIndex = 0;
const autoSlideInterval = 6000;
let autoSlideTimer;

const mainImage = document.getElementById('mainImage');
const mainDescription = document.getElementById('mainDescription');
const roomName = document.getElementById('roomName');
const thumbnailsContainer = document.getElementById('thumbnails');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreenImg');
const closeFullscreen = document.querySelector('.close-fullscreen');
const mainWrapper = document.querySelector('.main-image-wrapper');

// funkcija za prikazivanje slike
function showImage(index){
    const item = galleryData[index];
    mainImage.src = item.src;
    mainImage.alt = item.alt;
    mainDescription.textContent = item.description;
    roomName.textContent = item.title;

    document.querySelectorAll('.thumb').forEach((t,i) =>{
        t.classList.toggle('active', i === index);
    });

    currentIndex = index;
}

function createThumbnails() {
  thumbnailsContainer.innerHTML = ''; // očisti ako se poziva više puta
  galleryData.forEach((item, i) => {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.classList.add('thumb');
    if (i === 0) img.classList.add('active');
    img.addEventListener('click', () => {
      showImage(i);
      resetAutoSlide();
    });
    thumbnailsContainer.appendChild(img);
  });
}

// navigacija

prevBtn.addEventListener('click',() =>{
    let newIndex = currentIndex - 1;
    if(newIndex < 0) newIndex = galleryData.length - 1;
    showImage(newIndex);
    resetAutoSlide();
});

nextBtn.addEventListener('click',() =>{
    let newIndex = (currentIndex + 1) % galleryData.length;
    showImage(newIndex);
    resetAutoSlide();
});

// Automatski slajd
function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    showImage((currentIndex + 1) % galleryData.length);
  }, autoSlideInterval);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// Fullscreen
mainWrapper.addEventListener('click', () => {
  fullscreenImg.src = mainImage.src;
  fullscreen.classList.add('active');
});

closeFullscreen.addEventListener('click', () => fullscreen.classList.remove('active'));
fullscreen.addEventListener('click', (e) => {
  if (e.target === fullscreen) fullscreen.classList.remove('active');
});

// Inicijalizacija kada se DOM učita
document.addEventListener('DOMContentLoaded', () => {
  createThumbnails();
  showImage(0);
  startAutoSlide();
});

// Pauziranje auto-slajda kad je miš iznad
document.querySelector('.gallery-container').addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
document.querySelector('.gallery-container').addEventListener('mouseleave', startAutoSlide);