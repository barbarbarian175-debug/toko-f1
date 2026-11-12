/* =========================================================
   PUSAT LIVE — posisi balapan dari OpenF1 (gratis, tanpa key)
   Desain: timing tower ala siaran TV (datar, tipis, 1 warna aksen).
   - Lintasan sirkuit selalu terlihat (sticky di desktop & mobile),
     warna kartu menyesuaikan otomatis dengan gambar lintasan.
   - Animasi: reveal lintasan, stagger baris, flash naik/turun posisi,
     bar rating/ban, hitung angka. Hormati "reduced motion".
   - Refresh otomatis tiap 30 detik selama halaman Live aktif.
   ========================================================= */
(function () {
    'use strict';

    var OPENF1 = 'https://api.openf1.org/v1/';
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
    var TRACKS = [
        [/albert/, 'albert-park'], [/hermanos|mexico city/, 'mexico'], [/baku/, 'baku'], [/barcelona|catalunya/, 'barcelona'],
        [/monaco/, 'monaco'], [/spa-franc|spa franc/, 'spa'], [/villeneuve|montreal/, 'montreal'], [/americas/, 'cota'],
        [/zandvoort/, 'zandvoort'], [/hungaroring/, 'hungaroring'], [/carlos pace|interlagos/, 'interlagos'], [/las vegas/, 'las-vegas'],
        [/lusail/, 'lusail'], [/madring/, 'madring'], [/marina bay/, 'marina-bay'], [/miami/, 'miami'], [/monza/, 'monza'], [/red bull ring/, 'red-bull-ring'], [/shanghai/, 'shanghai'], [/silverstone/, 'silverstone'], [/suzuka/, 'suzuka'],
        [/yas marina/, 'yas-marina'], [/bahrain/, 'bahrain'], [/jeddah/, 'jeddah']
    ];
    function trackImg(name) {
        var n = norm(name || '');
        var hit = TRACKS.find(function (pair) { return pair[0].test(n); });
        if (hit) return 'assets/images/circuits/' + hit[1] + '.png';
        if (typeof circuitImages !== 'undefined') {
            var key = Object.keys(circuitImages).find(function (k) { return norm(k) === n; });
            if (key) return 'assets/images/circuits/' + circuitImages[key] + '.png';
        }
        return '';
    }
    /* Cadangan: cari gambar lintasan dari data sirkuit situs (field apa pun yang mengandung img/track/layout). */
    function trackFromSite(c) {
        if (!c) return '';
        var k = Object.keys(c).find(function (x) { return /img|image|track|layout|map|lintasan/i.test(x) && typeof c[x] === 'string' && /\.(png|jpe?g|webp|avif|svg)/i.test(c[x]); });
        return k ? c[k] : '';
    }
    function siteCircuit(session) {
        if (typeof circuitsData === 'undefined') return null;
        var short = norm(session.circuit_short_name || ''), loc = norm(session.location || ''), ctry = norm(session.country_name || '');
        var best = null, bestScore = 0;
        circuitsData.forEach(function (c) {
            var score = 0;
            var nm = norm(c.name), gp = norm(c.gp || ''), city = norm(c.city || ''), co = norm(c.country || '');
            if (short && (nm.indexOf(short) !== -1 || short.indexOf(nm) !== -1)) score += 3;
            if (loc && city && (city === loc || city.indexOf(loc) !== -1 || loc.indexOf(city) !== -1)) score += 2;
            if (ctry && co && (co === ctry || co.indexOf(ctry) !== -1 || ctry.indexOf(co) !== -1)) score += 1;
            if (short && gp.indexOf(short) !== -1) score += 2;
            if (score > bestScore) { bestScore = score; best = c; }
        });
        return bestScore > 0 ? best : null;
    }
    /* OpenF1 membatasi laju; balasan error berupa objek, bukan array. Pastikan selalu array. */
    function getArr(url, strict) {
        return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (j) { if (!Array.isArray(j)) throw new Error('bukan array'); return j; })
            .catch(function (e) { if (strict) throw e; return []; });
    }
    var TYRE = {
        SOFT: { c: '#e10600', label: 'SOFT', s: 'S' }, MEDIUM: { c: '#f5c518', label: 'MEDIUM', s: 'M' }, HARD: { c: '#e8e8e8', label: 'HARD', s: 'H' },
        INTERMEDIATE: { c: '#4ed17a', label: 'INTER', s: 'I' }, WET: { c: '#2f7de1', label: 'WET', s: 'W' }
    };

    /* ---------------------------------------------------------
       DATA PREVIEW ala Pirelli (per sirkuit). Kunci = nama pendek sirkuit
       dari OpenF1 (huruf kecil, tanpa aksen). Tambah entri baru di sini.
       ratings: 1-5. press = tekanan awal minimum (psi).
       --------------------------------------------------------- */
    var PIRELLI_DATA = {
        'imola': {
            ratings: { traction: 2, braking: 3, evolution: 3, grip: 2, lateral: 3, stress: 3, abrasion: 3, downforce: 3 },
            laps: 63, record: '1:15.484', recordBy: 'Lewis Hamilton (2020)', compounds: ['C3', 'C4', 'C5'],
            press: { front: '24.5', rear: '21.5' }, name: 'Autodromo Enzo e Dino Ferrari'
        }
    };
    var RATE_ROWS = [
        ['traction', 'Traction'], ['braking', 'Braking'], ['evolution', 'Track Evolution'], ['grip', 'Asphalt Grip'],
        ['lateral', 'Lateral'], ['stress', 'Tyre Stress'], ['abrasion', 'Asphalt Abrasion'], ['downforce', 'Downforce']
    ];
    var CAR_FILE = /\.(png|jpe?g|webp|avif|svg)(\?.*)?$/i;
    function carOf(obj) {
        if (!obj || typeof obj !== 'object') return '';
        var keys = Object.keys(obj);
        var k = keys.find(function (x) { return /car|mobil|livery|bolide/i.test(x) && typeof obj[x] === 'string' && (CAR_FILE.test(obj[x]) || obj[x].indexOf('/') !== -1); });
        return k ? obj[k] : '';
    }
    function siteDriver(fullName) {
        if (typeof driversData === 'undefined') return null;
        var n = norm(fullName);
        var id = Object.keys(driversData).find(function (k) { return norm(driversData[k].name) === n; });
        return id ? driversData[id] : null;
    }
    function siteTeam(driverName, teamName) {
        if (typeof teamsData === 'undefined') return null;
        var n = norm(driverName), tn = norm(teamName);
        var t = teamsData.find(function (x) { return (x.drivers || []).some(function (d) { return norm(d) === n; }); });
        if (t) return t;
        return teamsData.find(function (x) { var nm = norm(x.name), fl = norm(x.full || ''); return tn && (nm === tn || tn.indexOf(nm) !== -1 || nm.indexOf(tn) !== -1 || (fl && (fl.indexOf(tn) !== -1 || tn.indexOf(fl) !== -1))); }) || null;
    }
    function carFor(d) {
        var drv = siteDriver(d.full_name || ''), team = siteTeam(d.full_name || '', d.team_name || '');
        return carOf(drv) || carOf(team) || '';
    }
    function teamColor(d) {
        var c = d && d.team_colour;
        if (!c) return '#777';
        return /^#/.test(c) ? c : '#' + c;
    }
    function fmtLap(sec) {
        sec = Number(sec);
        if (!sec || sec <= 0) return '—';
        var m = Math.floor(sec / 60), s = (sec - m * 60).toFixed(3);
        return m > 0 ? m + ':' + (Number(s) < 10 ? '0' : '') + s : s;
    }
    var meetingCache = {}, selDrv = null, lastArgs = null;

    /* ------------------------- STYLE ------------------------- */
    var css = document.createElement('style');
    css.textContent = `
        .lv-wrap { --ink: #f2f0ea; --mut: #8b8a90; --ln: #26262b; --pn: #17171a; --ac: #e10600; --lv-top: 12px;
            max-width: 1180px; margin: 0 auto; padding: 8px 16px 60px; color: var(--ink); text-align: left; }
        .lv-wrap * { box-sizing: border-box; }
        .lv-cond { font-family: var(--f-head, 'Barlow Condensed', sans-serif); }
        .lv-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; }
        .lv-stage { background: #0f0f11; border: 1px solid var(--ln); border-radius: 14px; padding: 26px 26px 30px; }

        /* header */
        .lv-hd { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; padding-bottom: 18px; border-bottom: 1px solid var(--ln); position: relative; }
        .lv-hd::after { content: ''; position: absolute; left: 0; bottom: -1px; height: 2px; width: 72px; background: var(--ac); }
        .lv-eyebrow { font-size: .78rem; color: var(--mut); letter-spacing: .04em; }
        .lv-title { margin: 4px 0 12px; font-weight: 700; font-size: clamp(2rem, 5.4vw, 3.5rem); line-height: .98; text-transform: uppercase; letter-spacing: .01em; }
        .lv-chips { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .lv-chip { padding: 5px 11px; border-radius: 6px; background: var(--pn); border: 1px solid var(--ln); font-size: .8rem; color: #d9d7d0; }
        .lv-badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 6px; font-size: .78rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
        .lv-badge.live { background: var(--ac); color: #fff; }
        .lv-badge.live i { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: lvpulse 1.4s ease-out infinite; }
        .lv-badge.done { background: #26262b; color: #bdbbc2; }
        .lv-badge.next { background: #2457d6; color: #fff; }
        .lv-refresh { padding: 9px 16px; border-radius: 8px; border: 1px solid #3a3a41; background: transparent; color: var(--ink); font: 600 .84rem var(--f-body, 'Inter', sans-serif); cursor: pointer; transition: background .2s, border-color .2s, transform .15s; }
        .lv-refresh:hover { background: #1d1d21; border-color: var(--ac); }
        .lv-refresh:active { transform: scale(.96); }
        .lv-refresh.spin b { display: inline-block; animation: lvspin .7s linear; }

        /* layout */
        .lv-main { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 26px; margin-top: 24px; align-items: start; }
        .lv-left { position: sticky; top: var(--lv-top); }

        /* kartu lintasan — selalu terlihat */
        .lv-trackcard { position: relative; border-radius: 12px; padding: 16px 18px 14px; border: 1px solid var(--ln); background: var(--pn); transition: background .4s; }
        .lv-trackcard.light { background: #ece8dd; color: #15151a; border-color: #d6d1c2; }
        .lv-tc-top { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; color: var(--mut); }
        .lv-trackcard.light .lv-tc-top { color: #6b675c; }
        .lv-tc-name { font-weight: 700; color: var(--ink); letter-spacing: .02em; text-align: right; }
        .lv-trackcard.light .lv-tc-name { color: #15151a; }
        .lv-tc-art { position: relative; margin: 14px 0 6px; min-height: 210px; display: flex; align-items: center; justify-content: center; overflow: hidden; animation: lvbreathe 5s ease-in-out 2.4s infinite; }
        .lv-tc-art img { width: 100%; max-height: 400px; object-fit: contain; opacity: 0; }
        .lv-trackcard.ready .lv-tc-art img { opacity: 1; animation: lvreveal 2.2s cubic-bezier(.6, .1, .2, 1) both; }
        .lv-tc-art img.inv { filter: invert(1); }
        .lv-trackcard.light img.opq { mix-blend-mode: multiply; }
        .lv-trackcard:not(.light) img.opq { mix-blend-mode: screen; }
        .lv-scan { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: var(--ac); box-shadow: 0 0 16px var(--ac); opacity: 0; pointer-events: none; }
        .lv-trackcard.ready .lv-scan { animation: lvscan 2.2s cubic-bezier(.6, .1, .2, 1) both; }
        .lv-notrack { text-align: center; padding: 40px 10px; }
        .lv-notrack b { display: block; font-size: 1.6rem; text-transform: uppercase; line-height: 1.1; }
        .lv-notrack span { display: block; margin-top: 8px; color: var(--mut); font-size: .8rem; }
        .lv-tc-meta { font-size: .78rem; color: var(--mut); text-align: center; min-height: 1em; }
        .lv-trackcard.light .lv-tc-meta { color: #6b675c; }
        .lv-sectors { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
        .lv-sec { padding: 8px 10px; border-radius: 8px; background: var(--pn); border: 1px solid var(--ln); border-top: 2px solid #5b3bd6; }
        .lv-sec:nth-child(2) { border-top-color: #1fa862; } .lv-sec:nth-child(3) { border-top-color: #e8a317; }
        .lv-sec small { display: block; color: var(--mut); font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; }
        .lv-sec b { font-size: .95rem; font-weight: 600; }

        /* kanan */
        .lv-flag { display: flex; gap: 10px; align-items: center; padding: 11px 14px; border-radius: 10px; font-size: .88rem; background: var(--pn); border: 1px solid var(--ln); border-left: 4px solid var(--fc, #777); margin-bottom: 14px; animation: lvslide .5s ease both; }
        .lv-flag b { text-transform: uppercase; color: var(--fc, #ddd); white-space: nowrap; }
        .lv-drv { display: flex; align-items: center; gap: 16px; padding: 12px 18px 12px 6px; margin-bottom: 14px; border-radius: 12px; background: var(--pn); border: 1px solid var(--ln); border-left: 4px solid var(--tc, #777); overflow: hidden; min-height: 96px; }
        .lv-drv.swap .lv-drv-car, .lv-drv.swap .lv-drv-info { animation: lvslide .5s cubic-bezier(.2, .8, .2, 1) both; }
        .lv-drv-car { width: 42%; max-width: 250px; flex: none; }
        .lv-drv-car img { width: 100%; max-height: 110px; object-fit: contain; filter: drop-shadow(0 8px 14px rgba(0, 0, 0, .6)); }
        .lv-drv-info { min-width: 0; padding-left: 8px; }
        .lv-drv-pos { font-size: 2.6rem; font-weight: 700; line-height: 1; color: var(--tc, #fff); }
        .lv-drv-name { font-weight: 700; font-size: 1.1rem; margin-top: 4px; }
        .lv-drv-team { color: var(--mut); font-size: .82rem; }
        .lv-table { width: 100%; border-collapse: separate; border-spacing: 0 3px; }
        .lv-table th { padding: 4px 12px; font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--mut); font-weight: 600; text-align: left; }
        .lv-table td { padding: 10px 12px; background: var(--pn); font-size: .92rem; transition: background .2s; }
        .lv-table td:first-child { border-radius: 8px 0 0 8px; box-shadow: inset 4px 0 0 var(--tc, #777); }
        .lv-table td:last-child { border-radius: 0 8px 8px 0; }
        .lv-table tbody tr { cursor: pointer; }
        .lv-table tbody tr:hover td { background: #1f1f24; }
        .lv-table tbody tr.sel td { background: #24201f; }
        .lv-table tbody tr.sel td:first-child { box-shadow: inset 4px 0 0 var(--ac); }
        .lv-table tbody tr.gain td { animation: lvgain 1.6s ease-out; }
        .lv-table tbody tr.loss td { animation: lvloss 1.6s ease-out; }
        .lv-pos { font-weight: 700; width: 52px; padding-left: 18px !important; }
        .lv-mv { font-size: .6rem; margin-left: 4px; }
        .lv-mv.u { color: #4ed17a; } .lv-mv.d { color: #ff5a4f; }
        .lv-acr { display: inline-block; min-width: 42px; margin-right: 10px; font-weight: 700; font-size: .82rem; letter-spacing: .04em; color: var(--tc, #fff); }
        .lv-nm { color: #d9d7d0; }
        .lv-tm { color: var(--mut); font-size: .84rem; }
        .lv-tyre { display: inline-block; min-width: 24px; padding: 2px 7px; border-radius: 999px; font-size: .72rem; font-weight: 800; text-align: center; color: #111; }
        .lv-tyre.dark { color: #fff; }
        .lv-lap, .lv-gap { text-align: right; }
        .lv-gap { color: #d9d7d0; }
        .lv-gap.lead { color: var(--ac); font-weight: 700; }
        .lv-msg { padding: 22px; text-align: center; color: var(--mut); border: 1px dashed #34343b; border-radius: 12px; }
        .lv-upd { color: var(--mut); font-size: .78rem; margin-top: 12px; }

        /* detail */
        .lv-detail { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 26px; padding-top: 24px; border-top: 1px solid var(--ln); }
        .lv-card { padding: 16px 18px 18px; border-radius: 12px; background: var(--pn); border: 1px solid var(--ln); transition: border-color .25s, transform .25s; }
        .lv-card:hover { border-color: #3d3d45; transform: translateY(-2px); }
        .lv-card h4 { margin: 0 0 14px; font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--mut); }
        .lv-rate { display: grid; grid-template-columns: 1fr 110px 26px; gap: 10px; align-items: center; margin-bottom: 9px; font-size: .84rem; }
        .lv-bar { display: flex; gap: 3px; }
        .lv-seg { height: 8px; flex: 1; background: #2a2a30; border-radius: 2px; }
        .lv-seg.on { background: var(--ac); }
        .lv-rv { text-align: right; color: var(--mut); font-size: .78rem; }
        .lv-nodata { color: var(--mut); font-size: .76rem; margin-top: 10px; line-height: 1.4; }
        .lv-stat { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--ln); }
        .lv-stat:last-child { border-bottom: 0; }
        .lv-stat .l { color: var(--mut); font-size: .8rem; }
        .lv-stat .v { font-size: 1.15rem; font-weight: 600; }
        .lv-stat .v small { font-size: .68rem; color: var(--mut); margin-left: 3px; }
        .lv-stat .s { display: block; color: var(--mut); font-size: .68rem; text-align: right; font-weight: 400; }
        .lv-cp { display: grid; grid-template-columns: 12px 36px 1fr auto; gap: 10px; align-items: center; margin-bottom: 12px; font-size: .86rem; }
        .lv-cp i { width: 12px; height: 12px; border-radius: 50%; background: var(--cc); }
        .lv-cp .t { height: 8px; background: #2a2a30; border-radius: 4px; overflow: hidden; }
        .lv-cp .t u { display: block; height: 100%; width: var(--w); background: var(--cc); border-radius: 4px; transform-origin: left; transition: width .8s cubic-bezier(.2, .8, .2, 1); }
        .lv-cp .ct { color: var(--mut); font-size: .78rem; }
        .lv-big { font-size: 2.2rem; line-height: 1; font-weight: 300; }
        .lv-big b { font-weight: 700; }
        .lv-kv { margin-top: 14px; }
        .lv-kv small { display: block; color: var(--mut); font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 4px; }
        .lv-pair { display: flex; gap: 26px; }
        .lv-pair div { font-weight: 600; font-size: 1.4rem; line-height: 1; }
        .lv-pair em { display: block; font-style: normal; font-size: .68rem; color: var(--mut); margin-top: 4px; font-weight: 500; }

        /* animasi masuk — hanya saat sesi pertama kali dirender */
        .lv-first .lv-hd > div { animation: lvrise .6s cubic-bezier(.2, .8, .2, 1) both; }
        .lv-first .lv-hd::after { animation: lvline .9s ease-out .2s both; }
        .lv-first .lv-sec { animation: lvrise .5s ease both; }
        .lv-first .lv-sec:nth-child(2) { animation-delay: .1s; } .lv-first .lv-sec:nth-child(3) { animation-delay: .2s; }
        .lv-first .lv-table tbody tr { animation: lvrise .45s cubic-bezier(.2, .8, .2, 1) both; animation-delay: calc(var(--i) * 32ms + .15s); }
        .lv-first .lv-drv { animation: lvrise .5s ease .1s both; }
        .lv-first .lv-card { animation: lvrise .6s cubic-bezier(.2, .8, .2, 1) both; }
        .lv-first .lv-card:nth-child(2) { animation-delay: .1s; } .lv-first .lv-card:nth-child(3) { animation-delay: .2s; } .lv-first .lv-card:nth-child(4) { animation-delay: .3s; }
        .lv-first .lv-seg.on { animation: lvseg .45s ease both; animation-delay: var(--d); }
        .lv-first .lv-cp .t u { animation: lvgrow 1s cubic-bezier(.2, .8, .2, 1) .3s both; }

        @keyframes lvrise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes lvslide { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: none; } }
        @keyframes lvline { from { width: 0; } to { width: 72px; } }
        @keyframes lvseg { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: none; } }
        @keyframes lvgrow { from { transform: scaleX(0); } to { transform: none; } }
        @keyframes lvreveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes lvscan { 0% { left: 0; opacity: 1; } 96% { opacity: 1; } 100% { left: calc(100% - 2px); opacity: 0; } }
        @keyframes lvbreathe { 0%, 100% { filter: drop-shadow(0 0 0 rgba(225, 6, 0, 0)); } 50% { filter: drop-shadow(0 0 10px rgba(225, 6, 0, .35)); } }
        @keyframes lvpulse { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, .7); } 100% { box-shadow: 0 0 0 9px rgba(255, 255, 255, 0); } }
        @keyframes lvspin { to { transform: rotate(360deg); } }
        @keyframes lvgain { 0% { background: rgba(78, 209, 122, .45); } 100% { background: var(--pn); } }
        @keyframes lvloss { 0% { background: rgba(255, 90, 79, .4); } 100% { background: var(--pn); } }

        @media (max-width: 900px) {
            .lv-main { grid-template-columns: 1fr; gap: 16px; }
            /* mobile: lintasan tetap menempel di atas saat tabel di-scroll */
            .lv-left { z-index: 5; background: #0f0f11; padding: 0 0 8px; margin: 0 -4px; }
            .lv-tc-art { min-height: 0; margin: 8px 0 2px; }
            .lv-tc-art img { max-height: 21vh; }
            .lv-trackcard { padding: 10px 14px 8px; }
            .lv-sectors { margin-top: 6px; }
        }
        @media (max-width: 640px) {
            .lv-stage { padding: 16px 14px 22px; }
            .lv-hide-sm { display: none; }
            .lv-table td { padding: 9px 8px; } .lv-pos { padding-left: 14px !important; }
            .lv-drv-car { width: 38%; }
        }
        @media (prefers-reduced-motion: reduce) {
            .lv-wrap *, .lv-wrap *::before, .lv-wrap *::after { animation: none !important; transition: none !important; }
            .lv-trackcard.ready .lv-tc-art img { opacity: 1; }
        }`;
    document.head.appendChild(css);

    /* ------------------------- STATE ------------------------- */
    var page = null, stageEl = null, bodyEl = null, headEl = null, flagEl = null, updEl = null, trackEl = null, secEl = null, drvEl = null, detailEl = null;
    var timer = null, lastSessionKey = null;
    var renderedKey = null, firstT = null, trackKey = null, prevPos = {}, lastSelKey = null;

    function latestBy(arr, keyFn) {
        var map = {};
        arr.forEach(function (x) {
            var k = keyFn(x), t = new Date(x.date || 0).getTime();
            if (!map[k] || t > map[k]._t) map[k] = Object.assign({}, x, { _t: t });
        });
        return map;
    }
    function fmtDateTime(d) {
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    function fmtGap(v) {
        if (v == null || v === '') return '—';
        if (isNaN(Number(v))) return String(v);
        return '+' + Number(v).toFixed(3);
    }
    function countUp(root) {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        Array.prototype.forEach.call(root.querySelectorAll('[data-count]'), function (el) {
            var to = parseFloat(el.getAttribute('data-count')), dec = Number(el.getAttribute('data-dec') || 0), t0 = null;
            if (isNaN(to)) return;
            function step(ts) {
                if (!t0) t0 = ts;
                var p = Math.min((ts - t0) / 1100, 1), e = 1 - Math.pow(1 - p, 3);
                el.textContent = (to * e).toFixed(dec);
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    /* Warna kartu lintasan menyesuaikan gambar supaya lintasan SELALU terlihat. */
    function themeTrack(img, card) {
        try {
            var w = 64, h = 64, c = document.createElement('canvas');
            c.width = w; c.height = h;
            var x = c.getContext('2d');
            x.drawImage(img, 0, 0, w, h);
            var d = x.getImageData(0, 0, w, h).data, sum = 0, n = 0;
            for (var i = 0; i < d.length; i += 4) {
                if (d[i + 3] > 40) { sum += d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114; n++; }
            }
            if (n / (w * h) > .9) {                       /* gambar tanpa transparansi: lihat warna latar */
                var bg = d[0] * .299 + d[1] * .587 + d[2] * .114;
                img.classList.add('opq');
                if (bg > 128) card.classList.add('light');
            } else if (n > 20) {
                if (sum / n < 128) card.classList.add('light');   /* garis gelap -> kartu terang */
            } else img.classList.add('inv');
        } catch (e) { img.classList.add('inv'); }         /* canvas diblokir (file://) -> perilaku lama */
        card.classList.add('ready');
    }
    function setTrack(session, circ, name) {
        var src = trackImg(session.circuit_short_name || (circ && circ.name) || '') || trackFromSite(circ);
        var key = (src || '') + '|' + name;
        if (key === trackKey) return;
        trackKey = key;
        var meta = [];
        var lenKm = circ && circ.length ? parseFloat(String(circ.length).replace(',', '.')) : NaN;
        if (lenKm > 100) lenKm = lenKm / 1000;
        if (lenKm) meta.push(lenKm.toFixed(3) + ' km');
        if (circ && circ.turns) meta.push(circ.turns + ' tikungan');
        trackEl.className = 'lv-trackcard';
        trackEl.innerHTML = '<div class="lv-tc-top"><span>Lintasan</span><span class="lv-tc-name lv-cond">' + esc(name) + '</span></div>' +
            '<div class="lv-tc-art">' + (src ? '<img alt="Lintasan ' + esc(name) + '">' : '<div class="lv-notrack"><b class="lv-cond">' + esc(name) + '</b><span>Gambar lintasan belum tersedia</span></div>') + '<i class="lv-scan"></i></div>' +
            '<div class="lv-tc-meta">' + esc(meta.join(' • ')) + '</div>';
        var img = trackEl.querySelector('img');
        if (img) {
            img.addEventListener('load', function () { themeTrack(img, trackEl); });
            img.addEventListener('error', function () {
                trackEl.querySelector('.lv-tc-art').innerHTML = '<div class="lv-notrack"><b class="lv-cond">' + esc(name) + '</b><span>Gambar lintasan tidak ditemukan</span></div>';
                trackEl.classList.add('ready');
            });
            img.src = src;
        } else trackEl.classList.add('ready');
    }

    /* ------------------------- RENDER ------------------------- */
    function render(session, positions, drivers, intervals, rc, stints, laps) {
        lastArgs = [session, positions, drivers, intervals, rc, stints, laps];
        var sKey = session.session_key;
        if (sKey !== renderedKey) {
            renderedKey = sKey; prevPos = {}; lastSelKey = null;
            stageEl.classList.add('lv-first');
            clearTimeout(firstT);
            firstT = setTimeout(function () { stageEl.classList.remove('lv-first'); }, 3400);
        }
        var firstPaint = stageEl.classList.contains('lv-first');

        var now = Date.now();
        var start = session.date_start ? new Date(session.date_start).getTime() : null;
        var end = session.date_end ? new Date(session.date_end).getTime() : null;
        var status = 'done', label = 'Selesai';
        if (start && now < start) { status = 'next'; label = 'Akan datang'; }
        else if (start && end && now >= start && now <= end) { status = 'live'; label = 'Berlangsung'; }
        else if (start && !end && now >= start) { status = 'live'; label = 'Berlangsung'; }
        var badge = '<span class="lv-badge ' + status + '">' + (status === 'live' ? '<i></i>' : '') + label + '</span>';

        /* data turunan */
        var lapMap = {}, curLap = 0, bestLap = null, bestSec = [null, null, null];
        var drvMap = {};
        drivers.forEach(function (d) { drvMap[d.driver_number] = d; });
        (laps || []).forEach(function (l) {
            var n = Number(l.lap_number) || 0;
            if (n > (lapMap[l.driver_number] || 0)) lapMap[l.driver_number] = n;
            if (n > curLap) curLap = n;
            var t = Number(l.lap_duration);
            if (t > 0 && (!bestLap || t < bestLap.t)) bestLap = { t: t, drv: l.driver_number };
            [1, 2, 3].forEach(function (i) {
                var s = Number(l['duration_sector_' + i]);
                if (s > 0 && (bestSec[i - 1] == null || s < bestSec[i - 1])) bestSec[i - 1] = s;
            });
        });
        var posMap = latestBy(positions, function (x) { return x.driver_number; });
        var intMap = latestBy(intervals, function (x) { return x.driver_number; });
        var stintMap = {};
        (stints || []).forEach(function (s) {
            var cur = stintMap[s.driver_number];
            if (!cur || (Number(s.lap_end) || 0) > (Number(cur.lap_end) || 0)) stintMap[s.driver_number] = s;
        });
        var rows = Object.keys(posMap).map(function (k) { return posMap[k]; })
            .sort(function (a, b) { return (a.position || 99) - (b.position || 99); });
        var selRow = rows.find(function (r) { return String(r.driver_number) === String(selDrv); }) || rows[0] || null;
        var selD = selRow ? (drvMap[selRow.driver_number] || {}) : null;

        var compCount = {};
        rows.forEach(function (r) {
            var st = stintMap[r.driver_number];
            if (st && st.compound) { var c = String(st.compound).toUpperCase(); compCount[c] = (compCount[c] || 0) + 1; }
        });

        var circ = siteCircuit(session);
        var P = PIRELLI_DATA[norm(session.circuit_short_name || '')] || null;
        var meetName = meetingCache[session.meeting_key] || '';
        var eyebrow = (meetName || ('Formula 1 ' + (session.country_name || ''))).replace(/\s*20\d\d\s*$/, '');
        var cname = (P && P.name) || (circ && circ.name) || session.circuit_short_name || 'Sirkuit';
        var lenKm = circ && circ.length ? parseFloat(String(circ.length).replace(',', '.')) : NaN;
        if (lenKm > 100) lenKm = lenKm / 1000;
        var totalLaps = P && P.laps ? P.laps : ((status === 'done' && /race/i.test(session.session_name || '') && curLap) ? curLap : null);
        var dist = (totalLaps && lenKm) ? (totalLaps * lenKm) : null;

        /* header */
        headEl.innerHTML = '<div><div class="lv-eyebrow">' + esc(eyebrow) + (session.country_name ? ' • ' + esc(session.country_name) : '') + '</div>' +
            '<h2 class="lv-title lv-cond">' + esc(session.location || session.circuit_short_name || 'Pusat Live') + '</h2>' +
            '<div class="lv-chips">' + badge + '<span class="lv-chip">' + esc(session.session_name || 'Sesi') + '</span>' +
            (start ? '<span class="lv-chip">' + esc(fmtDateTime(new Date(start))) + '</span>' : '') + '</div></div>' +
            '<button type="button" class="lv-refresh" id="lv-refresh"><b>⟳</b> Refresh</button>';
        var rb = headEl.querySelector('#lv-refresh');
        if (rb) rb.addEventListener('click', function () { rb.classList.add('spin'); load(true); });

        /* lintasan (dibangun sekali per sirkuit) + sektor */
        setTrack(session, circ, cname);
        secEl.innerHTML = [1, 2, 3].map(function (i) {
            return '<div class="lv-sec"><small>Sektor ' + i + '</small><b class="lv-mono">' + (bestSec[i - 1] ? bestSec[i - 1].toFixed(3) : '—') + '</b></div>';
        }).join('');

        /* bendera */
        if (rc && rc.length) {
            var last = rc.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); }).pop();
            var flag = String(last.flag || '').toUpperCase();
            var color = flag === 'RED' ? '#e10600' : flag === 'YELLOW' ? '#f5c518' : flag === 'GREEN' ? '#4ed17a' : flag === 'BLUE' ? '#2f7de1' : '#bdbbc2';
            flagEl.hidden = false;
            flagEl.style.setProperty('--fc', color);
            flagEl.innerHTML = '<b>' + esc(flag || 'Info') + '</b><span>' + esc(last.message || '') + '</span>';
        } else flagEl.hidden = true;

        /* kartu pembalap terpilih */
        if (selRow) {
            var carSrc = carFor(selD), selKey = String(selRow.driver_number);
            var swap = lastSelKey !== null && lastSelKey !== selKey;
            lastSelKey = selKey;
            var iv0 = intMap[selRow.driver_number];
            drvEl.className = 'lv-drv' + (swap ? ' swap' : '');
            drvEl.style.setProperty('--tc', teamColor(selD));
            drvEl.innerHTML = '<div class="lv-drv-car">' + (carSrc ? '<img src="' + esc(carSrc) + '" alt="Mobil">' : '') + '</div>' +
                '<div class="lv-drv-info"><div class="lv-drv-pos lv-cond">P' + esc(selRow.position) + '</div>' +
                '<div class="lv-drv-name">' + esc(selD.full_name || ('Pembalap #' + selRow.driver_number)) + '</div>' +
                '<div class="lv-drv-team">' + esc(selD.team_name || '') + (iv0 && selRow.position !== 1 ? ' • <span class="lv-mono">' + esc(fmtGap(iv0.gap_to_leader)) + '</span>' : '') + '</div></div>';
            var im = drvEl.querySelector('img');
            if (im) im.addEventListener('error', function () { im.remove(); });
            drvEl.hidden = false;
        } else drvEl.hidden = true;

        /* tabel posisi */
        if (!rows.length) {
            bodyEl.innerHTML = '<div class="lv-msg">Belum ada data posisi untuk sesi ini.</div>';
        } else {
            var newPos = {};
            bodyEl.innerHTML = '<table class="lv-table"><thead><tr><th>Pos</th><th>Pembalap</th><th class="lv-hide-sm">Tim</th><th>Ban</th><th style="text-align:right">Lap</th><th style="text-align:right">Gap</th></tr></thead><tbody>' +
                rows.map(function (r, idx) {
                    var d = drvMap[r.driver_number] || {};
                    var iv = intMap[r.driver_number];
                    var lead = r.position === 1;
                    var gap = lead ? (iv ? 'Leader' : null) : (iv ? iv.gap_to_leader : null);
                    var st = stintMap[r.driver_number];
                    var tyre = '—';
                    if (st && st.compound) {
                        var t = TYRE[String(st.compound).toUpperCase()] || { c: '#888', label: String(st.compound), s: '?' };
                        var age = (lapMap[r.driver_number] || 0) - (Number(st.lap_start) || 0);
                        var dark = ['#e10600', '#2f7de1', '#4ed17a'].indexOf(t.c) !== -1;
                        tyre = '<span class="lv-tyre' + (dark ? ' dark' : '') + '" style="background:' + t.c + '" title="' + esc(t.label) + (age > 0 ? ' • ' + age + ' lap' : '') + '">' + esc(t.s) + '</span>';
                    }
                    var prev = prevPos[r.driver_number], cls = '', mv = '';
                    if (prev != null && prev !== r.position) {
                        cls = prev > r.position ? 'gain' : 'loss';
                        mv = '<span class="lv-mv ' + (cls === 'gain' ? 'u' : 'd') + '">' + (cls === 'gain' ? '▲' : '▼') + '</span>';
                    }
                    newPos[r.driver_number] = r.position;
                    var isSel = selRow && String(selRow.driver_number) === String(r.driver_number);
                    if (isSel) cls += ' sel';
                    return '<tr data-n="' + esc(r.driver_number) + '" class="' + cls + '" style="--i:' + idx + ';--tc:' + esc(teamColor(d)) + '"><td class="lv-pos lv-cond">' + esc(r.position) + mv + '</td>' +
                        '<td><span class="lv-acr lv-cond">' + esc(d.name_acronym || ('#' + r.driver_number)) + '</span><span class="lv-nm">' + esc(d.full_name || ('Pembalap #' + r.driver_number)) + '</span></td>' +
                        '<td class="lv-hide-sm lv-tm">' + esc(d.team_name || '—') + '</td>' +
                        '<td>' + tyre + '</td>' +
                        '<td class="lv-lap lv-mono">' + (lapMap[r.driver_number] || '—') + '</td>' +
                        '<td class="lv-gap lv-mono' + (lead && iv ? ' lead' : '') + '">' + esc(lead && iv ? 'LEADER' : fmtGap(gap)) + '</td></tr>';
                }).join('') + '</tbody></table>';
            prevPos = newPos;
        }
        updEl.textContent = 'Diperbarui ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + (status === 'live' ? ' • otomatis tiap 30 detik' : '') + ' • ketuk baris untuk ganti pembalap';

        /* detail sirkuit */
        var rt = P ? P.ratings : null;
        var rates = RATE_ROWS.map(function (r, ri) {
            var v = rt ? rt[r[0]] : 0;
            var segs = [1, 2, 3, 4, 5].map(function (n) { return '<i class="lv-seg' + (n <= v ? ' on' : '') + '" style="--d:' + (ri * 70 + n * 70) + 'ms"></i>'; }).join('');
            return '<div class="lv-rate"><span>' + r[1] + '</span><div class="lv-bar">' + segs + '</div><span class="lv-rv lv-mono">' + (rt ? v + '/5' : '—') + '</span></div>';
        }).join('');
        var recVal = P && P.record ? P.record : (bestLap ? fmtLap(bestLap.t) : '—');
        var recLbl = P && P.record ? 'Rekor lap' : 'Lap tercepat';
        var recSub = P && P.record ? (P.recordBy || '') : (bestLap && drvMap[bestLap.drv] ? (drvMap[bestLap.drv].name_acronym || '') + ' • sesi ini' : '');
        var stats = '<div class="lv-stat"><span class="l">Jarak balapan</span><span class="v lv-mono">' + (dist ? '<span data-count="' + dist.toFixed(3) + '" data-dec="3">' + dist.toFixed(3) + '</span><small>km</small>' : '—') + '</span></div>' +
            '<div class="lv-stat"><span class="l">Jumlah lap</span><span class="v lv-mono">' + (totalLaps ? '<span data-count="' + totalLaps + '" data-dec="0">' + totalLaps + '</span>' : '—') + (curLap && status === 'live' ? '<span class="s">lap saat ini ' + curLap + '</span>' : '') + '</span></div>' +
            '<div class="lv-stat"><span class="l">Panjang sirkuit</span><span class="v lv-mono">' + (lenKm ? '<span data-count="' + lenKm.toFixed(3) + '" data-dec="3">' + lenKm.toFixed(3) + '</span><small>km</small>' : '—') + (circ && circ.turns ? '<span class="s">' + esc(circ.turns) + ' tikungan</span>' : '') + '</span></div>' +
            '<div class="lv-stat"><span class="l">' + recLbl + '</span><span class="v lv-mono">' + esc(recVal) + (recSub ? '<span class="s">' + esc(recSub) + '</span>' : '') + '</span></div>';
        var cc = (P && P.compounds) || ['', '', ''];
        var total = rows.length || 1;
        var cmps = [['HARD', '#e8e8e8', cc[0]], ['MEDIUM', '#f5c518', cc[1]], ['SOFT', '#e10600', cc[2]]].map(function (t) {
            var n = compCount[t[0]] || 0;
            return '<div class="lv-cp" style="--cc:' + t[1] + '"><i></i><b class="lv-cond">' + esc(t[2] || t[0].charAt(0)) + '</b><div class="t"><u style="--w:' + Math.round(n / total * 100) + '%"></u></div><span class="ct lv-mono">' + n + ' • ' + t[0].toLowerCase() + '</span></div>';
        }).join('');
        var extra = [];
        if (compCount.INTERMEDIATE) extra.push('Inter ' + compCount.INTERMEDIATE);
        if (compCount.WET) extra.push('Wet ' + compCount.WET);
        var pr = P && P.press ? P.press : null;
        detailEl.innerHTML =
            '<div class="lv-card"><h4>Karakter sirkuit</h4>' + rates + (rt ? '' : '<div class="lv-nodata">Rating Pirelli untuk sirkuit ini belum diisi (lihat PIRELLI_DATA di live.js).</div>') + '</div>' +
            '<div class="lv-card"><h4>Statistik</h4>' + stats + '</div>' +
            '<div class="lv-card"><h4>Compound dipakai</h4>' + cmps + (extra.length ? '<div class="lv-nodata">' + extra.join(' • ') + '</div>' : '') + '</div>' +
            '<div class="lv-card"><h4>Ban 18"</h4><div class="lv-big lv-cond"><b>18"</b> tyre</div>' +
            '<div class="lv-kv"><small>EOS camber limit</small><div class="lv-pair lv-mono"><div>-3.25°<em>DEPAN</em></div><div>-1.75°<em>BELAKANG</em></div></div></div>' +
            '<div class="lv-kv"><small>Tekanan awal min. (slick)</small><div class="lv-pair lv-mono"><div>' + (pr ? esc(pr.front) + '<span style="font-size:.8rem"> psi</span>' : '—') + '<em>DEPAN</em></div><div>' + (pr ? esc(pr.rear) + '<span style="font-size:.8rem"> psi</span>' : '—') + '<em>BELAKANG</em></div></div></div></div>';
        if (firstPaint) countUp(detailEl);
    }

    function load(manual) {
        if (!page) return;
        if (!manual) bodyEl.innerHTML = '<div class="lv-msg">Memuat data live…</div>';
        fetch(OPENF1 + 'sessions?session_key=latest')
            .then(function (r) { return r.json(); })
            .then(function (sessions) {
                var s = (sessions || [])[0];
                if (!s) throw new Error('no session');
                lastSessionKey = s.session_key;
                var k = s.session_key;
                /* posisi wajib berhasil; sisanya opsional. Dua tahap supaya tidak melebihi batas laju. */
                return Promise.all([
                    Promise.resolve(s),
                    getArr(OPENF1 + 'position?session_key=' + k, true),
                    getArr(OPENF1 + 'drivers?session_key=' + k),
                    getArr(OPENF1 + 'intervals?session_key=' + k)
                ]).then(function (a) {
                    return Promise.all([
                        getArr(OPENF1 + 'race_control?session_key=' + k),
                        getArr(OPENF1 + 'stints?session_key=' + k),
                        getArr(OPENF1 + 'laps?session_key=' + k)
                    ]).then(function (b2) { return a.concat(b2); });
                }).then(function (all) {
                    if (meetingCache[s.meeting_key] !== undefined || !s.meeting_key) return all;
                    return getArr(OPENF1 + 'meetings?meeting_key=' + s.meeting_key).then(function (m) {
                        meetingCache[s.meeting_key] = (m[0] && (m[0].meeting_official_name || m[0].meeting_name)) || '';
                        return all;
                    });
                });
            })
            .then(function (all) { render(all[0], all[1], all[2], all[3], all[4], all[5], all[6]); })
            .catch(function () {
                bodyEl.innerHTML = '<div class="lv-msg">Data live belum bisa dimuat. Periksa koneksi internet, lalu coba lagi.</div>';
                if (!lastArgs) {
                    headEl.innerHTML = '<div><div class="lv-eyebrow">Data live dari OpenF1</div><h2 class="lv-title lv-cond">Pusat Live</h2></div>' +
                        '<button type="button" class="lv-refresh" id="lv-refresh"><b>⟳</b> Coba lagi</button>';
                    var rb = headEl.querySelector('#lv-refresh');
                    if (rb) rb.addEventListener('click', function () { load(true); });
                }
            });
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        page = document.createElement('div');
        page.id = 'live-page';
        page.className = 'page';
        page.innerHTML = '<div class="lv-wrap"><div class="lv-stage" id="lv-stage">' +
            '<div class="lv-hd" id="lv-head"><div><div class="lv-eyebrow">Memuat…</div></div></div>' +
            '<div class="lv-main">' +
            '<aside class="lv-left"><div class="lv-trackcard" id="lv-track"></div><div class="lv-sectors" id="lv-sec"></div></aside>' +
            '<section class="lv-right"><div class="lv-flag" id="lv-flag" hidden></div><div class="lv-drv" id="lv-drv" hidden></div>' +
            '<div id="lv-body"><div class="lv-msg">Memuat data live…</div></div><div class="lv-upd" id="lv-upd"></div></section>' +
            '</div><div class="lv-detail" id="lv-detail"></div></div></div>';
        var after = document.getElementById('schedule-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        stageEl = page.querySelector('#lv-stage');
        headEl = page.querySelector('#lv-head');
        trackEl = page.querySelector('#lv-track');
        secEl = page.querySelector('#lv-sec');
        flagEl = page.querySelector('#lv-flag');
        drvEl = page.querySelector('#lv-drv');
        bodyEl = page.querySelector('#lv-body');
        updEl = page.querySelector('#lv-upd');
        detailEl = page.querySelector('#lv-detail');
        bodyEl.addEventListener('click', function (e) {
            var tr = e.target.closest && e.target.closest('tr[data-n]');
            if (!tr || !lastArgs) return;
            selDrv = tr.getAttribute('data-n');
            render.apply(null, lastArgs);
        });
        var menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-live]')) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-live onclick="showPage(\'live-page\'); return false;">Live</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var sch = links.find(function (l) { return /schedule|jadwal/i.test(l.textContent); });
            if (sch) sch.after(li); else menu.appendChild(li);
            var a = li.querySelector('a');
            if (a) a.addEventListener('click', function () { setTimeout(function () { load(true); }, 150); });
        }
        load(false);
        timer = setInterval(function () {
            if (page && page.classList.contains('active')) load(true);
        }, 30000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();