/* =========================================================
   HASIL BALAPAN (otomatis)
   Menu "Hasil" di navbar: pilih seri/GP + sesi, data diambil otomatis.
   Sesi: Latihan 1-3, Sprint, Kualifikasi, Grid Start, Ringkasan Pit Stop,
         Putaran Tercepat, Hasil Balapan (termasuk balapan sebelumnya).

   Sumber data (gratis, tanpa API key):
     - Jolpica F1 API : jadwal, kualifikasi, sprint, hasil balap, pit stop
     - OpenF1 API     : hasil Latihan 1-3

   Pasang: taruh sefolder dengan index.html, tambahkan di bawah klasemen.js:
       <script src="hasil.js"></script>
   ========================================================= */
(function () {
    'use strict';

    const JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    const OPENF1 = 'https://api.openf1.org/v1/';
    const MIN = 60e3, HOUR = 3600e3, DAY = 864e5;

    /* ---------- helper umum ---------- */
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const norm = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const flagImg = code => code ? `<img class="hs-flag" src="https://flagcdn.com/w40/${code}.png" alt="" loading="lazy" onerror="this.remove()">` : '';

    const COUNTRY = {
        Australia: 'au', China: 'cn', Japan: 'jp', USA: 'us', 'United States': 'us', Canada: 'ca', Monaco: 'mc', Spain: 'es',
        Austria: 'at', UK: 'gb', 'United Kingdom': 'gb', Belgium: 'be', Hungary: 'hu', Netherlands: 'nl', Italy: 'it',
        Azerbaijan: 'az', Bahrain: 'bh', Singapore: 'sg', Mexico: 'mx', Brazil: 'br', Qatar: 'qa', UAE: 'ae',
        'United Arab Emirates': 'ae', 'Saudi Arabia': 'sa', Malaysia: 'my'
    };
    const isBahrain = r => /bahrain/i.test(r.raceName || '');
    const raceCode = r => isBahrain(r) ? 'bh' : (COUNTRY[r.Circuit.Location.country] || '');

    /* ---------- tim: nama dari data situs (teams.js), logo & warna ---------- */
    const TEAM_LOGO = {
        'mclaren': 'https://i.pinimg.com/1200x/72/64/4a/72644aef0c75a11905a848d485ba2fad.jpg',
        'haas': 'https://i.pinimg.com/1200x/92/fd/43/92fd431a41b0fadeee14fd11702680cb.jpg',
        'alpine': 'https://i.pinimg.com/1200x/89/65/2d/89652d94b80ad8d9bf6a59b2be5210d7.jpg',
        'ferrari': 'https://i.pinimg.com/736x/25/7f/fe/257ffe9204fa0004ff97fe9fdcb5c99b.jpg',
        'racing bulls': 'https://i.pinimg.com/736x/42/ad/59/42ad594511fbde88971da4812f72e293.jpg',
        'red bull': 'https://i.pinimg.com/1200x/28/ee/6c/28ee6c55b8e3d6414342daf10d97fe5a.jpg',
        'cadillac': 'https://i.pinimg.com/736x/92/3d/58/923d581d5325793b207ccba147d50ed5.jpg',
        'mercedes': 'https://i.pinimg.com/736x/31/fb/08/31fb0838a14408a5cd6fa946d277cbbb.jpg',
        'williams': 'https://i.pinimg.com/736x/ea/35/df/ea35df160123cc7a1383d329e63c7ddb.jpg',
        'audi': 'https://i.pinimg.com/736x/b0/f7/eb/b0f7eb6e9c6d5923a044bf4bfa9bcd68.jpg',
        'aston martin': 'https://i.pinimg.com/1200x/b6/4a/57/b64a5745c7786e8b5c96df096eeebb69.jpg'
    };
    const TEAM_ALIAS = [['rb f1', 'racing bulls'], ['visa cash', 'racing bulls'], ['sauber', 'audi']];
    const TEAM_COLOR = [['mercedes', '#27F4D2'], ['ferrari', '#E8002D'], ['mclaren', '#FF8000'], ['racing bulls', '#6692FF'], ['red bull', '#3671C6'],
        ['alpine', '#00A1E8'], ['haas', '#B6BABD'], ['audi', '#F50537'], ['sauber', '#F50537'], ['williams', '#1868DB'], ['aston', '#229971'], ['cadillac', '#AAAAAD']];
    const teamKey = name => { let n = norm(name); const a = TEAM_ALIAS.find(([k]) => n.includes(k)); if (a) n = a[1]; return n; };
    const teamLogo = name => { const n = teamKey(name), k = Object.keys(TEAM_LOGO).find(x => n.includes(x)); return k ? TEAM_LOGO[k] : ''; };
    const teamColor = name => { const n = teamKey(name), t = TEAM_COLOR.find(([k]) => n.includes(k)); return t ? t[1] : '#777'; };

    function siteTeam(given, family) {
        if (typeof teamsData === 'undefined' || !Array.isArray(teamsData)) return '';
        const full = norm(given + ' ' + family), last = norm(family), ini = norm(given).charAt(0);
        let hit = teamsData.find(t => (t.drivers || []).some(n => norm(n) === full));
        if (!hit) hit = teamsData.find(t => (t.drivers || []).some(n => { const w = norm(n).split(/\s+/); return w[w.length - 1] === last && w[0].charAt(0) === ini; }));
        return hit ? (hit.name || hit.short || hit.team || '') : '';
    }
    function teamCell(name) {
        const dot = `<i class="hs-dot" style="background:${teamColor(name)}"></i>`, src = teamLogo(name);
        const ic = src ? `<img class="hs-logo" src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=this.dataset.dot" data-dot="${esc(dot)}">` : dot;
        return `<span class="hs-team">${ic}${esc(name)}</span>`;
    }
    const titleCase = s => (s && s === s.toUpperCase()) ? s.charAt(0) + s.slice(1).toLowerCase() : s;

    /* ---------- gaya ---------- */
    const css = document.createElement('style');
    css.textContent = `
        .hs-wrap { max-width: 1100px; margin: 28px auto 48px; padding: 0 18px; }
        .hs-bar { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .hs-dd { position: relative; }
        .hs-dd-btn { display: flex; align-items: center; gap: 10px; padding: 9px 16px; border-radius: 999px; cursor: pointer; font: inherit; font-weight: 600; font-size: .9rem;
                     color: #f2efea; background: rgba(14,15,20,.82); border: 1px solid rgba(255,255,255,.22); }
        .hs-dd-btn:hover { border-color: rgba(255,255,255,.5); }
        .hs-dd-btn i { font-style: normal; font-size: .7rem; opacity: .7; }
        .hs-dd-list { position: absolute; z-index: 30; top: calc(100% + 8px); left: 0; min-width: 100%; max-height: 340px; overflow-y: auto; margin: 0; padding: 6px; list-style: none;
                      background: #15171d; border: 1px solid rgba(255,255,255,.18); border-radius: 14px; box-shadow: 0 18px 40px rgba(0,0,0,.5); }
        .hs-dd-list[hidden] { display: none; }
        .hs-dd-list li { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: .86rem; font-weight: 600; white-space: nowrap; color: #f2efea; }
        .hs-dd-list li:hover { background: rgba(255,255,255,.09); }
        .hs-dd-list li.on { background: rgba(255,255,255,.14); }
        .hs-flag { height: 13px; width: auto; border-radius: 2px; box-shadow: 0 0 0 1px rgba(255,255,255,.2); }
        .hs-head { position: relative; overflow: hidden; margin: 26px 0 20px; padding: 26px 30px 24px; border-radius: 22px; isolation: isolate;
                   background: linear-gradient(135deg, #17181f 0%, #0c0d11 100%);
                   border: 1px solid rgba(255,255,255,.10); box-shadow: 0 18px 40px rgba(0,0,0,.35); }
        .hs-head::before { content: ""; position: absolute; inset: 0; z-index: -1; opacity: .5;
                           background: repeating-linear-gradient(115deg, rgba(255,255,255,.045) 0 2px, transparent 2px 64px); }
        .hs-head::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 6px; z-index: 1;
                          background: conic-gradient(#f2f2f2 25%, #111 0 50%, #f2f2f2 0 75%, #111 0) 0 0 / 12px 12px; opacity: .85; }
        .hs-ghost { position: absolute; right: 22px; bottom: -34px; z-index: -1; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-style: italic; font-weight: 800;
                    font-size: clamp(7rem, 20vw, 11rem); line-height: 1; letter-spacing: -.02em; color: rgba(255,255,255,.05); user-select: none; pointer-events: none; }
        .hs-top { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
        .hs-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .hs-chip { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 999px; font-size: .68rem; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
                   color: #d9d9e0; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.14); }
        .hs-chip i { width: 7px; height: 7px; border-radius: 50%; background: #8d8d98; }
        .hs-chip.done i { background: #35d07f; }
        .hs-chip.live { color: #fff; background: rgba(225,6,0,.22); border-color: rgba(255,70,60,.6); }
        .hs-chip.live i { background: #ff3b30; animation: hsPulse 1.3s ease-in-out infinite; }
        .hs-chip.next i { background: #f5b942; }
        @keyframes hsPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,59,48,.7); } 50% { box-shadow: 0 0 0 6px rgba(255,59,48,0); } }
        .hs-head .hs-flag { height: auto; width: 58px; border-radius: 6px; box-shadow: 0 0 0 1px rgba(255,255,255,.28), 0 6px 18px rgba(0,0,0,.45); }
        .hs-gp { margin: 0; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; font-style: italic; text-transform: uppercase;
                 font-size: clamp(2rem, 6vw, 3.6rem); line-height: .98; letter-spacing: .005em; color: #fff; }
        .hs-meta { display: flex; flex-wrap: wrap; gap: 10px 26px; margin-top: 20px; font-size: .82rem; color: #b8b8c2; text-align: left; }
        .hs-meta span { display: inline-flex; align-items: center; gap: 8px; }
        .hs-meta svg { width: 15px; height: 15px; flex: none; stroke: #8d8d98; }
        .hs-meta b { color: #f2efea; font-weight: 700; letter-spacing: .05em; }
        .hs-card { background: rgba(14,15,20,.82); border: 1px solid rgba(255,255,255,.1); border-radius: 18px; padding: 6px 18px 10px; overflow-x: auto; }
        .hs-table { width: 100%; border-collapse: collapse; min-width: 640px; }
        .hs-table th { text-align: left; font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; color: #8d8d98; font-weight: 600; padding: 14px 8px 10px; border-bottom: 1px solid rgba(255,255,255,.14); white-space: nowrap; }
        .hs-table td { padding: 11px 8px; border-bottom: 1px solid rgba(255,255,255,.07); font-size: .88rem; color: #f2efea; white-space: nowrap; font-variant-numeric: tabular-nums; }
        .hs-table tr:last-child td { border-bottom: 0; }
        .hs-table .hs-r { text-align: right; }
        .hs-table td:first-child { color: #a9a9b3; }
        .hs-table tbody tr:nth-child(-n+3) td:first-child { color: #fff; font-weight: 700; }
        .hs-team { display: inline-flex; align-items: center; }
        .hs-logo { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; margin-right: 10px; background: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,.18); }
        .hs-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin: 0 11px 0 6px; }
        .hs-msg { padding: 34px 8px; text-align: center; color: #a9a9b3; white-space: normal; }
        @media (max-width: 640px) { .hs-hide { display: none; } .hs-table { min-width: 0; } .hs-head { padding: 20px 18px 22px; border-radius: 18px; } .hs-head .hs-flag { width: 42px; } .hs-meta { gap: 8px 18px; } }
        /* animasi masuk halaman Hasil: tirai menyapu dari kiri, header meluncur, baris tabel muncul satu per satu (beda dari Klasemen) */
        #hasil-page.active { animation: hsWipe .65s cubic-bezier(.75, 0, .2, 1) backwards !important; }
        #hasil-page.active .hs-bar { animation: hsDrop .5s .25s cubic-bezier(.2, .8, .2, 1) backwards; }
        #hasil-page.active .hs-head { animation: hsSlide .6s .15s cubic-bezier(.2, .8, .2, 1) backwards; }
        #hasil-page.active .hs-table tbody tr { animation: hsRow .42s cubic-bezier(.2, .8, .2, 1) backwards; }
        #hs-body.hs-silent .hs-table tbody tr { animation: none; }
        ${Array.from({ length: 24 }, (_, i) => `#hasil-page.active .hs-table tbody tr:nth-child(${i + 1}) { animation-delay: ${(0.35 + i * 0.035).toFixed(3)}s; }`).join('\n        ')}
        @keyframes hsWipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes hsSlide { from { opacity: 0; transform: translateX(-60px) skewX(-8deg); } to { opacity: 1; transform: none; } }
        @keyframes hsDrop { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        @keyframes hsRow { from { opacity: 0; transform: translateX(34px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { #hasil-page.active, #hasil-page.active * { animation: none !important; } }
        /* lampu hover navbar */
        .navbar .nav-glow { display: none !important; }
        .nav-lamp { position: absolute; top: 0; left: 0; height: 3px; border-radius: 0 0 3px 3px; background: #fff; opacity: 0; pointer-events: none; z-index: 2;
                    box-shadow: 0 0 10px 1px rgba(255,255,255,.55), 0 8px 16px rgba(255,255,255,.22);
                    transition: transform .28s cubic-bezier(.4,0,.2,1), width .28s cubic-bezier(.4,0,.2,1), opacity .2s ease; }
        @media (max-width: 700px) { .nav-lamp { display: none; } }`;
    document.head.appendChild(css);

    /* ---------- ambil data (cache + cadangan data lama kalau API gagal) ---------- */
    const mem = new Map();
    async function getJSON(url, ttl) {
        const key = 'hasil:' + url, now = Date.now();
        let old = mem.get(url);
        if (!old) { try { old = JSON.parse(localStorage.getItem(key) || 'null') || undefined; } catch (e) { /* abaikan */ } }
        if (old && now - old.t < (old.e ? Math.min(ttl, 3 * 60 * 1000) : ttl)) { mem.set(url, old); return old.v; }   // hasil kosong hanya disimpan 3 menit
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const val = await res.json();
            const rt = val && val.MRData && val.MRData.RaceTable;
            const rec = { t: now, v: val, e: !!(rt && !(rt.Races && rt.Races.length)) };   // e = hasil masih kosong
            mem.set(url, rec);
            try { const s = JSON.stringify(rec); if (s.length < 150000) localStorage.setItem(key, s); } catch (e) { /* abaikan */ }
            return rec.v;
        } catch (err) {
            if (old) return old.v;
            throw err;
        }
    }

    /* ---------- state & helper balapan ---------- */
    const state = { races: [], round: null, session: 'race' };
    const raceStart = r => new Date(r.date + 'T' + (r.time || '12:00:00Z'));
    const finished = r => Date.now() > raceStart(r).getTime() + 6 * HOUR;
    const ttlFor = r => finished(r) ? 24 * HOUR : 3 * MIN;
    const curRace = () => state.races.find(r => r.round === state.round);

    const SESSIONS = [
        { id: 'fp1', label: 'Latihan 1', of: 'Practice 1' },
        { id: 'fp2', label: 'Latihan 2', of: 'Practice 2', noSprint: true },
        { id: 'fp3', label: 'Latihan 3', of: 'Practice 3', noSprint: true },
        { id: 'sprint', label: 'Sprint', onlySprint: true },
        { id: 'q', label: 'Kualifikasi' },
        { id: 'grid', label: 'Grid Start' },
        { id: 'pit', label: 'Ringkasan Pit Stop' },
        { id: 'fl', label: 'Putaran Tercepat' },
        { id: 'race', label: 'Hasil Balapan' }
    ];
    const sessionsFor = r => SESSIONS.filter(s => !(s.noSprint && r.Sprint) && !(s.onlySprint && !r.Sprint));

    const msg = t => `<div class="hs-card"><div class="hs-msg">${esc(t)}</div></div>`;
    const EMPTY = msg('Hasil sesi ini belum tersedia. Coba lagi setelah sesi selesai.');
    function table(cols, rows) {
        return `<div class="hs-card"><table class="hs-table"><thead><tr>${cols.map(c => `<th class="${c[1] || ''}">${esc(c[0])}</th>`).join('')}</tr></thead><tbody>` +
            rows.map(r => `<tr>${r.map((v, i) => `<td class="${cols[i][1] || ''}">${v}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
    }
    const fullName = d => `${d.givenName} ${d.familyName}`;
    const teamOf = (d, c) => siteTeam(d.givenName, d.familyName) || (c && c.name) || '';
    const fmtLap = s => { s = Number(s); if (!isFinite(s) || s <= 0) return '—'; const m = Math.floor(s / 60), r = (s - m * 60).toFixed(3).padStart(6, '0'); return m ? `${m}:${r}` : r; };

    async function jol(race, file) {
        const j = await getJSON(`${JOLPICA}${race.season}/${race.round}/${file}.json?limit=100`, ttlFor(race));
        return (j.MRData.RaceTable.Races || [])[0] || {};
    }

    /* ---------- pembuat tabel tiap sesi ---------- */
    async function raceLike(race, file, key) {
        const L = (await jol(race, file))[key] || [];
        if (!L.length) return EMPTY;
        return table([['Pos'], ['No'], ['Pembalap'], ['Tim'], ['Lap', 'hs-hide'], ['Waktu / Pensiun'], ['Poin', 'hs-r']],
            L.map(x => [esc(x.positionText || x.position), esc(x.number), esc(fullName(x.Driver)), teamCell(teamOf(x.Driver, x.Constructor)),
                esc(x.laps), esc((x.Time && x.Time.time) || x.status), esc(x.points)]));
    }

    async function qualifying(race) {
        const L = (await jol(race, 'qualifying')).QualifyingResults || [];
        if (!L.length) return EMPTY;
        return table([['Pos'], ['No'], ['Pembalap'], ['Tim'], ['Q1'], ['Q2'], ['Q3']],
            L.map(x => [esc(x.position), esc(x.number), esc(fullName(x.Driver)), teamCell(teamOf(x.Driver, x.Constructor)), esc(x.Q1 || '—'), esc(x.Q2 || '—'), esc(x.Q3 || '—')]));
    }

    async function startingGrid(race) {
        const L = ((await jol(race, 'results')).Results || []).slice();
        if (!L.length) return EMPTY;
        const g = x => Number(x.grid) || 99;               // grid 0 = start dari pit lane
        L.sort((a, b) => g(a) - g(b));
        return table([['Pos'], ['No'], ['Pembalap'], ['Tim']],
            L.map(x => [Number(x.grid) ? esc(x.grid) : 'PL', esc(x.number), esc(fullName(x.Driver)), teamCell(teamOf(x.Driver, x.Constructor))]));
    }

    async function pitStops(race) {
        const [res, pit] = await Promise.all([jol(race, 'results'), jol(race, 'pitstops')]);
        const L = (pit.PitStops || []).slice();
        if (!L.length) return msg('Data pit stop belum tersedia.');
        const by = {}; (res.Results || []).forEach(x => { by[x.Driver.driverId] = x; });
        L.sort((a, b) => String(a.time).localeCompare(String(b.time)));
        return table([['Stop'], ['No'], ['Pembalap'], ['Tim'], ['Lap'], ['Waktu', 'hs-hide'], ['Durasi', 'hs-r']],
            L.map(p => { const r = by[p.driverId]; return [esc(p.stop), esc(r ? r.number : ''), esc(r ? fullName(r.Driver) : p.driverId),
                r ? teamCell(teamOf(r.Driver, r.Constructor)) : '', esc(p.lap), esc(p.time), esc(p.duration)]; }));
    }

    async function fastestLaps(race) {
        const L = ((await jol(race, 'results')).Results || []).filter(x => x.FastestLap);
        if (!L.length) return EMPTY;
        L.sort((a, b) => Number(a.FastestLap.rank) - Number(b.FastestLap.rank));
        return table([['Pos'], ['No'], ['Pembalap'], ['Tim'], ['Lap'], ['Waktu'], ['Kec. rata-rata', 'hs-r hs-hide']],
            L.map(x => { const f = x.FastestLap, sp = f.AverageSpeed; return [esc(f.rank), esc(x.number), esc(fullName(x.Driver)), teamCell(teamOf(x.Driver, x.Constructor)),
                esc(f.lap), esc(f.Time && f.Time.time), esc(sp ? `${sp.speed} ${sp.units || 'kph'}` : '—')]; }));
    }

    async function practice(race, name) {
        const all = await getJSON(`${OPENF1}sessions?year=${race.season}`, HOUR);
        const t0 = Date.parse(race.date + 'T00:00:00Z');
        const s = (all || []).find(x => x.session_name === name && Date.parse(x.date_start) >= t0 - 5 * DAY && Date.parse(x.date_start) <= t0 + DAY);
        if (!s) return msg('Sesi ini tidak ada di akhir pekan ini, atau datanya belum tersedia.');
        const ttl = ttlFor(race), k = s.session_key;
        const [res, drv] = await Promise.all([getJSON(`${OPENF1}session_result?session_key=${k}`, ttl).catch(() => []), getJSON(`${OPENF1}drivers?session_key=${k}`, ttl)]);
        const D = {}; (drv || []).forEach(d => { D[d.driver_number] = d; });

        let rows = [];
        if (Array.isArray(res) && res.length) {
            rows = res.map(x => ({ no: x.driver_number, pos: x.position, t: Array.isArray(x.duration) ? x.duration.filter(Boolean).pop() : x.duration,
                gap: x.gap_to_leader, laps: x.number_of_laps, out: x.dns || x.dsq }));
            rows.sort((a, b) => (a.pos || 99) - (b.pos || 99));
        } else {                                              // cadangan: hitung dari waktu lap tercepat
            const laps = await getJSON(`${OPENF1}laps?session_key=${k}`, ttl);
            const best = {};
            (laps || []).forEach(l => {
                const b = best[l.driver_number] || (best[l.driver_number] = { no: l.driver_number, t: null, laps: 0 });
                b.laps++; if (l.lap_duration && (!b.t || l.lap_duration < b.t)) b.t = l.lap_duration;
            });
            rows = Object.values(best).filter(b => b.t).sort((a, b) => a.t - b.t);
            rows.forEach((b, i) => { b.pos = i + 1; b.gap = i ? b.t - rows[0].t : 0; });
        }
        if (!rows.length) return EMPTY;
        return table([['Pos'], ['No'], ['Pembalap'], ['Tim'], ['Waktu'], ['Selisih'], ['Lap', 'hs-hide']], rows.map(r => {
            const d = D[r.no] || {};
            const first = d.first_name || '', last = titleCase(d.last_name || '') || d.full_name || ('#' + r.no);
            const gap = typeof r.gap === 'number' ? (r.gap > 0 ? '+' + r.gap.toFixed(3) : '—') : (r.gap || '—');
            return [esc(r.pos || '—'), esc(r.no), esc((first + ' ' + last).trim()), teamCell(siteTeam(first, last) || d.team_name || ''),
                esc(r.out ? '—' : fmtLap(r.t)), esc(gap), esc(r.laps == null ? '—' : r.laps)];
        }));
    }

    const BUILD = {
        fp1: r => practice(r, 'Practice 1'), fp2: r => practice(r, 'Practice 2'), fp3: r => practice(r, 'Practice 3'),
        sprint: r => raceLike(r, 'sprint', 'SprintResults'), q: qualifying, grid: startingGrid, pit: pitStops, fl: fastestLaps,
        race: r => raceLike(r, 'results', 'Results')
    };

    /* ---------- tampilan ---------- */
    const page = document.createElement('div');
    page.id = 'hasil-page';
    page.className = 'page';
    page.innerHTML = `<section class="hs-wrap" aria-label="Hasil balapan">
        <div class="hs-bar" id="hs-bar"></div>
        <header class="hs-head">
            <span class="hs-ghost" id="hs-ghost" aria-hidden="true"></span>
            <div class="hs-top"><div class="hs-chips"><span class="hs-chip" id="hs-status"><i></i><em style="font-style:normal">—</em></span><span class="hs-chip" id="hs-round"></span></div><span id="hs-flag"></span></div>
            <h2 class="hs-gp" id="hs-title">Hasil</h2>
            <div class="hs-meta">
                <span><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg><b id="hs-date"></b></span>
                <span><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span id="hs-circuit"></span></span>
            </div>
        </header>
        <div id="hs-body"><div class="hs-card"><div class="hs-msg">Memuat…</div></div></div></section>`;

    const dds = [];
    function makeDD(onPick) {
        const el = document.createElement('div'); el.className = 'hs-dd';
        el.innerHTML = '<button type="button" class="hs-dd-btn"><span></span><i>▾</i></button><ul class="hs-dd-list" hidden></ul>';
        const btn = el.firstChild, list = el.lastChild, label = btn.querySelector('span');
        btn.addEventListener('click', e => { e.stopPropagation(); const open = list.hidden; dds.forEach(d => d.close()); list.hidden = !open; });
        list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) { list.hidden = true; onPick(li.dataset.v); } });
        const dd = {
            el, close() { list.hidden = true; },
            set(items, cur) {
                list.innerHTML = items.map(i => `<li data-v="${esc(i.v)}" class="${i.v === cur ? 'on' : ''}">${i.html}</li>`).join('');
                const c = items.find(i => i.v === cur); label.innerHTML = c ? `<span style="display:inline-flex;align-items:center;gap:8px">${c.html}</span>` : '';
            }
        };
        dds.push(dd); return dd;
    }
    document.addEventListener('click', () => dds.forEach(d => d.close()));

    const ddRace = makeDD(v => { state.round = v; const r = curRace(); if (!sessionsFor(r).some(s => s.id === state.session)) state.session = 'race'; refreshBar(); show(); });
    const ddSess = makeDD(v => { state.session = v; refreshBar(); show(); });

    function raceItems() {
        const cnt = {}; state.races.forEach(r => { const k = isBahrain(r) ? 'Bahrain' : r.Circuit.Location.country; cnt[k] = (cnt[k] || 0) + 1; });
        return state.races.map(r => {
            const c = isBahrain(r) ? 'Bahrain' : r.Circuit.Location.country;
            const name = cnt[c] > 1 ? `${c} · ${r.Circuit.Location.locality}` : c;
            return { v: r.round, html: `${flagImg(raceCode(r))}<span>${esc(name)}</span>` };
        });
    }
    function refreshBar() {
        const r = curRace();
        ddRace.set(raceItems(), state.round);
        ddSess.set(sessionsFor(r).map(s => ({ v: s.id, html: `<span>${esc(s.label)}</span>` })), state.session);
    }

    function dateRange(r) {
        const end = new Date(r.date + 'T00:00:00Z'), start = r.FirstPractice ? new Date(r.FirstPractice.date + 'T00:00:00Z') : new Date(end - 2 * DAY);
        const m = d => d.toLocaleString('id-ID', { month: 'short', timeZone: 'UTC' }).toUpperCase(), dd = d => String(d.getUTCDate()).padStart(2, '0');
        return start.getUTCMonth() === end.getUTCMonth()
            ? `${dd(start)} - ${dd(end)} ${m(end)} ${end.getUTCFullYear()}` : `${dd(start)} ${m(start)} - ${dd(end)} ${m(end)} ${end.getUTCFullYear()}`;
    }

    let token = 0;
    async function show(silent) {
        const r = curRace(); if (!r) return;
        const my = ++token, s = SESSIONS.find(x => x.id === state.session);
        const now = Date.now(), st = raceStart(r).getTime(), stat = now < st - 2 * DAY ? ['next', 'Akan datang'] : now <= st + 3 * HOUR ? ['live', 'Berlangsung'] : ['done', 'Selesai'];
        const chip = document.getElementById('hs-status'); chip.className = 'hs-chip ' + stat[0]; chip.lastChild.textContent = stat[1];
        document.getElementById('hs-round').textContent = `Ronde ${String(r.round).padStart(2, '0')} / ${state.races.length}`;
        document.getElementById('hs-ghost').textContent = String(r.round).padStart(2, '0');
        document.getElementById('hs-title').textContent = `${r.raceName} ${r.season}`;
        document.getElementById('hs-date').textContent = dateRange(r);
        document.getElementById('hs-circuit').textContent = `${r.Circuit.circuitName}, ${r.Circuit.Location.locality}`;
        document.getElementById('hs-flag').innerHTML = flagImg(raceCode(r));
        const body = document.getElementById('hs-body');
        if (!silent) body.innerHTML = msg('Memuat…');
        try {
            const html = await BUILD[state.session](r);
            if (my === token) { body.innerHTML = html; body.classList.toggle('hs-silent', !!silent); }
        } catch (err) {
            if (my === token && !silent) body.innerHTML = msg('Data belum bisa dimuat (server data sedang sibuk atau sesi masih berlangsung). Coba lagi beberapa saat.');
        }
    }

    /* ---------- menu navbar + halaman ---------- */
    let ready = null;
    function ensure() {
        if (!ready) ready = (async () => {
            try {
                const j = await getJSON(`${JOLPICA}current.json?limit=100`, HOUR);
                state.races = j.MRData.RaceTable.Races || [];
            } catch (e) { state.races = []; }
            if (!state.races.length) { document.getElementById('hs-body').innerHTML = msg('Jadwal belum bisa dimuat. Coba muat ulang halaman.'); return false; }
            const started = state.races.filter(r => raceStart(r).getTime() <= Date.now());
            state.round = (started.length ? started[started.length - 1] : state.races[0]).round;
            refreshBar();
            return true;
        })();
        return ready;
    }
    async function open() { if (await ensure()) show(); else ready = null; }
    // dipakai halaman Schedule: buka Hasil Balapan untuk ronde tertentu
    window.openHasilRound = async function (round) {
        if (typeof showPage === 'function') showPage('hasil-page');
        if (!(await ensure())) { ready = null; return; }
        if (state.races.some(r => r.round === String(round))) { state.round = String(round); state.session = 'race'; refreshBar(); }
        show();
    };


    /* ---------- lampu hover navbar (berlaku untuk SEMUA menu, termasuk yang ditambah lewat JS) ---------- */
    function setupNav(menu) {
        const nav = menu && menu.closest('.navbar');
        if (!nav || nav.querySelector('.nav-lamp')) return;
        const lamp = document.createElement('span'); lamp.className = 'nav-lamp'; lamp.setAttribute('aria-hidden', 'true'); nav.appendChild(lamp);
        let shown = false;
        function moveTo(a) {
            const n = nav.getBoundingClientRect(), r = a.getBoundingClientRect(), t = `translate(${(r.left - n.left).toFixed(1)}px, ${(r.top - n.top - 6).toFixed(1)}px)`;
            if (!shown) { lamp.style.transition = 'none'; lamp.style.width = r.width + 'px'; lamp.style.transform = t; void lamp.offsetWidth; lamp.style.transition = ''; shown = true; }
            else { lamp.style.width = r.width + 'px'; lamp.style.transform = t; }
            lamp.style.opacity = '1';
        }
        let cur = null;   // menu yang sedang ditunjuk lampu
        const hide = () => { lamp.style.opacity = '0'; shown = false; cur = null; };
        // Hitung ulang posisi lampu setelah tata letak navbar bergeser (mis. kolom cari muncul/hilang saat pindah halaman)
        function resync() {
            const hovered = [...menu.querySelectorAll('a')].find(x => x.matches(':hover, :focus-visible'));
            if (hovered) { cur = hovered; moveTo(hovered); } else hide();
        }
        let syncT = 0;
        function resyncSoon() {
            requestAnimationFrame(() => requestAnimationFrame(resync));
            clearTimeout(syncT); syncT = setTimeout(resync, 350);   // cadangan kalau tata letak baru selesai belakangan
        }
        window.addEventListener('resize', () => { if (cur) resync(); });
        menu.addEventListener('mouseover', e => { const a = e.target.closest('a'); if (a && menu.contains(a)) { cur = a; moveTo(a); } });
        menu.addEventListener('mouseleave', hide);
        menu.addEventListener('focusin', e => { const a = e.target.closest('a'); if (a) { cur = a; moveTo(a); } });
        menu.addEventListener('focusout', hide);

        // penanda menu aktif: Hasil menyala saat halamannya terbuka, menu lain dimatikan
        const link = menu.querySelector('[data-hasil]');
        const orig = window.showPage;
        if (typeof orig === 'function' && link && !orig.__hasil) {
            window.showPage = function (id) {
                const out = orig.apply(this, arguments);
                resyncSoon();
                if (id === 'hasil-page') { menu.querySelectorAll('a.active').forEach(x => x.classList.remove('active')); link.classList.add('active'); }
                else link.classList.remove('active');
                return out;
            };
            window.showPage.__hasil = true;
        }
    }

    function mount() {
        const after = document.getElementById('klasemen-page') || document.getElementById('circuits-page');
        if (after) after.after(page); else (document.getElementById('main-wrapper') || document.body).appendChild(page);
        document.getElementById('hs-bar').append(ddRace.el, ddSess.el);

        const menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-hasil]')) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="#" data-hasil>Hasil</a>';
            li.firstChild.addEventListener('click', e => { e.preventDefault(); if (typeof showPage === 'function') showPage('hasil-page'); open(); });
            const items = [...menu.querySelectorAll('li')];
            const anchor = items.find(l => /klasemen/i.test(l.textContent)) || items.find(l => /sirkuit/i.test(l.textContent));
            if (anchor) anchor.after(li); else menu.appendChild(li);
        }
        setupNav(menu);
        // perbarui otomatis tiap 3 menit selama halaman dibuka & balapan masih baru/berjalan
        setInterval(() => {
            const r = curRace();
            if (page.classList.contains('active') && r && Date.now() - raceStart(r).getTime() < 2 * DAY) show(true);
        }, 3 * MIN);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();