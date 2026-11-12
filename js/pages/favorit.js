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
        .fv-stage { position: relative; overflow: hidden; border-radius: 28px; border: 1px solid rgba(255,255,255,.16); padding: 18px 22px 22px;
            background: radial-gradient(ellipse 55% 60% at 78% 28%, rgba(225,6,0,.5), transparent 70%), radial-gradient(ellipse at 10% 100%, rgba(120,0,0,.25), transparent 60%), linear-gradient(160deg, #0d0d12, #050507); }
        .fv-top { position: relative; z-index: 6; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
        .fv-search { display: flex; align-items: center; gap: 10px; width: min(300px, 70%); padding: 10px 16px; border-radius: 999px;
            border: 1px solid rgba(255,255,255,.28); background: rgba(10,10,14,.55); backdrop-filter: blur(8px); color: #fff; }
        .fv-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: #fff; font: 500 .88rem var(--f-body, 'Inter', sans-serif); }
        .fv-search input::placeholder { color: #9a9aa6; }
        .fv-avatar { position: relative; width: 44px; height: 44px; border-radius: 50%; border: 2px solid rgba(255,255,255,.35); background: #1a1b21; flex: none; }
        .fv-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: center top; }
        .fv-avatar i { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9px; background: #e10600; color: #fff;
            font: 700 .65rem/18px var(--f-body, 'Inter', sans-serif); text-align: center; font-style: normal; }
        .fv-hero { position: relative; min-height: 330px; }
        .fv-hero-txt { position: relative; z-index: 4; max-width: 52%; padding: 34px 0 30px; display: flex; flex-direction: column; align-items: flex-start; }
        .fv-eyebrow { font-size: .7rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #cfcfd8; }
        .fv-name { margin: 14px 0 0; font-family: 'Orbitron', var(--f-head, 'Barlow Condensed', sans-serif); font-weight: 800; text-transform: uppercase;
            line-height: 1.02; font-size: clamp(1.9rem, 6.2vw, 4rem); letter-spacing: .01em; color: #fff; overflow-wrap: anywhere; }
        .fv-teamline { margin-top: 18px; font-weight: 700; font-size: 1.02rem; color: #fff; }
        .fv-teamline { display: flex; align-items: center; gap: 10px; }
        .fv-tlogo { height: 30px; width: auto; max-width: 70px; object-fit: contain; flex: none; }
        .fv-card .fv-mlogo { display: inline-block; width: 18px; height: 18px; height: 18px; object-fit: contain; margin-right: 7px; vertical-align: -4px; background: transparent; }
        .fv-tag { margin: 6px 0 0; color: #a9a9b3; font-size: .95rem; line-height: 1.45; max-width: 400px; }
        .fv-stat { margin-top: 12px; display: inline-flex; gap: 8px; align-items: center; }
        .fv-stat b { background: #e10600; border-radius: 999px; padding: 4px 11px; font-size: .8rem; }
        .fv-stat span { color: #a9a9b3; font-size: .82rem; }
        .fv-btn { margin-top: 20px; display: inline-flex; align-items: center; gap: 12px; padding: 11px 22px; border: 0; border-radius: 999px; cursor: pointer;
            background: linear-gradient(90deg, #c8353a 0%, #7a1a1f 100%); color: #fff; font: 600 .9rem var(--f-body, 'Inter', sans-serif); box-shadow: 0 6px 24px rgba(225,6,0,.25); }
        .fv-btn:hover { filter: brightness(1.15); }
        .fv-photo { position: absolute; z-index: 2; right: -2%; top: -70px; width: 62%; height: calc(100% + 120px); pointer-events: none;
            -webkit-mask-image: linear-gradient(to right, transparent 0, #000 32%), linear-gradient(to bottom, #000 72%, transparent 100%); -webkit-mask-composite: source-in;
            mask-image: linear-gradient(to right, transparent 0, #000 32%), linear-gradient(to bottom, #000 72%, transparent 100%); mask-composite: intersect; }
        .fv-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
        .fv-num { position: absolute; z-index: 1; right: 4%; top: 22px; font-family: 'Orbitron', var(--f-head, sans-serif); font-weight: 800; font-style: italic;
            font-size: clamp(7rem, 20vw, 14rem); line-height: 1; color: transparent; -webkit-text-stroke: 3px #ff2a1f; text-shadow: 0 0 28px rgba(255,40,30,.65); opacity: .9; pointer-events: none; }
        .fv-blank { position: relative; z-index: 4; padding: 40px 0; max-width: 460px; color: #d7d7de; }
        .fv-chips { position: relative; z-index: 5; display: flex; gap: 8px; flex-wrap: wrap; margin: 4px 0 16px; }
        .fv-chip { display: inline-flex; align-items: center; gap: 8px; padding: 4px 13px 4px 4px; border-radius: 999px; border: 1px solid rgba(255,255,255,.22);
            background: rgba(10,10,14,.55); color: #fff; font: 600 .82rem var(--f-body, 'Inter', sans-serif); cursor: pointer; backdrop-filter: blur(6px); }
        .fv-chip img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; object-position: center top; background: #333; }
        .fv-chip.sel { border-color: #e10600; background: rgba(225,6,0,.22); }
        .fv-dash { position: relative; z-index: 5; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .fv-dcard { border: 1px solid rgba(255,255,255,.14); border-radius: 22px; background: rgba(22,22,28,.55); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            padding: 20px 22px; min-height: 300px; display: flex; flex-direction: column; }
        .fv-dcard h4 { margin: 0 0 16px; font-size: 1rem; font-weight: 700; color: #fff; }
        .fv-racehead { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: .88rem; }
        .fv-racehead img { width: 26px; height: 18px; object-fit: cover; border-radius: 2px; }
        .fv-circuit { margin-top: 8px; color: #8d8d98; font-size: .8rem; }
        .fv-dcard .fv-track { display: block; width: 100%; height: 110px; object-fit: contain; filter: brightness(0) invert(1); opacity: .92; margin: 14px 0 10px; }
        .fv-dcard .fv-track.tk-l { filter: invert(1); border-radius: 8px; opacity: 1; }
        .fv-dcard .fv-track.tk-d { filter: none; border-radius: 8px; opacity: 1; }
        .fv-racedate { color: #a9a9b3; font-size: .85rem; line-height: 1.5; }
        .fv-bigdate { margin-top: auto; font-weight: 700; font-size: 1rem; color: #fff; }
        .fv-countdown { color: #ff4d4d; font-size: .95rem; margin-top: 2px; }
        .fv-link { margin-top: auto; align-self: flex-start; color: #ff4d4d; font-weight: 500; font-size: .95rem; cursor: pointer; background: none; border: 0; padding: 12px 0 0; text-decoration: none; }
        .fv-link:hover { color: #ff8080; }
        .fv-minirow { display: flex; align-items: center; gap: 10px; padding: 11px 12px; margin: 0 -12px; border-radius: 8px; font-size: .88rem; }
        .fv-minirow.hi { background: rgba(255,255,255,.09); }
        .fv-minirow .fv-pos { width: 18px; color: #cfcfd8; }
        .fv-minirow .fv-logo { width: 22px; height: 22px; border-radius: 5px; flex: none; display: grid; place-items: center; font-size: .6rem; font-weight: 800; color: #fff; overflow: hidden; }
        .fv-minirow .fv-logo img { width: 100%; height: 100%; object-fit: contain; }
        .fv-minirow .fv-logo:has(img) { padding: 2px; box-sizing: border-box; }
        .fv-minirow .fv-nm { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fv-minirow .fv-pts { font-variant-numeric: tabular-nums; color: #e7e7ee; }
        .fv-news { display: flex; gap: 12px; align-items: center; padding: 9px 0; color: inherit; text-decoration: none; }
        .fv-news img, .fv-news .fv-ph { width: 74px; height: 50px; border-radius: 6px; object-fit: cover; background: #23242b; flex: none; }
        .fv-news .fv-nt { font-weight: 600; font-size: .83rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .fv-news .fv-ns { color: #8d8d98; font-size: .74rem; margin-top: 3px; }
        .fv-news:hover .fv-nt { color: #ff8080; }
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
        @media (max-width: 860px) { .fv-dash { grid-template-columns: 1fr; } .fv-dcard { min-height: 0; } }
        @media (max-width: 760px) { .fv-stage { padding: 14px 14px 18px; } .fv-photo { width: 92%; right: -12%; top: 40px; height: 380px; opacity: .85; }
            .fv-hero { min-height: 400px; } .fv-hero-txt { max-width: 100%; padding-top: 230px; } .fv-num { top: 70px; right: 2%; font-size: 7rem; } }
        @media (max-width: 640px) { .fv-grid { grid-template-columns: 1fr 1fr; gap: 10px; } .fv-card img { height: 150px; } }`;
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&display=swap';
    document.head.appendChild(fontLink);
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
    var nk = function (s) { return norm(s).replace(/[^a-z0-9]/g, ''); };
    function teamKey(value) {
        var key = nk(value).replace(/f1team$|team$/, '');
        return key === 'rb' ? 'racingbulls' : key;
    }
    function teamByCtor(ctor) {
        if (typeof teamsData === 'undefined' || !ctor) return null;
        var c = teamKey(ctor);
        if (!c) return null;
        return teamsData.find(function (t) {
            return [t.name, t.full].some(function (x) { var k = teamKey(x); return k && (k === c || k.indexOf(c) !== -1 || c.indexOf(k) !== -1); });
        }) || null;
    }
    function teamOf(driverName, ctor) {
        if (typeof teamsData === 'undefined') return null;
        var n = norm(driverName), last = n.split(' ').pop();
        var t = teamsData.find(function (t) { return (t.drivers || []).some(function (x) { return norm(x) === n; }); });
        if (!t && last) t = teamsData.find(function (t) { return (t.drivers || []).some(function (x) { return norm(x).split(' ').pop() === last; }); });
        return t || teamByCtor(ctor) || null;
    }
    /* logo tim: pakai field di teamsData, kalau kosong ambil dari objek teamLogos (script.js) */
    function logoOf(team, ctor) {
        if (!team && !ctor) return '';
        var v = team ? ( team.logo || team.img || team.logoImg || '') : '';
        if (v && typeof v === 'object') v = v.src || v.logo || v.url || v.img || '';
        if (v) return v;
        var map = window.teamLogos || (typeof teamLogos !== 'undefined' ? teamLogos : null);
        if (!map) return '';
        var names = (team ? [team.name, team.full] : []).concat(ctor ? [ctor] : []);
        var keys = Object.keys(map);
        for (var i = 0; i < names.length; i++) {
            var want = teamKey(names[i]);
            if (!want) continue;
            var key = keys.find(function (k) { return teamKey(k) === want; }) ||
                keys.find(function (k) {
                    var candidate = teamKey(k);
                    return candidate && (candidate.indexOf(want) !== -1 || want.indexOf(candidate) !== -1);
                });
            if (key) return map[key];
        }
        return '';
    }
    function ctorForDriver(name) {
        if (!standingsMap) return '';
        var n = norm(name), standing = standingsMap[n];
        if (standing && standing.ctor) return standing.ctor;
        var last = n.split(' ').pop();
        var key = Object.keys(standingsMap).find(function (k) {
            return last && k.split(' ').pop() === last && standingsMap[k].ctor;
        });
        return key ? standingsMap[key].ctor : '';
    }
    function driverByName(name) {
        if (typeof driversData === 'undefined') return null;
        var id = Object.keys(driversData).find(function (k) { return norm(driversData[k].name) === norm(name); });
        return id ? { id: id, d: driversData[id] } : null;
    }

    var page = null, heroEl = null, chipsEl = null, nextEl = null, standEl = null, hlEl = null,
        listD = null, listT = null, emptyD = null, emptyT = null, countEl = null, searchEl = null, avatarEl = null;
    var focusId = null, standingsMap = null, standRows = null, newsItems = null;

    function renderFocus() {
        if (!heroEl) return;
        var d = load();
        if (avatarEl) avatarEl.innerHTML = '';
        if (!d.d.length) {
            focusId = null;
            chipsEl.innerHTML = '';
            heroEl.innerHTML = '<div class="fv-blank"><div class="fv-eyebrow">Driver Focus</div><h2 class="fv-name" style="font-size:1.8rem">Belum ada favorit</h2>' +
                '<p class="fv-tag">Ketuk ♥ di kartu pembalap mana pun untuk menjadikannya fokus di sini.</p></div>';
            renderStandings();
            return;
        }
        if (!focusId || d.d.indexOf(String(focusId)) === -1) focusId = d.d[0];
        var drv = driverById(focusId);
        if (!drv) return;
        var ctor = ctorForDriver(drv.name);
        var team = teamOf(drv.name, ctor);
        var logo = logoOf(team, ctor);
        var title = (drv.title || '').split(':').slice(1).join(':').trim() || '';
        var st = standingsMap ? standingsMap[norm(drv.name)] : null;
        var nomor = drv.stats && drv.stats.Nomor ? String(drv.stats.Nomor) : '';
        if (avatarEl) avatarEl.innerHTML = (drv.photo ? '<img src="' + esc(drv.photo) + '" alt="" onerror="this.remove()">' : '') + '<i>' + (d.d.length + d.t.length) + '</i>';
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
            '<h2 class="fv-name">' + esc(drv.name).replace(' ', '<br>') + '</h2>' +
            '<div class="fv-teamline">' + (logo ? '<img class="fv-tlogo" src="' + esc(logo) + '" alt="" onerror="this.remove()">' : '') + '<span>' + esc(drv.team || (team ? team.name : '')) + '</span></div>' +
            (title ? '<p class="fv-tag">' + esc(title) + '</p>' : '') +
            (st ? '<div class="fv-stat"><b>P' + esc(st.pos) + '</b><span>' + esc(st.points) + ' poin • klasemen ' + YEAR + '</span></div>' : '') +
            '<button type="button" class="fv-btn" id="fv-profile">Lihat profil <span>→</span></button></div>' +
            (nomor ? '<span class="fv-num">' + esc(nomor) + '</span>' : '') +
            '<div class="fv-photo">' + (drv.photo ? '<img src="' + esc(drv.photo) + '" alt="' + esc(drv.name) + '" onerror="this.remove()">' : '') + '</div>';
        bindProfile(focusId);
        renderStandings();
        renderNews();
    }

    function bindProfile(id) {
        var b = heroEl && heroEl.querySelector('#fv-profile');
        if (b) b.addEventListener('click', function () { if (typeof window.openDetail === 'function') window.openDetail(Number(id)); });
    }

    function teamLogo(name, ctor) {
        var team = teamOf(name, ctor);
        var bg = team && team.color ? team.color : '#555';
        var logo = logoOf(team, ctor);
        var ini = team && team.name ? team.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() : '';
        return '<span class="fv-logo" style="background:' + (logo ? '#fff' : esc(bg)) + '">' + (logo ? '<img src="' + esc(logo) + '" alt="" onerror="this.remove()">' : esc(ini)) + '</span>';
    }

    function renderStandings() {
        if (!standEl) return;
        if (!standRows) return;
        var focusName = focusId && driverById(focusId) ? norm(driverById(focusId).name) : '';
        var hit = standRows.some(function (r) { return norm(r.name) === focusName; });
        standEl.innerHTML = '<h4>Standings</h4>' + standRows.map(function (r, i) {
            var on = hit ? norm(r.name) === focusName : i === 0;
            return '<div class="fv-minirow' + (on ? ' hi' : '') + '"><span class="fv-pos">' + esc(r.pos) + '</span>' + teamLogo(r.name, r.ctor) +
                '<span class="fv-nm">' + esc(r.name) + '</span><span class="fv-pts">' + esc(r.points) + ' PTS</span></div>';
        }).join('') + '<button type="button" class="fv-link" data-go="klasemen-page">Lihat klasemen lengkap</button>';
        var b = standEl.querySelector('[data-go]');
        if (b) b.addEventListener('click', function () { if (typeof window.showPage === 'function') window.showPage('klasemen-page'); });
    }

    /* ---------- berita (pengganti Race Highlights) ---------- */
    var NEWS_FEEDS = [
        'https://www.motorsport.com/rss/f1/news/',
        'https://www.autosport.com/rss/f1/news/',
        'https://news.google.com/rss/search?q=formula+1&hl=id&gl=ID&ceid=ID:id'
    ];
    var NEWS_MORE = 'https://news.google.com/search?q=formula%201&hl=id&gl=ID&ceid=ID%3Aid';
    function ago(s) {
        var t = new Date(String(s).replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? '' : 'Z')).getTime();
        if (!t) return '';
        var m = Math.max(1, Math.round((Date.now() - t) / 60000));
        if (m < 60) return m + ' mnt lalu';
        if (m < 1440) return Math.round(m / 60) + ' jam lalu';
        return Math.round(m / 1440) + ' hari lalu';
    }
    function parseFeed(j) {
        return (j.items || []).slice(0, 10).map(function (it) {
            var title = it.title || '', src = (j.feed && j.feed.title) || '';
            var cut = title.lastIndexOf(' - ');
            if (cut > 20) { src = title.slice(cut + 3); title = title.slice(0, cut); }
            var img = it.thumbnail || (it.enclosure && it.enclosure.link) || '';
            if (!img) { var mm = String(it.content || it.description || '').match(/<img[^>]+src=["']([^"']+)/i); if (mm) img = mm[1]; }
            if (img && !/^https?:/.test(img)) img = '';
            return { title: title, link: it.link, src: src.replace(/^Google News.*/, 'Berita F1'), date: it.pubDate, img: img };
        }).filter(function (x) { return x.title && x.link; });
    }
    function loadNews() {
        var cached = cacheGet('f1_fv_news2', 15 * 60 * 1000);
        if (cached && cached.length) { newsItems = cached; renderNews(); return; }
        Promise.all(NEWS_FEEDS.map(function (u) {
            return fetchJSON('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(u)).then(parseFeed).catch(function () { return []; });
        })).then(function (lists) {
            var all = [].concat.apply([], lists), seen = {};
            all = all.filter(function (n) { if (seen[n.link]) return false; seen[n.link] = 1; return true; });
            // berita yang punya gambar didahulukan, lalu yang terbaru
            all.sort(function (a, b) { return (!!b.img - !!a.img) || (new Date(b.date) - new Date(a.date)); });
            if (!all.length) { if (hlEl) hlEl.innerHTML = '<h4>Berita Terbaru</h4><p class="fv-racedate">Berita belum bisa dimuat.</p>'; return; }
            newsItems = all.slice(0, 12);
            cacheSet('f1_fv_news2', newsItems);
            renderNews();
        });
    }
    function renderNews() {
        if (!hlEl || !newsItems) return;
        var drv = focusId ? driverById(focusId) : null;
        var items = newsItems.slice();
        if (drv) { // berita yang menyebut pembalap fokus naik ke atas
            var last = norm(drv.name.split(' ').pop());
            items.sort(function (a, b) { return (norm(b.title).indexOf(last) !== -1) - (norm(a.title).indexOf(last) !== -1); });
        }
        items = items.slice(0, 3);
        hlEl.innerHTML = '<h4>Berita Terbaru</h4>' + items.map(function (n) {
            var th = n.img ? '<img src="' + esc(n.img) + '" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;fv-ph&quot;></span>\'">' : '<img src="assets/images/bg/hero-f1.jpg" alt="" onerror="this.outerHTML=\'<span class=&quot;fv-ph&quot;></span>\'">';
            return '<a class="fv-news" href="' + esc(n.link) + '" target="_blank" rel="noopener noreferrer">' + th +
                '<div><div class="fv-nt">' + esc(n.title) + '</div><div class="fv-ns">' + esc(n.src) + (n.date ? ' • ' + esc(ago(n.date)) : '') + '</div></div></a>';
        }).join('') + '<a class="fv-link" href="' + NEWS_MORE + '" target="_blank" rel="noopener noreferrer">Lihat semua berita</a>';
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
                var ctor = ctorForDriver(drv.name);
                var team = teamOf(drv.name, ctor);
                var logo = logoOf(team, ctor);
                var card = document.createElement('article');
                card.className = 'fv-card';
                card.innerHTML = '<img src="' + esc(drv.photo || '') + '" alt="' + esc(drv.name) + '" loading="lazy" onerror="this.remove()">' +
                    '<div class="fv-info"><div class="fv-name">' + esc(drv.name) + '</div>' +
                    '<div class="fv-meta">' + (logo ? '<img class="fv-mlogo" src="' + esc(logo) + '" alt="" onerror="this.remove()">' : '<span class="fv-team" style="background:' + (team ? team.color : '#888') + '"></span>') + esc(drv.team || (team ? team.name : '')) + (drv.stats && drv.stats.Nomor ? ' • #' + esc(drv.stats.Nomor) : '') + '</div></div>';
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

    var FLAGS = { italy: 'it', belgium: 'be', netherlands: 'nl', uk: 'gb', monaco: 'mc', spain: 'es', austria: 'at', hungary: 'hu', azerbaijan: 'az', singapore: 'sg',
        usa: 'us', uae: 'ae', mexico: 'mx', brazil: 'br', qatar: 'qa', 'saudi arabia': 'sa', bahrain: 'bh', australia: 'au', japan: 'jp', china: 'cn', canada: 'ca',
        france: 'fr', germany: 'de', portugal: 'pt', turkey: 'tr', 'united states': 'us', 'united kingdom': 'gb' };

    function loadDashboard() {
        function setStand(rows, map) { standRows = rows; standingsMap = map; renderFocus(); }
        var cached = cacheGet('f1_fv_stand3', 20 * 60 * 1000);
        if (cached) setStand(cached.rows, cached.map);
        else fetchJSON(JOLPICA + 'current/driverStandings.json').then(function (j) {
            var list = (j.MRData && j.MRData.StandingsTable && j.MRData.StandingsTable.StandingsLists[0]) || {};
            var rows = (list.DriverStandings || []).slice(0, 4).map(function (r) {
                var ctor = (r.Constructors && r.Constructors[0] && r.Constructors[0].name) || '';
                return { pos: r.position, name: (r.Driver.givenName + ' ' + r.Driver.familyName), points: r.points, ctor: ctor };
            });
            var map = {};
            (list.DriverStandings || []).forEach(function (r) {
                var ctor = (r.Constructors && r.Constructors[0] && r.Constructors[0].name) || '';
                map[norm(r.Driver.givenName + ' ' + r.Driver.familyName)] = { pos: r.position, points: r.points, ctor: ctor };
            });
            cacheSet('f1_fv_stand3', { rows: rows, map: map });
            setStand(rows, map);
        }).catch(function () { if (standEl) standEl.innerHTML = '<h4>Standings</h4><p class="fv-racedate">Klasemen belum bisa dimuat.</p>'; });

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
            var when = new Date(nx.date + 'T' + (nx.time || '12:00:00Z'));
            var days = Math.ceil((when.getTime() - now) / 864e5);
            var flag = FLAGS[norm((nx.Circuit.Location && nx.Circuit.Location.country) || '')];
            var dtxt = when.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
            nextEl.innerHTML = '<h4>Next Race</h4>' +
                '<div class="fv-racehead">' + (flag ? '<img src="https://flagcdn.com/w40/' + flag + '.png" alt="" onerror="this.remove()">' : '') + '<span>' + esc(nx.raceName) + '</span></div>' +
                '<div class="fv-circuit">' + esc(nx.Circuit.circuitName) + '</div>' +
                (img ? '<img class="fv-track" src="' + esc(img) + '" alt="Lintasan ' + esc(nx.Circuit.circuitName) + '" loading="lazy" onerror="this.remove()">' : '') +
                '<div class="fv-bigdate">' + esc(dtxt) + '</div>' +
                '<div class="fv-countdown">' + (days <= 1 ? 'Race Day' : days + ' hari lagi') + '</div>';
            var ti = nextEl.querySelector('.fv-track');
            if (ti) ti.addEventListener('load', function () {
                /* gambar transparan -> jadi putih (default CSS). gambar dengan latar solid -> pilih inversi yang sesuai */
                try {
                    var c = document.createElement('canvas'); c.width = c.height = 32;
                    var x = c.getContext('2d'); x.drawImage(ti, 0, 0, 32, 32);
                    var d = x.getImageData(0, 0, 32, 32).data, n = 0;
                    for (var i = 3; i < d.length; i += 4) if (d[i] > 40) n++;
                    if (n / 1024 > .9) ti.classList.add((d[0] * .299 + d[1] * .587 + d[2] * .114) > 128 ? 'tk-l' : 'tk-d');
                } catch (e) {}
            });
            nextEl.style.cursor = 'pointer';
            nextEl.onclick = function () {
                var a = document.querySelector('a[data-schedule]');
                if (a) a.click(); else if (typeof window.showPage === 'function') window.showPage('schedule-page');
            };
        }

        loadNews();
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        page = document.createElement('div');
        page.id = 'favorit-page';
        page.className = 'page';
        page.innerHTML = '<div class="fv-wrap"><div class="fv-stage">' +
            '<div class="fv-top"><div class="fv-search"><span>🔍</span><input type="text" id="fv-search" placeholder="Cari pembalap, tim…" aria-label="Cari favorit"></div>' +
            '<div class="fv-avatar" id="fv-avatar"></div></div>' +
            '<div class="fv-hero" id="fv-hero"></div>' +
            '<div class="fv-chips" id="fv-chips"></div>' +
            '<div class="fv-dash">' +
            '<div class="fv-dcard" id="fv-next"><h4>Next Race</h4><p class="fv-racedate">Memuat jadwal…</p></div>' +
            '<div class="fv-dcard" id="fv-stand"><h4>Standings</h4><p class="fv-racedate">Memuat klasemen…</p></div>' +
            '<div class="fv-dcard" id="fv-hl"><h4>Berita Terbaru</h4><p class="fv-racedate">Memuat berita…</p></div>' +
            '</div></div>' +
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
        avatarEl = page.querySelector('#fv-avatar');
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