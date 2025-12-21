const form = document.getElementById('contactForm');
const status = document.getElementById('status');

// PROMENI OVAJ DEO SA SVOJIM LINKOM !!!');

form.action = "https://formspree.io/f/xldqoozg";   // ←←← OVDE STAVI SVOJ LINK

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      status.innerHTML = '<span class="success">✔ Hvala! Poruka je uspešno poslata. Javiću vam se uskoro!</span>';
      form.reset();
      form.style.display = 'none';
    } else {
      throw new Error();
    }
  })
  .catch(() => {
    status.innerHTML = '<span class="error">✖ Greška prilikom slanja. Pokušajte ponovo ili pošaljite direktno na moj mail.</span>';
  });
});