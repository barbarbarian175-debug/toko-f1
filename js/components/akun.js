// Login F1 (versi web statis, tanpa server): nama + email disimpan di perangkat
// (localStorage 'f1_user'), sama seperti login demo di toko Bu Berta.
// Login admin toko baju tetap ada di localhost: archive/shop-admin/login.php —
// file PHP tidak bisa jalan di GitHub Pages, jadi tombol Login tidak lagi
// mengarah ke sana.
(function () {
  'use strict';
  var KEY = 'f1_user';
  var btn = document.querySelector('.cn-right .cn-akun');
  if (!btn) return;
  btn.removeAttribute('onclick');

  function readUser() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function saveUser(u) { try { localStorage.setItem(KEY, JSON.stringify(u)); } catch (e) {} }
  function clearUser() { try { localStorage.removeItem(KEY); } catch (e) {} }

  // ---- kartu profil saat sudah login (gaya .kp-pop yang sudah ada) ----
  var pop = document.createElement('div');
  pop.className = 'kp-pop';
  pop.innerHTML = '<div class="card"><div class="card__img"><div class="kp-bg"></div></div>' +
    '<div class="card__avatar"><span class="kp-ini"></span></div>' +
    '<div class="card__title"></div><div class="card__subtitle"></div>' +
    '<div class="card__wrapper"><button type="button" class="card__btn card__btn-solid" id="kp-a">Tutup</button>' +
    '<button type="button" class="card__btn" id="kp-k">Keluar</button></div></div>';
  document.body.appendChild(pop);
  pop.querySelector('#kp-a').onclick = function () { pop.classList.remove('open'); };
  pop.querySelector('#kp-k').onclick = function () { clearUser(); pop.classList.remove('open'); applyLogin(); };

  // ---- panel login ----
  var overlay = document.createElement('div');
  overlay.className = 'lg-overlay';
  overlay.style.display = 'none'; // diatur lewat JS supaya tetap benar walau CSS masih versi lama (cache)
  overlay.innerHTML =
    '<form class="lg-card" id="lg-form">' +
    '<button type="button" class="lg-close" aria-label="Tutup">\u00d7</button>' +
    '<h3>Masuk</h3><p class="lg-sub">Login demo &mdash; data tersimpan di perangkatmu.</p>' +
    '<label>Nama<input name="nama" required maxlength="40" placeholder="Nama kamu" autocomplete="name"></label>' +
    '<label>Email<input name="email" type="email" required placeholder="email@contoh.com" autocomplete="email"></label>' +
    '<button class="lg-submit" type="submit">Masuk</button></form>';
  document.body.appendChild(overlay);
  var form = overlay.querySelector('#lg-form');
  function openLogin() { overlay.style.display = 'flex'; var i = form.querySelector('input'); if (i) i.focus(); }
  function closeLogin() { overlay.style.display = 'none'; }
  overlay.querySelector('.lg-close').onclick = closeLogin;
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeLogin(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = form.querySelector('input[name="nama"]').value.trim();
    var email = form.querySelector('input[name="email"]').value.trim();
    if (!nama || !email) return;
    saveUser({ nama: nama, email: email });
    closeLogin();
    applyLogin();
  });

  function applyLogin() {
    var u = readUser();
    if (u && u.nama) {
      btn.textContent = u.nama.split(' ')[0];
      pop.querySelector('.kp-ini').textContent = u.nama.trim().charAt(0).toUpperCase();
      pop.querySelector('.card__title').textContent = u.nama;
      pop.querySelector('.card__subtitle').textContent = u.email || 'Penggemar F1';
      btn.onclick = function (e) { e.stopPropagation(); pop.classList.toggle('open'); };
    } else {
      btn.textContent = 'Login';
      btn.onclick = function (e) { e.stopPropagation(); openLogin(); };
    }
  }
  document.addEventListener('click', function (e) {
    if (!pop.contains(e.target) && e.target !== btn) pop.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLogin(); pop.classList.remove('open'); }
  });
  applyLogin();
})();
