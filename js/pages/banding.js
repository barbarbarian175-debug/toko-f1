/* =========================================================
   BANDINGKAN — head-to-head ala referensi Renault (hitam +
   garis kuning diagonal): dua kartu pembalap dengan foto besar
   dan baris statistik karier + musim berjalan.
   - Statistik musim: Jolpica results.json seluruh musim 2026.
   - Statistik karier: Jolpica drivers/{id}/results.json
     (paginasi, cache 6 jam) -> GP, menang, podium, pole, poin.
   ========================================================= */
(function () {
    'use strict';

    var JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    var YEAR = new Date().getFullYear();
    var CACHE_KEY = 'f1_cmp_cache';
    var CAREER_KEY = 'f1_cmp_career';
    var TTL = 20 * 60 * 1000;
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };

    var css = document.createElement('style');
    css.textContent = `
        .bd-wrap { position: relative; max-width: 1060px; margin: 0 auto; padding: 8px 16px 60px; color: #fff; text-align: left; }
        .bd-wrap h2 { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: clamp(2.4rem, 8vw, 4rem); margin: 14px 0 2px; text-transform: uppercase; font-style: italic; line-height: .95; }
        .bd-wrap h2::after { content: ''; display: block; width: 74px; height: 5px; background: #ffd500; margin-top: 12px; }
        .bd-wrap .bd-sub { color: #cfcfd6; margin: 0 0 20px; }
        .bd-pick { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: end; margin-bottom: 22px; }
        .bd-pick label { display: block; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #cfcfd6; margin-bottom: 6px; }
        .bd-pick select { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,.35); background: #111; color: #fff; font: 600 .95rem var(--f-body, 'Inter', sans-serif); }
        .bd-pick select:focus { border-color: #ffd500; outline: none; }
        .bd-swap { width: 46px; height: 46px; border-radius: 50%; border: 0; background: #ffd500; color: #111; font-size: 19px; font-weight: 800; cursor: pointer; }
        .bd-vs { position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: start; }
        .bd-vs::before { content: ''; position: absolute; top: 40px; left: -6%; width: 112%; height: 300px; background: #ffd500;
            transform: rotate(-7deg); transform-origin: center; z-index: 0; pointer-events: none; }
        .bd-vs > * { position: relative; z-index: 1; }
        .bd-mid { text-align: center; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; font-style: italic; font-size: 2.2rem; color: #ffd500; padding-top: 90px; text-shadow: 0 2px 12px rgba(0,0,0,.6); }
        .bd-card { background: #fff; color: #14151a; border-radius: 4px; overflow: hidden; box-shadow: 0 18px 40px rgba(0,0,0,.45); }
        .bd-card img { display: block; width: 100%; height: 250px; object-fit: cover; object-position: center top; background: #222; }
        .bd-card .bd-info { padding: 18px 20px 8px; }
        .bd-card .bd-name { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; text-transform: uppercase; font-size: 1.7rem; line-height: .95; }
        .bd-card .bd-role { margin-top: 6px; font-size: .78rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #6b717d; }
        .bd-card .bd-role::after { content: ''; display: block; width: 44px; height: 3px; background: #ffd500; margin-top: 8px; }
        .bd-card .bd-team { margin-top: 10px; font-weight: 700; font-size: .92rem; }
        .bd-rows { padding: 6px 20px 20px; }
        .bd-row { display: flex; justify-content: space-between; gap: 10px; padding: 9px 0; border-top: 1px solid rgba(20,21,26,.1); font-size: .92rem; }
        .bd-row span { color: #6b717d; }
        .bd-row b { font-variant-numeric: tabular-nums; }
        .bd-row b.win { color: #c80000; }
        .bd-row b.win::after { content: ' ▲'; font-size: .7em; }
        .bd-sec { margin: 14px 0 2px; font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #6b717d; }
        .bd-verdict { margin-top: 20px; padding: 16px 20px; border-radius: 4px; background: #ffd500; color: #111; font-size: 1.02rem; line-height: 1.5; font-weight: 600; }
        .bd-msg { padding: 22px; text-align: center; color: #cfcfd6; border: 1px dashed rgba(255,255,255,.35); border-radius: 12px; }
        @media (max-width: 700px) { .bd-vs { grid-template-columns: 1fr; } .bd-vs::before { top: 30px; height: 240px; } .bd-mid { padding: 4px 0; } .bd-card img { height: 210px; } .bd-pick { grid-template-columns: 1fr; } .bd-swap { justify-self: center; transform: rotate(90deg); } }`;
    document.head.appendChild(css);

    var drivers = [];
    function driverList() {
        if (typeof driversData === 'undefined') return [];
        return Object.keys(driversData).map(function (id) {
            var d = driversData[id];
            return { id: id, name: d.name, team: d.team, photo: d.photo || '', num: (d.stats && d.stats.Nomor) || '', debut: (d.stats && d.stats['Debut F1']) || '', nat: (d.stats && d.stats.Kebangsaan) || '' };
        }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    function cacheGet(key, ttl) {
        try { var c = JSON.parse(localStorage.getItem(key) || 'null'); if (c && Date.now() - c.ts < ttl) return c.data; } catch (e) {}
        return null;
    }
    function cacheSet(key, data) { try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {} }

    /* ---------- statistik musim (satu fetch) ---------- */
    function computeStats(races) {
        var by = {};
        races.forEach(function (r) {
            (r.Results || []).forEach(function (res) {
                var d = res.Driver || {};
                var key = norm((d.givenName || '') + ' ' + (d.familyName || ''));
                if (!key) return;
                var s = by[key] || (by[key] = { key: key, name: (d.givenName || '') + ' ' + (d.familyName || ''), team: (res.Constructor || {}).name || '', points: 0, wins: 0, podiums: 0, poles: 0, races: 0 });
                s.races++;
                s.points += Number(res.points || 0);
                var pos = parseInt(res.position, 10);
                if (pos === 1) s.wins++;
                if (pos >= 1 && pos <= 3) s.podiums++;
                if (String(res.grid) === '1') s.poles++;
            });
        });
        var arr = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return b.points - a.points; });
        arr.forEach(function (s, i) { s.champ = i + 1; });
        return arr;
    }
    var statsByName = null, statsReady = false, loadingStats = true;
    function loadStats(cb) {
        var cached = cacheGet(CACHE_KEY, TTL);
        if (cached) { statsByName = cached; statsReady = true; loadingStats = false; cb(true); return; }
        fetch(JOLPICA + YEAR + '/results.json?limit=2000')
            .then(function (r) { return r.json(); })
            .then(function (j) {
                var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                var map = {};
                computeStats(races).forEach(function (s) { map[s.key] = s; });
                statsByName = map; statsReady = true; loadingStats = false;
                cacheSet(CACHE_KEY, map);
                cb(true);
            })
            .catch(function () { statsReady = false; loadingStats = false; cb(false); });
    }

    /* ---------- statistik karier (per pembalap, paginasi) ---------- */
    var ID_OVERRIDE = { 'max verstappen': 'max_verstappen' };
    function idCandidates(name) {
        var clean = norm(name), parts = clean.split(/\s+/), last = parts[parts.length - 1], first = parts[0];
        return Array.from(new Set([ID_OVERRIDE[clean], last, first + '_' + last].filter(Boolean)));
    }
    function careerCache() { return cacheGet(CAREER_KEY, 6 * 3600e3) || {}; }
    function careerCacheSet(all) { cacheSet(CAREER_KEY, all); }
    function loadCareer(name, cb) {
        var all = careerCache();
        if (all[norm(name)]) { cb(all[norm(name)]); return; }
        var cands = idCandidates(name);
        var tried = 0;
        (function probe() {
            if (tried >= cands.length) { cb(null); return; }
            var id = cands[tried++];
            fetch(JOLPICA + 'drivers/' + id + '/results.json?limit=1')
                .then(function (r) { return r.json(); })
                .then(function (j) {
                    var total = Number((j.MRData && j.MRData.total) || 0);
                    if (!total) { probe(); return; }
                    var pages = Math.min(Math.ceil(total / 100), 6), done = 0;
                    var acc = { entered: 0, wins: 0, podiums: 0, poles: 0, points: 0, dob: '', nat: '' };
                    for (var off = 0; off < pages * 100; off += 100) {
                        fetch(JOLPICA + 'drivers/' + id + '/results.json?limit=100&offset=' + off)
                            .then(function (r) { return r.json(); })
                            .then(function (jj) {
                                var races = (jj.MRData && jj.MRData.RaceTable && jj.MRData.RaceTable.Races) || [];
                                races.forEach(function (rc) {
                                    (rc.Results || []).forEach(function (res) {
                                        var d = res.Driver || {};
                                        acc.entered++;
                                        acc.points += Number(res.points || 0);
                                        var pos = parseInt(res.position, 10);
                                        if (pos === 1) acc.wins++;
                                        if (pos >= 1 && pos <= 3) acc.podiums++;
                                        if (String(res.grid) === '1') acc.poles++;
                                        if (!acc.dob && d.dateOfBirth) acc.dob = d.dateOfBirth;
                                        if (!acc.nat && d.nationality) acc.nat = d.nationality;
                                    });
                                });
                                if (++done === pages) {
                                    var all2 = careerCache();
                                    all2[norm(name)] = acc;
                                    careerCacheSet(all2);
                                    cb(acc);
                                }
                            })
                            .catch(function () { if (++done === pages) cb(acc.entered ? acc : null); });
                    }
                })
                .catch(function () { probe(); });
        })();
    }

    var selA = null, selB = null, outEl = null, msgEl = null, verdictEl = null;
    var careerA = null, careerB = null;

    function statOf(name) { return statsByName ? (statsByName[norm(name)] || null) : null; }
    function findDriver(id) { return drivers.find(function (d) { return String(d.id) === String(id); }); }
    function fmtDob(iso) {
        if (!iso) return '—';
        var d = new Date(iso + 'T00:00:00Z');
        return isNaN(d) ? iso : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function render() {
        var a = findDriver(selA.value), b = findDriver(selB.value);
        if (!a || !b) return;
        if (a.id === b.id) { msgEl.hidden = false; msgEl.textContent = 'Pilih dua pembalap yang berbeda.'; outEl.innerHTML = ''; verdictEl.textContent = ''; return; }
        if (loadingStats) { msgEl.hidden = false; msgEl.textContent = 'Memuat statistik musim ' + YEAR + '…'; }
        else if (!statsReady) { msgEl.hidden = false; msgEl.textContent = 'Statistik live belum bisa dimuat (periksa koneksi). Menampilkan info dasar saja.'; }
        else msgEl.hidden = true;
        var sa = statOf(a.name), sb = statOf(b.name);
        var wins = { a: 0, b: 0 };
        function row(label, va, vb, inv) {
            var betterA = false, betterB = false;
            if (typeof va === 'number' && typeof vb === 'number') {
                if (inv) { betterA = va < vb; betterB = vb < va; } else { betterA = va > vb; betterB = vb > va; }
            } else if (typeof va === 'number' && vb == null) betterA = true;
            else if (typeof vb === 'number' && va == null) betterB = true;
            if (betterA) wins.a++;
            if (betterB) wins.b++;
            return { label: label, va: va, vb: vb, betterA: betterA, betterB: betterB };
        }
        function fmt(v) { return (v == null || v === '') ? '—' : String(v); }
        var ca = careerA, cb = careerB;
        var rowsA = [], rowsB = [];
        var defs = [
            ['Tanggal lahir', ca ? fmtDob(ca.dob) : null, cb ? fmtDob(cb.dob) : null, null],
            ['Kebangsaan', ca ? ca.nat : a.nat, cb ? cb.nat : b.nat, null],
            ['Debut F1', a.debut || '—', b.debut || '—', null],
            ['Grand Prix', ca ? ca.entered : null, cb ? cb.entered : null, false],
            ['Pole position', ca ? ca.poles : null, cb ? cb.poles : null, false],
            ['Podium', ca ? ca.podiums : null, cb ? cb.podiums : null, false],
            ['Menang', ca ? ca.wins : null, cb ? cb.wins : null, false],
            ['Poin karier', ca ? Math.round(ca.points) : null, cb ? Math.round(cb.points) : null, false]
        ];
        defs.forEach(function (d) { var r = row(d[0], d[1], d[2], d[3] === true); rowsA.push(r); rowsB.push(r); });
        function col(d, s, career, rows, side) {
            var html = '<div class="bd-card">' +
                (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy" onerror="this.remove()">' : '') +
                '<div class="bd-info"><div class="bd-name">' + esc(d.name) + '</div>' +
                '<div class="bd-role">Race Driver</div>' +
                '<div class="bd-team">' + esc(d.team) + (d.num ? ' • #' + esc(d.num) : '') + '</div></div>' +
                '<div class="bd-rows"><div class="bd-sec">Karier</div>';
            rows.forEach(function (r) {
                var v = side === 'a' ? r.va : r.vb, better = side === 'a' ? r.betterA : r.betterB;
                html += '<div class="bd-row"><span>' + esc(r.label) + '</span><b class="' + (better ? 'win' : '') + '">' + esc(fmt(v)) + '</b></div>';
            });
            html += '<div class="bd-sec">Musim ' + YEAR + '</div>';
            [['Poin', s ? s.points : null, false], ['Menang', s ? s.wins : null, false], ['Podium', s ? s.podiums : null, false], ['Pole', s ? s.poles : null, false]].forEach(function (st) {
                var other = side === 'a' ? sb : sa;
                var ov = other ? other[st[0].toLowerCase() === 'poin' ? 'points' : st[0].toLowerCase() === 'menang' ? 'wins' : st[0].toLowerCase() === 'podium' ? 'podiums' : 'poles'] : null;
                var v = st[1];
                var better = false;
                if (v != null && ov != null) better = v > ov; else if (v != null && ov == null) better = true;
                if (better) wins[side]++;
                html += '<div class="bd-row"><span>' + st[0] + '</span><b class="' + (better ? 'win' : '') + '">' + esc(fmt(v)) + '</b></div>';
            });
            return html + '</div></div>';
        }
        outEl.innerHTML = '<div class="bd-vs">' + col(a, sa, ca, rowsA, 'a') + '<div class="bd-mid">VS</div>' + col(b, sb, cb, rowsB, 'b') + '</div>';
        if (!statsReady && !ca && !cb) verdictEl.textContent = 'Data live belum tersedia — perbandingan statistik menyusul begitu API bisa dijangkau.';
        else if (wins.a === wins.b) verdictEl.innerHTML = '<b>' + esc(a.name) + '</b> dan <b>' + esc(b.name) + '</b> berimbang ' + wins.a + '–' + wins.b + ' di semua kategori yang dibandingkan.';
        else if (wins.a > wins.b) verdictEl.innerHTML = '<b>' + esc(a.name) + '</b> unggul ' + wins.a + '–' + wins.b + ' atas <b>' + esc(b.name) + '</b>.';
        else verdictEl.innerHTML = '<b>' + esc(b.name) + '</b> unggul ' + wins.b + '–' + wins.a + ' atas <b>' + esc(a.name) + '</b>.';
    }

    function refreshCareer() {
        var a = findDriver(selA.value), b = findDriver(selB.value);
        if (!a || !b) return;
        careerA = null; careerB = null;
        var done = 0;
        function check() { if (++done === 2) render(); }
        loadCareer(a.name, function (c) { careerA = c; check(); });
        loadCareer(b.name, function (c) { careerB = c; check(); });
    }

    function mount() {
        drivers = driverList();
        var wrapper = document.getElementById('main-wrapper') || document.body;
        var page = document.createElement('div');
        page.id = 'banding-page';
        page.className = 'page';
        var opts = drivers.map(function (d) { return '<option value="' + esc(d.id) + '">' + esc(d.name) + ' (' + esc(d.team) + ')</option>'; }).join('');
        page.innerHTML = '<div class="bd-wrap"><h2>Bandingkan<br>Pembalap</h2>' +
            '<p class="bd-sub">Head-to-head musim ' + YEAR + ' & karier • data live dari Jolpica</p>' +
            '<div class="bd-pick"><div><label>Pembalap 1</label><select id="bd-a">' + opts + '</select></div>' +
            '<button type="button" class="bd-swap" id="bd-swap" aria-label="Tukar">⇄</button>' +
            '<div><label>Pembalap 2</label><select id="bd-b">' + opts + '</select></div></div>' +
            '<div class="bd-msg" id="bd-msg" hidden></div>' +
            '<div id="bd-out"></div><div class="bd-verdict" id="bd-verdict">Memuat statistik…</div></div>';
        var after = document.getElementById('favorit-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        selA = page.querySelector('#bd-a');
        selB = page.querySelector('#bd-b');
        outEl = page.querySelector('#bd-out');
        msgEl = page.querySelector('#bd-msg');
        verdictEl = page.querySelector('#bd-verdict');
        selA.addEventListener('change', function () { render(); refreshCareer(); });
        selB.addEventListener('change', function () { render(); refreshCareer(); });
        page.querySelector('#bd-swap').addEventListener('click', function () {
            var t = selA.value; selA.value = selB.value; selB.value = t; render(); refreshCareer();
        });
        var menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-banding]')) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-banding onclick="showPage(\'banding-page\'); return false;">Bandingkan</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var fav = links.find(function (l) { return /favorit/i.test(l.textContent); });
            if (fav) fav.after(li); else menu.appendChild(li);
        }
        loadStats(function () {
            var sorted = drivers.slice().sort(function (x, y) {
                var sx = statOf(x.name), sy = statOf(y.name);
                return ((sy && sy.points) || 0) - ((sx && sx.points) || 0);
            });
            if (sorted.length > 1) { selA.value = sorted[0].id; selB.value = sorted[1].id; }
            render();
            refreshCareer();
        });
        render();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
