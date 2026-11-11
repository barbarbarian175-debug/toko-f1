/* =====================================================================
   NAVBAR gaya CardNav (React Bits) tanpa React & tanpa GSAP, semua halaman.
   - Kartu dibuat otomatis dari menu lama (#nav-menu), jadi menu yang
     ditambahkan file JS lain (Klasemen, Hasil, Schedule, Kuis) ikut muncul.
   - Kolom cari (#search-input) dipindah ke navbar ini, tetap berfungsi.
   ===================================================================== */
(function () {
    const wrap = document.getElementById('card-nav');
    const menu = document.getElementById('nav-menu');       // menu lama (disembunyikan)
    if (!wrap || !menu) return;

    const nav = wrap.querySelector('.cn-nav');
    const burger = wrap.querySelector('.cn-burger');
    const content = wrap.querySelector('.cn-content');
    const logo = wrap.querySelector('.cn-logo');
    const cta = wrap.querySelector('.cn-cta');
    const searchSlot = wrap.querySelector('.cn-search-slot');

    /* ---------- pengelompokan menu ke 3 kartu (ubah sesuka hati) ---------- */
    const GROUPS = [
        { label: 'Belajar',        items: ['Beranda', 'Sejarah', 'Game', 'Kuis'] },
        { label: 'Balapan',        items: ['Pembalap', 'Tim', 'Sirkuit'] },
        { label: 'Hasil & Jadwal', items: ['Klasemen', 'Hasil', 'Schedule', 'Katalog'] }
    ];
    /* halaman aktif -> menu yang ditandai */
    const PAGE_TO_LABEL = {
        'home-page': 'Beranda', 'drivers-page': 'Pembalap', 'detail-page': 'Pembalap',
        'teams-page': 'Tim', 'team-detail-page': 'Tim',
        'circuits-page': 'Sirkuit', 'circuit-detail-page': 'Sirkuit',
        'klasemen-page': 'Klasemen', 'hasil-page': 'Hasil', 'schedule-page': 'Schedule',
        'history-page': 'Sejarah', 'reflek-page': 'Game', 'profile-page': 'Profil',
        'katalog-page': 'Katalog'
    };

    /* ---------- wajah mungil (SVG): tiap menu punya ekspresi sendiri ---------- */
    const INK = '#2b2420';
    const stroke = d => '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
    const dotEye = (x, y) => '<ellipse class="eye" cx="' + x + '" cy="' + y + '" rx="1.7" ry="2.2" fill="' + INK + '"/><circle cx="' + (x + .6) + '" cy="' + (y - .8) + '" r=".6" fill="#fff"/>';
    const star = x => '<path class="eye" d="M' + x + ' 7.4 L' + (x + .8) + ' 9.2 L' + (x + 2.7) + ' 9.3 L' + (x + 1.2) + ' 10.5 L' + (x + 1.7) + ' 12.4 L' + x + ' 11.3 L' + (x - 1.7) + ' 12.4 L' + (x - 1.2) + ' 10.5 L' + (x - 2.7) + ' 9.3 L' + (x - .8) + ' 9.2Z" fill="' + INK + '"/>';
    const EYES = {
        dot:     dotEye(8.3, 10) + dotEye(15.7, 10),
        happy:   stroke('M6.4 11 Q8.3 7.9 10.2 11') + stroke('M13.8 11 Q15.7 7.9 17.6 11'),
        star:    star(8.3) + star(15.7),
        cool:    '<rect x="4.3" y="8" width="6.6" height="4.4" rx="2" fill="' + INK + '"/><rect x="13.1" y="8" width="6.6" height="4.4" rx="2" fill="' + INK + '"/>' +
                 '<path d="M10.9 9.4 H13.1" stroke="' + INK + '" stroke-width="1.2"/><path d="M5.8 9.4 H8" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".6"/><path d="M14.6 9.4 H16.8" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".6"/>',
        wink:    dotEye(8.3, 10) + stroke('M14 10.2 Q15.8 12.4 17.6 10.2'),
        sleepy:  stroke('M6.5 10.6 H10.1') + stroke('M13.9 10.6 H17.5'),
        think:   dotEye(8.3, 9.2) + dotEye(15.7, 9.2) + '<path d="M13.4 5.9 L17.8 5.2" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round"/>',
        glasses: '<circle cx="8.3" cy="10" r="3" fill="none" stroke="' + INK + '" stroke-width="1"/><circle cx="15.7" cy="10" r="3" fill="none" stroke="' + INK + '" stroke-width="1"/><path d="M11.3 10 H12.7" stroke="' + INK + '" stroke-width="1"/>' +
                 '<ellipse class="eye" cx="8.3" cy="10" rx="1.2" ry="1.6" fill="' + INK + '"/><ellipse class="eye" cx="15.7" cy="10" rx="1.2" ry="1.6" fill="' + INK + '"/>'
    };
    const MOUTHS = {
        grin:   '<path d="M6.8 14 H17.2 Q16.6 19.6 12 19.6 Q7.4 19.6 6.8 14Z" fill="' + INK + '"/>',
        smile:  stroke('M8.2 14.8 Q12 18.8 15.8 14.8'),
        smirk:  stroke('M8.8 16 Q12.4 17.8 16 14.6'),
        flat:   stroke('M9.2 16.4 H14.8'),
        tongue: '<path d="M7.6 14.4 Q12 19.4 16.4 14.4Z" fill="' + INK + '"/><ellipse cx="12" cy="17.6" rx="1.9" ry="1.5" fill="#ffa66b"/>',
        cheer:  '<path d="M6.4 13.6 H17.6 Q17 20.4 12 20.4 Q7 20.4 6.4 13.6Z" fill="' + INK + '"/><path d="M8.4 18 Q12 16.4 15.6 18 Q14.4 19.6 12 19.6 Q9.6 19.6 8.4 18Z" fill="#ffa66b"/>',
        yawn:   '<ellipse cx="12" cy="16.6" rx="2.1" ry="2.7" fill="' + INK + '"/>'
    };
    /* menu -> [mata, mulut]  (ubah sesuka hati) */
    const FACES = {
        beranda:  ['dot', 'grin'],     // senang
        pembalap: ['cool', 'smirk'],   // keren
        tim:      ['star', 'grin'],    // semangat
        sirkuit:  ['wink', 'smile'],   // usil
        klasemen: ['glasses', 'smile'],// pintar
        hasil:    ['happy', 'cheer'],  // bersorak
        schedule: ['think', 'smirk'],  // mikir
        sejarah:  ['sleepy', 'flat'],  // ngantuk
        game:     ['dot', 'tongue'],   // jahil
        kuis:     ['think', 'flat'],   // bingung
        profil:   ['dot', 'smile'],    // ramah
        katalog:  ['star', 'smile']    // belanja
    };
    const SPARE = [['wink', 'grin'], ['star', 'smile'], ['cool', 'grin'], ['happy', 'smile'], ['glasses', 'grin']];
    let spare = 0;
    function faceFor(label) {
        const f = FACES[label.toLowerCase()] || SPARE[spare++ % SPARE.length];
        return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#ffd966"/>' +
            '<ellipse cx="5.2" cy="14.8" rx="2" ry="1.3" fill="#ffb26b" opacity=".55"/>' +
            '<ellipse cx="18.8" cy="14.8" rx="2" ry="1.3" fill="#ffb26b" opacity=".55"/>' +
            '<g class="eyes">' + EYES[f[0]] + '</g>' +
            '<g class="mouth-smile">' + MOUTHS[f[1]] + '</g>' +
            '<ellipse class="mouth-o" cx="12" cy="16.4" rx="1.8" ry="2.3" fill="' + INK + '"/></svg>';
    }

    let open = false, timer = 0;
    const baseH = () => wrap.offsetHeight || 60;

    /* ---------- bangun kartu dari menu lama ---------- */
    function build() {
        const found = [...menu.querySelectorAll('a')]
            .map(a => ({ label: a.textContent.trim(), run: () => a.click() }))
            .filter(x => x.label);

        if (typeof window.openProfilePage === 'function') {
            found.push({ label: 'Profil', run: () => window.openProfilePage() });
        }

        const buckets = GROUPS.map(() => []);
        const extra = [];
        found.forEach(item => {
            const gi = GROUPS.findIndex(g => g.items.some(n => n.toLowerCase() === item.label.toLowerCase()));
            if (item.label === 'Profil' || gi < 0) extra.push(item);   // Profil & menu baru -> kartu terakhir
            else buckets[gi].push(item);
        });
        buckets[buckets.length - 1].push(...extra);
        buckets.forEach((b, gi) => {
            const order = GROUPS[gi].items.map(n => n.toLowerCase());
            b.sort((x, y) => {
                const ix = order.indexOf(x.label.toLowerCase()), iy = order.indexOf(y.label.toLowerCase());
                return (ix < 0 ? 99 : ix) - (iy < 0 ? 99 : iy);
            });
        });

        content.textContent = '';
        spare = 0;
        GROUPS.forEach((g, gi) => {
            if (!buckets[gi].length) return;
            const card = document.createElement('div');
            card.className = 'cn-card' + (open ? ' in' : '');
            const links = document.createElement('div');
            links.className = 'cn-card-links';
            buckets[gi].forEach(item => {
                const a = document.createElement('a');
                a.className = 'cn-link';
                a.href = '#';
                a.dataset.label = item.label;
                a.setAttribute('aria-label', 'Buka ' + item.label);
                const t = document.createElement('span');
                t.className = 'cn-link-text';
                t.textContent = item.label;
                const face = document.createElement('span');
                face.className = 'cn-face';
                face.setAttribute('aria-hidden', 'true');
                face.innerHTML = faceFor(item.label);
                a.append(t, face);
                a.addEventListener('click', e => {
                    e.preventDefault();
                    setOpen(false);
                    item.run();
                });
                links.appendChild(a);
            });
            card.appendChild(links);
            content.appendChild(card);
        });
        markActive();
        if (open) nav.style.height = openHeight() + 'px';
    }

    /* ---------- tandai menu halaman yang sedang dibuka ---------- */
    function markActive() {
        const page = document.querySelector('.page.active');
        const id = page ? page.id : '';
        let label = PAGE_TO_LABEL[id];
        if (!label) {                                   // halaman lain, mis. 'kuis-page'
            const hit = [...content.querySelectorAll('.cn-link')]
                .find(a => id.toLowerCase().includes(a.dataset.label.toLowerCase()));
            label = hit && hit.dataset.label;
        }
        content.querySelectorAll('.cn-link').forEach(a => {
            const on = a.dataset.label === label;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
    }

    /* ---------- hitung tinggi saat terbuka ---------- */
    function openHeight() {
        const keep = [content.style.position, content.style.height, content.style.visibility];
        content.style.position = 'static';
        content.style.height = 'auto';
        content.style.visibility = 'hidden';
        const h = content.scrollHeight;
        [content.style.position, content.style.height, content.style.visibility] = keep;
        return baseH() + h;
    }

    /* ---------- buka / tutup ---------- */
    function setOpen(next) {
        if (next === open) return;
        open = next;
        clearTimeout(timer);
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        content.setAttribute('aria-hidden', String(!open));
        const cards = [...content.children];

        if (open) {
            markActive();
            nav.classList.add('open');
            nav.style.height = openHeight() + 'px';
            cards.forEach((c, i) => { c.style.transitionDelay = (0.12 + i * 0.08) + 's'; c.classList.add('in'); });
        } else {
            nav.style.height = baseH() + 'px';
            cards.forEach(c => { c.style.transitionDelay = '0s'; c.classList.remove('in'); });
            timer = setTimeout(() => { nav.classList.remove('open'); nav.style.height = ''; }, 500);
        }
    }

    /* mata wajah mungil mengikuti kursor */
    content.addEventListener('pointermove', e => {
        const a = e.target.closest('.cn-link');
        if (!a) return;
        const r = a.querySelector('.cn-face').getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / 90;
        const dy = (e.clientY - (r.top + r.height / 2)) / 30;
        a.style.setProperty('--ex', Math.max(-1, Math.min(1, dx)).toFixed(2));
        a.style.setProperty('--ey', Math.max(-1, Math.min(1, dy)).toFixed(2));
    });
    content.addEventListener('pointerout', e => {
        const a = e.target.closest('.cn-link');
        if (a && !a.contains(e.relatedTarget)) { a.style.removeProperty('--ex'); a.style.removeProperty('--ey'); }
    });

    burger.addEventListener('click', e => { e.stopPropagation(); setOpen(!open); });
    document.addEventListener('click', e => { if (open && !e.target.closest('#card-nav')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

    /* ---------- logo F1 = ke Beranda ---------- */
    function goHome() {
        setOpen(false);
        if (typeof window.showPage === 'function') window.showPage('home-page');
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    logo.addEventListener('click', goHome);
    logo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); } });

    /* ---------- tombol "Mulai belajar": hanya di Beranda, menggulung ke panduan pemula ---------- */
    cta.addEventListener('click', () => {
        setOpen(false);
        const guide = document.getElementById('nb-guide');
        if (guide) guide.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const home = document.getElementById('home-page');
    function syncHome() {
        wrap.classList.toggle('is-home', !!home && home.classList.contains('active'));
    }
    if (home) new MutationObserver(syncHome).observe(home, { attributes: true, attributeFilter: ['class'] });
    syncHome();

    /* ---------- kolom cari: pindahkan dari navbar lama, tetap berfungsi ---------- */
    const search = document.getElementById('search-input');
    function syncSearch() {
        if (!search) return;
        const visible = search.style.display !== 'none';
        wrap.classList.toggle('has-search', visible);   // di HP: dapat baris sendiri
        nav.style.height = open ? openHeight() + 'px' : '';
    }
    if (search && searchSlot) {
        searchSlot.appendChild(search);
        new MutationObserver(syncSearch).observe(search, { attributes: true, attributeFilter: ['style'] });
        syncSearch();
    }
    window.addEventListener('resize', () => { syncSearch(); if (open) nav.style.height = openHeight() + 'px'; });

    /* ---------- menu lama bisa bertambah belakangan (file JS lain) ---------- */
    build();
    new MutationObserver(build).observe(menu, { childList: true, subtree: true });
    window.addEventListener('load', build);
})();