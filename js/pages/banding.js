/* =========================================================
   BANDINGKAN — head-to-head dua pembalap musim ini
   - Data: Jolpica Ergast (gratis, tanpa API key), satu fetch
     hasil seluruh musim -> dihitung poin, menang, podium, pole,
     rata-rata finis. Cache 20 menit di localStorage.
   - Pilih dua pembalap dari dropdown; statistik dibandingkan
     berdampingan dengan bar dan penanda yang unggul.
   ========================================================= */
(function () {
    'use strict';

    var JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    var YEAR = new Date().getFullYear();
    var CACHE_KEY = 'f1_cmp_cache';
    var TTL = 20 * 60 * 1000;
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };

    var css = document.createElement('style');
    css.textContent = `
        .bd-wrap { max-width: 1060px; margin: 0 auto; padding: 8px 16px 60px; color: #fff; text-align: left; }
        .bd-wrap h2 { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: clamp(2rem, 6vw, 3rem); margin: 10px 0 4px; text-transform: uppercase; }
        .bd-wrap .bd-sub { color: #a9a9b3; margin: 0 0 20px; }
        .bd-pick { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: end; margin-bottom: 22px; }
        .bd-pick label { display: block; font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #a9a9b3; margin-bottom: 6px; }
        .bd-pick select { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,.25); background: #17181d; color: #fff; font: 600 .95rem var(--f-body, 'Inter', sans-serif); }
        .bd-swap { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.25); background: #17181d; color: #fff; font-size: 18px; cursor: pointer; }
        .bd-swap:hover { border-color: #e10600; }
        .bd-vs { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: start; }
        .bd-mid { text-align: center; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; font-style: italic; font-size: 2rem; color: #e10600; padding-top: 70px; }
        .bd-card { border: 1px solid rgba(255,255,255,.14); border-radius: 18px; overflow: hidden; background: #17181d; }
        .bd-card img { display: block; width: 100%; height: 240px; object-fit: cover; object-position: center top; background: #222; }
        .bd-card .bd-info { padding: 14px 16px 6px; }
        .bd-card .bd-name { font-weight: 800; font-size: 1.25rem; }
        .bd-card .bd-team { color: #a9a9b3; font-size: .85rem; margin-top: 2px; }
        .bd-rows { padding: 6px 16px 16px; }
        .bd-row { padding: 10px 0; border-top: 1px solid rgba(255,255,255,.08); }
        .bd-row .bd-lab { display: flex; justify-content: space-between; font-size: .8rem; color: #a9a9b3; margin-bottom: 6px; }
        .bd-row .bd-lab b { color: #fff; font-size: .95rem; }
        .bd-row .bd-lab b.win { color: #ff4d4d; }
        .bd-bar { height: 8px; border-radius: 99px; background: rgba(255,255,255,.1); overflow: hidden; }
        .bd-bar i { display: block; height: 100%; border-radius: 99px; background: #e10600; }
        .bd-bar i.dim { background: #5a5a66; }
        .bd-verdict { margin-top: 18px; padding: 16px 18px; border-radius: 14px; background: #17181d; border: 1px solid rgba(255,255,255,.14); font-size: 1rem; line-height: 1.5; }
        .bd-msg { padding: 22px; text-align: center; color: #a9a9b3; border: 1px dashed rgba(255,255,255,.25); border-radius: 14px; }
        @media (max-width: 700px) { .bd-vs { grid-template-columns: 1fr; } .bd-mid { padding-top: 0; } .bd-card img { height: 200px; } .bd-pick { grid-template-columns: 1fr; } .bd-swap { justify-self: center; transform: rotate(90deg); } }`;
    document.head.appendChild(css);

    var drivers = [];
    function driverList() {
        if (typeof driversData === 'undefined') return [];
        return Object.keys(driversData).map(function (id) {
            var d = driversData[id];
            return { id: id, name: d.name, team: d.team, photo: d.photo || '', num: (d.stats && d.stats.Nomor) || '' };
        }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    function cacheGet() {
        try { var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); if (c && Date.now() - c.ts < TTL) return c.data; } catch (e) {}
        return null;
    }
    function cacheSet(data) { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {} }

    /* Hitung statistik per pembalap dari seluruh hasil musim. */
    function computeStats(races) {
        var by = {};
        races.forEach(function (r) {
            (r.Results || []).forEach(function (res) {
                var d = res.Driver || {};
                var key = norm((d.givenName || '') + ' ' + (d.familyName || ''));
                if (!key) return;
                var s = by[key] || (by[key] = { key: key, name: (d.givenName || '') + ' ' + (d.familyName || ''), team: (res.Constructor || {}).name || '', points: 0, wins: 0, podiums: 0, poles: 0, races: 0, dnf: 0, posSum: 0, posN: 0 });
                s.races++;
                s.points += Number(res.points || 0);
                var pos = parseInt(res.position, 10);
                if (pos === 1) s.wins++;
                if (pos >= 1 && pos <= 3) s.podiums++;
                if (String(res.grid) === '1') s.poles++;
                var st = String(res.status || '');
                if (st !== 'Finished' && st.charAt(0) !== '+') s.dnf++;
                if (!isNaN(pos)) { s.posSum += pos; s.posN++; }
            });
        });
        Object.keys(by).forEach(function (k) {
            var s = by[k];
            s.avg = s.posN ? (s.posSum / s.posN) : null;
        });
        var arr = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return b.points - a.points; });
        arr.forEach(function (s, i) { s.champ = i + 1; });
        return arr;
    }

    var statsByName = null, statsReady = false, loadingStats = true;
    function loadStats(cb) {
        var cached = cacheGet();
        if (cached) { statsByName = cached; statsReady = true; loadingStats = false; cb(true); return; }
        fetch(JOLPICA + YEAR + '/results.json?limit=2000')
            .then(function (r) { return r.json(); })
            .then(function (j) {
                var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                var arr = computeStats(races);
                var map = {};
                arr.forEach(function (s) { map[s.key] = s; });
                statsByName = map; statsReady = true; loadingStats = false;
                cacheSet(map);
                cb(true);
            })
            .catch(function () { statsReady = false; loadingStats = false; cb(false); });
    }

    var selA = null, selB = null, outEl = null, msgEl = null;
    var STATS = [
        { k: 'champ', label: 'Posisi klasemen', inv: true, fmt: function (v) { return v ? '#' + v : '—'; } },
        { k: 'points', label: 'Poin', fmt: function (v) { return String(v); } },
        { k: 'wins', label: 'Menang', fmt: function (v) { return String(v); } },
        { k: 'podiums', label: 'Podium', fmt: function (v) { return String(v); } },
        { k: 'poles', label: 'Pole position', fmt: function (v) { return String(v); } },
        { k: 'avg', label: 'Rata-rata finis', inv: true, fmt: function (v) { return v == null ? '—' : v.toFixed(1); } }
    ];

    function statOf(driverName) {
        if (!statsByName) return null;
        return statsByName[norm(driverName)] || null;
    }
    function findDriver(id) { return drivers.find(function (d) { return String(d.id) === String(id); }); }

    function render() {
        var a = findDriver(selA.value), b = findDriver(selB.value);
        if (!a || !b) return;
        if (a.id === b.id) { msgEl.hidden = false; msgEl.textContent = 'Pilih dua pembalap yang berbeda.'; outEl.innerHTML = ''; return; }
        if (loadingStats) {
            msgEl.hidden = false; msgEl.textContent = 'Memuat statistik musim ' + YEAR + '…';
        } else if (!statsReady) {
            msgEl.hidden = false; msgEl.textContent = 'Statistik live belum bisa dimuat (periksa koneksi). Menampilkan info dasar saja.';
        } else msgEl.hidden = true;
        var sa = statOf(a.name), sb = statOf(b.name);
        var wins = { a: 0, b: 0 };
        function col(d, s, other) {
            var html = '<div class="bd-card">' +
                (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy" onerror="this.remove()">' : '') +
                '<div class="bd-info"><div class="bd-name">' + esc(d.name) + '</div><div class="bd-team">' + esc(d.team) + (d.num ? ' • #' + esc(d.num) : '') + '</div></div>' +
                '<div class="bd-rows">';
            STATS.forEach(function (st) {
                var v = s ? s[st.k] : null, ov = other ? other[st.k] : null;
                var num = (v == null) ? 0 : v, onum = (ov == null) ? 0 : ov;
                var better = false;
                if (v != null && ov != null) better = st.inv ? num < onum : num > onum;
                else if (v != null && ov == null) better = true;
                if (better) wins[d === a ? 'a' : 'b']++;
                var max = Math.max(num, onum, 1);
                var pct = st.k === 'avg' ? (num ? (1 - Math.min(num, 20) / 20) * 100 : 0) : (num / max) * 100;
                html += '<div class="bd-row"><div class="bd-lab"><span>' + st.label + '</span><b class="' + (better ? 'win' : '') + '">' + st.fmt(v) + '</b></div>' +
                    '<div class="bd-bar"><i class="' + (better ? '' : 'dim') + '" style="width:' + Math.max(pct, v ? 4 : 0) + '%"></i></div></div>';
            });
            return html + '</div></div>';
        }
        outEl.innerHTML = '<div class="bd-vs">' + col(a, sa, sb) + '<div class="bd-mid">VS</div>' + col(b, sb, sa) + '</div>';
        var verdict = document.getElementById('bd-verdict');
        if (verdict) {
            if (!statsReady) verdict.textContent = 'Data live belum tersedia — perbandingan statistik menyusul begitu API bisa dijangkau.';
            else if (wins.a === wins.b) verdict.innerHTML = '<b>' + esc(a.name) + '</b> dan <b>' + esc(b.name) + '</b> berimbang ' + wins.a + '–' + wins.b + ' di ' + STATS.length + ' kategori musim ' + YEAR + '.';
            else if (wins.a > wins.b) verdict.innerHTML = '<b>' + esc(a.name) + '</b> unggul ' + wins.a + '–' + wins.b + ' atas <b>' + esc(b.name) + '</b> di musim ' + YEAR + '.';
            else verdict.innerHTML = '<b>' + esc(b.name) + '</b> unggul ' + wins.b + '–' + wins.a + ' atas <b>' + esc(a.name) + '</b> di musim ' + YEAR + '.';
        }
    }

    function mount() {
        drivers = driverList();
        var wrapper = document.getElementById('main-wrapper') || document.body;
        var page = document.createElement('div');
        page.id = 'banding-page';
        page.className = 'page';
        var opts = drivers.map(function (d) { return '<option value="' + esc(d.id) + '">' + esc(d.name) + ' (' + esc(d.team) + ')</option>'; }).join('');
        page.innerHTML = '<div class="bd-wrap"><h2>Bandingkan Pembalap</h2>' +
            '<p class="bd-sub">Head-to-head musim ' + YEAR + ' • data live dari Jolpica</p>' +
            '<div class="bd-pick"><div><label>Pembalap 1</label><select id="bd-a">' + opts + '</select></div>' +
            '<button type="button" class="bd-swap" id="bd-swap" aria-label="Tukar">⇄</button>' +
            '<div><label>Pembalap 2</label><select id="bd-b">' + opts + '</select></div></div>' +
            '<div class="bd-msg" id="bd-msg" hidden></div>' +
            '<div id="bd-out"></div><div class="bd-verdict" id="bd-verdict">Memuat statistik musim ' + YEAR + '…</div></div>';
        var after = document.getElementById('favorit-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        selA = page.querySelector('#bd-a');
        selB = page.querySelector('#bd-b');
        outEl = page.querySelector('#bd-out');
        msgEl = page.querySelector('#bd-msg');
        function byPoints(name) { var s = statOf(name); return s ? -s.points : 0; }
        function pickDefaults() {
            var sorted = drivers.slice().sort(function (x, y) {
                var sx = statOf(x.name), sy = statOf(y.name);
                return ((sy && sy.points) || 0) - ((sx && sx.points) || 0);
            });
            if (sorted.length > 1) { selA.value = sorted[0].id; selB.value = sorted[1].id; }
            render();
        }
        selA.addEventListener('change', render);
        selB.addEventListener('change', render);
        page.querySelector('#bd-swap').addEventListener('click', function () {
            var t = selA.value; selA.value = selB.value; selB.value = t; render();
        });
        var menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-banding]')) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-banding onclick="showPage(\'banding-page\'); return false;">Bandingkan</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var fav = links.find(function (l) { return /favorit/i.test(l.textContent); });
            if (fav) fav.after(li); else menu.appendChild(li);
        }
        loadStats(function () { pickDefaults(); });
        render();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
