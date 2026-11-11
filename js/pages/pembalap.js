/* =========================================================
   PROFIL PEMBALAP (desain baru + statistik otomatis)
   - Biografi tetap dari driversData (script.js) dan TIDAK diubah sama sekali.
   - Statistik musim berjalan + statistik karier dihitung otomatis dari Jolpica F1 API
     (gratis, tanpa API key), jadi tidak perlu diisi / diganti manual tiap race.
   - Tombol "Full season results" dan "Results archive" membuka tabel hasil.

   Pasang: taruh sefolder dengan index.html, tambahkan SETELAH script.js (dan teams.js):
       <script src="pembalap.js"></script>
   ========================================================= */
(function () {
    'use strict';

    const J = 'https://api.jolpi.ca/ergast/f1/';
    const MIN = 60e3;
    const STAT_TTL = 20 * MIN;                     // data statistik dianggap segar selama 20 menit
    const THIS_YEAR = new Date().getFullYear();

    /* ---------- foto khusus halaman detail (foto kartu di daftar pembalap tidak berubah) ---------- */
    const DETAIL_PHOTOS = {
        'George Russell': 'assets/images/pin/335a439401a80a106c69ac66837744d5.jpg',
        'Fernando Alonso': 'assets/images/pin/ea3eb673a5f7c92eb556b3de131f1211.jpg',
        'Alex Albon': 'assets/images/pin/afcd5ceb8327048b73f2431cbe8f1267.jpg',
        'Pierre Gasly': 'assets/images/pin/65d3fc19af57e89719a355dd54772b4c.jpg',
        'Max Verstappen': 'assets/images/pin/0c3038a5d8b460f0a4cc209d494b4b03.jpg',
        'Nico Hulkenberg': 'assets/images/pin/1db88ee5ef56b9e8b8caf98198da1243.jpg',
        'Carlos Sainz': 'assets/images/pin/75bb25b5c589f05dcaa3833571bf45ba.jpg',
        'Andrea Kimi Antonelli': 'assets/images/pin/4e1e1df5d82ebb1988aba491d6beb1d4.jpg',
        'Oscar Piastri': 'assets/images/pin/9a3e3637ba9df9668efdf110f6d7b7f1.jpg',
        'Lewis Hamilton': 'assets/images/pin/b0b73931f614fabd2705534742a82dfc.jpg',
        'Charles Leclerc': 'assets/images/pin/8e761e6520e7ed1a624945a23478d3dc.jpg',
        'Lando Norris': 'assets/images/pin/151bc722353f65da3a81b8a3d2db449c.jpg',
        'Lance Stroll': 'assets/images/pin/cba76ca425678e5bf44f8c6b1f3ed25f.jpg',
        'Esteban Ocon': 'assets/images/pin/cc812a48ef657cd4bd0289cd53baf43a.jpg',
        'Oliver Bearman': 'assets/images/pin/bc5d2e467dc84b5994ce7e00755abf9c.jpg',
        'Gabriel Bortoleto': 'assets/images/pin/b644f93c373790bf186f054bdb33134f.jpg',
        'Liam Lawson': 'assets/images/pin/1bfa8a10f93d95010037a850b473ef1b.jpg',
        'Arvid Lindblad': 'assets/images/pin/97ebe5e3b1eb0e319704d16c4c30b79a.jpg',
        'Isack Hadjar': 'assets/images/pin/5ae6e9ab756fd19632932264482fb84f.jpg',
        'Franco Colapinto': 'assets/images/pin/db2cfaff50027d168794aaecae07643e.jpg',
        'Sergio Pérez': 'assets/images/pin/e42ef88f0fdc561ef1bca0999dbaf170.jpg',
        'Valtteri Bottas': 'assets/images/pin/4fea40f0ed8d100d1b294f2b08594b89.jpg'
    };
    const detailPhoto = d => DETAIL_PHOTOS[d.name] || d.photo;

    /* ---------- helper ---------- */
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const norm = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const ord = n => { const v = n % 100, s = ['th', 'st', 'nd', 'rd']; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
    const num = n => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 });
    const NAT = {
        'Inggris': 'gb', 'Spanyol': 'es', 'Thailand': 'th', 'Prancis': 'fr', 'Belanda': 'nl', 'Jerman': 'de', 'Italia': 'it', 'Australia': 'au',
        'Monako': 'mc', 'Kanada': 'ca', 'Brasil': 'br', 'Selandia Baru': 'nz', 'Argentina': 'ar', 'Meksiko': 'mx', 'Finlandia': 'fi'
    };
    const ID_OVERRIDE = { 'max verstappen': 'max_verstappen' };      // selain itu: nama belakang
    function idCandidates(name) {
        const clean = norm(name), parts = clean.split(/\s+/), last = parts[parts.length - 1], first = parts[0];
        return [...new Set([ID_OVERRIDE[clean], last, first + '_' + last].filter(Boolean))];
    }
    const teamColor = d => {
        if (typeof teamsData !== 'undefined' && Array.isArray(teamsData)) {
            const t = teamsData.find(t => (t.drivers || []).includes(d.name));
            if (t && t.color) return t.color;
        }
        return '#8a8f9a';
    };

    // logo tim (sumber sama dengan showcase tim di Beranda)
    const TEAM_LOGOS = {
        'mclaren': 'assets/images/pin/72644aef0c75a11905a848d485ba2fad.jpg',
        'haas': 'assets/images/pin/92fd431a41b0fadeee14fd11702680cb.jpg',
        'alpine': 'assets/images/pin/89652d94b80ad8d9bf6a59b2be5210d7.jpg',
        'ferrari': 'assets/images/pin/257ffe9204fa0004ff97fe9fdcb5c99b.jpg',
        'red bull': 'assets/images/pin/28ee6c55b8e3d6414342daf10d97fe5a.jpg',
        'racing bulls': 'assets/images/pin/42ad594511fbde88971da4812f72e293.jpg',
        'cadillac': 'assets/images/pin/923d581d5325793b207ccba147d50ed5.jpg',
        'mercedes': 'assets/images/pin/31fb0838a14408a5cd6fa946d277cbbb.jpg',
        'williams': 'assets/images/pin/ea35df160123cc7a1383d329e63c7ddb.jpg',
        'audi': 'assets/images/pin/b0f7eb6e9c6d5923a044bf4bfa9bcd68.jpg',
        'aston martin': 'assets/images/pin/b64a5745c7786e8b5c96df096eeebb69.jpg'
    };
    const teamLogo = d => {
        const text = String(d.team || '').toLowerCase();
        const key = Object.keys(TEAM_LOGOS).find(k => text.includes(k));
        return key ? TEAM_LOGOS[key] : '';
    };

    /* ---------- gaya ---------- */
    const css = document.createElement('style');
    css.textContent = `
        html body.theme-detail { background: #f4f1ec !important; background-attachment: fixed !important; }
        body.theme-detail canvas { display: none; }
        #detail-page::before, #detail-page::after { display: none !important; }

        .dp { max-width: 1100px; margin: 0 auto; padding: 4px 4px 56px; color: #14151a; text-align: left; font-family: var(--f-body, 'Inter', sans-serif); }
        .dp * { box-sizing: border-box; }
        .dp-top { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin: 6px 0 18px; }
        .dp-back { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; border: 1.5px solid #14151a; background: #fff; color: #14151a; font: 700 .85rem var(--f-body, 'Inter', sans-serif); cursor: pointer; text-decoration: none; }
        .dp-back:hover { background: #14151a; color: #fff; }
        .dp-jump { display: flex; gap: 8px; }
        .dp-jump a { padding: 8px 16px; border-radius: 999px; font-size: .82rem; font-weight: 600; color: #14151a; text-decoration: none; background: rgba(20,21,26,.06); }
        .dp-jump a:hover { background: rgba(20,21,26,.12); }

        /* HERO */
        .dp-hero { position: relative; display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 44px; align-items: center; padding: 26px; border-radius: 24px; overflow: hidden; isolation: isolate;
                   background: #fff; border: 1px solid #e7e2da; }
        .dp-team-logo { position: absolute; top: 22px; right: 26px; z-index: 2; width: 88px; height: 88px; object-fit: contain; mix-blend-mode: multiply; }
        .dp-photo { position: relative; margin: 0; aspect-ratio: 3 / 4; border-radius: 18px; overflow: hidden; background: #111; box-shadow: 0 14px 34px rgba(20,21,26,.18); }
        .dp-photo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
        .dp-photo.empty { display: grid; place-items: center; background: color-mix(in srgb, var(--tc) 60%, #222); }
        .dp-photo.empty::after { content: attr(data-i); font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 6rem; font-weight: 800; color: rgba(255,255,255,.7); }
        .dp-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-size: .74rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #4b505b; }
        .dp-eyebrow i { width: 11px; height: 11px; border-radius: 50%; background: var(--tc); box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(20,21,26,.2); }
        .dp-first { margin: 14px 0 0; font-size: 1.15rem; font-weight: 500; color: #4b505b; }
        .dp-last { margin: 0; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; font-style: italic; text-transform: uppercase; line-height: .92;
                   font-size: clamp(2.8rem, 8vw, 5.6rem); color: #14151a; overflow-wrap: anywhere; }
        .dp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .dp-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 13px; border-radius: 999px; font-size: .78rem; font-weight: 600; color: #14151a; background: rgba(255,255,255,.85); border: 1px solid rgba(20,21,26,.14); }
        .dp-chip img { height: 12px; width: auto; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,.18); }
        .dp-hl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 520px; margin-top: 26px; }
        .dp-hl div { padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,.88); border: 1px solid rgba(20,21,26,.1); }
        .dp-hl span { display: block; font-size: .66rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #6b717d; }
        .dp-hl b { display: block; margin-top: 4px; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 2rem; font-weight: 800; line-height: 1.05; }

        /* BIOGRAFI */
        .dp-sec { margin-top: 34px; }
        .dp-bio { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 40px; padding: 34px 36px; border-radius: 22px; background: #fff; border: 1px solid #e7e2da; }
        .dp-kicker { font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #6b717d; }
        .dp-bio h2 { margin: 0 0 18px; font-size: clamp(1.4rem, 3vw, 1.9rem); line-height: 1.25; font-weight: 700; }
        .dp-text p { margin: 0 0 18px; font-size: 1.04rem; line-height: 1.85; color: #23252b; }
        .dp-text p:last-child { margin-bottom: 0; }

        /* STATISTIK */
        .dp-sechead { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .dp-sechead h2 { margin: 0; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; font-style: italic; text-transform: uppercase; }
        .dp-upd { font-size: .72rem; color: #7a7f8a; }
        .dp-stats { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; align-items: start; }
        .dp-card { padding: 26px 28px 28px; border-radius: 20px; background: #fff; border: 1px solid #e7e2da; }
        .dp-card h3 { margin: 0 0 20px; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 1.55rem; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; }
        .dp-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 26px; }
        .dp-sep { grid-column: 1 / -1; height: 1px; background: #e7e2da; }
        .dp-it span { display: block; font-size: .72rem; font-weight: 600; color: #6b717d; }
        .dp-it b { display: block; margin-top: 4px; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 2rem; font-weight: 800; line-height: 1.05; color: #14151a; }
        .dp-rows { display: flex; flex-direction: column; }
        .dp-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 0; border-bottom: 1px solid #eee9e1; }
        .dp-row:first-child { padding-top: 0; }
        .dp-row span { font-size: .8rem; font-weight: 600; color: #6b717d; }
        .dp-row b { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 1.55rem; font-weight: 800; white-space: nowrap; }
        .dp-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
        .dp-btn { padding: 10px 20px; border-radius: 999px; border: 1.5px solid #14151a; background: #14151a; color: #fff; font: 700 .82rem var(--f-body, 'Inter', sans-serif); cursor: pointer; transition: transform .15s ease, background .15s ease; }
        .dp-btn:hover { transform: translateY(-2px); }
        .dp-btn.alt { background: transparent; color: #14151a; }
        .dp-btn.alt:hover { background: #14151a; color: #fff; }
        .dp-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
        .dp-sk { display: inline-block; width: 52px; height: .85em; vertical-align: middle; border-radius: 6px; background: linear-gradient(90deg, #ebe7e0 25%, #f6f3ee 50%, #ebe7e0 75%); background-size: 200% 100%; animation: dpSh 1.2s linear infinite; }
        @keyframes dpSh { to { background-position: -200% 0; } }
        .dp-err { margin: 0 0 16px; padding: 12px 14px; border-radius: 12px; background: #f6efe7; color: #6b4a22; font-size: .84rem; }
        .dp-err button { margin-left: 8px; padding: 4px 12px; border-radius: 99px; border: 1px solid #6b4a22; background: transparent; color: inherit; font: inherit; font-weight: 700; cursor: pointer; }

        /* PEMBALAP LAIN */
        .dp-others h3 { margin: 0 0 14px; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 1.5rem; font-weight: 800; text-transform: uppercase; }
        .dp-others-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .dp-o { display: flex; align-items: center; gap: 12px; padding: 8px 16px 8px 8px; border-radius: 14px; background: #fff; border: 1px solid #e7e2da; cursor: pointer; transition: border-color .2s, transform .2s; }
        .dp-o:hover { border-color: #14151a; transform: translateY(-2px); }
        .dp-o img { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; object-position: center top; background: #ddd; }
        .dp-o h4 { margin: 0; font-size: .88rem; } .dp-o p { margin: 2px 0 0; font-size: .74rem; color: #6b717d; }

        /* MODAL */
        .dp-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 18px; background: rgba(20,21,26,.55); animation: dpFade .2s ease; }
        .dp-sheet { width: min(900px, 100%); max-height: 84vh; display: flex; flex-direction: column; border-radius: 20px; background: #fff; color: #14151a; box-shadow: 0 24px 60px rgba(0,0,0,.3); animation: dpPop .25s cubic-bezier(.2,.8,.2,1); overflow: hidden; }
        .dp-sheet header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 22px; border-bottom: 1px solid #e7e2da; }
        .dp-sheet h4 { margin: 0; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: 1.4rem; font-weight: 800; text-transform: uppercase; }
        .dp-x { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid #14151a; background: #fff; font-size: 1.1rem; line-height: 1; cursor: pointer; }
        .dp-x:hover { background: #14151a; color: #fff; }
        .dp-scroll { overflow: auto; padding: 6px 22px 22px; }
        .dp-t { width: 100%; border-collapse: collapse; min-width: 560px; font-variant-numeric: tabular-nums; }
        .dp-t th { position: sticky; top: 0; background: #fff; text-align: left; padding: 14px 8px 10px; font-size: .64rem; letter-spacing: .08em; text-transform: uppercase; color: #6b717d; border-bottom: 1px solid #e7e2da; }
        .dp-t td { padding: 10px 8px; border-bottom: 1px solid #f0ece5; font-size: .86rem; white-space: nowrap; }
        .dp-t .r { text-align: right; } .dp-t th.r { text-align: right; }
        .dp-t td.win { font-weight: 800; } .dp-t td.out { color: #9a9ea8; }
        .dp-t h5 { margin: 22px 0 0; font-size: .8rem; }
        .dp-sub { margin: 22px 0 -4px; font-size: .74rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #6b717d; }
        .dp-empty { padding: 34px 8px; text-align: center; color: #6b717d; }
        @keyframes dpFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dpPop { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: none; } }
        #detail-page.active .dp-hero { animation: dpUp .55s cubic-bezier(.2,.8,.2,1) backwards; }
        #detail-page.active .dp-sec { animation: dpUp .55s .12s cubic-bezier(.2,.8,.2,1) backwards; }
        @keyframes dpUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }

        @media (max-width: 860px) {
            .dp-hero { grid-template-columns: 1fr; gap: 24px; padding: 18px; }
            .dp-photo { max-width: 300px; }
            .dp-team-logo { width: 60px; height: 60px; top: 16px; right: 16px; }
            .dp-bio { grid-template-columns: 1fr; gap: 18px; padding: 24px 20px; }
            .dp-stats { grid-template-columns: 1fr; }
            .dp-card { padding: 22px 20px 24px; }
        }
        @media (max-width: 480px) { .dp-hl { grid-template-columns: 1fr 1fr 1fr; gap: 8px; } .dp-hl div { padding: 10px 10px; } .dp-hl b { font-size: 1.5rem; } .dp-it b { font-size: 1.7rem; } .dp-jump { display: none; } }
        @media (prefers-reduced-motion: reduce) { #detail-page.active .dp-hero, #detail-page.active .dp-sec, .dp-modal, .dp-sheet, .dp-sk { animation: none !important; } }`;
    document.head.appendChild(css);

    /* ---------- ambil data + hitung statistik ---------- */
    // Semua permintaan ke API diantre satu per satu (jeda singkat) dan diulang kalau ditolak server,
    // supaya tidak kena batas permintaan (kalau ditolak, browser menganggapnya error jaringan).
    let queue = Promise.resolve();
    function fj(url, tries) {
        tries = tries || 0;
        const run = queue.then(async () => {
            await new Promise(r => setTimeout(r, 260));
            try { return await fetch(url); } catch (e) { return null; }
        });
        queue = run.catch(() => {});
        return run.then(async res => {
            if ((!res || res.status === 429 || res.status >= 500) && tries < 4) {
                await new Promise(r => setTimeout(r, 1200 * (tries + 1)));
                return fj(url, tries + 1);
            }
            if (!res || !res.ok) throw new Error(res ? 'HTTP ' + res.status : 'network');
            return res.json();
        });
    }
    const isFinish = s => /^(Finished|Lapped|\+\d+ Laps?)$/i.test(String(s || ''));

    // klasemen akhir satu pembalap di satu musim (API tidak punya klasemen semua musim sekaligus per pembalap)
    async function standingOf(id, y) {
        const j = await fj(`${J}${y}/drivers/${id}/driverstandings.json`);
        const l = (j.MRData.StandingsTable.StandingsLists || [])[0];
        const s = l && (l.DriverStandings || [])[0];
        return s ? { y: +l.season, round: +l.round, pos: +s.position, pts: +s.points, wins: +s.wins, t: ((s.Constructors || [])[0] || {}).name || '' } : null;
    }

    async function fetchRaw(driver, onProgress) {
        for (const id of idCandidates(driver.name)) {
            const first = await fj(`${J}drivers/${id}/results.json?limit=100`);
            const total = Number(first.MRData.total) || 0;
            if (!total) continue;
            const pages = [first];
            for (let off = 100; off < total; off += 100) pages.push(await fj(`${J}drivers/${id}/results.json?limit=100&offset=${off}`));
            const results = pages.flatMap(j => j.MRData.RaceTable.Races || []).map(r => {
                const x = (r.Results || [])[0] || {};
                return { y: +r.season, r: +r.round, n: r.raceName, c: (r.Circuit.Location || {}).locality || '', pt: x.positionText, p: +x.position, g: +x.grid, pts: +x.points,
                         st: x.status, fl: x.FastestLap ? +x.FastestLap.rank : 0, t: (x.Constructor || {}).name || '' };
            });
            const season = Math.max(...results.map(r => r.y));
            const sp = await fj(`${J}${season}/drivers/${id}/sprint.json?limit=100`).catch(() => null);
            const sprints = sp ? (sp.MRData.RaceTable.Races || []).map(r => {
                const x = (r.SprintResults || [])[0] || {};
                return { r: +r.round, n: r.raceName, pt: x.positionText, p: +x.position, g: +x.grid, pts: +x.points };
            }) : [];
            const raw = { id, season, results, standings: [], sprints, rounds: 0, incomplete: true, at: Date.now() };

            // 1) musim berjalan dulu, supaya posisi musim langsung tampil
            const cur = await standingOf(id, season).catch(() => null);
            if (cur) {
                raw.standings.push(cur);
                if (cur.pos === 1) raw.rounds = await fj(`${J}${season}.json?limit=1`).then(j => Number(j.MRData.total) || 0).catch(() => 0);
            }

            // 2) musim-musim sebelumnya diambil di latar belakang (terbaru dulu), tabel ikut terisi bertahap
            const years = [...new Set(results.map(r => r.y))].filter(y => y !== season).sort((a, b) => b - a);
            (async () => {
                let missing = cur ? 0 : 1;
                for (const y of years) {
                    const s = await standingOf(id, y).catch(() => null);
                    if (s) raw.standings.push(s); else missing++;
                    if (onProgress) onProgress(raw, false);
                }
                raw.incomplete = missing > 0;      // kalau ada yang gagal dimuat, dicoba lagi 2 menit kemudian
                raw.at = Date.now();
                if (onProgress) onProgress(raw, true);
            })();
            return raw;
        }
        return null;
    }

    const mem = new Map();
    async function getRaw(driver, force) {
        const key = 'dp:v2:' + norm(driver.name), now = Date.now();   // v2: buang cache lama yang klasemennya kosong
        let c = mem.get(key);
        if (!c) { try { c = JSON.parse(localStorage.getItem(key) || 'null') || undefined; } catch (e) { /* abaikan */ } }
        if (c && !force && now - c.at < (c.incomplete ? 2 * MIN : STAT_TTL)) { mem.set(key, c); return c; }
        try {
            const save = (r, done) => {
                mem.set(key, r);
                try { localStorage.setItem(key, JSON.stringify(r)); } catch (e) { /* abaikan */ }
                // tampilan ikut diperbarui saat klasemen musim lama selesai dimuat
                if (current && current.driver === driver) { current.raw = r; if (done || r.standings.length % 4 === 0) refresh(r); }
            };
            const raw = await fetchRaw(driver, save);
            if (!raw) { if (c) return c; return null; }
            mem.set(key, raw);
            try { localStorage.setItem(key, JSON.stringify(raw)); } catch (e) { /* abaikan */ }
            return raw;
        } catch (err) {
            if (c) return c;                    // pakai data tersimpan kalau server data sedang sibuk
            throw err;
        }
    }

    const classified = x => /^\d+$/.test(String(x.pt)) && x.p > 0;
    function compute(raw) {
        const S = raw.season, R = raw.results, cur = R.filter(r => r.y === S);
        const sprint = raw.sprints || [];
        const gp = list => ({
            races: list.length, points: list.reduce((a, r) => a + (r.pts || 0), 0),
            wins: list.filter(r => classified(r) && r.p === 1).length, podiums: list.filter(r => classified(r) && r.p <= 3).length,
            poles: list.filter(r => r.g === 1).length, top10: list.filter(r => classified(r) && r.p <= 10).length,
            fl: list.filter(r => r.fl === 1).length, dnf: list.filter(r => !isFinish(r.st)).length
        });
        const g = gp(cur), sp = gp(sprint.map(s => ({ pts: s.pts, pt: s.pt, p: s.p, g: s.g, st: 'Finished', fl: 0 })));
        const stand = raw.standings.find(s => s.y === S);
        const all = gp(R);
        const best = R.filter(classified).reduce((m, r) => Math.min(m, r.p), 99);
        const bestGrid = R.filter(r => r.g > 0).reduce((m, r) => Math.min(m, r.g), 99);
        const careerPoints = (!raw.incomplete && raw.standings.length) ? raw.standings.reduce((a, s) => a + (s.pts || 0), 0) : all.points;
        const titles = raw.standings.filter(s => s.pos === 1 && (s.y < S || raw.rounds && s.round >= raw.rounds)).length;
        return {
            season: S, partial: !!raw.incomplete,
            season_pos: stand ? ord(stand.pos) : '—', season_pts: stand ? stand.pts : g.points + sp.points,
            gp: g, sp, 
            career: {
                entered: R.length, points: careerPoints,
                bestFinish: best < 99 ? `${best} (x${R.filter(r => classified(r) && r.p === best).length})` : '—',
                podiums: all.podiums,
                bestGrid: bestGrid < 99 ? `${bestGrid} (x${R.filter(r => r.g === bestGrid).length})` : '—',
                poles: all.poles, titles, dnf: all.dnf
            }
        };
    }

    /* ---------- tampilan ---------- */
    const page = () => document.getElementById('detail-page');
    let current = null;                       // { id, driver, raw }

    const skel = '<i class="dp-sk"></i>';
    const item = (label, id) => `<div class="dp-it"><span>${esc(label)}</span><b data-k="${id}">${skel}</b></div>`;
    const row = (label, id) => `<div class="dp-row"><span>${esc(label)}</span><b data-k="${id}">${skel}</b></div>`;

    function markup(id, d) {
        const name = d.name.trim(), parts = name.split(/\s+/), last = parts.pop(), first = parts.join(' ');
        const nat = d.stats && d.stats['Kebangsaan'], code = NAT[nat], no = d.stats && d.stats['Nomor'], debut = d.stats && d.stats['Debut F1'];
        const others = Object.keys(driversData).filter(k => String(k) !== String(id));
        return `<div class="dp" style="--tc:${esc(teamColor(d))}">
            <div class="dp-top">
                <a href="#" class="dp-back" onclick="showPage('drivers-page'); return false;">Back</a>
            </div>

            <section class="dp-hero">
                <figure class="dp-photo" data-i="${esc(last.charAt(0))}">
                    <img src="${esc(detailPhoto(d))}" data-fb="${esc(d.photo)}" alt="${esc(d.name)}" referrerpolicy="no-referrer" onerror="var f=this.getAttribute('data-fb');if(f&&this.getAttribute('src')!==f){this.src=f}else{this.remove()}">
                </figure>
                ${teamLogo(d) ? `<img class="dp-team-logo" src="${esc(teamLogo(d))}" alt="${esc(d.team)}" title="${esc(d.team)}" onerror="this.remove()">` : ''}
                <div>
                    <p class="dp-first">${esc(first)}</p>
                    <h1 class="dp-last">${esc(last)}</h1>
                    <div class="dp-chips">
                        ${nat ? `<span class="dp-chip">${code ? `<img src="https://flagcdn.com/w40/${code}.png" alt="" onerror="this.remove()">` : ''}${esc(nat)}</span>` : ''}
                        ${no != null ? `<span class="dp-chip">No. ${esc(no)}</span>` : ''}
                        ${debut ? `<span class="dp-chip">Debut F1 ${esc(debut)}</span>` : ''}
                    </div>
                    <div class="dp-hl">
                        <div><span>Season Position</span><b data-k="h_pos">${skel}</b></div>
                        <div><span>Season Points</span><b data-k="h_pts">${skel}</b></div>
                        <div><span>GP Wins</span><b data-k="h_win">${skel}</b></div>
                    </div>
                </div>
            </section>

            <section class="dp-sec dp-bio" id="dp-bio">
                <div class="dp-kicker">Biografi</div>
                <div>
                    <h2>${esc(d.title)}</h2>
                    <div class="dp-text" id="article-text">${formatBio(d.bio)}</div>
                </div>
            </section>

            <section class="dp-sec" id="dp-stats">
                <div class="dp-sechead"><h2>Statistics</h2><span class="dp-upd" id="dp-upd"></span></div>
                <div id="dp-err"></div>
                <div class="dp-stats">
                    <div class="dp-card">
                        <h3 id="dp-season-title">Season</h3>
                        <div class="dp-g2">
                            ${item('Season Position', 'pos')}${item('Season Points', 'pts')}
                            <div class="dp-sep"></div>
                            ${item('Grand Prix Races', 'gp_races')}${item('Grand Prix Points', 'gp_pts')}
                            ${item('Grand Prix Wins', 'gp_wins')}${item('Grand Prix Podiums', 'gp_pod')}
                            ${item('Grand Prix Poles', 'gp_pole')}${item('Grand Prix Top 10s', 'gp_top10')}
                            ${item('Fastest Laps', 'gp_fl')}${item('DNFs', 'gp_dnf')}
                            <div class="dp-sep"></div>
                            ${item('Sprint Races', 'sp_races')}${item('Sprint Points', 'sp_pts')}
                            ${item('Sprint Wins', 'sp_wins')}${item('Sprint Podiums', 'sp_pod')}
                            ${item('Sprint Poles', 'sp_pole')}${item('Sprint Top 10s', 'sp_top10')}
                        </div>
                        <div class="dp-btns"><button class="dp-btn" type="button" id="dp-b-season" disabled>Full season results</button></div>
                    </div>
                    <div class="dp-card">
                        <h3>Career Stats</h3>
                        <div class="dp-rows">
                            ${row('Grands Prix Entered', 'c_entered')}${row('Career Points', 'c_points')}${row('Highest Race Finish', 'c_best')}
                            ${row('Podiums', 'c_pod')}${row('Highest Grid Position', 'c_grid')}${row('Pole Positions', 'c_pole')}
                            ${row('World Championships', 'c_titles')}${row('DNFs', 'c_dnf')}
                        </div>
                        <div class="dp-btns"><button class="dp-btn alt" type="button" id="dp-b-archive" disabled>Results archive</button></div>
                    </div>
                </div>
            </section>

            <section class="dp-sec dp-others">
                <h3>Pembalap lainnya</h3>
                <div class="dp-others-list">${others.map(k => `<div class="dp-o" onclick="openDetail(${k})"><img src="${esc(driversData[k].photo)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'"><div><h4>${esc(driversData[k].name)}</h4><p>${esc(driversData[k].team)}</p></div></div>`).join('')}</div>
            </section>
        </div>`;
    }

    const $k = k => page().querySelector(`[data-k="${k}"]`);
    const put = (k, v) => { const el = $k(k); if (el) el.textContent = v; };

    function fill(m) {
        put('pos', m.season_pos); put('pts', num(m.season_pts));
        put('gp_races', m.gp.races); put('gp_pts', num(m.gp.points)); put('gp_wins', m.gp.wins); put('gp_pod', m.gp.podiums);
        put('gp_pole', m.gp.poles); put('gp_top10', m.gp.top10); put('gp_fl', m.gp.fl); put('gp_dnf', m.gp.dnf);
        put('sp_races', m.sp.races); put('sp_pts', num(m.sp.points)); put('sp_wins', m.sp.wins); put('sp_pod', m.sp.podiums);
        put('sp_pole', m.sp.poles); put('sp_top10', m.sp.top10);
        const c = m.career;
        put('c_entered', c.entered); put('c_points', num(c.points)); put('c_best', c.bestFinish); put('c_pod', c.podiums);
        put('c_grid', c.bestGrid); put('c_pole', c.poles); put('c_titles', c.titles + (m.partial ? ' …' : '')); put('c_dnf', c.dnf);
        put('h_pos', m.season_pos); put('h_pts', num(m.season_pts)); put('h_win', m.gp.wins);
        document.getElementById('dp-season-title').textContent = `${m.season} Season`;
    }

    // dipanggil saat klasemen musim lama selesai dimuat di latar belakang
    function refresh(raw) {
        if (!current || !page() || !page().querySelector('[data-k="pos"]')) return;
        current.raw = raw;
        fill(compute(raw));
    }

    async function loadStats(silent, force) {
        const cur = current; if (!cur) return;
        const err = document.getElementById('dp-err');
        try {
            const raw = await getRaw(cur.driver, force);
            if (current !== cur) return;
            if (!raw) {
                err.innerHTML = '<p class="dp-err">Data balapan pembalap ini belum tersedia.</p>';
                ['pos', 'pts', 'gp_races', 'gp_pts', 'gp_wins', 'gp_pod', 'gp_pole', 'gp_top10', 'gp_fl', 'gp_dnf', 'sp_races', 'sp_pts', 'sp_wins', 'sp_pod', 'sp_pole', 'sp_top10',
                 'c_entered', 'c_points', 'c_best', 'c_pod', 'c_grid', 'c_pole', 'c_titles', 'c_dnf', 'h_pos', 'h_pts', 'h_win'].forEach(k => put(k, '—'));
                return;
            }
            cur.raw = raw; err.innerHTML = '';
            fill(compute(raw));
            document.getElementById('dp-b-season').disabled = false; document.getElementById('dp-b-archive').disabled = false;
            const t = new Date(raw.at);
            document.getElementById('dp-upd').textContent = `Diperbarui otomatis · ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
        } catch (e) {
            if (current !== cur || silent) return;
            err.innerHTML = '<p class="dp-err">Statistik belum bisa dimuat (server data sedang sibuk). <button type="button" id="dp-retry">Coba lagi</button></p>';
            const b = document.getElementById('dp-retry'); if (b) b.onclick = () => { err.innerHTML = ''; loadStats(false, true); };
        }
    }

    /* ---------- modal hasil ---------- */
    function modal(title, body) {
        const el = document.createElement('div');
        el.className = 'dp-modal';
        el.innerHTML = `<div class="dp-sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h4>${esc(title)}</h4><button class="dp-x" type="button" aria-label="Tutup">×</button></header><div class="dp-scroll">${body}</div></div>`;
        const close = () => { el.remove(); document.removeEventListener('keydown', onKey); };
        const onKey = e => { if (e.key === 'Escape') close(); };
        el.addEventListener('click', e => { if (e.target === el || e.target.closest('.dp-x')) close(); });
        document.addEventListener('keydown', onKey);
        document.body.appendChild(el);
    }
    const fin = x => /^\d+$/.test(String(x.pt)) ? x.pt : (x.pt || '—');

    function seasonResults() {
        const raw = current && current.raw; if (!raw) return;
        const rows = raw.results.filter(r => r.y === raw.season).sort((a, b) => a.r - b.r);
        let html = `<table class="dp-t"><thead><tr><th>Rd</th><th>Grand Prix</th><th>Grid</th><th>Finish</th><th>Status</th><th class="r">Pts</th></tr></thead><tbody>` +
            rows.map(r => `<tr><td>${r.r}</td><td>${esc(r.n.replace(' Grand Prix', ''))}</td><td>${r.g > 0 ? r.g : 'PL'}</td><td class="${r.p === 1 && classified(r) ? 'win' : !classified(r) ? 'out' : ''}">${esc(fin(r))}</td><td class="${isFinish(r.st) ? '' : 'out'}">${esc(r.st)}</td><td class="r">${num(r.pts)}</td></tr>`).join('') + '</tbody></table>';
        if (raw.sprints && raw.sprints.length) {
            html += `<p class="dp-sub">Sprint</p><table class="dp-t"><thead><tr><th>Rd</th><th>Sprint</th><th>Grid</th><th>Finish</th><th></th><th class="r">Pts</th></tr></thead><tbody>` +
                raw.sprints.map(r => `<tr><td>${r.r}</td><td>${esc(r.n.replace(' Grand Prix', ''))}</td><td>${r.g > 0 ? r.g : 'PL'}</td><td>${esc(fin(r))}</td><td></td><td class="r">${num(r.pts)}</td></tr>`).join('') + '</tbody></table>';
        }
        modal(`${current.driver.name} · ${raw.season} season results`, rows.length ? html : '<p class="dp-empty">Belum ada hasil musim ini.</p>');
    }

    function archive() {
        const raw = current && current.raw; if (!raw) return;
        const years = [...new Set(raw.results.map(r => r.y))].sort((a, b) => b - a);
        const html = `<table class="dp-t"><thead><tr><th>Season</th><th>Team</th><th class="r">Races</th><th class="r">Wins</th><th class="r">Podiums</th><th class="r">Poles</th><th class="r">Points</th><th class="r">Pos</th></tr></thead><tbody>` +
            years.map(y => {
                const L = raw.results.filter(r => r.y === y), s = raw.standings.find(x => x.y === y);
                const team = (s && s.t) || (L[L.length - 1] || {}).t || '—';
                const pts = s ? s.pts : L.reduce((a, r) => a + (r.pts || 0), 0);
                return `<tr><td><b>${y}</b></td><td>${esc(team)}</td><td class="r">${L.length}</td><td class="r">${L.filter(r => classified(r) && r.p === 1).length}</td><td class="r">${L.filter(r => classified(r) && r.p <= 3).length}</td><td class="r">${L.filter(r => r.g === 1).length}</td><td class="r">${num(pts)}</td><td class="r">${s ? s.pos : '—'}</td></tr>`;
            }).join('') + '</tbody></table>';
        modal(`${current.driver.name} · results archive`, html);
    }

    document.addEventListener('click', e => {
        if (e.target.closest('#dp-b-season')) seasonResults();
        else if (e.target.closest('#dp-b-archive')) archive();
        else { const a = e.target.closest('.dp-jump a'); if (a) { e.preventDefault(); const t = document.querySelector(a.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
    });

    /* ---------- ganti fungsi openDetail lama ---------- */
    window.openDetail = function (id) {
        const driver = typeof driversData !== 'undefined' ? driversData[id] : null;
        if (!driver) return;
        showPage('detail-page');
        const root = page(); if (!root) return;
        root.innerHTML = markup(id, driver);
        const img = root.querySelector('.dp-photo img');
        if (img) {
            img.addEventListener('error', () => { const f = root.querySelector('.dp-photo'); if (f && !img.isConnected) f.classList.add('empty'); });
            img.addEventListener('load', () => { const f = root.querySelector('.dp-photo'); if (f) f.classList.remove('empty'); });
        }
        current = { id, driver, raw: null };
        loadStats(false, false);
    };

    // perbarui otomatis selama halaman profil terbuka
    setInterval(() => { const p = page(); if (current && p && p.classList.contains('active') && !document.hidden) loadStats(true, false); }, 5 * MIN);
})();