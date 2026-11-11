/* =========================================================
   FAVORIT — dashboard ala referensi (Driver Focus + kartu)
   - Tombol hati (♥) di kartu pembalap, kartu tim, dan halaman
     detail pembalap. Keadaan tersimpan di localStorage 'f1_fav'.
   - Halaman "Favoritku" jadi dashboard: Driver Focus (foto besar
     + nama + tim), kartu Next Race, Standings mini, dan
     Race Highlights (3 balapan terakhir + pemenang).
   - Data dashboard dari Jolpica (gratis, tanpa key), cache lokal.
   - Gambar semuanya lokal (foto pembalap & outline lintasan).
   ========================================================= */
(function () {
    'use strict';

    var KEY = 'f1_fav';
    var JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    var YEAR = new Date().getFullYear();
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
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
    function fmtDate(d) {
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
            ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    function load() {
        try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && Array.isArray(d.d) && Array.isArray(d.t)) return d; } catch (e) {}
        return { d: [], t: [] };
    }
    function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
    function isFav(type, id) {
        var d = load();
        return type === 'driver' ? d.d.indexOf(String(id)) !== -1 : d.t.indexOf(String(id)) !== -1;
    }
    function toggle(type, id) {
        var d = load(), arr = type === 'driver' ? d.d : d.t, i = arr.indexOf(String(id));
        if (i === -1) arr.push(String(id)); else arr.splice(i, 1);
        save(d);
        syncButtons();
        renderFav();
        return i === -1;
    }
    window.f1Fav = { isFav: isFav, toggle: toggle, load: load };

    /* ---------- toast kecil ---------- */
    var toastEl = null, toastTimer = null;
    function toast(msg) {
        if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'fv-toast'; document.body.appendChild(toastEl); }
        toastEl.textContent = msg;
        toastEl.classList.add('on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
    }

    /* ---------- gaya: dashboard gelap ---------- */
    var css = document.createElement('style');
    css.textContent = `
        .fv-heart { position: absolute; top: 10px; right: 10px; z-index: 5; width: 34px; height: 34px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,.35); background: rgba(10,10,14,.55); color: #fff; font-size: 17px; line-height: 1;
            cursor: pointer; display: grid; place-items: center; padding: 0; backdrop-filter: blur(2px); transition: transform .15s ease, background .15s ease; }
        .fv-heart:hover { transform: scale(1.12); }
        .fv-heart.on { background: #e10600; border-color: #e10600; color: #fff; }
        .driver-card, .team-card { position: relative; }
        .fv-toast { position: fixed; left: 50%; bottom: 26px; transform: translate(-50%, 20px); z-index: 9999;
            background: #14151a; color: #fff; border: 1px solid rgba(255,255,255,.2); border-radius: 999px;
            padding: 10px 18px; font-size: .85rem; font-weight: 600; opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease; }
        .fv-toast.on { opacity: 1; transform: translate(-50%, 0); }
        .fv-wrap { max-width: 1100px; margin: 0 auto; padding: 8px 16px 60px; color: #fff; text-align: left; }
        .fv-search { display: flex; align-items: center; gap: 8px; margin: 12px 0 18px; padding: 11px 16px; border-radius: 999px;
            border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.06); color: #fff; }
        .fv-search input { flex: 1; border: 0; outline: 0; background: transparent; color: #fff; font: 500 .95rem var(--f-body, 'Inter', sans-serif); }
        .fv-search input::placeholder { color: #8d8d98; }
        .fv-hero { position: relative; display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 0; overflow: hidden;
            border-radius: 22px; border: 1px solid rgba(255,255,255,.14); background: linear-gradient(100deg, #101116 55%, #1c0d10 100%); min-height: 300px; }
        .fv-hero .fv-hero-txt { padding: 26px 8px 26px 26px; display: flex; flex-direction: column; justify-content: center; }
        .fv-eyebrow { font-size: .72rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #a9a9b3; }
        .fv-first { margin: 12px 0 0; font-size: 1.05rem; font-weight: 600; color: #d7d7de; letter-spacing: .04em; }
        .fv-last { margin: 0; font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; font-style: italic; text-transform: uppercase;
            line-height: .9; font-size: clamp(3rem, 11vw, 5.2rem); color: #fff; }
        .fv-hero .fv-teamline { margin-top: 12px; color: #d7d7de; font-weight: 600; }
        .fv-hero .fv-tag { margin-top: 6px; color: #a9a9b3; font-size: .9rem; line-height: 1.5; max-width: 420px; }
        .fv-hero .fv-stat { margin-top: 14px; display: inline-flex; gap: 8px; align-items: center; }
        .fv-hero .fv-stat b { background: #e10600; border-radius: 999px; padding: 5px 12px; font-size: .82rem; }
        .fv-hero .fv-stat span { color: #a9a9b3; font-size: .85rem; }
        .fv-hero figure { margin: 0; position: relative; min-height: 300px; }
        .fv-hero figure img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
        .fv-hero figure .fv-num { position: absolute; right: 14px; bottom: 6px; font-family: var(--f-head, 'Barlow Condensed', sans-serif);
            font-weight: 800; font-style: italic; font-size: clamp(5rem, 18vw, 8.5rem); line-height: .8; color: rgba(255,255,255,.14); }
        .fv-hero .fv-empty { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; color: #d7d7de; padding: 20px; background: rgba(10,10,14,.45); }
        .fv-chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 14px 0 4px; }
        .fv-chip { display: inline-flex; align-items: center; gap: 8px; padding: 5px 13px 5px 5px; border-radius: 999px; border: 1px solid rgba(255,255,255,.22);
            background: rgba(255,255,255,.05); color: #fff; font: 600 .85rem var(--f-body, 'Inter', sans-serif); cursor: pointer; }
        .fv-chip img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; object-position: center top; background: #333; }
        .fv-chip.sel { border-color: #e10600; background: rgba(225,6,0,.18); }
        .fv-dash { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
        .fv-dcard { border: 1px solid rgba(255,255,255,.14); border-radius: 18px; background: #17181d; padding: 16px 18px; min-height: 190px; }
        .fv-dcard h4 { margin: 0 0 10px; font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #a9a9b3; }
        .fv-dcard .fv-track { display: block; width: 100%; max-height: 92px; object-fit: contain; filter: invert(1); opacity: .9; margin: 2px 0 8px; }
        .fv-dcard .fv-racename { font-weight: 800; font-size: 1.05rem; line-height: 1.3; }
        .fv-dcard .fv-racedate { color: #a9a9b3; font-size: .85rem; margin-top: 4px; line-height: 1.5; }
        .fv-dcard .fv-link { display: inline-block; margin-top: 12px; color: #ff4d4d; font-weight: 700; font-size: .85rem; cursor: pointer; background: none; border: 0; padding: 0; }
        .fv-minirow { display: flex; align-items: center; gap: 9px; padding: 8px 0; border-top: 1px solid rgba(255,255,255,.08); font-size: .92rem; }
        .fv-minirow:first-of-type { border-top: 0; }
        .fv-minirow .fv-pos { font-weight: 800; width: 20px; color: #a9a9b3; }
        .fv-minirow .fv-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
        .fv-minirow .fv-nm { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fv-minirow .fv-pts { font-weight: 800; font-variant-numeric: tabular-nums; }
        .fv-hl { display: flex; gap: 11px; align-items: center; padding: 9px 0; border-top: 1px solid rgba(255,255,255,.08); }
        .fv-hl:first-of-type { border-top: 0; }
        .fv-hl img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; object-position: center top; background: #222; flex: none; }
        .fv-hl .fv-hl-t { font-weight: 700; font-size: .9rem; line-height: 1.3; }
        .fv-hl .fv-hl-s { color: #a9a9b3; font-size: .8rem; margin-top: 2px; }
        .fv-wrap h3 { margin: 30px 0 12px; font-size: 1.05rem; letter-spacing: .06em; text-transform: uppercase; color: #d7d7de; }
        .fv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .fv-card { position: relative; border: 1px solid rgba(255,255,255,.14); border-radius: 16px; overflow: hidden; background: #17181d; cursor: pointer; text-align: left; padding: 0; color: #fff; }
        .fv-card img { display: block; width: 100%; height: 190px; object-fit: cover; object-position: center top; background: #222; }
        .fv-card .fv-info { padding: 12px 14px 14px; }
        .fv-card .fv-name { font-weight: 700; font-size: 1rem; }
        .fv-card .fv-meta { color: #a9a9b3; font-size: .82rem; margin-top: 3px; }
        .fv-card .fv-team { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 7px; vertical-align: -1px; }
        .fv-empty { border: 1px dashed rgba(255,255,255,.25); border-radius: 14px; padding: 22px; color: #a9a9b3; text-align: center; }
        .fv-x { position: absolute; top: 8px; right: 8px; z-index: 3; width: 28px; height: 28px; border-radius: 50%; border: 0; background: rgba(0,0,0,.55); color: #fff; cursor: pointer; font-size: 14px; }
        @media (max-width: 760px) { .fv-dash { grid-template-columns: 1fr; } .fv-hero { grid-template-columns: 1fr; } .fv-hero figure { min-height: 230px; order: -1; } .fv-hero .fv-hero-txt { padding: 18px 20px 22px; } }
        @media (max-width: 640px) { .fv-grid { grid-template-columns: 1fr 1fr; gap: 10px; } .fv-card img { height: 150px; } }`;
    document.head.appendChild(css);

    /* ---------- tombol hati di kartu ---------- */
    function heartBtn(type, id) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'fv-heart' + (isFav(type, id) ? ' on' : '');
        b.setAttribute('aria-label', 'Simpan ke favorit');
        b.setAttribute('data-fv-type', type);
        b.setAttribute('data-fv-id', String(id));
        b.textContent = '♥';
        b.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            var added = toggle(type, id);
            toast(added ? 'Ditambahkan ke favorit ♥' : 'Dihapus dari favorit');
        });
        return b;
    }
    function decorate() {
        document.querySelectorAll('.driver-card:not([data-fv])').forEach(function (card) {
            var m = (card.getAttribute('onclick') || '').match(/openDetail\((\d+)\)/);
            if (!m) return;
            card.setAttribute('data-fv', '1');
            card.appendChild(heartBtn('driver', m[1]));
        });
        document.querySelectorAll('.team-card:not([data-fv])').forEach(function (card) {
            var nameEl = card.querySelector('.tc-name');
            if (!nameEl) return;
            card.setAttribute('data-fv', '1');
            card.appendChild(heartBtn('team', nameEl.textContent.trim()));
        });
        document.querySelectorAll('#detail-page .dp-hero:not([data-fv])').forEach(function (hero) {
            var first = hero.querySelector('.dp-first'), last = hero.querySelector('.dp-last');
            if (!first || !last) return;
            var name = (first.textContent + ' ' + last.textContent).replace(/\s+/g, ' ').trim();
            var id = null;
            if (typeof driversData !== 'undefined') {
                Object.keys(driversData).forEach(function (k) { if (norm(driversData[k].name) === norm(name)) id = k; });
            }
            if (!id) return;
            hero.setAttribute('data-fv', '1');
            hero.appendChild(heartBtn('driver', id));
        });
    }
    function syncButtons() {
        document.querySelectorAll('.fv-heart').forEach(function (b) {
            var t = b.getAttribute('data-fv-type'), id = b.getAttribute('data-fv-id');
            if (t && id != null) b.classList.toggle('on', isFav(t, id));
        });
    }

    /* ---------- data dashboard ---------- */
    function cacheGet(key, ttl) {
        try { var c = JSON.parse(localStorage.getItem(key) || 'null'); if (c && Date.now() - c.ts < ttl) return c.data; } catch (e) {}
        return null;
    }
    function cacheSet(key, data) { try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {} }
    function fetchJSON(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }); }
    function driverById(id) { return (typeof driversData !== 'undefined') ? (driversData[id] || null) : null; }
    function teamOf(driverName) {
        if (typeof teamsData === 'undefined') return null;
        return teamsData.find(function (t) { return (t.drivers || []).indexOf(driverName) !== -1; }) || null;
    }
    function driverByName(name) {
        if (typeof driversData === 'undefined') return null;
        var id = Object.keys(driversData).find(function (k) { return norm(driversData[k].name) === norm(name); });
        return id ? { id: id, d: driversData[id] } : null;
    }

    var page = null, heroEl = null, chipsEl = null, nextEl = null, standEl = null, hlEl = null,
        listD = null, listT = null, emptyD = null, emptyT = null, countEl = null, searchEl = null;
    var focusId = null, standingsMap = null;

    function renderFocus() {
        if (!heroEl) return;
        var d = load();
        if (!d.d.length) {
            focusId = null;
            chipsEl.innerHTML = '';
            heroEl.innerHTML = '<figure><img src="assets/images/bg/hero-f1.jpg" alt="" onerror="this.remove()">' +
                '<div class="fv-empty"><div><div class="fv-eyebrow">Driver Focus</div><p style="margin:10px 0 4px;font-weight:700">Belum ada pembalap favorit</p><p style="margin:0">Ketuk ♥ di kartu pembalap mana pun untuk menjadikannya fokus di sini.</p></div></div></figure>';
            return;
        }
        if (!focusId || d.d.indexOf(String(focusId)) === -1) focusId = d.d[0];
        var drv = driverById(focusId);
        if (!drv) return;
        var parts = drv.name.trim().split(/\s+/), last = parts.pop(), first = parts.join(' ');
        var team = teamOf(drv.name);
        var title = (drv.title || '').split(':').slice(1).join(':').trim() || drv.team;
        var st = standingsMap ? standingsMap[norm(drv.name)] : null;
        chipsEl.innerHTML = '';
        d.d.forEach(function (id) {
            var dd = driverById(id);
            if (!dd) return;
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'fv-chip' + (String(id) === String(focusId) ? ' sel' : '');
            chip.innerHTML = (dd.photo ? '<img src="' + esc(dd.photo) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + esc(dd.name);
            chip.addEventListener('click', function () { focusId = String(id); renderFocus(); });
            chipsEl.appendChild(chip);
        });
        heroEl.innerHTML =
            '<div class="fv-hero-txt"><div class="fv-eyebrow">Driver Focus</div>' +
            '<p class="fv-first">' + esc(first) + '</p><h2 class="fv-last">' + esc(last) + '</h2>' +
            '<div class="fv-teamline">' + (team ? '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:' + esc(team.color) + ';margin-right:8px"></span>' : '') + esc(drv.team) + (drv.stats && drv.stats.Nomor ? ' • #' + esc(drv.stats.Nomor) : '') + '</div>' +
            '<p class="fv-tag">' + esc(title) + '</p>' +
            (st ? '<div class="fv-stat"><b>P' + st.pos + '</b><span>' + st.points + ' poin • klasemen ' + YEAR + '</span></div>' : '') +
            '</div>' +
            '<figure>' + (drv.photo ? '<img src="' + esc(drv.photo) + '" alt="' + esc(drv.name) + '" onerror="this.remove()">' : '') +
            (drv.stats && drv.stats.Nomor ? '<span class="fv-num">' + esc(drv.stats.Nomor) + '</span>' : '') + '</figure>';
    }

    function renderFav() {
        if (!page) return;
        var d = load();
        if (countEl) countEl.textContent = (d.d.length + d.t.length) + ' favorit';
        renderFocus();
        listD.innerHTML = '';
        listT.innerHTML = '';
        if (!d.d.length) { emptyD.hidden = false; } else {
            emptyD.hidden = true;
            d.d.forEach(function (id) {
                var drv = driverById(id);
                if (!drv) return;
                var team = teamOf(drv.name);
                var card = document.createElement('article');
                card.className = 'fv-card';
                card.innerHTML = '<img src="' + esc(drv.photo || '') + '" alt="' + esc(drv.name) + '" loading="lazy" onerror="this.remove()">' +
                    '<div class="fv-info"><div class="fv-name">' + esc(drv.name) + '</div>' +
                    '<div class="fv-meta"><span class="fv-team" style="background:' + (team ? team.color : '#888') + '"></span>' + esc(drv.team || (team ? team.name : '')) + (drv.stats && drv.stats.Nomor ? ' • #' + esc(drv.stats.Nomor) : '') + '</div></div>';
                var x = document.createElement('button');
                x.type = 'button'; x.className = 'fv-x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Hapus dari favorit');
                x.addEventListener('click', function (e) { e.stopPropagation(); toggle('driver', id); });
                card.appendChild(x);
                card.addEventListener('click', function () { if (typeof window.openDetail === 'function') window.openDetail(Number(id)); });
                listD.appendChild(card);
            });
        }
        if (!d.t.length) { emptyT.hidden = false; } else {
            emptyT.hidden = true;
            d.t.forEach(function (name) {
                var t = (typeof teamsData !== 'undefined') ? teamsData.find(function (x) { return norm(x.name) === norm(name); }) : null;
                if (!t) return;
                var card = document.createElement('article');
                card.className = 'fv-card';
                card.innerHTML = '<div style="height:8px;background:' + esc(t.color || '#888') + '"></div>' +
                    '<div class="fv-info"><div class="fv-name">' + esc(t.name) + '</div>' +
                    '<div class="fv-meta">' + esc(t.full || '') + '<br>' + esc((t.drivers || []).join(' & ')) + '</div></div>';
                var x = document.createElement('button');
                x.type = 'button'; x.className = 'fv-x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Hapus dari favorit');
                x.addEventListener('click', function (e) { e.stopPropagation(); toggle('team', name); });
                card.appendChild(x);
                card.addEventListener('click', function () {
                    if (typeof window.openTeamDetail === 'function' && typeof teamsData !== 'undefined') window.openTeamDetail(teamsData.indexOf(t));
                    else if (typeof window.showPage === 'function') window.showPage('teams-page');
                });
                listT.appendChild(card);
            });
        }
        applySearch();
    }

    function applySearch() {
        if (!searchEl || !page) return;
        var q = norm(searchEl.value);
        page.querySelectorAll('.fv-card').forEach(function (c) {
            c.style.display = (!q || norm(c.textContent).indexOf(q) !== -1) ? '' : 'none';
        });
    }

    function loadDashboard() {
        var cached = cacheGet('f1_fv_stand', 20 * 60 * 1000);
        if (cached) { standingsMap = cached.map; renderStand(cached.rows); renderFocus(); }
        else fetchJSON(JOLPICA + 'current/driverStandings.json').then(function (j) {
            var list = (j.MRData && j.MRData.StandingsTable && j.MRData.StandingsTable.StandingsLists[0]) || {};
            var rows = (list.DriverStandings || []).slice(0, 4).map(function (r) {
                return { pos: r.position, name: (r.Driver.givenName + ' ' + r.Driver.familyName), points: r.points };
            });
            var map = {};
            (list.DriverStandings || []).forEach(function (r) { map[norm(r.Driver.givenName + ' ' + r.Driver.familyName)] = { pos: r.position, points: r.points }; });
            standingsMap = map;
            cacheSet('f1_fv_stand', { rows: rows, map: map });
            renderStand(rows); renderFocus();
        }).catch(function () { if (standEl) standEl.innerHTML = '<h4>Standings</h4><p class="fv-racedate">Klasemen belum bisa dimuat.</p>'; });
        function renderStand(rows) {
            if (!standEl) return;
            standEl.innerHTML = '<h4>Standings</h4>' + rows.map(function (r) {
                var team = teamOf(r.name);
                return '<div class="fv-minirow"><span class="fv-pos">' + esc(r.pos) + '</span>' +
                    '<span class="fv-dot" style="background:' + (team ? team.color : '#888') + '"></span>' +
                    '<span class="fv-nm">' + esc(r.name) + '</span><span class="fv-pts">' + esc(r.points) + ' PTS</span></div>';
            }).join('') + '<button type="button" class="fv-link" data-go="klasemen-page">Lihat klasemen lengkap →</button>';
            var b = standEl.querySelector('[data-go]');
            if (b) b.addEventListener('click', function () { if (typeof window.showPage === 'function') window.showPage('klasemen-page'); });
        }

        var sched = cacheGet('f1_fv_sched', 3600e3);
        if (sched) renderNext(sched);
        else fetchJSON(JOLPICA + 'current.json').then(function (j) {
            var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
            cacheSet('f1_fv_sched', races);
            renderNext(races);
        }).catch(function () { if (nextEl) nextEl.innerHTML = '<h4>Next Race</h4><p class="fv-racedate">Jadwal belum bisa dimuat.</p>'; });
        function renderNext(races) {
            if (!nextEl) return;
            var now = Date.now(), nx = null;
            races.forEach(function (r) {
                if (!nx && new Date(r.date + 'T' + (r.time || '12:00:00Z')).getTime() > now) nx = r;
            });
            if (!nx) { nextEl.innerHTML = '<h4>Next Race</h4><p class="fv-racedate">Musim ' + YEAR + ' sudah selesai.</p>'; return; }
            var img = trackImg(nx.Circuit.circuitName);
            nextEl.innerHTML = '<h4>Next Race</h4>' +
                (img ? '<img class="fv-track" src="' + esc(img) + '" alt="Lintasan ' + esc(nx.Circuit.circuitName) + '" loading="lazy" onerror="this.remove()">' : '') +
                '<div class="fv-racename">' + esc(nx.raceName) + '</div>' +
                '<div class="fv-racedate">' + esc(nx.Circuit.circuitName) + '<br>' + fmtDate(new Date(nx.date + 'T' + (nx.time || '12:00:00Z'))) + '</div>' +
                '<button type="button" class="fv-link" data-go="schedule">Lihat jadwal →</button>';
            var b = nextEl.querySelector('[data-go]');
            if (b) b.addEventListener('click', function () {
                var a = document.querySelector('a[data-schedule]');
                if (a) a.click(); else if (typeof window.showPage === 'function') window.showPage('schedule-page');
            });
        }

        var res = cacheGet('f1_fv_res', 3600e3);
        if (res) renderHl(res);
        else fetchJSON(JOLPICA + YEAR + '/results.json?limit=2000').then(function (j) {
            var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
            cacheSet('f1_fv_res', races);
            renderHl(races);
        }).catch(function () { if (hlEl) hlEl.innerHTML = '<h4>Race Highlights</h4><p class="fv-racedate">Highlight belum bisa dimuat.</p>'; });
        function renderHl(races) {
            if (!hlEl) return;
            var done = races.filter(function (r) { return (r.Results || []).length; }).slice(-3).reverse();
            if (!done.length) { hlEl.innerHTML = '<h4>Race Highlights</h4><p class="fv-racedate">Belum ada balapan musim ini.</p>'; return; }
            hlEl.innerHTML = '<h4>Race Highlights</h4>' + done.map(function (r) {
                var w = r.Results[0] && r.Results[0].Driver ? (r.Results[0].Driver.givenName + ' ' + r.Results[0].Driver.familyName) : '';
                var hit = driverByName(w);
                var img = hit && hit.d.photo ? '<img src="' + esc(hit.d.photo) + '" alt="' + esc(w) + '" loading="lazy" onerror="this.remove()">' : '<span style="width:52px;height:52px;border-radius:10px;background:#222;display:inline-block;flex:none"></span>';
                return '<div class="fv-hl">' + img + '<div><div class="fv-hl-t">' + esc(r.raceName) + '</div><div class="fv-hl-s">Pemenang: ' + esc(w || '—') + ' • ' + esc((r.Circuit && r.Circuit.circuitName) || '') + '</div></div></div>';
            }).join('');
        }
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        page = document.createElement('div');
        page.id = 'favorit-page';
        page.className = 'page';
        page.innerHTML = '<div class="fv-wrap">' +
            '<div class="fv-search"><span>🔍</span><input type="text" id="fv-search" placeholder="Cari pembalap, tim…" aria-label="Cari favorit"></div>' +
            '<div class="fv-hero" id="fv-hero"></div>' +
            '<div class="fv-chips" id="fv-chips"></div>' +
            '<div class="fv-dash">' +
            '<div class="fv-dcard" id="fv-next"><h4>Next Race</h4><p class="fv-racedate">Memuat jadwal…</p></div>' +
            '<div class="fv-dcard" id="fv-stand"><h4>Standings</h4><p class="fv-racedate">Memuat klasemen…</p></div>' +
            '<div class="fv-dcard" id="fv-hl"><h4>Race Highlights</h4><p class="fv-racedate">Memuat highlight…</p></div>' +
            '</div>' +
            '<h3>♥ Pembalap favorit (<span id="fv-count">0 favorit</span>)</h3><div class="fv-grid" id="fv-drivers"></div>' +
            '<div class="fv-empty" id="fv-empty-d">Belum ada pembalap favorit. Ketuk ♥ di kartu pembalap mana pun.</div>' +
            '<h3>♥ Tim favorit</h3><div class="fv-grid" id="fv-teams"></div>' +
            '<div class="fv-empty" id="fv-empty-t">Belum ada tim favorit. Ketuk ♥ di kartu tim mana pun.</div></div>';
        var after = document.getElementById('katalog-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        heroEl = page.querySelector('#fv-hero');
        chipsEl = page.querySelector('#fv-chips');
        nextEl = page.querySelector('#fv-next');
        standEl = page.querySelector('#fv-stand');
        hlEl = page.querySelector('#fv-hl');
        listD = page.querySelector('#fv-drivers');
        listT = page.querySelector('#fv-teams');
        emptyD = page.querySelector('#fv-empty-d');
        emptyT = page.querySelector('#fv-empty-t');
        countEl = page.querySelector('#fv-count');
        searchEl = page.querySelector('#fv-search');
        searchEl.addEventListener('input', applySearch);

        var menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-favorit]')) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-favorit onclick="showPage(\'favorit-page\'); return false;">Favorit</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var kuis = links.find(function (l) { return /kuis/i.test(l.textContent); });
            if (kuis) kuis.after(li); else menu.appendChild(li);
        }
        renderFav();
        loadDashboard();
        decorate();
        if (typeof MutationObserver !== 'undefined') {
            var obs = new MutationObserver(function () { decorate(); });
            var root = document.getElementById('main-wrapper') || document.body;
            obs.observe(root, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
