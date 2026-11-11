// Kalau sudah login: tombol "Login" di navbar berubah jadi nama, klik -> kartu profil
// (File asli, hanya path yang disesuaikan karena file PHP toko pindah ke archive/shop-admin/)
(function () {
  fetch('archive/shop-admin/me.php', { credentials: 'same-origin' }).then(r => r.json()).then(d => {
    if (!d.login) return;
    const btn = document.querySelector('.cn-right .cn-akun');
    if (!btn) return;
    const admin = d.role === 'admin';
    btn.textContent = d.nama.split(' ')[0];

    const pop = document.createElement('div');
    pop.className = 'kp-pop';
    pop.innerHTML = '<div class="card"><div class="card__img"><div class="kp-bg"></div></div>' +
      '<div class="card__avatar"><span class="kp-ini"></span></div>' +
      '<div class="card__title"></div><div class="card__subtitle"></div>' +
      '<div class="card__wrapper"><button class="card__btn card__btn-solid" id="kp-a"></button>' +
      '<button class="card__btn" id="kp-k">Keluar</button></div></div>';
    document.body.appendChild(pop);
    pop.querySelector('.kp-ini').textContent = d.nama.trim().charAt(0).toUpperCase();
    pop.querySelector('.card__title').textContent = d.nama;
    pop.querySelector('.card__subtitle').textContent = admin ? 'Admin Toko' : 'Pembeli';
    const a = pop.querySelector('#kp-a');
    a.textContent = admin ? 'Dashboard' : 'Tutup';
    a.onclick = () => admin ? (location.href = 'archive/shop-admin/admin/index.php') : pop.classList.remove('open');
    pop.querySelector('#kp-k').onclick = () => (location.href = 'archive/shop-admin/logout.php');

    btn.onclick = e => { e.stopPropagation(); pop.classList.toggle('open'); };
    document.addEventListener('click', e => { if (!pop.contains(e.target)) pop.classList.remove('open'); });
  }).catch(() => {});
})();
