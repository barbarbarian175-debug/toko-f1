/* =========================================================
   FAVORIT — simpan pembalap & tim kesukaan (localStorage)
   - Tombol hati (♥) di kartu pembalap, kartu tim, dan halaman
     detail pembalap. Keadaan tersimpan di localStorage 'f1_fav'.
   - Halaman "Favoritku" menampilkan semua yang disimpan.
   - Tidak mengubah desain yang sudah ada; hanya menambah tombol.
   ========================================================= */
(function () {
    'use strict';

    var KEY = 'f1_fav';
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };

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
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'fv-toast';
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        toastEl.classList.add('on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
    }

    /* ---------- gaya ---------- */
    var css = document.createElement('style');
    css.textContent = `
        .fv-heart { position: absolute; top: 10px; right: 10px; z-index: 5; width: 34px; height: 34px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,.35); background: rgba(10,10,14,.55); color: #fff; font-size: 17px; line-height: 1;
            cursor: pointer; display: grid; place-items: center; padding: 0; backdrop-filter: blur(2px); transition: transform .15s ease, background .15s ease; }
        .fv-heart:hover { transform: scale(1.12); }
        .fv-heart.on { background: #e10600; border-color: #e10600; color: #fff; }
        .fv-heart.on::after { content: ''; }
        .driver-card, .team-card { position: relative; }
        .fv-toast { position: fixed; left: 50%; bottom: 26px; transform: translate(-50%, 20px); z-index: 9999;
            background: #14151a; color: #fff; border: 1px solid rgba(255,255,255,.2); border-radius: 999px;
            padding: 10px 18px; font-size: .85rem; font-weight: 600; opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease; }
        .fv-toast.on { opacity: 1; transform: translate(-50%, 0); }
        .fv-wrap { max-width: 1100px; margin: 0 auto; padding: 8px 16px 60px; color: #fff; text-align: left; }
        .fv-wrap h2 { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: clamp(2rem, 6vw, 3rem); margin: 10px 0 4px; text-transform: uppercase; }
        .fv-wrap .fv-sub { color: #a9a9b3; margin: 0 0 22px; }
        .fv-wrap h3 { margin: 26px 0 12px; font-size: 1.05rem; letter-spacing: .06em; text-transform: uppercase; color: #d7d7de; }
        .fv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .fv-card { position: relative; border: 1px solid rgba(255,255,255,.14); border-radius: 16px; overflow: hidden; background: #17181d; cursor: pointer; text-align: left; padding: 0; color: #fff; }
        .fv-card img { display: block; width: 100%; height: 190px; object-fit: cover; object-position: center top; background: #222; }
        .fv-card .fv-info { padding: 12px 14px 14px; }
        .fv-card .fv-name { font-weight: 700; font-size: 1rem; }
        .fv-card .fv-meta { color: #a9a9b3; font-size: .82rem; margin-top: 3px; }
        .fv-card .fv-team { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 7px; vertical-align: -1px; }
        .fv-empty { border: 1px dashed rgba(255,255,255,.25); border-radius: 14px; padding: 22px; color: #a9a9b3; text-align: center; }
        .fv-x { position: absolute; top: 8px; right: 8px; z-index: 3; width: 28px; height: 28px; border-radius: 50%; border: 0; background: rgba(0,0,0,.55); color: #fff; cursor: pointer; font-size: 14px; }
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

    /* ---------- halaman Favoritku ---------- */
    var page = null, listD = null, listT = null, emptyD = null, emptyT = null, countEl = null;
    function driverById(id) {
        if (typeof driversData === 'undefined') return null;
        return driversData[id] || null;
    }
    function teamByName(name) {
        if (typeof teamsData === 'undefined') return null;
        return teamsData.find(function (t) { return norm(t.name) === norm(name); }) || null;
    }
    function renderFav() {
        if (!page) return;
        var d = load();
        countEl.textContent = (d.d.length + d.t.length) + ' favorit';
        listD.innerHTML = '';
        listT.innerHTML = '';
        if (!d.d.length) {
            emptyD.hidden = false;
        } else {
            emptyD.hidden = true;
            d.d.forEach(function (id) {
                var drv = driverById(id);
                if (!drv) return;
                var team = (typeof teamsData !== 'undefined') ? teamsData.find(function (t) { return (t.drivers || []).indexOf(drv.name) !== -1; }) : null;
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
        if (!d.t.length) {
            emptyT.hidden = false;
        } else {
            emptyT.hidden = true;
            d.t.forEach(function (name) {
                var t = teamByName(name);
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
                    if (typeof window.openTeamDetail === 'function' && typeof teamsData !== 'undefined') {
                        window.openTeamDetail(teamsData.indexOf(t));
                    } else if (typeof window.showPage === 'function') window.showPage('teams-page');
                });
                listT.appendChild(card);
            });
        }
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        page = document.createElement('div');
        page.id = 'favorit-page';
        page.className = 'page';
        page.innerHTML = '<div class="fv-wrap"><h2>Favoritku</h2>' +
            '<p class="fv-sub"><span id="fv-count">0 favorit</span> • tersimpan di perangkat ini</p>' +
            '<h3>♥ Pembalap</h3><div class="fv-grid" id="fv-drivers"></div>' +
            '<div class="fv-empty" id="fv-empty-d">Belum ada pembalap favorit. Ketuk ♥ di kartu pembalap mana pun.</div>' +
            '<h3>♥ Tim</h3><div class="fv-grid" id="fv-teams"></div>' +
            '<div class="fv-empty" id="fv-empty-t">Belum ada tim favorit. Ketuk ♥ di kartu tim mana pun.</div></div>';
        var after = document.getElementById('katalog-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        listD = page.querySelector('#fv-drivers');
        listT = page.querySelector('#fv-teams');
        emptyD = page.querySelector('#fv-empty-d');
        emptyT = page.querySelector('#fv-empty-t');
        countEl = page.querySelector('#fv-count');

        var menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-favorit]')) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-favorit onclick="showPage(\'favorit-page\'); return false;">Favorit</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var kuis = links.find(function (l) { return /kuis/i.test(l.textContent); });
            if (kuis) kuis.after(li); else menu.appendChild(li);
        }
        renderFav();
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
