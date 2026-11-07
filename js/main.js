/* ---- 1. News (ticker + list). Later this will come from the database ---- */
const news = [
  { date: '05 September 2025', title: 'Teachers Day' },
  { date: '', title: 'Admissions open - apply online today' },   /* sample, edit me */
  { date: '', title: 'Annual calendar is now available' }          /* sample, edit me */
];
const ticker = document.getElementById('newsItems');
if (ticker) ticker.innerHTML = news.map(n => `<span>${n.date ? `<span class="news-date">${n.date}</span>` : ''}${n.title}</span>`).join('');
const newsList = document.getElementById('newsList');
if (newsList) newsList.innerHTML = news.map(n => `<li><span class="new">NEW</span>${n.title}</li>`).join('');

/* ---- 2. Mobile menu + dropdowns ---- */
const mainNav = document.getElementById('mainNav');
document.getElementById('menuToggle')?.addEventListener('click', () => mainNav.classList.toggle('open'));
const drops = document.querySelectorAll('.has-dropdown');
function closeDrops(except) { drops.forEach(d => { if (d !== except) { d.classList.remove('open'); d.querySelector('.nav-btn').setAttribute('aria-expanded', 'false'); } }); }
drops.forEach(d => d.querySelector('.nav-btn').addEventListener('click', () => {
  const open = d.classList.toggle('open');
  d.querySelector('.nav-btn').setAttribute('aria-expanded', open);
  closeDrops(d);
}));
document.addEventListener('click', e => { if (!e.target.closest('.has-dropdown')) closeDrops(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrops(); });

/* ---- 3. Hero slider ---- */
const slides = document.querySelectorAll('.slide');
if (slides.length) {
  let cur = 0, timer;
  const show = i => { slides[cur].classList.remove('active'); cur = (i + slides.length) % slides.length; slides[cur].classList.add('active'); };
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(cur + 1), 5000); };
  document.getElementById('nextBtn').addEventListener('click', () => { show(cur + 1); auto(); });
  document.getElementById('prevBtn').addEventListener('click', () => { show(cur - 1); auto(); });
  auto();
}

/* ---- 4. Announcement popup (once per visit) ---- */
const popup = document.getElementById('announcePopup');
if (popup) {
  let seen = false;
  try { seen = sessionStorage.getItem('popupSeen') === '1'; } catch (e) {}
  const close = () => { popup.hidden = true; try { sessionStorage.setItem('popupSeen', '1'); } catch (e) {} };
  if (!seen) setTimeout(() => { popup.hidden = false; }, 600);
  document.getElementById('popupClose').addEventListener('click', close);
  popup.addEventListener('click', e => { if (e.target === popup) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !popup.hidden) close(); });
}

/* ---- 5. Counting numbers ---- */
document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    let n = 0; const step = Math.max(1, Math.ceil(end / 50));
    const t = setInterval(() => { n = Math.min(end, n + step); el.textContent = n; if (n === end) clearInterval(t); }, 30);
  });
  io.observe(el);
});

/* ---- 6. Form validation (every form with class "js-form") ---- */
document.querySelectorAll('.js-form').forEach(form => {
  const msg = form.querySelector('.form-msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(inp => {
      const bad = inp.value.trim() === '' || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
      inp.closest('.field').classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    msg.className = 'form-msg ' + (ok ? 'ok' : 'error');
    msg.textContent = ok ? 'Form looks good. (Sending to the server comes in the dynamic phase.)' : 'Please fill all the fields correctly.';
    if (ok) form.reset();
  });
});
