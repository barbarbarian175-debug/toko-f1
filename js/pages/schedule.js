/* =========================================================
   SCHEDULE / KALENDER F1 (otomatis)
   Menu "Schedule" di navbar + halaman kalender seluruh seri GP per musim.
   Pilih tahun lewat dropdown (2018 sampai tahun depan), kartu tiap balapan:
   ronde, bendera, nama GP, tanggal, bentuk lintasan, dan status
   (Selesai / Berlangsung / Berikutnya). Balapan musim ini yang sudah
   berlangsung bisa diklik untuk membuka halaman Hasil.

   Sumber data: Jolpica F1 API (gratis, tanpa API key) -> tidak perlu ganti manual.

   Pasang: taruh sefolder dengan index.html, tambahkan di bawah hasil.js:
       <script src="schedule.js"></script>
   ========================================================= */
(function () {
    'use strict';

    const JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    const MIN = 60e3, HOUR = 3600e3, DAY = 864e5;
    const FIRST_YEAR = 2018;
    const THIS_YEAR = new Date().getFullYear();

    /* ---------- helper umum ---------- */
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const norm = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const pad2 = n => String(n).padStart(2, '0');

    const COUNTRY = {
        Australia: 'au', China: 'cn', Japan: 'jp', USA: 'us', 'United States': 'us', Canada: 'ca', Monaco: 'mc', Spain: 'es',
        Austria: 'at', UK: 'gb', 'United Kingdom': 'gb', Belgium: 'be', Hungary: 'hu', Netherlands: 'nl', Italy: 'it',
        Azerbaijan: 'az', Bahrain: 'bh', Singapore: 'sg', Mexico: 'mx', Brazil: 'br', Qatar: 'qa', UAE: 'ae',
        'United Arab Emirates': 'ae', 'Saudi Arabia': 'sa', Malaysia: 'my', Germany: 'de', France: 'fr', Portugal: 'pt',
        Turkey: 'tr', 'Türkiye': 'tr', Russia: 'ru', Korea: 'kr', India: 'in', Vietnam: 'vn', Argentina: 'ar', 'South Africa': 'za'
    };
    const flagCode = r => COUNTRY[r.Circuit.Location.country] || '';
    const flagImg = code => code ? `<img class="sch-flag" src="https://flagcdn.com/w40/${code}.png" alt="" loading="lazy" onerror="this.remove()">` : '';
    const COUNTRY_NAME = { UK: 'Great Britain', USA: 'United States', UAE: 'Abu Dhabi', Turkey: 'Türkiye', 'United Arab Emirates': 'Abu Dhabi' };

    /* gambar lintasan: pakai file yang sama dengan halaman Sirkuit (assets/images/circuits/*.png) */
    const TRACKS = [
        [/albert/, 'albert-park'], [/hermanos|mexico city/, 'mexico'], [/baku/, 'baku'], [/barcelona|catalunya/, 'barcelona'],
        [/monaco/, 'monaco'], [/spa-franc|spa franc/, 'spa'], [/villeneuve|montreal/, 'montreal'], [/americas/, 'cota'],
        [/zandvoort/, 'zandvoort'], [/hungaroring/, 'hungaroring'], [/carlos pace|interlagos/, 'interlagos'], [/las vegas/, 'las-vegas'],
        [/lusail/, 'lusail'], [/madring/, 'madring'], [/marina bay/, 'marina-bay'], [/miami/, 'miami'], [/monza/, 'monza'],
        [/red bull ring/, 'red-bull-ring'], [/shanghai/, 'shanghai'], [/silverstone/, 'silverstone'], [/suzuka/, 'suzuka'],
        [/yas marina/, 'yas-marina'], [/bahrain/, 'bahrain'], [/jeddah/, 'jeddah']
    ];
    function trackImg(r) {
        const n = norm(r.Circuit.circuitName);
        const hit = TRACKS.find(([re]) => re.test(n));
        if (hit) return `assets/images/circuits/${hit[1]}.png`;
        if (typeof circuitImages !== 'undefined' && circuitImages[r.Circuit.circuitName]) return `assets/images/circuits/${circuitImages[r.Circuit.circuitName]}.png`;
        return '';
    }

    /* ---------- gaya ---------- */
    const css = document.createElement('style');
    css.textContent = `
        /* tema terang: latar krem + kartu putih (seperti situs resmi), navbar tetap gelap */
        html body.theme-schedule { background: #f4f1ec !important; background-attachment: fixed !important; }
        body.theme-schedule canvas { display: none; }
        body.theme-schedule .navbar { background: rgba(20, 20, 26, .9); }

        .sch-wrap { max-width: 1100px; margin: 28px auto 56px; padding: 0 4px; text-align: left; color: #14151a; }
        .sch-bar { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 22px; }
        .sch-note { font-size: .74rem; color: #7a7f8a; max-width: 460px; line-height: 1.4; }
        .sch-dd { position: relative; }
        .sch-dd-btn { display: flex; align-items: center; gap: 10px; padding: 9px 20px; border-radius: 999px; cursor: pointer; font: inherit; font-weight: 800; font-size: .95rem;
                      color: #14151a; background: #fff; border: 1.5px solid #14151a; }
        .sch-dd-btn:hover { background: #faf8f5; }
        .sch-dd-btn i { font-style: normal; font-size: .7rem; transition: transform .2s; }
        .sch-dd.open .sch-dd-btn i { transform: rotate(180deg); }
        .sch-dd-list { position: absolute; z-index: 30; top: calc(100% + 8px); left: 0; min-width: 100%; max-height: 330px; overflow-y: auto; margin: 0; padding: 6px; list-style: none;
                       background: #f6f2ee; border: 1.5px solid #14151a; border-radius: 16px; box-shadow: 0 14px 30px rgba(0,0,0,.14); }
        .sch-dd-list[hidden] { display: none; }
        .sch-dd-list li { padding: 10px 16px; border-radius: 10px; cursor: pointer; font-size: .9rem; font-weight: 600; color: #14151a; }
        .sch-dd-list li:hover { background: #e9e4dd; }
        .sch-dd-list li.on { color: #9a9ea8; }
        .sch-dd-list li.on::after { content: " •"; }

        .sch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
        .sch-card { position: relative; display: flex; flex-direction: column; min-height: 168px; padding: 16px 18px 14px; border-radius: 14px; overflow: hidden; text-align: left;
                    background: #fff; border: 1px solid #e7e2da; color: #14151a; transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
        .sch-card.go { cursor: pointer; }
        .sch-card.go:hover, .sch-card.go:focus-visible { transform: translateY(-3px); border-color: #14151a; box-shadow: 0 10px 24px rgba(20,21,26,.10); outline: none; }
        .sch-card.live, .sch-card.next { border: 1.5px solid #2457d6; background: #f5f8ff; }
        .sch-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .sch-round { font-size: .64rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8a8f9a; }
        .sch-st { display: inline-flex; align-items: center; gap: 5px; font-size: .62rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8a8f9a; }
        .sch-card.done .sch-st { color: #2f7d57; }
        .sch-card.done .sch-st::before { content: "✓"; font-size: .72rem; }
        .sch-card.live .sch-st, .sch-card.next .sch-st { padding: 3px 9px; border-radius: 99px; background: #2457d6; color: #fff; }
        .sch-country { display: flex; align-items: center; gap: 9px; margin: 10px 0 0; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 1.45rem; font-weight: 800; line-height: 1.1; color: #14151a; }
        .sch-flag { height: 14px; width: auto; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,.18); flex: none; }
        .sch-gp { margin: 6px 0 0; max-width: 78%; font-size: .68rem; line-height: 1.45; letter-spacing: .02em; text-transform: uppercase; color: #6b717d; }
        .sch-foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 14px; }
        .sch-date { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 1.1rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: #14151a; white-space: nowrap; }
        .sch-sub { display: flex; gap: 8px; align-items: center; margin-top: 4px; font-size: .7rem; min-height: 1em; }
        .sch-tag { padding: 1px 7px; border-radius: 4px; font-size: .6rem; font-weight: 800; letter-spacing: .08em; background: #e8ecf5; color: #36456b; }
        .sch-track { width: 66px; height: 52px; flex: none; object-fit: contain; object-position: right bottom; filter: invert(1); opacity: .85; }
        .sch-msg { grid-column: 1 / -1; padding: 40px 12px; text-align: center; color: #6b717d; background: #fff; border: 1px solid #e7e2da; border-radius: 14px; }
        @media (max-width: 640px) { .sch-grid { grid-template-columns: 1fr 1fr; gap: 10px; } .sch-card { padding: 13px 13px 12px; min-height: 150px; }
                                    .sch-country { font-size: 1.2rem; } .sch-gp { max-width: 100%; } .sch-track { width: 56px; height: 44px; } .sch-date { white-space: normal; } }
        @media (max-width: 420px) { .sch-grid { grid-template-columns: 1fr; } }

        /* animasi masuk: halaman memudar halus, kartu "muncul" bergantian dari bawah (beda dari Hasil & Klasemen) */
        #schedule-page.active { animation: schIn .45s ease-out backwards !important; }
        #schedule-page.active .sch-bar { animation: schFade .4s .1s ease-out backwards; }
        #schedule-page.active .sch-card { animation: schPop .5s cubic-bezier(.2,.8,.2,1) backwards; }
        #sch-grid.sch-silent .sch-card { animation: none !important; }
        ${Array.from({ length: 30 }, (_, i) => `#schedule-page.active .sch-card:nth-child(${i + 1}) { animation-delay: ${(0.15 + i * 0.03).toFixed(2)}s; }`).join('\n        ')}
        @keyframes schIn { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: none; } }
        @keyframes schFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes schPop { from { opacity: 0; transform: translateY(30px) scale(.94); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { #schedule-page.active, #schedule-page.active * { animation: none !important; } }`;
    document.head.appendChild(css);

    /* ---------- ambil data (cache + cadangan data lama kalau API gagal) ---------- */
    const mem = new Map();
    async function getJSON(url, ttl) {
        const key = 'jadwal:' + url, now = Date.now();
        let old = mem.get(url);
        if (!old) { try { old = JSON.parse(localStorage.getItem(key) || 'null') || undefined; } catch (e) { /* abaikan */ } }
        if (old && now - old.t < ttl) { mem.set(url, old); return old.v; }
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const rec = { t: now, v: await res.json() };
            mem.set(url, rec);
            try { const s = JSON.stringify(rec); if (s.length < 150000) localStorage.setItem(key, s); } catch (e) { /* abaikan */ }
            return rec.v;
        } catch (err) {
            if (old) return old.v;
            throw err;
        }
    }


    /* ---------- cadangan: kalender yang sudah diumumkan tapi belum ada di API ----------
       Dipakai HANYA kalau Jolpica belum punya datanya. Begitu API terisi, otomatis pakai API.
       [nama GP, hari pertama, hari balapan, sprint?, sirkuit, kota, negara] */
    const FALLBACK = {
        2027: [
            ['Bahrain Grand Prix', '03-12', '03-14', 1, 'Bahrain International Circuit', 'Sakhir', 'Bahrain'],
            ['Saudi Arabian Grand Prix', '03-19', '03-21', 0, 'Jeddah Corniche Circuit', 'Jeddah', 'Saudi Arabia'],
            ['Australian Grand Prix', '04-02', '04-04', 1, 'Albert Park Grand Prix Circuit', 'Melbourne', 'Australia'],
            ['Japanese Grand Prix', '04-09', '04-11', 1, 'Suzuka Circuit', 'Suzuka', 'Japan'],
            ['Chinese Grand Prix', '04-16', '04-18', 0, 'Shanghai International Circuit', 'Shanghai', 'China'],
            ['Miami Grand Prix', '04-30', '05-02', 0, 'Miami International Autodrome', 'Miami', 'USA'],
            ['Canadian Grand Prix', '05-21', '05-23', 1, 'Circuit Gilles Villeneuve', 'Montreal', 'Canada'],
            ['Monaco Grand Prix', '06-04', '06-06', 1, 'Circuit de Monaco', 'Monte-Carlo', 'Monaco'],
            ['Portuguese Grand Prix', '06-18', '06-20', 0, 'Autódromo Internacional do Algarve', 'Portimão', 'Portugal'],
            ['British Grand Prix', '07-02', '07-04', 1, 'Silverstone Circuit', 'Silverstone', 'UK'],
            ['Austrian Grand Prix', '07-09', '07-11', 0, 'Red Bull Ring', 'Spielberg', 'Austria'],
            ['Belgian Grand Prix', '07-23', '07-25', 0, 'Circuit de Spa-Francorchamps', 'Spa', 'Belgium'],
            ['Hungarian Grand Prix', '07-30', '08-01', 0, 'Hungaroring', 'Budapest', 'Hungary'],
            ['Italian Grand Prix', '09-03', '09-05', 1, 'Autodromo Nazionale di Monza', 'Monza', 'Italy'],
            ['Spanish Grand Prix', '09-10', '09-12', 0, 'Madring', 'Madrid', 'Spain'],
            ['Azerbaijan Grand Prix', '09-24', '09-26', 0, 'Baku City Circuit', 'Baku', 'Azerbaijan'],
            ['Turkish Grand Prix', '10-01', '10-03', 0, 'Istanbul Park', 'Istanbul', 'Turkey'],
            ['Singapore Grand Prix', '10-08', '10-10', 0, 'Marina Bay Street Circuit', 'Marina Bay', 'Singapore'],
            ['United States Grand Prix', '10-22', '10-24', 0, 'Circuit of the Americas', 'Austin', 'USA'],
            ['Mexico City Grand Prix', '10-29', '10-31', 0, 'Autódromo Hermanos Rodríguez', 'Mexico City', 'Mexico'],
            ['São Paulo Grand Prix', '11-05', '11-07', 1, 'Autódromo José Carlos Pace', 'São Paulo', 'Brazil'],
            ['Las Vegas Grand Prix', '11-18', '11-20', 0, 'Las Vegas Strip Street Circuit', 'Las Vegas', 'USA'],
            ['Qatar Grand Prix', '12-03', '12-05', 1, 'Lusail International Circuit', 'Lusail', 'Qatar'],
            ['Abu Dhabi Grand Prix', '12-10', '12-12', 1, 'Yas Marina Circuit', 'Abu Dhabi', 'UAE']
        ]
    };
    const fromFallback = year => (FALLBACK[year] || []).map((x, i) => ({
        season: String(year), round: String(i + 1), raceName: x[0], date: `${year}-${x[2]}`, time: '13:00:00Z',
        FirstPractice: { date: `${year}-${x[1]}` }, Sprint: x[3] ? { date: `${year}-${x[2]}` } : undefined,
        Circuit: { circuitName: x[4], Location: { locality: x[5], country: x[6] } }
    }));

    /* ---------- state & helper ---------- */
    const state = { year: THIS_YEAR, races: [], fallback: false };
    const raceStart = r => new Date(r.date + 'T' + (r.time || '12:00:00Z')).getTime();
    function statusOf(r, now) {
        const st = raceStart(r);
        if (now > st + 3 * HOUR) return 'done';
        if (now >= st - 2 * DAY) return 'live';
        return 'upcoming';
    }
    function dateRange(r) {
        const end = new Date(r.date + 'T00:00:00Z');
        const first = r.FirstPractice || r.Qualifying || r.Sprint;
        const start = first ? new Date(first.date + 'T00:00:00Z') : new Date(end - 2 * DAY);
        const m = d => d.toLocaleString('id-ID', { month: 'short', timeZone: 'UTC' }).replace('.', '').toUpperCase(), dd = d => pad2(d.getUTCDate());
        return start.getUTCMonth() === end.getUTCMonth() ? `${dd(start)} - ${dd(end)} ${m(end)}` : `${dd(start)} ${m(start)} - ${dd(end)} ${m(end)}`;
    }
    function shortDate(r) {
        const d = new Date(r.date + 'T00:00:00Z');
        return `${pad2(d.getUTCDate())} ${d.toLocaleString('id-ID', { month: 'short', timeZone: 'UTC' }).replace('.', '').toUpperCase()}`;
    }
    const countryCounts = R => { const o = {}; R.forEach(r => { const c = r.Circuit.Location.country; o[c] = (o[c] || 0) + 1; }); return o; };
    function placeName(r, counts) {
        const c = r.Circuit.Location.country;
        return counts[c] > 1 ? r.Circuit.Location.locality : (COUNTRY_NAME[c] || c);
    }

    /* ---------- tampilan ---------- */
    const page = document.createElement('div');
    page.id = 'schedule-page';
    page.className = 'page';
    page.innerHTML = `<section class="sch-wrap" aria-label="Kalender balapan F1">
        <div class="sch-bar" id="sch-bar"><span class="sch-note" id="sch-note" hidden></span></div>
        <div class="sch-grid" id="sch-grid"><div class="sch-msg">Memuat…</div></div>
    </section>`;

    /* dropdown tahun */
    const dd = document.createElement('div');
    dd.className = 'sch-dd';
    dd.innerHTML = '<button type="button" class="sch-dd-btn" aria-haspopup="listbox"><span></span><i>▾</i></button><ul class="sch-dd-list" role="listbox" hidden></ul>';
    const ddBtn = dd.firstChild, ddList = dd.lastChild;
    const years = []; for (let y = FIRST_YEAR; y <= THIS_YEAR + 1; y++) years.push(y);
    function refreshDD() {
        ddBtn.firstChild.textContent = state.year;
        ddList.innerHTML = years.map(y => `<li role="option" data-v="${y}" class="${y === state.year ? 'on' : ''}">${y}</li>`).join('');
    }
    const closeDD = () => { ddList.hidden = true; dd.classList.remove('open'); };
    ddBtn.addEventListener('click', e => { e.stopPropagation(); const open = ddList.hidden; ddList.hidden = !open; dd.classList.toggle('open', open); if (open) { const on = ddList.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest' }); } });
    ddList.addEventListener('click', e => { const li = e.target.closest('li'); if (!li) return; closeDD(); state.year = Number(li.dataset.v); refreshDD(); load(); });
    document.addEventListener('click', closeDD);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDD(); });

    const $ = id => document.getElementById(id);
    const msgHTML = t => `<div class="sch-msg">${esc(t)}</div>`;

    function render(silent) {
        const grid = $('sch-grid'), now = Date.now(), R = state.races;
        $('sch-note').hidden = !state.fallback;
        if (state.fallback) $('sch-note').textContent = 'Jadwal sesuai pengumuman resmi F1. Otomatis beralih ke data API begitu tersedia.';
        grid.classList.toggle('sch-silent', !!silent);
        if (!R.length) { grid.innerHTML = msgHTML(state.year > THIS_YEAR ? `Kalender ${state.year} belum dirilis.` : 'Jadwal belum bisa dimuat. Coba lagi beberapa saat.'); return; }
        const counts = countryCounts(R);
        const nextRound = (R.find(r => statusOf(r, now) !== 'done') || {}).round;
        const canOpen = state.year === THIS_YEAR && typeof window.openHasilRound === 'function';
        grid.innerHTML = R.map(r => {
            const s = statusOf(r, now), isNext = s === 'upcoming' && r.round === nextRound;
            const cls = s === 'done' ? 'done' : s === 'live' ? 'live' : isNext ? 'next' : '';
            const label = s === 'done' ? 'Selesai' : s === 'live' ? 'Berlangsung' : isNext ? 'Berikutnya' : '';
            const go = canOpen && s !== 'upcoming';
            const img = trackImg(r);
            const sub = r.Sprint ? '<span class="sch-tag">SPRINT</span>' : '';
            return `<article class="sch-card ${cls} ${go ? 'go' : ''}" data-round="${esc(r.round)}" ${go ? 'tabindex="0" role="button"' : ''} aria-label="${esc(r.raceName)}">
                <div class="sch-top"><span class="sch-round">Ronde ${pad2(r.round)}</span>${label ? `<span class="sch-st"><i></i>${label}</span>` : ''}</div>
                <h3 class="sch-country">${flagImg(flagCode(r))}<span>${esc(placeName(r, counts))}</span></h3>
                <p class="sch-gp">${esc(r.raceName)} ${esc(r.season)}</p>
                <div class="sch-foot">
                    <div><div class="sch-date">${esc(dateRange(r))}</div><div class="sch-sub">${sub}</div></div>
                    ${img ? `<img class="sch-track" src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
                </div></article>`;
        }).join('');
    }

    let token = 0, ready = false;
    async function load(silent) {
        const my = ++token, year = state.year;
        if (!silent) { $('sch-grid').innerHTML = msgHTML('Memuat…'); }
        let races = [];
        try {
            const j = await getJSON(`${JOLPICA}${year}.json?limit=100`, year < THIS_YEAR ? 7 * DAY : HOUR);
            races = j.MRData.RaceTable.Races || [];
        } catch (e) { /* pakai cadangan di bawah kalau ada */ }
        if (my !== token) return;
        state.fallback = false;
        if (!races.length) { races = fromFallback(year); state.fallback = races.length > 0; }
        if (!races.length && silent) return;
        state.races = races;
        render(silent);
        ready = true;
    }
    const open = () => { if (!ready) { refreshDD(); load(); } else load(true); };

    /* klik kartu -> buka halaman Hasil (balapan musim ini yang sudah berlangsung) */
    page.addEventListener('click', e => {
        const c = e.target.closest('.sch-card.go'); if (c && typeof window.openHasilRound === 'function') window.openHasilRound(c.dataset.round);
    });
    page.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const c = e.target.closest('.sch-card.go'); if (c && typeof window.openHasilRound === 'function') { e.preventDefault(); window.openHasilRound(c.dataset.round); }
    });

    /* ---------- menu navbar + halaman ---------- */
    function mount() {
        const after = document.getElementById('hasil-page') || document.getElementById('klasemen-page') || document.getElementById('circuits-page');
        if (after) after.after(page); else (document.getElementById('main-wrapper') || document.body).appendChild(page);
        $('sch-bar').prepend(dd); refreshDD();

        const menu = document.getElementById('nav-menu');
        let link = null;
        if (menu && !menu.querySelector('[data-schedule]')) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="#" data-schedule>Schedule</a>';
            link = li.firstChild;
            link.addEventListener('click', e => { e.preventDefault(); if (typeof showPage === 'function') showPage('schedule-page'); open(); });
            const items = [...menu.querySelectorAll('li')];
            const anchor = items.find(l => l.querySelector('[data-hasil]')) || items.find(l => /hasil/i.test(l.textContent)) ||
                items.find(l => /klasemen/i.test(l.textContent)) || items.find(l => /sirkuit/i.test(l.textContent));
            if (anchor) anchor.after(li); else menu.appendChild(li);
        }

        // penanda menu aktif (Schedule menyala saat halamannya terbuka)
        const orig = window.showPage;
        if (menu && link && typeof orig === 'function' && !orig.__sch) {
            window.showPage = function (id) {
                const out = orig.apply(this, arguments);
                document.body.classList.toggle('theme-schedule', id === 'schedule-page');
                if (id === 'schedule-page') { menu.querySelectorAll('a.active').forEach(x => x.classList.remove('active')); link.classList.add('active'); }
                else link.classList.remove('active');
                return out;
            };
            window.showPage.__sch = true;
        }

        // perbarui status (selesai / berikutnya) tiap 5 menit selama halaman dibuka
        setInterval(() => { if (page.classList.contains('active') && state.year === THIS_YEAR) load(true); }, 5 * MIN);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();