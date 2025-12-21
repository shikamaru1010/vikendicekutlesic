document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Ažuriraj ARIA
    hamburger.setAttribute('aria-expanded', !expanded);
  });

  // Zatvaranje menija klikom na link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
});