// Video kontrole za Kvadovi sekciju
document.addEventListener('DOMContentLoaded', () => {
  const videoItem = document.querySelector('.kvadovi-video-item');
  if (!videoItem) return;

  const video = videoItem.querySelector('video');
  const playBtn = videoItem.querySelector('.kvadovi-play');

  playBtn.addEventListener('click', () => {
    video.muted = false;
    video.play();
    playBtn.classList.add('skriveno');
  });

  video.addEventListener('click', () => {
    video.pause();
    video.muted = true;
    video.currentTime = 0;
    playBtn.classList.remove('skriveno');
  });

  video.addEventListener('ended', () => {
    playBtn.classList.remove('skriveno');
  });
});
