/* ---------- 1. Latest news (later this will come from the database) ---------- */
const news = [
  { date: '05 September 2025', title: 'Teachers day' }
];
const newsBox = document.getElementById('newsItems');
newsBox.innerHTML = news
  .map(n => `<span><span class="news-date">${n.date}</span>${n.title}</span>`)
  .join('');

/* ---------- 2. Mobile menu ---------- */
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

/* ---------- 3. Banner slider ---------- */
const slides = document.querySelectorAll('.slide');
let current = 0;
let timer;

function showSlide(index) {
  slides[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
}
function startAuto() { timer = setInterval(() => showSlide(current + 1), 4000); }
function resetAuto() { clearInterval(timer); startAuto(); }

document.getElementById('nextBtn').addEventListener('click', () => { showSlide(current + 1); resetAuto(); });
document.getElementById('prevBtn').addEventListener('click', () => { showSlide(current - 1); resetAuto(); });
startAuto();

/* ---------- 4. Form validation (works for every form with class "js-form") ---------- */
document.querySelectorAll('.js-form').forEach(form => {
  const msg = form.querySelector('.form-msg');

  form.addEventListener('submit', e => {
    e.preventDefault();                       // stop the page from reloading
    let valid = true;

    form.querySelectorAll('[required]').forEach(input => {
      const empty = input.value.trim() === '';
      const badEmail = input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value);
      const bad = empty || badEmail;
      input.closest('.field').classList.toggle('invalid', bad);
      if (bad) valid = false;
    });

    if (!valid) {
      msg.textContent = 'Please fill all the fields correctly.';
      msg.className = 'form-msg error';
      return;
    }

    // PHASE 2: this is where we will send the data to the server.
    msg.textContent = 'Form looks good. (Sending to the server will be added in the dynamic phase.)';
    msg.className = 'form-msg ok';
    form.reset();
  });
});

/* ---------- 5. Announcement popup ---------- */
const popup = document.getElementById('announcePopup');
const popupClose = document.getElementById('popupClose');

function closePopup() {
  popup.hidden = true;
  try { sessionStorage.setItem('popupSeen', '1'); } catch (e) {}
}

if (popup) {
  let seen = false;
  try { seen = sessionStorage.getItem('popupSeen') === '1'; } catch (e) {}

  if (!seen) {
    setTimeout(() => { popup.hidden = false; popupClose.focus(); }, 600);
  }

  popupClose.addEventListener('click', closePopup);
  popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !popup.hidden) closePopup(); });
}