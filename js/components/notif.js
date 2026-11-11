// Lonceng notifikasi di sebelah "Mulai belajar". Edit daftar BERITA di bawah untuk mengganti isinya.
(function () {
  // page = id halaman di websitemu yang dibuka saat berita diklik (boleh dikosongkan)
  const BERITA = [
    { id: 1, t: 'Klasemen & hasil diperbarui', d: 'Terbaru', p: 'Lihat posisi terbaru para pembalap.', page: 'drivers-page' },
    { id: 2, t: 'Sirkuit baru ditambahkan', d: 'Terbaru', p: 'Jelajahi profil sirkuit musim ini.', page: 'circuits-page' },
    { id: 3, t: 'Kenali tim musim 2026', d: 'Terbaru', p: 'Daftar tim dan pembalapnya.', page: 'teams-page' }
  ];
  const mulai = [...document.querySelectorAll('.cn-right .cn-cta')].find(b => b.textContent.trim() === 'Mulai belajar');
  const right = document.querySelector('.cn-right');
  if (!right) return;

  let dibaca = [];
  try { dibaca = JSON.parse(localStorage.getItem('notifDibaca') || '[]'); } catch (e) {}
  const belum = () => BERITA.filter(b => !dibaca.includes(b.id)).length;

  const bell = document.createElement('button');
  bell.type = 'button'; bell.className = 'nt-bell'; bell.setAttribute('aria-label', 'Berita terbaru');
  bell.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><span class="t-badge"></span>';
  right.insertBefore(bell, mulai || right.firstChild);
  const badge = bell.querySelector('.t-badge');
  function tampilBadge() {
    const n = belum();
    badge.textContent = n;
    badge.classList.toggle('is-in', n > 0);
  }
  setTimeout(tampilBadge, 600);   // jeda sebentar supaya animasi masuknya terlihat

  const pop = document.createElement('div');
  pop.className = 'nt-pop';
  pop.innerHTML = '<h4>Berita terbaru</h4>';
  BERITA.forEach(b => {
    const a = document.createElement('div');
    a.className = 'nt-item';
    a.innerHTML = '<b></b><small></small><p></p>';
    a.querySelector('b').textContent = b.t;
    a.querySelector('small').textContent = b.d;
    a.querySelector('p').textContent = b.p;
    a.onclick = () => { pop.classList.remove('open'); if (b.page && typeof showPage === 'function') showPage(b.page); };
    pop.appendChild(a);
  });
  document.body.appendChild(pop);

  bell.onclick = e => {
    e.stopPropagation();
    const kp = document.querySelector('.kp-pop'); if (kp) kp.classList.remove('open');
    const r = bell.getBoundingClientRect();
    pop.style.top = (r.bottom + 12) + 'px';
    pop.style.left = Math.max(8, Math.min(r.right - 320, innerWidth - 328)) + 'px';
    pop.classList.toggle('open');
    if (pop.classList.contains('open')) {   // dibuka = dianggap sudah dibaca, badge keluar
      dibaca = BERITA.map(b => b.id);
      try { localStorage.setItem('notifDibaca', JSON.stringify(dibaca)); } catch (e) {}
      tampilBadge();
    }
  };
  document.addEventListener('click', e => { if (!pop.contains(e.target)) pop.classList.remove('open'); });
})();
