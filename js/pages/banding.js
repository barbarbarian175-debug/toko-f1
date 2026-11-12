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

    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@700&family=Ubuntu:wght@400;500;700&display=swap';
    document.head.appendChild(fl);

    var css = document.createElement('style');
    css.textContent = `
        .bd-wrap { --serif: 'PT Serif', Georgia, 'Times New Roman', serif; --sans: 'Ubuntu', var(--f-body, 'Inter'), sans-serif;
            max-width: 1060px; margin: 0 auto; padding: 8px 0 60px; text-align: left; font-family: var(--sans); }
        /* ---- hero hitam + pita kuning diagonal ---- */
        .bd-hero { position: relative; overflow: hidden; background: #000; color: #fff; min-height: 430px; padding: 76px 7% 60px; }
        .bd-band { position: absolute; inset: 0; z-index: 0; pointer-events: none;
            background: linear-gradient(90deg, #f0a200 0%, #ffdc3a 100%);
            clip-path: polygon(52% 100%, 86% 0, 100% 0, 100% 20%, 73% 100%); }
        .bd-hero-in { position: relative; z-index: 1; }
        .bd-hero h2 { margin: 0; font-family: var(--serif); font-weight: 700; text-transform: uppercase; line-height: 1.08;
            font-size: clamp(2.1rem, 7.2vw, 4rem); letter-spacing: .01em; }
        .bd-hero h2 .l2 { display: flex; align-items: center; gap: 18px; }
        .bd-hero h2 .dash { display: inline-block; width: clamp(40px, 9vw, 76px); height: 2px; background: #fff; }
        .bd-hero p { margin: 28px 0 0; max-width: 340px; color: #fff; font-size: .95rem; line-height: 1.65; }
        .bd-note { position: absolute; right: 7%; bottom: 34px; z-index: 1; text-align: right; color: #fff; font-size: .95rem; line-height: 1.5; }
        /* ---- bagian putih ---- */
        .bd-body { position: relative; background: #fff; color: #111; padding: 44px 6% 56px; overflow: hidden; }
        .bd-mark { position: absolute; left: 0; right: 0; top: 6px; text-align: center; font-family: var(--serif); font-weight: 700;
            font-size: clamp(6rem, 22vw, 11rem); line-height: 1; color: #f2f2f2; letter-spacing: .04em; pointer-events: none; user-select: none; }
        .bd-body h3 { position: relative; margin: 0; text-align: center; font-family: var(--serif); font-weight: 700; text-transform: uppercase;
            font-size: clamp(1.4rem, 4vw, 1.9rem); padding-top: clamp(36px, 8vw, 72px); color: #111; }
        .bd-lead { position: relative; margin: 14px auto 34px; max-width: 420px; text-align: center; color: #777; font-size: .95rem; line-height: 1.6; }
        .bd-pick { position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px; align-items: end; max-width: 760px; margin: 0 auto 38px; }
        .bd-pick label { display: block; font-size: .78rem; color: #777; margin-bottom: 4px; }
        .bd-pick select { width: 100%; padding: 10px 2px; border: 0; border-bottom: 2px solid #111; border-radius: 0; background: transparent; color: #111; font: 500 .95rem var(--sans); }
        .bd-pick select:focus { outline: none; border-bottom-color: #f0a200; }
        .bd-swap { width: 42px; height: 42px; border-radius: 50%; border: 0; background: linear-gradient(135deg, #f0a200, #ffdc3a); color: #111; font-size: 18px; font-weight: 700; cursor: pointer; }
        .bd-vs { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 7vw, 90px); max-width: 860px; margin: 0 auto; }
        .bd-card { min-width: 0; }
        .bd-photo { position: relative; width: min(100%, 300px); margin: 0 auto; background: #efefef;
            clip-path: polygon(0 0, 100% 0, 100% 96%, 0 100%); }
        .bd-photo img { display: block; width: 100%; height: 280px; object-fit: cover; object-position: center top; }
        .bd-info { padding: 22px 0 0 clamp(14px, 12%, 40px); }
        .bd-name { font-family: var(--serif); font-weight: 700; text-transform: uppercase; font-size: clamp(1.3rem, 3.4vw, 1.75rem); line-height: 1.12; color: #111; }
        .bd-name::after { content: ''; display: block; width: 70px; height: 3px; margin-top: 12px; background: linear-gradient(90deg, #f0a200, #ffdc3a); }
        .bd-role { margin-top: 14px; font-size: .95rem; text-transform: uppercase; color: #777; letter-spacing: .02em; }
        .bd-team { margin-top: 4px; font-size: .82rem; color: #999; }
        .bd-rows { margin-top: 22px; }
        .bd-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 3px 0; font-size: .95rem; line-height: 1.5; }
        .bd-row span { text-align: right; color: #888; }
        .bd-row b { font-weight: 500; color: #111; font-variant-numeric: tabular-nums; }
        .bd-row b.win { color: #c80000; font-weight: 700; }
        .bd-row b.win::after { content: ' \u25B2'; font-size: .7em; }
        .bd-sec { margin: 16px 0 4px; text-align: right; padding-right: calc(50% + 9px); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: #bbb; white-space: nowrap; }
        .bd-verdict { position: relative; max-width: 860px; margin: 40px auto 0; padding: 16px 20px; background: #000; color: #fff; border-left: 6px solid #ffdc3a; font-size: 1.02rem; line-height: 1.5; }
        .bd-verdict b { color: #ffdc3a; }
        .bd-msg { position: relative; max-width: 760px; margin: 0 auto 24px; padding: 16px; text-align: center; color: #666; border: 1px dashed #bbb; }
        @media (max-width: 700px) {
            .bd-hero { min-height: 360px; padding: 60px 6% 50px; }
            .bd-band { clip-path: polygon(62% 100%, 92% 0, 100% 0, 100% 100%, 88% 100%); opacity: .95; }
            .bd-hero p { max-width: 62%; font-size: .88rem; }
            .bd-note { right: 6%; bottom: 20px; font-size: .8rem; }
            .bd-vs { grid-template-columns: 1fr; gap: 46px; }
            .bd-pick { grid-template-columns: 1fr; }
            .bd-swap { justify-self: center; transform: rotate(90deg); }
            .bd-photo { width: min(100%, 260px); margin: 0; }
            .bd-photo img { height: 250px; }
            .bd-info { padding-left: 14px; }
        }`;
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
                .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(function (j) {
                    var total = Number((j.MRData && j.MRData.total) || 0);
                    if (!total) { probe(); return; }
                    var pages = Math.min(Math.ceil(total / 100), 6);
                    var acc = { entered: 0, wins: 0, podiums: 0, poles: 0, points: 0, dob: '', nat: '' };
                    /* halaman diambil berurutan (bukan serentak) supaya tidak kena batas laju API */
                    (function nextPage(p) {
                        if (p >= pages) {
                            var all2 = careerCache();
                            all2[norm(name)] = acc;
                            careerCacheSet(all2);
                            cb(acc);
                            return;
                        }
                        fetch(JOLPICA + 'drivers/' + id + '/results.json?limit=100&offset=' + (p * 100))
                            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
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
                                nextPage(p + 1);
                            })
                            .catch(function () { cb(null); }); /* gagal -> tampil "—", tidak di-cache setengah jadi */
                    })(0);
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
            var parts = d.name.trim().split(/\s+/), last = parts.pop(), first = parts.join(' ');
            var html = '<div class="bd-card">' +
                '<div class="bd-photo">' + (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy" onerror="this.remove()">' : '') + '</div>' +
                '<div class="bd-info"><div class="bd-name">' + (first ? esc(first) + '<br>' : '') + esc(last) + '</div>' +
                '<div class="bd-role">Race Driver</div>' +
                '<div class="bd-team">' + esc(d.team) + (d.num ? ' \u2022 #' + esc(d.num) : '') + '</div></div>' +
                '<div class="bd-rows">';
            rows.forEach(function (r) {
                var v = side === 'a' ? r.va : r.vb, better = side === 'a' ? r.betterA : r.betterB;
                html += '<div class="bd-row"><span>' + esc(r.label) + '</span><b class="' + (better ? 'win' : '') + '">' + esc(fmt(v)) + '</b></div>';
            });
            html += '<div class="bd-sec">Musim ' + YEAR + '</div>';
            [['Poin', s ? s.points : null], ['Menang', s ? s.wins : null], ['Podium', s ? s.podiums : null], ['Pole', s ? s.poles : null]].forEach(function (st) {
                var other = side === 'a' ? sb : sa;
                var f = st[0] === 'Poin' ? 'points' : st[0] === 'Menang' ? 'wins' : st[0] === 'Podium' ? 'podiums' : 'poles';
                var ov = other ? other[f] : null, v = st[1], better = false;
                if (v != null && ov != null) better = v > ov; else if (v != null && ov == null) better = true;
                if (better) wins[side]++;
                html += '<div class="bd-row"><span>' + st[0] + '</span><b class="' + (better ? 'win' : '') + '">' + esc(fmt(v)) + '</b></div>';
            });
            return html + '</div></div>';
        }
        outEl.innerHTML = '<div class="bd-vs">' + col(a, sa, ca, rowsA, 'a') + col(b, sb, cb, rowsB, 'b') + '</div>';
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
        page.innerHTML = '<div class="bd-wrap">' +
            '<section class="bd-hero"><div class="bd-band"></div><div class="bd-hero-in">' +
            '<h2><span class="l1">Bandingkan</span><span class="l2"><i class="dash"></i>Pembalap</span></h2>' +
            '<p>Adu statistik dua pembalap Formula 1: karier dari awal debut sampai musim ' + YEAR + ', langsung dari data Jolpica.</p></div>' +
            '<div class="bd-note">Head-to-head<br>musim ' + YEAR + '</div></section>' +
            '<section class="bd-body"><div class="bd-mark">VS</div><h3>Pembalap</h3>' +
            '<p class="bd-lead">Pilih dua pembalap. Angka yang lebih unggul diberi warna merah dan tanda panah.</p>' +
            '<div class="bd-pick"><div><label>Pembalap 1</label><select id="bd-a">' + opts + '</select></div>' +
            '<button type="button" class="bd-swap" id="bd-swap" aria-label="Tukar">\u21C4</button>' +
            '<div><label>Pembalap 2</label><select id="bd-b">' + opts + '</select></div></div>' +
            '<div class="bd-msg" id="bd-msg" hidden></div>' +
            '<div id="bd-out"></div><div class="bd-verdict" id="bd-verdict">Memuat statistik\u2026</div></section></div>';
        var after = document.getElementById('favorit-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        selA = page.querySelector('#bd-a');
        selB = page.querySelector('#bd-b');
        outEl = page.querySelector('#bd-out');
        msgEl = page.querySelector('#bd-msg');
        verdictEl = page.querySelector('#bd-verdict');
        selA.addEventListener('change', function () { careerA = null; careerB = null; render(); refreshCareer(); });
        selB.addEventListener('change', function () { careerA = null; careerB = null; render(); refreshCareer(); });
        page.querySelector('#bd-swap').addEventListener('click', function () {
            var t = selA.value; selA.value = selB.value; selB.value = t; careerA = null; careerB = null; render(); refreshCareer();
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