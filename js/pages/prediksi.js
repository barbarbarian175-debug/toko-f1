/* =========================================================
   PREDIKSI — tebak pemenang balapan berikutnya
   Desain mengikuti referensi: panel kuning, lembar putih + nav, foto
   pembalap menyembul keluar bingkai, nama besar yang menimpa kartu
   statistik putih di dasar hero, dan panel abu-abu di belakang/bawahnya.
   - Balapan berikutnya dari jadwal Jolpica (gratis, tanpa key).
   - Tebakan per ronde tersimpan di localStorage 'f1_pred' (peta: ronde -> tebakan),
     jadi tebakan ronde yang sedang berlangsung tidak tertimpa tebakan ronde baru.
   - Setelah balapan selesai, hasil dicek otomatis dari API:
     juara tepat = 10 poin, podium = 5 poin. Riwayat di 'f1_pred_hist'.
   ========================================================= */
(function () {
    'use strict';

    var JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    var YEAR = new Date().getFullYear();
    var PRED_KEY = 'f1_pred';
    var HIST_KEY = 'f1_pred_hist';
    var SCHED_KEY = 'f1_pred_sched';
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var TRACKS = [
        [/albert/, 'albert-park'], [/hermanos|mexico city/, 'mexico'], [/baku/, 'baku'], [/barcelona|catalunya/, 'barcelona'],
        [/monaco/, 'monaco'], [/spa-franc|spa franc/, 'spa'], [/villeneuve|montreal/, 'montreal'], [/americas/, 'cota'],
        [/zandvoort/, 'zandvoort'], [/hungaroring/, 'hungaroring'], [/carlos pace|interlagos/, 'interlagos'], [/las vegas/, 'las-vegas'],
        [/lusail/, 'lusail'], [/madring/, 'madring'], [/marina bay/, 'marina-bay'], [/miami/, 'miami'], [/monza/, 'monza'], [/red bull ring/, 'red-bull-ring'], [/shanghai/, 'shanghai'], [/silverstone/, 'silverstone'], [/suzuka/, 'suzuka'],
        [/yas marina/, 'yas-marina'], [/bahrain/, 'bahrain'], [/jeddah/, 'jeddah']
    ];
    function trackImg(circuitName) {
        var n = norm(circuitName || '');
        var hit = TRACKS.find(function (pair) { return pair[0].test(n); });
        if (hit) return 'assets/images/circuits/' + hit[1] + '.png';
        if (typeof circuitImages !== 'undefined' && circuitImages[circuitName]) return 'assets/images/circuits/' + circuitImages[circuitName] + '.png';
        return '';
    }
    function teamOf(driverName) {
        if (typeof teamsData === 'undefined') return null;
        var n = norm(driverName), last = n.split(' ').pop();
        return teamsData.find(function (x) { return (x.drivers || []).indexOf(driverName) !== -1; }) ||
            teamsData.find(function (x) { return (x.drivers || []).some(function (d) { return norm(d) === n; }); }) ||
            teamsData.find(function (x) { return (x.drivers || []).some(function (d) { return norm(d).split(' ').pop() === last; }); }) || null;
    }
    function teamColorOf(driverName) { var t = teamOf(driverName); return t && t.color ? t.color : '#888'; }

    /* Ambil field data pembalap secara fleksibel (nama field di situsmu bisa beda-beda). */
    function pick(o, re) {
        if (!o || typeof o !== 'object') return '';
        var k = Object.keys(o).find(function (x) { return re.test(x) && (typeof o[x] === 'string' || typeof o[x] === 'number') && String(o[x]).length < 40 && String(o[x]) !== ''; });
        return k ? o[k] : '';
    }
    var CAR_FILE = /\.(png|jpe?g|webp|avif|svg)(\?.*)?$/i;
    function carOf(obj) {
        if (!obj || typeof obj !== 'object') return '';
        var k = Object.keys(obj).find(function (x) { return /car|mobil|livery|bolide/i.test(x) && typeof obj[x] === 'string' && (CAR_FILE.test(obj[x]) || obj[x].indexOf('/') !== -1); });
        return k ? obj[k] : '';
    }

    /* Logo tim.
       Urutan pencarian: (1) field gambar di teamsData (logo/img/badge/dll), (2) file di TEAM_LOGO_DIR
       bernama <kunci-tim>.png / .svg / .webp. Kalau semuanya gagal dimuat, tampil badge inisial berwarna tim. */
    var TEAM_LOGO_DIR = 'assets/images/teams/';
    var TEAM_KEYS = [
        [/red bull/, 'red-bull'], [/racing bulls|rb f1|visa cash|alphatauri|toro rosso/, 'racing-bulls'],
        [/mercedes/, 'mercedes'], [/ferrari/, 'ferrari'], [/mclaren/, 'mclaren'], [/aston/, 'aston-martin'],
        [/alpine/, 'alpine'], [/williams/, 'williams'], [/haas/, 'haas'], [/audi|sauber|kick/, 'audi'], [/cadillac/, 'cadillac']
    ];
    function teamKey(name) {
        var n = norm(name), hit = TEAM_KEYS.find(function (p) { return p[0].test(n); });
        return hit ? hit[1] : n.replace(/\b(f1|team|racing)\b/g, '').trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    function logoSources(driverName, teamName) {
        var out = [], t = teamOf(driverName);
        if (t) {
            Object.keys(t).forEach(function (k) {
                var v = t[k];
                if (/logo|badge|emblem|icon|crest|img|image/i.test(k) && !/car|mobil|livery|driver|photo|foto|track|circuit/i.test(k) &&
                    typeof v === 'string' && v && (CAR_FILE.test(v) || v.indexOf('/') !== -1)) out.push(v);
            });
        }
        var tl = null;
        try { if (typeof teamLogos !== 'undefined') tl = teamLogos; } catch (e) {}
        if (!tl && window.teamLogos) tl = window.teamLogos;
        if (tl) {
            var want = [(t && t.name) || '', (t && t.full) || '', teamName || ''].map(function (x) { return norm(x).replace(/[^a-z0-9]/g, ''); }).filter(Boolean);
            var tk = Object.keys(tl).find(function (k) { var kk = norm(k).replace(/[^a-z0-9]/g, ''); return kk && want.some(function (w) { return kk === w || kk.indexOf(w) !== -1 || w.indexOf(kk) !== -1; }); });
            var tv = tk ? tl[tk] : '';
            if (tv && typeof tv === 'object') tv = tv.src || tv.logo || tv.url || tv.img || '';
            if (tv) out.push(tv);
        }
        var key = teamKey((t && t.name) || teamName) || teamKey(teamName);
        if (key) [key, key.replace(/-/g, '')].forEach(function (kn) {
            ['png', 'jpg', 'svg', 'webp', 'jpeg'].forEach(function (ext) { out.push(TEAM_LOGO_DIR + kn + '.' + ext); });
        });
        return out.filter(function (s, i) { return out.indexOf(s) === i; });
    }
    /* kalau satu sumber gagal dimuat, coba sumber berikutnya; habis -> hapus <img> (badge inisial tetap terlihat) */
    window.__prLogoErr = function (img) {
        var rest = (img.getAttribute('data-alt') || '').split('|').filter(Boolean);
        if (!rest.length) { img.remove(); return; }
        img.setAttribute('data-alt', rest.slice(1).join('|'));
        img.src = rest[0];
    };
    function teamBadge(driverName, teamName, size) {
        var srcs = logoSources(driverName, teamName), col = teamColorOf(driverName);
        var w = String(teamName || '').replace(/\b(F1|Team|Racing)\b/gi, '').trim().split(/\s+/);
        var ini = (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)).toUpperCase();
        return '<span class="pr-tl ' + (size || '') + '" style="--tc:' + col + '"><em>' + esc(ini) + '</em>' +
            (srcs.length ? '<img src="' + esc(srcs[0]) + '" data-alt="' + esc(srcs.slice(1).join('|')) + '" alt="Logo ' + esc(teamName) + '" onerror="window.__prLogoErr(this)">' : '') + '</span>';
    }

    /* Font geometris mirip referensi (jatuh ke font sistem kalau offline). */
    if (!document.getElementById('pr-font')) {
        var lk = document.createElement('link');
        lk.id = 'pr-font'; lk.rel = 'stylesheet';
        lk.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(lk);
    }

    var css = document.createElement('style');
    css.textContent = `
        .pr-wrap { --y1: #f6bd05; --y2: #fccb2e; --ink: #151515; --mut: #7a7a7a; --gray: #ececee; --tc: #888;
            max-width: 1180px; margin: 0 auto; padding: 8px 16px 60px; text-align: left; color: var(--ink);
            font-family: 'Plus Jakarta Sans', var(--f-body, 'Inter', sans-serif); }
        .pr-wrap * { box-sizing: border-box; }

        /* panggung kuning. isolation: z-index di dalam tidak bocor ke navbar situs */
        .pr-stage { position: relative; isolation: isolate; background: var(--y1); padding: 96px 28px 0 28px; overflow: hidden; border-radius: 6px; }
        /* panel abu-abu di BELAKANG lembar putih: mulai dari sudut kiri-atas hero, sampai kanan & bawah (seperti referensi) */
        .pr-stage::before { content: ''; position: absolute; z-index: 0; left: 72px; right: 0; top: 170px; bottom: 0; background: var(--gray); }

        /* lembar putih + nav */
        .pr-sheet { background: #fff; position: relative; z-index: 1; box-shadow: 0 30px 60px -26px rgba(0, 0, 0, .4); }
        .pr-nav { display: flex; align-items: center; gap: 34px; padding: 0 28px; height: 74px; position: relative; z-index: 1; }
        .pr-burger { width: 16px; height: 10px; flex: none; margin-right: -8px;
            background: linear-gradient(#b9b9b9, #b9b9b9) top / 100% 1.5px no-repeat, linear-gradient(#b9b9b9, #b9b9b9) left center / 70% 1.5px no-repeat, linear-gradient(#b9b9b9, #b9b9b9) bottom / 100% 1.5px no-repeat; }
        .pr-logo { font-weight: 800; font-size: .82rem; letter-spacing: .14em; text-transform: uppercase; line-height: 1.15; }
        .pr-logo b { display: block; color: #d6141c; font-weight: 800; }
        .pr-nav nav { display: flex; gap: 26px; }
        .pr-nav nav a { font-size: .78rem; font-weight: 700; color: var(--ink); text-decoration: none; padding: 4px 0; border-bottom: 1px solid transparent; transition: border-color .2s; cursor: pointer; }
        .pr-nav nav a:hover, .pr-nav nav a.on { border-bottom-color: var(--ink); }
        .pr-sc { margin-left: auto; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: #b4b4b4; font-weight: 700; white-space: nowrap; }
        .pr-sc b { color: var(--ink); font-size: .95rem; letter-spacing: 0; margin: 0 4px 0 8px; }

        .pr-body { display: flex; }
        .pr-side { width: 44px; flex: none; position: relative; }
        .pr-side span { position: absolute; left: 50%; bottom: 40px; transform: translateX(-50%) rotate(180deg); writing-mode: vertical-rl; font-size: .62rem; letter-spacing: .28em; text-transform: uppercase; color: #b9b9b9; font-weight: 700; white-space: nowrap; }
        .pr-main { flex: 1; min-width: 0; }

        /* hero (bukan stacking context, jadi nama bisa di atas kartu & foto di bawah kartu) */
        .pr-hero { position: relative; min-height: 540px; background: linear-gradient(180deg, var(--y2), #f9c11a); }
        .pr-car { position: absolute; left: 6%; top: 52px; width: 210px; z-index: 3; }
        .pr-car img { width: 100%; display: block; filter: drop-shadow(0 8px 8px rgba(0, 0, 0, .25)); }
        .pr-hl { position: absolute; left: 16%; bottom: 128px; z-index: 5; max-width: 62%; }
        .pr-no { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1rem; margin-bottom: 10px; }
        .pr-no i { width: 22px; height: 14px; border-radius: 2px; background: var(--tc); display: inline-block; }
        .pr-no span { font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; opacity: .65; }
        .pr-tag { display: inline-block; padding: 3px 9px; border-radius: 99px; background: var(--ink); color: #fff; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 700; }
        .pr-name { margin: 0; font-weight: 700; font-size: clamp(2.7rem, 6.4vw, 5.5rem); line-height: .98; letter-spacing: -.025em; color: var(--ink); text-transform: none; font-family: inherit; }
        .pr-name .ln { display: block; overflow: hidden; padding-bottom: .1em; margin-bottom: -.1em; }
        .pr-name .ln i { display: inline-block; font-style: normal; }
        .pr-name.sm { font-size: clamp(1.8rem, 4vw, 3.1rem); line-height: 1.05; }
        /* foto: menyembul ke atas menembus nav, bagian bawahnya tertutup kartu statistik */
        .pr-photo { position: absolute; left: 38%; bottom: 0; width: min(29%, 320px); height: calc(100% + 100px); z-index: 2; pointer-events: none; }
        .pr-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; border-radius: 999px 999px 0 0; background: #222; }
        .pr-photo img.cut { object-fit: contain; object-position: center bottom; border-radius: 0; background: none; filter: drop-shadow(0 16px 24px rgba(0, 0, 0, .35)); }
        .pr-photo.empty { display: none; }
        .pr-hr { position: absolute; right: 4%; top: 40px; width: 21%; min-width: 170px; z-index: 6; }
        .pr-day { display: flex; align-items: flex-start; gap: 12px; }
        .pr-day b { font-size: clamp(3.6rem, 8vw, 6.4rem); line-height: .82; font-weight: 600; letter-spacing: -.04em; }
        .pr-day span { font-size: .78rem; font-weight: 600; margin-top: 4px; }
        .pr-rn { font-weight: 700; font-size: 1.05rem; line-height: 1.22; margin-top: 12px; }
        .pr-when { font-size: .72rem; color: rgba(0, 0, 0, .55); margin-top: 6px; font-weight: 600; }
        .pr-trk { display: block; width: 100%; max-height: 64px; object-fit: contain; object-position: left center; margin: 10px 0 2px; filter: brightness(0); opacity: .82; }
        .pr-trk.tk-m { filter: none; mix-blend-mode: multiply; }
        .pr-trk.tk-d { filter: none; background: #151515; border-radius: 8px; padding: 6px; }

        /* tombol prediksi: pill hitam yang jelas */
        .pr-link { display: inline-block; margin-top: 14px; padding: 11px 22px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font-family: inherit; font-weight: 700; font-size: .82rem; cursor: pointer; box-shadow: 0 8px 18px -8px rgba(0, 0, 0, .5); transition: transform .2s, opacity .2s, background .2s; }
        .pr-link:hover:not(:disabled) { transform: translateY(-2px); }
        .pr-link:disabled { opacity: .5; cursor: default; box-shadow: none; }
        .pr-link.done, .pr-link.done:disabled { background: #1fa862; opacity: 1; }
        .pr-note { display: block; margin-top: 8px; font-size: .66rem; color: rgba(0, 0, 0, .5); font-weight: 600; max-width: 190px; line-height: 1.35; }

        /* kartu statistik: menempel di dasar hero, menimpa foto; nama menimpa kartu */
        .pr-stats { position: absolute; z-index: 3; left: 8%; right: 7%; bottom: 0; display: flex; flex-wrap: wrap; gap: 22px 56px; padding: 74px 36px 38px 8%; background: #fff; box-shadow: 0 -14px 40px -22px rgba(0, 0, 0, .3); }
        .pr-cell small { display: block; font-size: .62rem; letter-spacing: .16em; text-transform: uppercase; color: var(--mut); font-weight: 700; margin-bottom: 8px; }
        .pr-cell b { font-size: 1.32rem; font-weight: 600; }

        /* area abu-abu (daftar pembalap + riwayat) */
        .pr-lower { position: relative; z-index: 0; margin: 0 -28px 0 72px; background: var(--gray); padding: 52px 32px 46px; }
        .pr-lower h3 { margin: 0 0 14px; font-size: .74rem; letter-spacing: .2em; text-transform: uppercase; color: var(--mut); font-weight: 800; font-family: inherit; }
        .pr-lower h3.second { margin-top: 36px; }
        .pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 12px; }
        .pr-chip { position: relative; border: 0; background: #fff; border-bottom: 3px solid var(--tc, #888); padding: 0; text-align: left; cursor: pointer; overflow: hidden; color: var(--ink); font-family: inherit;
            animation: prUp .5s cubic-bezier(.2, .8, .2, 1) both; animation-delay: calc(var(--i, 0) * 30ms);
            transition: transform .25s cubic-bezier(.2, .8, .2, 1), box-shadow .25s; }
        .pr-chip:hover { transform: translateY(-4px); box-shadow: 0 14px 24px -12px rgba(0, 0, 0, .35); }
        .pr-chip img { display: block; width: 100%; height: 104px; object-fit: cover; object-position: center top; background: #2a2a2a; transition: transform .5s cubic-bezier(.2, .8, .2, 1); }
        .pr-chip:hover img { transform: scale(1.06); }
        .pr-chip .pr-nm { padding: 9px 11px 1px; font-weight: 700; font-size: .84rem; }
        .pr-chip .pr-tm { padding: 0 11px 11px; color: var(--mut); font-size: .7rem; font-weight: 600; }
        .pr-chip.sel { background: var(--y2); border-bottom-color: var(--ink); }
        .pr-chip.sel .pr-tm { color: rgba(0, 0, 0, .6); }
        .pr-chip.sel::after { content: '✓'; position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; border-radius: 50%; background: var(--ink); color: #fff; font-size: .75rem; line-height: 22px; text-align: center; animation: prPop .35s cubic-bezier(.3, 1.6, .5, 1); }
        .pr-grid.settled .pr-chip { animation: none; }
        .pr-row { display: flex; justify-content: space-between; gap: 12px; padding: 14px 18px; margin-bottom: 8px; background: #fff; border-left: 4px solid #cfcfd4; font-size: .88rem; font-weight: 600; animation: prUp .45s ease both; }
        .pr-row small { display: block; color: var(--mut); font-weight: 500; margin-top: 3px; font-size: .76rem; }
        .pr-row .pr-pts { font-weight: 800; white-space: nowrap; color: var(--mut); align-self: center; font-size: 1.05rem; }
        .pr-row.good { border-left-color: #1fa862; } .pr-row.good .pr-pts { color: #1fa862; }
        .pr-msg { padding: 18px 22px; color: var(--mut); border: 1px dashed #c4c4ca; font-size: .88rem; font-weight: 600; }

        /* logo tim */
        .pr-tl { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; background: var(--tc, #888); color: #fff; font-weight: 800; font-size: .55rem; overflow: hidden; flex: none; }
        .pr-tl em { font-style: normal; }
        .pr-tl img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: #fff; padding: 2px; }
        .pr-tl.lg { width: 34px; height: 34px; border-radius: 6px; font-size: .7rem; }
        .pr-chip .pr-tm { display: flex; align-items: center; gap: 6px; }
        /* reset aturan umum .pr-chip img supaya logo tidak ikut tinggi 104px */
        .pr-chip .pr-tl img { height: 100%; transition: none; }
        .pr-chip:hover .pr-tl img { transform: none; }

        /* animasi ganti pembalap */
        .go .pr-name .ln i { transform: translateY(108%); animation: prName .75s cubic-bezier(.2, .8, .2, 1) forwards; animation-delay: calc(var(--k) * 90ms); }
        .go.pr-photo img { animation: prPhoto .8s cubic-bezier(.2, .8, .2, 1) both; }
        .go.pr-car img { animation: prCar .8s cubic-bezier(.2, .8, .2, 1) both; }
        .go .pr-no { animation: prUp .5s ease both; }
        .go.pr-stats .pr-cell { animation: prUp .55s cubic-bezier(.2, .8, .2, 1) both; animation-delay: calc(var(--k) * 70ms + .15s); }
        .go.pr-hr > * { animation: prUp .6s cubic-bezier(.2, .8, .2, 1) both; }
        .go.pr-hr > *:nth-child(2) { animation-delay: .08s; } .go.pr-hr > *:nth-child(3) { animation-delay: .16s; } .go.pr-hr > *:nth-child(4) { animation-delay: .24s; } .go.pr-hr > *:nth-child(5) { animation-delay: .3s; }
        @keyframes prName { to { transform: none; } }
        @keyframes prPhoto { from { opacity: 0; transform: translateY(60px); clip-path: inset(100% 0 0 0); } to { opacity: 1; transform: none; clip-path: inset(0); } }
        @keyframes prCar { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }
        @keyframes prUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes prPop { from { transform: scale(0); } to { transform: scale(1); } }

        @media (max-width: 900px) {
            .pr-stage { padding: 56px 10px 0; }
            .pr-stage::before { display: none; }
            .pr-nav { height: auto; padding: 14px 16px; gap: 14px 22px; flex-wrap: wrap; }
            .pr-side { display: none; }
            .pr-hero { display: flex; flex-direction: column; min-height: 0; padding: 0 20px 24px; }
            .pr-car, .pr-photo, .pr-hl, .pr-hr, .pr-stats { position: static; width: auto; max-width: none; }
            .pr-car { width: 130px; margin-top: 18px; }
            .pr-photo { width: 66%; height: 290px; margin: -64px auto 0; align-self: center; }
            .pr-hl { margin-top: 6px; }
            .pr-hr { margin-top: 18px; }
            .pr-trk { max-width: 180px; }
            .pr-stats { margin: 22px 0 0; padding: 28px 20px 24px; gap: 20px 34px; }
            .pr-lower { margin: 0 -10px 0 0; padding: 26px 16px 38px; }
        }
        @media (max-width: 520px) { .pr-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } .pr-chip img { height: 80px; } .pr-chip .pr-tl img { height: 100%; } .pr-chip .pr-nm { font-size: .74rem; padding: 7px 8px 1px; } .pr-chip .pr-tm { padding: 0 8px 8px; } }
        @media (prefers-reduced-motion: reduce) { .pr-wrap *, .pr-wrap *::before, .pr-wrap *::after { animation: none !important; transition: none !important; } .go .pr-name .ln i { transform: none; } }`;
    document.head.appendChild(css);

    /* ---------- penyimpanan ---------- */
    /* Tebakan disimpan sebagai peta { ronde: tebakan } supaya tebakan ronde yang balapannya
       sedang berlangsung (belum ada hasil) tidak tertimpa saat kamu menebak ronde berikutnya. */
    function loadPreds() {
        try {
            var p = JSON.parse(localStorage.getItem(PRED_KEY) || 'null');
            if (!p || typeof p !== 'object') return {};
            if (p.round != null && p.driverId != null) { var o = {}; o[String(p.round)] = p; return o; }   /* migrasi format lama */
            return p;
        } catch (e) { return {}; }
    }
    function savePreds(p) { try { localStorage.setItem(PRED_KEY, JSON.stringify(p)); } catch (e) {} }
    function predFor(round) { return loadPreds()[String(round)] || null; }
    function loadHist() { try { var h = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); return Array.isArray(h) ? h : []; } catch (e) { return []; } }
    function saveHist(h) { try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch (e) {} }

    function drivers() {
        if (typeof driversData === 'undefined') return [];
        return Object.keys(driversData).map(function (id) {
            var d = driversData[id];
            return { id: id, name: d.name, team: d.team, photo: d.photo || '', raw: d };
        }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    function raceStart(r) {
        var t = r.time || '12:00:00Z';
        return new Date(r.date + 'T' + t);
    }
    /* Cocokkan nama di situsmu dengan nama dari API (mis. "Kimi Antonelli" vs "Andrea Kimi Antonelli"). */
    function sameDriver(name, drv) {
        if (!drv) return false;
        var a = norm(name), fam = norm(drv.familyName), giv = norm(drv.givenName);
        if (a === (giv + ' ' + fam).trim()) return true;
        var parts = a.split(/\s+/), first = parts[0], last = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
        if (fam !== last) return false;
        return parts.length < 2 || giv.indexOf(first) !== -1 || first.indexOf(giv) !== -1;
    }

    var nextRace = null, selectedId = null, totalRounds = 0, schedState = 'loading';
    var heroEl, carEl, photoEl, hlEl, hrEl, statsEl, gridEl, saveBtn, histEl, scoreEl;

    function totalScore() {
        return loadHist().reduce(function (a, h) { return a + (Number(h.points) || 0); }, 0);
    }
    function renderScore() { scoreEl.innerHTML = 'Skormu<b>' + totalScore() + '</b>poin'; }

    function renderHist() {
        var h = loadHist().slice().reverse();
        if (!h.length) { histEl.innerHTML = '<div class="pr-msg">Belum ada riwayat tebakan.</div>'; return; }
        histEl.innerHTML = h.map(function (x) {
            var pts = Number(x.points) || 0;
            return '<div class="pr-row' + (pts > 0 ? ' good' : '') + '"><span>Ronde ' + esc(x.round) + ' • ' + esc(x.raceName) + '<small>Tebakanmu: ' + esc(x.driver) + ' • Juara: ' + esc(x.winner || '—') + '</small></span>' +
                '<span class="pr-pts">+' + pts + '</span></div>';
        }).join('');
    }

    /* picu ulang animasi pada sebuah elemen */
    function go(el) { if (!el) return; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }

    /* deteksi foto cutout (transparan) vs foto persegi (hanya jalan kalau gambar boleh dibaca canvas) */
    function probePhoto(img) {
        try {
            var c = document.createElement('canvas'); c.width = c.height = 16;
            var x = c.getContext('2d'); x.drawImage(img, 0, 0, 16, 16);
            var a = x.getImageData(0, 0, 16, 16).data;
            if (a[3] < 20 && a[15 * 4 + 3] < 20) img.classList.add('cut');
        } catch (e) {}
    }
    function probeTrack(img) {
        try {
            var c = document.createElement('canvas'); c.width = c.height = 32;
            var x = c.getContext('2d'); x.drawImage(img, 0, 0, 32, 32);
            var d = x.getImageData(0, 0, 32, 32).data, n = 0;
            for (var i = 3; i < d.length; i += 4) if (d[i] > 40) n++;
            if (n / 1024 > .9) img.classList.add((d[0] * .299 + d[1] * .587 + d[2] * .114) > 128 ? 'tk-m' : 'tk-d');
        } catch (e) {}
    }

    /* gambar mobil yang latarnya hitam pekat (bukan transparan): hapus latar yang tersambung ke tepi gambar */
    function cleanCar(img) {
        try {
            if (img.dataset.clean) return;
            var w = img.naturalWidth, h = img.naturalHeight;
            if (!w || !h || w * h > 4e6) return;
            var c = document.createElement('canvas'); c.width = w; c.height = h;
            var x = c.getContext('2d'); x.drawImage(img, 0, 0);
            var id = x.getImageData(0, 0, w, h), d = id.data;
            if (d[3] < 20) return;                                   /* sudah transparan */
            var bg = function (p) { var i = p * 4; return d[i + 3] > 0 && d[i] < 18 && d[i + 1] < 18 && d[i + 2] < 18; };
            var seen = new Uint8Array(w * h), stack = [], p, k;
            var add = function (q) { if (!seen[q] && bg(q)) { seen[q] = 1; stack.push(q); } };
            for (k = 0; k < w; k++) { add(k); add((h - 1) * w + k); }
            for (k = 0; k < h; k++) { add(k * w); add(k * w + w - 1); }
            if (!stack.length) return;                               /* latar bukan hitam */
            while (stack.length) {
                p = stack.pop();
                var px = p % w;
                if (px > 0) add(p - 1);
                if (px < w - 1) add(p + 1);
                if (p >= w) add(p - w);
                if (p < w * (h - 1)) add(p + w);
            }
            for (k = 0; k < seen.length; k++) if (seen[k]) d[k * 4 + 3] = 0;
            x.putImageData(id, 0, 0);
            img.dataset.clean = '1';
            img.src = c.toDataURL('image/png');
        } catch (e) {}
    }

    /* status tombol simpan: belum disimpan / sudah tersimpan / ubah / balapan sudah mulai */
    function syncSave() {
        if (!saveBtn || !nextRace) return;
        var mine = predFor(nextRace.round);
        var started = raceStart(nextRace).getTime() <= Date.now();
        var saved = !!(mine && selectedId && String(mine.driverId) === String(selectedId));
        saveBtn.classList.toggle('done', saved);
        if (started) { saveBtn.disabled = true; saveBtn.textContent = 'Balapan sudah dimulai'; return; }
        saveBtn.disabled = !selectedId || saved;
        saveBtn.textContent = saved ? 'Tersimpan ✓' : (mine ? 'Ubah prediksi' : 'Simpan prediksi');
    }

    /* kolom kanan hero: tanggal + balapan + simpan (dibangun saat balapan berubah) */
    function renderRight() {
        if (!nextRace) { hrEl.innerHTML = ''; saveBtn = null; return; }
        var dt = raceStart(nextRace);
        var cn = (nextRace.Circuit && nextRace.Circuit.circuitName) || '';
        var timg = trackImg(cn);
        var wk = dt.toLocaleDateString('id-ID', { weekday: 'long' });
        var tm = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        hrEl.innerHTML = '<div class="pr-day"><b>' + pad(dt.getDate()) + '</b><span>/ ' + pad(dt.getMonth() + 1) + '</span></div>' +
            '<div class="pr-rn">' + esc(nextRace.raceName) + '</div>' +
            '<div class="pr-when">' + esc(wk) + ' • ' + esc(tm) + ' (waktu perangkatmu)</div>' +
            (timg ? '<img class="pr-trk" src="' + esc(timg) + '" alt="Lintasan ' + esc(cn) + '">' : '') +
            '<div><button type="button" class="pr-link" id="pr-save" disabled>Simpan prediksi</button>' +
            '<span class="pr-note">Bisa diubah sampai balapan dimulai.</span></div>';
        var ti = hrEl.querySelector('.pr-trk');
        if (ti) {
            ti.addEventListener('load', function () { probeTrack(ti); });
            ti.addEventListener('error', function () { ti.remove(); });
        }
        saveBtn = hrEl.querySelector('#pr-save');
        saveBtn.addEventListener('click', saveCurrent);
        syncSave();
        go(hrEl);
    }

    /* sisi kiri + foto + statistik: bergantung pembalap terpilih */
    function renderDriver() {
        var d = selectedId ? drivers().find(function (x) { return String(x.id) === String(selectedId); }) : null;
        var mine = nextRace ? predFor(nextRace.round) : null;
        var country = (nextRace && nextRace.Circuit && nextRace.Circuit.Location && nextRace.Circuit.Location.country) || '';
        var roundTxt = nextRace ? 'Ronde ' + nextRace.round + (totalRounds ? ' / ' + totalRounds : '') + (country ? ' • ' + country : '') : '';

        if (!nextRace) {
            var t = schedState === 'error' ? ['Jadwal belum', 'bisa dimuat'] : (schedState === 'loading' ? ['Memuat', 'jadwal…'] : ['Musim ' + YEAR, 'selesai']);
            heroEl.style.setProperty('--tc', '#888');
            carEl.innerHTML = ''; photoEl.className = 'pr-photo empty'; photoEl.innerHTML = '';
            hlEl.innerHTML = '<h2 class="pr-name"><span class="ln"><i style="--k:0">' + esc(t[0]) + '</i></span><span class="ln"><i style="--k:1">' + esc(t[1]) + '</i></span></h2>';
            statsEl.innerHTML = '<div class="pr-cell"><small>Info</small><b>' + (schedState === 'error' ? 'Periksa koneksi internet, lalu buka lagi halaman ini' : (schedState === 'loading' ? 'Mengambil jadwal balapan' : 'Terima kasih sudah ikut menebak!')) + '</b></div>';
            go(hlEl); go(statsEl);
            return;
        }

        if (!d) {                                  /* belum memilih: tampilkan info balapan */
            heroEl.style.setProperty('--tc', '#151515');
            carEl.innerHTML = ''; photoEl.className = 'pr-photo empty'; photoEl.innerHTML = '';
            hlEl.innerHTML = '<div class="pr-no"><span>' + esc(roundTxt) + '</span></div><h2 class="pr-name sm"><span class="ln"><i style="--k:0">Pilih</i></span><span class="ln"><i style="--k:1">jagoanmu</i></span></h2>';
            var loc = nextRace.Circuit && nextRace.Circuit.Location ? [nextRace.Circuit.Location.locality, nextRace.Circuit.Location.country].filter(Boolean).join(', ') : '';
            var cells0 = [['Balapan', nextRace.raceName], ['Sirkuit', (nextRace.Circuit && nextRace.Circuit.circuitName) || '—'], ['Lokasi', loc || '—'], ['Poin', 'Juara +10 • Podium +5']];
            statsEl.innerHTML = cells0.map(function (c, i) { return '<div class="pr-cell" style="--k:' + i + '"><small>' + c[0] + '</small><b>' + esc(c[1]) + '</b></div>'; }).join('');
            go(hlEl); go(statsEl);
            return;
        }

        var raw = d.raw, tc = teamColorOf(d.name), team = teamOf(d.name);
        heroEl.style.setProperty('--tc', tc);
        var carSrc = carOf(raw) || carOf(team);
        carEl.innerHTML = carSrc ? '<img src="' + esc(carSrc) + '" alt="Mobil ' + esc(d.team) + '">' : '';
        var ci = carEl.querySelector('img');
        if (ci) {
            ci.addEventListener('load', function () { cleanCar(ci); });
            ci.addEventListener('error', function () { ci.remove(); });
        }
        go(carEl);

        photoEl.className = 'pr-photo' + (d.photo ? '' : ' empty');
        photoEl.innerHTML = d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '">' : '';
        var pi = photoEl.querySelector('img');
        if (pi) { pi.addEventListener('load', function () { probePhoto(pi); }); pi.addEventListener('error', function () { photoEl.classList.add('empty'); }); }
        go(photoEl);

        var no = pick(raw, /^(number|no|num|nomor|racenumber|driver_?number)$/i);
        var parts = String(d.name).trim().split(/\s+/), first = parts.shift(), last = parts.join(' ');
        if (!last) { last = first; first = ''; }
        hlEl.innerHTML = '<div class="pr-no">' + (no ? esc(no) : '') + teamBadge(d.name, d.team, 'lg') + '<span>' + esc(d.team || '') + '</span>' +
            (mine && String(mine.driverId) === String(d.id) ? '<em class="pr-tag" style="font-style:normal">Prediksimu</em>' : '') + '</div>' +
            '<h2 class="pr-name">' + (first ? '<span class="ln"><i style="--k:0">' + esc(first) + '</i></span>' : '') + '<span class="ln"><i style="--k:1">' + esc(last) + '</i></span></h2>';
        go(hlEl);

        var cells = [['Tim', d.team || '—']];
        var extra = [['Negara', pick(raw, /country|nation|negara/i)], ['Podium', pick(raw, /podium/i)], ['Poin', pick(raw, /point|poin/i)], ['Grand Prix', pick(raw, /grand|^gp|entries|starts|balapan/i)]];
        extra.forEach(function (e) { if (e[1] !== '') cells.push(e); });
        if (cells.length < 3) cells.push(['Ronde', roundTxt || '—']);
        statsEl.innerHTML = cells.map(function (c, i) { return '<div class="pr-cell" style="--k:' + i + '"><small>' + esc(c[0]) + '</small><b>' + esc(c[1]) + '</b></div>'; }).join('');
        go(statsEl);
    }

    function renderGrid() {
        var firstDraw = !gridEl.children.length;
        gridEl.innerHTML = '';
        if (!nextRace) return;
        drivers().forEach(function (d, idx) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'pr-chip' + (String(selectedId) === String(d.id) ? ' sel' : '');
            chip.style.setProperty('--tc', teamColorOf(d.name));
            chip.style.setProperty('--i', idx);
            chip.innerHTML = (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy">' : '') +
                '<div class="pr-nm">' + esc(d.name) + '</div><div class="pr-tm">' + teamBadge(d.name, d.team) + '<span>' + esc(d.team) + '</span></div>';
            var im = chip.querySelector(':scope > img'); if (im) im.addEventListener('error', function () { im.remove(); });
            chip.addEventListener('click', function () {
                if (String(selectedId) === String(d.id)) return;
                selectedId = d.id;
                gridEl.querySelectorAll('.pr-chip').forEach(function (c) { c.classList.remove('sel'); });
                chip.classList.add('sel');
                syncSave();
                renderDriver();
                if (window.innerWidth < 900 && heroEl.scrollIntoView) heroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            gridEl.appendChild(chip);
        });
        if (!firstDraw) gridEl.classList.add('settled');
    }

    function renderRace() {
        var mine = nextRace ? predFor(nextRace.round) : null;
        if (mine && !selectedId) selectedId = mine.driverId;
        renderRight();
        renderGrid();
        renderDriver();
    }

    function saveCurrent() {
        if (!nextRace || !selectedId) return;
        if (raceStart(nextRace).getTime() <= Date.now()) { syncSave(); return; }   /* balapan sudah mulai saat halaman terbuka */
        var d = drivers().find(function (x) { return String(x.id) === String(selectedId); });
        if (!d) return;
        var preds = loadPreds();
        preds[String(nextRace.round)] = {
            round: String(nextRace.round), year: YEAR, raceName: nextRace.raceName,
            driverId: String(d.id), driverName: d.name,
            start: raceStart(nextRace).getTime(), created: Date.now()
        };
        savePreds(preds);
        syncSave();
        renderDriver();                              /* tampilkan label "Prediksimu" */
        renderScore();
    }

    /* Nilai semua tebakan yang balapannya sudah dimulai & hasilnya sudah tersedia. */
    function settle() {
        var preds = loadPreds(), now = Date.now(), hist = loadHist();
        var due = Object.keys(preds).filter(function (r) { return !preds[r].start || preds[r].start <= now; });
        if (!due.length) return;
        Promise.all(due.map(function (r) {
            var cur = preds[r];
            if (hist.some(function (x) { return String(x.round) === String(r); })) return Promise.resolve({ round: r });   /* sudah dinilai: bersihkan saja */
            return fetch(JOLPICA + (cur.year || YEAR) + '/' + r + '/results.json')
                .then(function (res) { return res.json(); })
                .then(function (j) {
                    var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                    if (!races.length || !(races[0].Results || []).length) return null;      /* hasil belum keluar */
                    var res = races[0].Results;
                    var top = res.slice(0, 3).map(function (x) { return x.Driver; });
                    var win = top[0];
                    var pts = sameDriver(cur.driverName, win) ? 10 : (top.some(function (dv) { return sameDriver(cur.driverName, dv); }) ? 5 : 0);
                    return { round: r, entry: { round: cur.round, raceName: cur.raceName, driver: cur.driverName, winner: win ? win.givenName + ' ' + win.familyName : '', points: pts, at: Date.now() } };
                })
                .catch(function () { return null; });
        })).then(function (out) {
            var h = loadHist(), p = loadPreds(), changed = false;
            out.forEach(function (o) {
                if (!o) return;
                if (o.entry && !h.some(function (x) { return String(x.round) === String(o.round); })) h.push(o.entry);
                delete p[o.round]; changed = true;
            });
            if (!changed) return;
            saveHist(h); savePreds(p);
            renderHist(); renderScore(); renderRace();
        });
    }

    function loadSchedule(cb) {
        var cached = null;
        try { var c = JSON.parse(localStorage.getItem(SCHED_KEY) || 'null'); if (c && c.y === YEAR && Date.now() - c.ts < 3600e3) cached = c.data; } catch (e) {}
        if (cached) { cb(cached, true); return; }
        fetch(JOLPICA + 'current.json')
            .then(function (r) { return r.json(); })
            .then(function (j) {
                var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                try { localStorage.setItem(SCHED_KEY, JSON.stringify({ ts: Date.now(), y: YEAR, data: races })); } catch (e) {}
                cb(races, true);
            })
            .catch(function () { cb([], false); });
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        var page = document.createElement('div');
        page.id = 'prediksi-page';
        page.className = 'page';
        page.innerHTML = '<div class="pr-wrap"><div class="pr-stage">' +
            '<div class="pr-sheet">' +
            '<header class="pr-nav"><span class="pr-burger"></span><div class="pr-logo">Formula 1<b>Prediksi</b></div>' +
            '<nav><a data-t="pr-pick" class="on">Tebak</a><a data-t="pr-hist-h">Riwayat</a></nav><div class="pr-sc" id="pr-score"></div></header>' +
            '<div class="pr-body"><div class="pr-side"><span>Tebak pemenang • Musim ' + YEAR + '</span></div>' +
            '<div class="pr-main"><div class="pr-hero" id="pr-hero">' +
            '<div class="pr-car" id="pr-car"></div><div class="pr-photo empty" id="pr-photo"></div>' +
            '<div class="pr-hl" id="pr-hl"></div><div class="pr-hr" id="pr-hr"></div>' +
            '<div class="pr-stats" id="pr-stats"></div></div></div></div></div>' +
            '<div class="pr-lower"><h3 id="pr-pick">Pilih pembalap — juara tepat +10 poin, podium +5 poin</h3><div class="pr-grid" id="pr-grid"></div>' +
            '<h3 class="second" id="pr-hist-h">Riwayat tebakan</h3><div id="pr-hist"></div></div>' +
            '</div></div>';
        var after = document.getElementById('banding-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        heroEl = page.querySelector('#pr-hero');
        carEl = page.querySelector('#pr-car');
        photoEl = page.querySelector('#pr-photo');
        hlEl = page.querySelector('#pr-hl');
        hrEl = page.querySelector('#pr-hr');
        statsEl = page.querySelector('#pr-stats');
        gridEl = page.querySelector('#pr-grid');
        histEl = page.querySelector('#pr-hist');
        scoreEl = page.querySelector('#pr-score');
        page.querySelectorAll('.pr-nav nav a').forEach(function (a) {
            a.addEventListener('click', function () {
                page.querySelectorAll('.pr-nav nav a').forEach(function (x) { x.classList.remove('on'); });
                a.classList.add('on');
                var t = page.querySelector('#' + a.getAttribute('data-t'));
                if (t && t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        /* menu "Prediksi" di navbar situs: coba ulang kalau navbar belum siap */
        function addMenu() {
            var menu = document.getElementById('nav-menu');
            if (!menu) return false;
            if (menu.querySelector('[data-prediksi]')) return true;
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-prediksi onclick="showPage(\'prediksi-page\'); return false;">Prediksi</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var bd = links.find(function (l) { return /bandingkan/i.test(l.textContent); });
            if (bd) bd.after(li); else menu.appendChild(li);
            return true;
        }
        if (!addMenu()) {
            var tries = 0, iv = setInterval(function () { if (addMenu() || ++tries > 20) clearInterval(iv); }, 500);
        }

        renderHist(); renderScore(); renderDriver();
        loadSchedule(function (races, ok) {
            var now = Date.now();
            nextRace = null;
            totalRounds = races.length;
            races.forEach(function (r) {
                if (!nextRace && raceStart(r).getTime() > now) nextRace = r;
            });
            schedState = ok ? 'done' : 'error';
            renderRace();
            settle();
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();