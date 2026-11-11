/* =========================================================
   PUSAT LIVE — posisi balapan dari OpenF1 (gratis, tanpa key)
   - Sesi terbaru (session_key=latest): info sesi, posisi,
     jarak ke pemimpin (interval), dan pesan race control.
   - Status otomatis: BERLANGSUNG / Selesai / Akan datang.
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
    /* Cari data sirkuit situs (panjang, tikungan, tahun pertama) dari nama/lokasi sesi. */
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
    var TYRE = {
        SOFT: { c: '#e10600', label: 'SOFT' }, MEDIUM: { c: '#f5c518', label: 'MEDIUM' }, HARD: { c: '#e8e8e8', label: 'HARD' },
        INTERMEDIATE: { c: '#4ed17a', label: 'INTER' }, WET: { c: '#2f7de1', label: 'WET' }
    };

    var css = document.createElement('style');
    css.textContent = `
        .lv-wrap { max-width: 1060px; margin: 0 auto; padding: 8px 16px 60px; color: #fff; text-align: left; }
        .lv-wrap h2 { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: clamp(2rem, 6vw, 3rem); margin: 10px 0 4px; text-transform: uppercase; }
        .lv-wrap .lv-sub { color: #a9a9b3; margin: 0 0 18px; }
        .lv-head { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,.14); border-radius: 16px; background: #17181d; padding: 16px 18px; margin-bottom: 16px; }
        .lv-head .lv-sess { font-weight: 800; font-size: 1.15rem; }
        .lv-head .lv-meta { color: #a9a9b3; font-size: .85rem; margin-top: 2px; }
        .lv-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 13px; border-radius: 999px; font-size: .8rem; font-weight: 800; letter-spacing: .06em; }
        .lv-badge.live { background: #e10600; color: #fff; }
        .lv-badge.live i { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: lvblink 1.1s infinite; }
        @keyframes lvblink { 50% { opacity: .25; } }
        .lv-badge.done { background: rgba(255,255,255,.12); color: #d7d7de; }
        .lv-badge.next { background: #2457d6; color: #fff; }
        .lv-flag { margin-bottom: 14px; padding: 12px 16px; border-radius: 12px; font-size: .9rem; background: #17181d; border: 1px solid rgba(255,255,255,.14); }
        .lv-flag b { text-transform: uppercase; }
        .lv-circ { display: grid; grid-template-columns: minmax(0, 1fr) 150px; gap: 14px; align-items: center; border: 1px solid rgba(255,255,255,.14); border-radius: 16px; background: #17181d; padding: 16px 18px; margin-bottom: 14px; }
        .lv-circ .lv-cname { font-weight: 800; font-size: 1.2rem; }
        .lv-circ .lv-cloc { color: #a9a9b3; font-size: .88rem; margin-top: 2px; }
        .lv-circ .lv-cfacts { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 10px; font-size: .88rem; }
        .lv-circ .lv-cfacts b { color: #fff; }
        .lv-circ .lv-cfacts span { color: #a9a9b3; }
        .lv-circ img { width: 100%; max-height: 110px; object-fit: contain; filter: invert(1); opacity: .92; }
        .lv-tyre { display: inline-block; min-width: 26px; padding: 3px 8px; border-radius: 999px; font-size: .72rem; font-weight: 800; text-align: center; color: #111; }
        .lv-tyre.dark { color: #fff; }
        .lv-lap { text-align: right; font-variant-numeric: tabular-nums; }
        .lv-table { width: 100%; border-collapse: collapse; background: #17181d; border: 1px solid rgba(255,255,255,.14); border-radius: 16px; overflow: hidden; }
        .lv-table th, .lv-table td { padding: 11px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,.07); }
        .lv-table th { font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: #a9a9b3; }
        .lv-table tr:last-child td { border-bottom: 0; }
        .lv-pos { font-weight: 800; width: 44px; }
        .lv-acr { display: inline-block; min-width: 44px; padding: 3px 8px; border-radius: 6px; background: rgba(255,255,255,.1); font-weight: 800; font-size: .8rem; text-align: center; margin-right: 9px; }
        .lv-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; vertical-align: -1px; }
        .lv-gap { text-align: right; font-variant-numeric: tabular-nums; color: #d7d7de; }
        .lv-refresh { padding: 10px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,.3); background: transparent; color: #fff; font: 600 .88rem var(--f-body, 'Inter', sans-serif); cursor: pointer; }
        .lv-refresh:hover { border-color: #e10600; }
        .lv-msg { padding: 22px; text-align: center; color: #a9a9b3; border: 1px dashed rgba(255,255,255,.25); border-radius: 14px; }
        .lv-upd { color: #a9a9b3; font-size: .8rem; margin-top: 12px; }
        @media (max-width: 640px) { .lv-table .lv-hide-sm { display: none; } .lv-table th, .lv-table td { padding: 9px 10px; } }`;
    document.head.appendChild(css);

    var page = null, bodyEl = null, headEl = null, flagEl = null, updEl = null, circEl = null;
    var timer = null, lastSessionKey = null;

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
        if (String(v).toLowerCase() === 'interval' || isNaN(Number(v))) return String(v);
        return '+' + Number(v).toFixed(3);
    }

    function render(session, positions, drivers, intervals, rc, stints, laps) {
        var now = Date.now();
        var start = session.date_start ? new Date(session.date_start).getTime() : null;
        var end = session.date_end ? new Date(session.date_end).getTime() : null;
        var status = 'done', label = 'Selesai';
        if (start && now < start) { status = 'next'; label = 'Akan datang'; }
        else if (start && end && now >= start && now <= end) { status = 'live'; label = 'BERLANGSUNG'; }
        else if (start && !end && now >= start) { status = 'live'; label = 'BERLANGSUNG'; }
        var badge = '<span class="lv-badge ' + status + '">' + (status === 'live' ? '<i></i>' : '') + label + '</span>';
        headEl.innerHTML = '<div><div class="lv-sess">' + esc(session.session_name || 'Sesi') + ' — ' + esc(session.location || '') + ' ' + esc(session.year || '') + '</div>' +
            '<div class="lv-meta">' + esc(session.circuit_short_name || '') + ' • ' + (start ? fmtDateTime(new Date(start)) : '') + '</div></div>' +
            '<div style="display:flex;gap:10px;align-items:center">' + badge +
            '<button type="button" class="lv-refresh" id="lv-refresh">⟳ Refresh</button></div>';
        var rb = headEl.querySelector('#lv-refresh');
        if (rb) rb.addEventListener('click', function () { load(true); });

        /* --- kartu sirkuit (ala preview Pirelli) --- */
        var lapMap = {};
        var curLap = 0;
        (laps || []).forEach(function (l) {
            var n = Number(l.lap_number) || 0;
            if (n > (lapMap[l.driver_number] || 0)) lapMap[l.driver_number] = n;
            if (n > curLap) curLap = n;
        });
        var circ = siteCircuit(session);
        var img = trackImg(session.circuit_short_name || (circ && circ.name) || '');
        var facts = [];
        if (circ && circ.length) facts.push('<span>Panjang <b>' + esc(circ.length) + '</b></span>');
        if (circ && circ.turns) facts.push('<span>Tikungan <b>' + esc(circ.turns) + '</b></span>');
        if (circ && circ.first) facts.push('<span>Sejak <b>' + esc(circ.first) + '</b></span>');
        if (curLap) facts.push('<span>Lap saat ini <b>' + curLap + '</b></span>');
        circEl.innerHTML = '<div><div class="lv-cname">' + esc(session.circuit_short_name || (circ && circ.name) || 'Sirkuit') + '</div>' +
            '<div class="lv-cloc">' + esc(session.location || '') + (session.country_name ? ' • ' + esc(session.country_name) : '') + '</div>' +
            (facts.length ? '<div class="lv-cfacts">' + facts.join('') + '</div>' : '') + '</div>' +
            (img ? '<img src="' + esc(img) + '" alt="Lintasan ' + esc(session.circuit_short_name || '') + '" loading="lazy" onerror="this.remove()">' : '');

        if (rc && rc.length) {
            var last = rc.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); }).pop();
            var flag = String(last.flag || '').toUpperCase();
            var color = flag === 'RED' ? '#e10600' : flag === 'YELLOW' ? '#f5c518' : flag === 'GREEN' ? '#4ed17a' : '#d7d7de';
            flagEl.hidden = false;
            flagEl.innerHTML = '<b style="color:' + color + '">Bendera ' + esc(flag || '—') + '</b> — ' + esc(last.message || '');
        } else flagEl.hidden = true;

        var posMap = latestBy(positions, function (x) { return x.driver_number; });
        var intMap = latestBy(intervals, function (x) { return x.driver_number; });
        var stintMap = {};
        (stints || []).forEach(function (s) {
            var cur = stintMap[s.driver_number];
            if (!cur || (Number(s.lap_end) || 0) > (Number(cur.lap_end) || 0)) stintMap[s.driver_number] = s;
        });
        var drvMap = {};
        drivers.forEach(function (d) { drvMap[d.driver_number] = d; });
        var rows = Object.keys(posMap).map(function (k) { return posMap[k]; })
            .sort(function (a, b) { return (a.position || 99) - (b.position || 99); });
        if (!rows.length) {
            bodyEl.innerHTML = '<div class="lv-msg">Belum ada data posisi untuk sesi ini.</div>';
        } else {
            bodyEl.innerHTML = '<table class="lv-table"><thead><tr><th>Pos</th><th>Pembalap</th><th class="lv-hide-sm">Tim</th><th>Ban</th><th style="text-align:right">Lap</th><th style="text-align:right">Gap</th></tr></thead><tbody>' +
                rows.map(function (r) {
                    var d = drvMap[r.driver_number] || {};
                    var iv = intMap[r.driver_number];
                    var gap = iv ? (r.position === 1 ? 'Interval' : iv.gap_to_leader) : null;
                    var st = stintMap[r.driver_number];
                    var tyre = '';
                    if (st && st.compound) {
                        var t = TYRE[String(st.compound).toUpperCase()] || { c: '#888', label: String(st.compound) };
                        var age = (lapMap[r.driver_number] || 0) - (Number(st.lap_start) || 0);
                        var dark = ['#e10600', '#2f7de1', '#4ed17a'].indexOf(t.c) !== -1;
                        tyre = '<span class="lv-tyre' + (dark ? ' dark' : '') + '" style="background:' + t.c + '" title="' + esc(t.label) + (age > 0 ? ' • ' + age + ' lap' : '') + '">' + esc(t.label === 'INTERMEDIATE' ? 'INT' : t.label.slice(0, 1)) + '</span>';
                    } else tyre = '—';
                    return '<tr><td class="lv-pos">' + esc(r.position) + '</td>' +
                        '<td><span class="lv-acr">' + esc(d.name_acronym || ('#' + r.driver_number)) + '</span>' + esc(d.full_name || ('Pembalap #' + r.driver_number)) + '</td>' +
                        '<td class="lv-hide-sm"><span class="lv-dot" style="background:' + esc(d.team_colour || '#888') + '"></span>' + esc(d.team_name || '—') + '</td>' +
                        '<td>' + tyre + '</td>' +
                        '<td class="lv-lap">' + (lapMap[r.driver_number] || '—') + '</td>' +
                        '<td class="lv-gap">' + esc(fmtGap(gap)) + '</td></tr>';
                }).join('') + '</tbody></table>';
        }
        updEl.textContent = 'Terakhir diperbarui: ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + (status === 'live' ? ' • refresh otomatis tiap 30 detik' : '');
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
                return Promise.all([
                    Promise.resolve(s),
                    fetch(OPENF1 + 'position?session_key=' + k).then(function (r) { return r.json(); }).catch(function () { return []; }),
                    fetch(OPENF1 + 'drivers?session_key=' + k).then(function (r) { return r.json(); }).catch(function () { return []; }),
                    fetch(OPENF1 + 'intervals?session_key=' + k).then(function (r) { return r.json(); }).catch(function () { return []; }),
                    fetch(OPENF1 + 'race_control?session_key=' + k).then(function (r) { return r.json(); }).catch(function () { return []; }),
                    fetch(OPENF1 + 'stints?session_key=' + k).then(function (r) { return r.json(); }).catch(function () { return []; }),
                    fetch(OPENF1 + 'laps?session_key=' + k).then(function (r) { return r.json(); }).catch(function () { return []; })
                ]);
            })
            .then(function (all) { render(all[0], all[1], all[2], all[3], all[4], all[5], all[6]); })
            .catch(function () {
                bodyEl.innerHTML = '<div class="lv-msg">Data live belum bisa dimuat. Periksa koneksi internet, lalu coba lagi.</div>';
                headEl.innerHTML = '<div><div class="lv-sess">Pusat Live</div><div class="lv-meta">Data live dari OpenF1</div></div>' +
                    '<button type="button" class="lv-refresh" id="lv-refresh">⟳ Coba lagi</button>';
                var rb = headEl.querySelector('#lv-refresh');
                if (rb) rb.addEventListener('click', function () { load(true); });
            });
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        page = document.createElement('div');
        page.id = 'live-page';
        page.className = 'page';
        page.innerHTML = '<div class="lv-wrap"><h2>Pusat Live</h2>' +
            '<p class="lv-sub">Posisi balapan terbaru dari OpenF1</p>' +
            '<div class="lv-head" id="lv-head"><div><div class="lv-sess">Memuat…</div></div></div>' +
            '<div class="lv-circ" id="lv-circ"></div>' +
            '<div class="lv-flag" id="lv-flag" hidden></div>' +
            '<div id="lv-body"><div class="lv-msg">Memuat data live…</div></div>' +
            '<div class="lv-upd" id="lv-upd"></div></div>';
        var after = document.getElementById('schedule-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        headEl = page.querySelector('#lv-head');
        circEl = page.querySelector('#lv-circ');
        flagEl = page.querySelector('#lv-flag');
        bodyEl = page.querySelector('#lv-body');
        updEl = page.querySelector('#lv-upd');
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
