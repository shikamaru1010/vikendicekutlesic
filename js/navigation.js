document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  let scrollPosition = 0;

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    if (navLinks.classList.contains('active')) {
      
      scrollPosition = window.pageYOffset;  
      body.style.top = `-${scrollPosition}px`;
      body.classList.add('menu-open');
    } else {
      
      body.classList.remove('menu-open');
      body.style.top = '';  
      window.scrollTo(0, scrollPosition); 
    }
    
   
    hamburger.setAttribute('aria-expanded', !expanded);
  });

  // Zatvaranje menija klikom na link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      body.classList.remove('menu-open');
      body.style.top = '';
      window.scrollTo(0, scrollPosition);
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
});