/* =========================================================
   BAGIKAN — share kartu pembalap & tim
   - Tombol "Bagikan" di kartu pembalap, kartu tim, dan halaman
     detail pembalap. Di HP membuka share sheet bawaan (bisa
     WhatsApp dll); di laptop menyalin link-nya.
   - Link memakai hash deep-link (#pembalap/<id> dan #tim/<i>)
     sehingga yang menerima langsung membuka profilnya.
   ========================================================= */
(function () {
    'use strict';

    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
    var SITE = 'https://barbarbarian175-debug.github.io/toko-f1/';

    var toastEl = null, toastTimer = null;
    function toast(msg) {
        if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'sh-toast'; document.body.appendChild(toastEl); }
        toastEl.textContent = msg;
        toastEl.classList.add('on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2400);
    }

    var css = document.createElement('style');
    css.textContent = `
        .driver-card, .team-card { position: relative; }
        .sh-btn { position: absolute; top: 10px; right: 52px; z-index: 5; height: 34px; padding: 0 12px; border-radius: 999px;
            border: 1px solid rgba(255,255,255,.35); background: rgba(10,10,14,.55); color: #fff; font: 600 .78rem var(--f-body, 'Inter', sans-serif);
            cursor: pointer; display: inline-flex; align-items: center; gap: 5px; backdrop-filter: blur(2px); }
        .sh-btn:hover { background: rgba(10,10,14,.8); }
        #detail-page .dp-hero .sh-btn { top: 12px; right: 54px; }
        .sh-toast { position: fixed; left: 50%; bottom: 26px; transform: translate(-50%, 20px); z-index: 9999;
            background: #14151a; color: #fff; border: 1px solid rgba(255,255,255,.2); border-radius: 999px;
            padding: 10px 18px; font-size: .85rem; font-weight: 600; opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease; }
        .sh-toast.on { opacity: 1; transform: translate(-50%, 0); }`;
    document.head.appendChild(css);

    function shareData(type, id) {
        var url, text, title;
        if (type === 'driver' && typeof driversData !== 'undefined' && driversData[id]) {
            var d = driversData[id];
            url = SITE + '#pembalap/' + id;
            text = 'Jagoanku di F1: ' + d.name + ' (' + d.team + ') — lihat profilnya di F1 Driver Articles: ' + url;
            title = d.name + ' — F1 Driver Articles';
        } else if (type === 'team' && typeof teamsData !== 'undefined' && teamsData[id]) {
            var t = teamsData[id];
            url = SITE + '#tim/' + id;
            text = 'Tim favoritku di F1: ' + t.name + ' (' + t.full + ') — lihat di F1 Driver Articles: ' + url;
            title = t.name + ' — F1 Driver Articles';
        } else {
            url = SITE; text = 'F1 Driver Articles — panduan, pembalap, tim, sirkuit & klasemen Formula 1: ' + url;
            title = 'F1 Driver Articles';
        }
        return { url: url, text: text, title: title };
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return false; });
        }
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        return Promise.resolve(ok);
    }

    window.f1Share = function (type, id) {
        var data = shareData(type, id);
        if (navigator.share) {
            navigator.share({ title: data.title, text: data.text, url: data.url }).catch(function () {});
            return;
        }
        copyText(data.url).then(function (ok) {
            toast(ok ? 'Link disalin — tempel di chat mana saja' : 'Link: ' + data.url);
        });
    };
    /* Untuk pengujian (jsdom): */
    window.__f1ShareData = shareData;

    function shareBtn(type, id) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'sh-btn';
        b.setAttribute('aria-label', 'Bagikan');
        b.textContent = '↗ Bagikan';
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); window.f1Share(type, id); });
        return b;
    }

    function decorate() {
        document.querySelectorAll('.driver-card:not([data-sh])').forEach(function (card) {
            var m = (card.getAttribute('onclick') || '').match(/openDetail\((\d+)\)/);
            if (!m) return;
            card.setAttribute('data-sh', '1');
            card.appendChild(shareBtn('driver', m[1]));
        });
        document.querySelectorAll('.team-card:not([data-sh])').forEach(function (card) {
            var idxEl = card.querySelector('.tc-index');
            var i = idxEl ? parseInt(idxEl.textContent, 10) - 1 : -1;
            if (isNaN(i) || i < 0) return;
            card.setAttribute('data-sh', '1');
            card.appendChild(shareBtn('team', i));
        });
        document.querySelectorAll('#detail-page .dp-hero:not([data-sh])').forEach(function (hero) {
            var first = hero.querySelector('.dp-first'), last = hero.querySelector('.dp-last');
            if (!first || !last) return;
            var name = (first.textContent + ' ' + last.textContent).replace(/\s+/g, ' ').trim();
            var id = null;
            if (typeof driversData !== 'undefined') {
                Object.keys(driversData).forEach(function (k) { if (norm(driversData[k].name) === norm(name)) id = k; });
            }
            if (!id) return;
            hero.setAttribute('data-sh', '1');
            hero.appendChild(shareBtn('driver', id));
        });
    }

    function openHash() {
        var h = (location.hash || '').replace(/^#/, '');
        var m = h.match(/^pembalap\/(\d+)$/);
        if (m && typeof window.openDetail === 'function') { window.openDetail(Number(m[1])); return; }
        var t = h.match(/^tim\/(\d+)$/);
        if (t && typeof window.openTeamDetail === 'function') { window.openTeamDetail(Number(t[1])); }
    }

    function init() {
        decorate();
        if (typeof MutationObserver !== 'undefined') {
            var obs = new MutationObserver(function () { decorate(); });
            var root = document.getElementById('main-wrapper') || document.body;
            obs.observe(root, { childList: true, subtree: true });
        }
        setTimeout(openHash, 700);
        window.addEventListener('hashchange', openHash);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
