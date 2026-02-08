const form = document.getElementById('contactForm');
const statusEl = document.getElementById('status');
const submitBtn = form.querySelector('button[type="submit"]');

form.action = "https://formspree.io/f/xldqoozg";

form.addEventListener('submit', function(e) {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Šaljem...';
  statusEl.textContent = '';
  statusEl.className = '';

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      statusEl.textContent = '\u2714 Hvala! Poruka je uspešno poslata. Javiću vam se uskoro!';
      statusEl.className = 'status-success';
      form.reset();
    } else {
      throw new Error();
    }
  })
  .catch(() => {
    statusEl.textContent = '\u2716 Greška prilikom slanja. Pokušajte ponovo ili pošaljite direktno na moj mail.';
    statusEl.className = 'status-error';
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Pošalji poruku';
  });
});
