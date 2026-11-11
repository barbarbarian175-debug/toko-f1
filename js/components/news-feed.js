/* =========================================================
   BERITA F1 OTOMATIS - bagian di Beranda, tepat di atas "Terima kasih sudah mampir!"
   - Ambil RSS berita F1 (lewat rss2json), gabung beberapa sumber, urut terbaru
   - Tata letak majalah: berita utama + 2 kecil + daftar "Terbaru" + grid berita lainnya
   - Hanya tampil judul, gambar, ringkasan pendek, dan link ke sumber asli
   - Diambil saat bagian ini hampir terlihat (Beranda tetap ringan), disimpan 30 menit
   ========================================================= */
(function () {
    /* ---------- PENGATURAN ---------- */
    const CFG = {
        feeds: [   // tambah / hapus sumber sesuka hati
            { name: 'Motorsport.com', url: 'https://www.motorsport.com/rss/f1/news/', home: 'https://www.motorsport.com/f1/news/' },
            { name: 'Autosport',      url: 'https://www.autosport.com/rss/f1/news/' },
            { name: 'BBC Sport',      url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml' }
        ],
        api: 'https://api.rss2json.com/v1/api.json?rss_url=',
        title: 'F1 News',
        cacheMinutes: 30,
        maxOther: 16          // jumlah kartu di baris geser "Berita lainnya"
    };

    const foot = document.querySelector('footer.site-credit');
    if (!foot) return;

    const css = document.createElement('style');
    css.textContent = `
        .nw { --nw-accent: #9db4cf; /* warna tulisan sumber & judul kecil, ganti sesuka hati */ margin: clamp(32px, 6vw, 72px) 0; color: #e8eaf0; }
        .nw a { color: inherit; text-decoration: none; }
        .nw-kicker { display: inline-block; color: var(--nw-accent); font: 700 .8rem/1 var(--f-body, Inter, sans-serif); letter-spacing: .18em; text-transform: uppercase; }
        .nw-title { margin: 0 0 22px; font: 700 clamp(1.9rem, 4vw, 2.7rem)/1.05 var(--f-head, 'Barlow Condensed', sans-serif); text-transform: uppercase; letter-spacing: .02em; }
        .nw-sub { margin: 0 0 22px; max-width: 640px; color: #8b93a3; font-size: .9rem; line-height: 1.6; }
        .nw-img { position: relative; overflow: hidden; border-radius: 8px; background: linear-gradient(135deg, #1d212a, #0f1217); aspect-ratio: 16 / 10; }
        .nw-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
        .nw-card:hover .nw-img img { transform: scale(1.05); }
        .nw-src { display: block; margin: 12px 0 5px; color: var(--nw-accent); font: 700 .68rem/1 var(--f-body, Inter, sans-serif); letter-spacing: .12em; text-transform: uppercase; }
        .nw-h { margin: 0; font: 700 1.12rem/1.25 var(--f-head, 'Barlow Condensed', sans-serif); letter-spacing: .01em; color: #f2f4f8; }
        .nw-card:hover .nw-h, .nw-row:hover .nw-h { text-decoration: underline; text-underline-offset: 3px; }
        .nw-d { display: block; margin-top: 6px; color: #7c8494; font-size: .74rem; }
        .nw-p { margin: 8px 0 0; color: #a9b2c2; font-size: .85rem; line-height: 1.6; }

        /* blok atas */
        .nw-top { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr); gap: 22px; padding: 22px; border: 1px solid #252a34; border-radius: 12px; background: rgba(20, 23, 29, .72); }
        .nw-side { display: grid; align-content: start; gap: 22px; }
        .nw-feat .nw-img { aspect-ratio: 16 / 11; }
        .nw-feat .nw-h { font-size: clamp(1.5rem, 2.6vw, 2.2rem); line-height: 1.12; margin-top: 2px; }
        .nw-feat .nw-src { margin-top: 14px; }
        .nw-latest { padding-left: 22px; border-left: 1px solid #252a34; }
        .nw-lh { margin: 0 0 6px; font: 700 .8rem/1 var(--f-body, Inter, sans-serif); letter-spacing: .16em; text-transform: uppercase; color: #8b93a3; }
        .nw-row { display: grid; grid-template-columns: minmax(0, 1fr) 72px; gap: 12px; padding: 14px 0; border-bottom: 1px solid #252a34; }
        .nw-row:last-child { border-bottom: 0; }
        .nw-row .nw-h { font-size: 1rem; }
        .nw-row .nw-img { aspect-ratio: 1 / 1; border-radius: 6px; }

        /* berita lainnya */
        .nw-more-h { display: flex; align-items: center; gap: 14px; margin: 34px 0 16px; font: 700 .85rem/1 var(--f-body, Inter, sans-serif); letter-spacing: .16em; text-transform: uppercase; }
        .nw-more-h::after { content: ""; flex: 1; height: 1px; background: #252a34; }
        .nw-more-h a { order: 2; color: #8b93a3; letter-spacing: .06em; text-transform: none; font-weight: 600; }
        .nw-more-h a:hover { color: #fff; }
        .nw-more-h::after { order: 1; }
        .nw-arrows { order: 2; display: flex; gap: 8px; }
        .nw-arrows[hidden] { display: none; }
        .nw-arr { width: 36px; height: 36px; padding: 0; display: grid; place-items: center; cursor: pointer; border: 1px solid #3a4150; border-radius: 50%; background: rgba(20, 23, 29, .72); color: #e8eaf0; font-size: 1rem; line-height: 1; transition: background .2s ease, color .2s ease, opacity .2s ease; }
        .nw-arr:hover:not(:disabled) { background: #e8eaf0; color: #14171d; }
        .nw-arr:disabled { opacity: .35; cursor: default; }
        .nw-arr:focus-visible { outline: 2px solid #e8eaf0; outline-offset: 2px; }
        .nw-grid { display: flex; gap: 22px; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none; -webkit-overflow-scrolling: touch; cursor: grab; }
        .nw-grid::-webkit-scrollbar { display: none; }
        .nw-grid.drag { scroll-snap-type: none; cursor: grabbing; user-select: none; -webkit-user-select: none; }
        .nw-grid .nw-card { flex: 0 0 calc((100% - 66px) / 4); scroll-snap-align: start; padding: 12px; border: 1px solid #252a34; border-radius: 10px; background: rgba(20, 23, 29, .72); transition: border-color .2s ease; }
        .nw-grid .nw-card:hover { border-color: #3a4150; }

        .nw-msg { padding: 36px 20px; text-align: center; color: #8b93a3; border: 1px dashed #252a34; border-radius: 12px; font-size: .9rem; }
        .nw-shim { animation: nw-pulse 1.2s ease-in-out infinite; }
        @keyframes nw-pulse { 50% { opacity: .45; } }

        @media (max-width: 1000px) {
            .nw-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
            .nw-feat { grid-column: 1 / -1; order: -1; }
            .nw-latest { padding-left: 22px; }
            .nw-grid .nw-card { flex-basis: calc((100% - 22px) / 2); }
        }
        @media (max-width: 640px) {
            .nw-top { grid-template-columns: minmax(0, 1fr); padding: 14px; gap: 20px; }
            .nw-latest { padding-left: 0; border-left: 0; border-top: 1px solid #252a34; padding-top: 18px; }
            .nw-grid { gap: 14px; }
            .nw-grid .nw-card { flex-basis: 80%; }
        }
        @media (prefers-reduced-motion: reduce) { .nw-card .nw-img img { transition: none; } .nw-shim { animation: none; } }`;
    document.head.appendChild(css);

    const sec = document.createElement('section');
    sec.className = 'nw';
    sec.setAttribute('aria-label', 'Berita terbaru Formula 1');
    sec.innerHTML = '<h2 class="nw-title"></h2><div class="nw-body"><div class="nw-msg nw-shim">Memuat berita terbaru...</div></div>';
    sec.querySelector('.nw-title').textContent = CFG.title;
    foot.before(sec);
    const body = sec.querySelector('.nw-body');

    /* ---------- util ---------- */
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const plain = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); };
    const safeUrl = u => /^https?:\/\//i.test(u || '') ? u : '';
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    function when(ms) {
        if (!ms) return '';
        const m = Math.floor((Date.now() - ms) / 60000);
        if (m >= 0 && m < 60) return Math.max(1, m) + ' menit lalu';
        if (m >= 60 && m < 1440) return Math.floor(m / 60) + ' jam lalu';
        const d = new Date(ms);
        return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
    }
    function imgOf(it) {
        let u = (it.enclosure && it.enclosure.link && /image|\.(jpe?g|png|webp)/i.test((it.enclosure.type || '') + it.enclosure.link)) ? it.enclosure.link : '';
        if (!u) u = it.thumbnail || '';
        if (!u) { const m = /<img[^>]+src=["']([^"']+)/i.exec(it.content || it.description || ''); if (m) u = m[1]; }
        if (/ichef\.bbci\.co\.uk/.test(u)) u = u.replace(/\/(\d{3})\//, '/800/');   // BBC: ambil ukuran lebih besar
        return safeUrl(u);
    }

    /* ---------- ambil data ---------- */
    function fetchFeed(f) {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 9000);
        return fetch(CFG.api + encodeURIComponent(f.url), { signal: ctl.signal })
            .then(r => r.json())
            .then(j => {
                if (!j || j.status !== 'ok' || !j.items) throw new Error('feed');
                return j.items.map(it => ({
                    title: plain(it.title),
                    link: safeUrl(it.link),
                    img: imgOf(it),
                    ms: Date.parse(String(it.pubDate || '').replace(' ', 'T') + 'Z') || 0,
                    text: plain(it.description || it.content).slice(0, 130),
                    src: f.name
                })).filter(x => x.title && x.link);
            })
            .finally(() => clearTimeout(t));
    }

    const KEY = 'f1news-v1';
    function readCache(any) {
        try {
            const c = JSON.parse(localStorage.getItem(KEY));
            if (c && c.items && c.items.length && (any || Date.now() - c.at < CFG.cacheMinutes * 60000)) return c.items;
        } catch (e) {}
        return null;
    }

    async function load() {
        const fresh = readCache(false);
        if (fresh) return fresh;
        const res = await Promise.allSettled(CFG.feeds.map(fetchFeed));
        const seen = new Set();
        const items = [].concat(...res.filter(r => r.status === 'fulfilled').map(r => r.value))
            .filter(x => { const k = x.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
            .sort((a, b) => b.ms - a.ms)
            .slice(0, 40);
        if (items.length) { try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), items })); } catch (e) {} return items; }
        return readCache(true) || [];   // gagal total: pakai simpanan lama kalau ada
    }

    /* ---------- tampilkan ---------- */
    const imgTag = x => x.img
        ? '<img src="' + esc(x.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">'
        : '';
    const card = x => '<a class="nw-card" href="' + esc(x.link) + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="nw-img">' + imgTag(x) + '</div>' +
        '<span class="nw-src">' + esc(x.src) + '</span><h3 class="nw-h">' + esc(x.title) + '</h3>' +
        '<span class="nw-d">' + esc(when(x.ms)) + '</span></a>';
    const row = x => '<a class="nw-row" href="' + esc(x.link) + '" target="_blank" rel="noopener noreferrer"><div>' +
        '<h3 class="nw-h">' + esc(x.title) + '</h3><span class="nw-d">' + esc(x.src) + ' &middot; ' + esc(when(x.ms)) + '</span></div>' +
        '<div class="nw-img">' + imgTag(x) + '</div></a>';

    function render(items) {
        if (!items.length) { body.innerHTML = '<div class="nw-msg">Berita belum bisa dimuat. Coba muat ulang halaman nanti.</div>'; return; }
        const pool = items.slice();
        const take = (n, needImg) => {
            const out = [];
            for (let i = 0; i < pool.length && out.length < n; i++) if (!needImg || pool[i].img) { out.push(pool[i]); pool.splice(i--, 1); }
            while (out.length < n && pool.length) out.push(pool.shift());
            return out;
        };
        const feat = take(1, true)[0];
        const side = take(2, true);
        const latest = take(5, false);
        const more = take(CFG.maxOther, true);

        body.innerHTML =
            '<div class="nw-top">' +
                '<div class="nw-side">' + side.map(card).join('') + '</div>' +
                '<a class="nw-card nw-feat" href="' + esc(feat.link) + '" target="_blank" rel="noopener noreferrer">' +
                    '<div class="nw-img">' + imgTag(feat) + '</div>' +
                    '<span class="nw-src">' + esc(feat.src) + '</span><h3 class="nw-h">' + esc(feat.title) + '</h3>' +
                    (feat.text ? '<p class="nw-p">' + esc(feat.text) + (feat.text.length >= 130 ? '...' : '') + '</p>' : '') +
                    '<span class="nw-d">' + esc(when(feat.ms)) + '</span></a>' +
                '<div class="nw-latest"><h3 class="nw-lh">Terbaru</h3>' + latest.map(row).join('') + '</div>' +
            '</div>' +
            (more.length ? '<div class="nw-more-h"><span>Berita lainnya</span>' +
                '<div class="nw-arrows"><button type="button" class="nw-arr nw-prev" aria-label="Berita sebelumnya">&#10094;</button><button type="button" class="nw-arr nw-next" aria-label="Berita berikutnya">&#10095;</button></div>' +
                '</div><div class="nw-grid">' + more.map(card).join('') + '</div>' : '');
        wireSlider();
    }

    /* baris "Berita lainnya": geser dengan jari / mouse (tarik) / tombol panah */
    function wireSlider() {
        const g = body.querySelector('.nw-grid');
        if (!g) return;
        const arrows = body.querySelector('.nw-arrows'), prev = body.querySelector('.nw-prev'), next = body.querySelector('.nw-next');
        const upd = () => {
            arrows.hidden = g.scrollWidth <= g.clientWidth + 4;
            prev.disabled = g.scrollLeft <= 4;
            next.disabled = g.scrollLeft >= g.scrollWidth - g.clientWidth - 4;
        };
        prev.addEventListener('click', () => g.scrollBy({ left: -(g.clientWidth + 22), behavior: 'smooth' }));
        next.addEventListener('click', () => g.scrollBy({ left: g.clientWidth + 22, behavior: 'smooth' }));
        g.addEventListener('scroll', upd, { passive: true });
        window.addEventListener('resize', upd);

        let down = false, moved = false, sx = 0, sl = 0;
        g.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; });
        window.addEventListener('pointermove', e => {
            if (!down) return;
            const dx = e.clientX - sx;
            if (Math.abs(dx) > 5) { moved = true; g.classList.add('drag'); g.scrollLeft = sl - dx; }
        });
        window.addEventListener('pointerup', () => { if (!down) return; down = false; g.classList.remove('drag'); });
        g.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);   // tarik tidak dianggap klik
        g.addEventListener('dragstart', e => e.preventDefault());
        upd();
    }

    /* ---------- muat saat bagian ini hampir terlihat ---------- */
    let started = false;
    function start() {
        if (started) return; started = true;
        load().then(render).catch(() => render([]));
    }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((e, o) => { if (e.some(x => x.isIntersecting)) { o.disconnect(); start(); } }, { rootMargin: '600px 0px' }).observe(sec);
    } else start();
})();