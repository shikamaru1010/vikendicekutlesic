document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('kontaktForma');
  const status = document.getElementById('kontaktStatus');
  if (!form) return;

  const dugme = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ime = form.querySelector('#kontakt-ime')?.value.trim() ?? '';
    const kontakt = form.querySelector('#kontakt-telefon')?.value.trim() ?? '';
    const poruka = form.querySelector('#kontakt-poruka')?.value.trim() ?? '';
    const honey = form.querySelector('[name="_honey"]')?.value ?? '';

    if (!ime || !kontakt || !poruka) return;
    if (honey) return;

    if (status) {
      status.textContent = 'Šaljem upit…';
      status.className = 'kontakt-status';
    }
    if (dugme instanceof HTMLButtonElement) dugme.disabled = true;

    const telo = {
      'Ime i prezime': ime,
      'Telefon ili email': kontakt,
      Poruka: poruka,
      'Sa sajta': 'https://vikendicekutlesic.rs',
      _subject: `Novi upit sa sajta — ${ime}`,
      _template: 'box',
      _captcha: 'false',
    };

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kontakt)) {
      telo._replyto = kontakt;
    }

    try {
      const odgovor = await fetch(
        'https://formsubmit.co/ajax/vikendicekutlesic@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(telo),
        }
      );

      const podatak = await odgovor.json().catch(() => ({}));

      if (!odgovor.ok) {
        throw new Error(typeof podatak.message === 'string' ? podatak.message : 'Greška pri slanju');
      }

      form.reset();
      if (status) {
        status.textContent = 'Upit je poslat. Javićemo se u najkraćem roku.';
        status.className = 'kontakt-status kontakt-status-ok';
      }
    } catch {
      if (status) {
        status.textContent = 'Slanje nije uspelo. Pozovite nas ili pišite na email.';
        status.className = 'kontakt-status kontakt-status-err';
      }
    } finally {
      if (dugme instanceof HTMLButtonElement) dugme.disabled = false;
    }
  });
});
