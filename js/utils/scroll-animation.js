/* =========================================================
   SCROLL ANIMATION (vanilla JS, tanpa library)
   Versi JavaScript dari komponen <ScrollAnimation> (React):
   elemen muncul sekali saja saat masuk layar -> fade + geser + blur.

   - Otomatis jalan di SEMUA halaman yang bisa di-scroll
     (Beranda, Sirkuit, Detail Pembalap, Detail Sirkuit, Klasemen,
      Hasil, Schedule, Katalog, Komponen, Bacaan, Detail Tim).
   - Konten yang dibuat lewat JS (innerHTML) juga ikut kena.
   - Hanya elemen DI BAWAH layar awal yang dianimasikan, jadi animasi
     masuk halaman yang sudah ada tidak bentrok.
   - Mau tambah sendiri? Cukup beri atribut di HTML:
         <div data-sa="up">...</div>      (up | down | left | right | pop | fade | section | row)
     Mau dimatikan di satu elemen:  data-sa="off"
   - Atau dari JS:  ScrollAnimation.add('.kelas-saya', 'pop');
   ========================================================= */
(function () {
    'use strict';

    if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;
    if (!(window.CSS && CSS.supports && CSS.supports('translate', '0 0'))) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ---------- DAFTAR ELEMEN YANG DIANIMASIKAN: [selector, gaya] ---------- */
    const RULES = [
        /* Beranda */
        ['.fs-wrap', 'fade'],
        ['.nb-hero-text', 'left'],
        ['.nb-hero-photo', 'right'],
        ['.nb-step', 'up'],
        ['.nb-tech-head', 'up'],
        ['.nb-tyre', 'pop'],
        ['.nb-divider', 'fade'],
        ['.nb-part', 'up'],
        ['.nb-terms > .nb-title', 'up'],
        ['.nb-ticket', 'up'],
        ['.nb-flag', 'pop'],
        ['.helm-footer', 'section'],
        ['.faq9-head', 'up'],
        ['.faq9-item', 'up'],
        ['.faq9-stats', 'up'],
        ['.ll-section', 'section'],
        ['.site-credit', 'up'],
        ['.nw-top', 'up'],
        ['.nw-card', 'up'],
        ['.nw-row', 'up'],

        /* Sirkuit & detail sirkuit */
        ['.circuit-card', 'pop'],
        ['.cd-stat', 'pop'],
        ['.cd-body', 'up'],
        ['.cd-nav', 'up'],

        /* Detail pembalap */
        ['#stats-grid > *', 'pop'],
        ['#article-text > *', 'up'],
        ['.other-drivers', 'up'],

        /* Klasemen, Hasil, Schedule */
        ['.kl-table tbody tr', 'row'],
        ['.hs-table tbody tr', 'row'],
        ['.sch-card', 'pop'],

        /* Katalog */
        ['.kt-card', 'pop'],

        /* Komponen / bacaan / detail tim */
        ['.pt-card', 'up'],
        ['.pt-next', 'up'],
        ['.flow', 'up'],
        ['.m6-gauges', 'up'],
        ['.td-sec', 'up'],
        ['.td-stats', 'up'],
        ['.bc-lead', 'up'],
        ['.bc-p', 'up'],
        ['.bc-more', 'up'],
        ['.bc-nav', 'up'],

        /* Elemen yang diberi atribut data-sa langsung di HTML */
        ['[data-sa]:not([data-sa="off"])', null]
    ];

    /* Bagian yang SENGAJA tidak disentuh (punya mekanisme scroll/drag/animasi sendiri) */
    const SKIP = '#drivers-page, #history-page, #reflek-page, #profile-page, #teams-page, ' +
                 '.hs-modal, .dp-modal, .td-bar, [data-sa="off"], [data-sa-skip]';

    const FOLD = 0.92;      // elemen di atas 92% tinggi layar (saat scroll 0) dianggap sudah terlihat -> tidak dianimasikan
    const MAX_STAGGER = 6;  // maksimal jeda berurutan
    const STEP = 0.08;      // detik antar elemen dalam satu kelompok
    const DUR = 0.75;       // harus sama dengan --sa-dur di CSS

    const tagged = new Set();       // sedang menunggu muncul
    const done = new WeakSet();     // sudah pernah dianimasikan (sekali saja)

    const io = new IntersectionObserver(onIntersect, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    function onIntersect(entries) {
        const hits = entries.filter(e => e.isIntersecting).map(e => e.target);
        if (!hits.length) return;

        /* urut dari atas ke bawah, kiri ke kanan -> jeda berurutan (stagger) */
        hits.sort((a, b) => {
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
            return (Math.round(ra.top / 8) - Math.round(rb.top / 8)) || (ra.left - rb.left);
        });

        hits.forEach((el, i) => {
            io.unobserve(el);
            tagged.delete(el);
            el.style.setProperty('--sa-delay', (Math.min(i, MAX_STAGGER) * STEP).toFixed(2) + 's');
            /* 2 frame supaya keadaan awal pasti sudah tergambar sebelum transisi jalan */
            requestAnimationFrame(() => requestAnimationFrame(() => play(el)));
        });
    }

    function play(el) {
        if (!el.isConnected) return;
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            el.removeEventListener('transitionend', onEnd);
            el.classList.remove('sa-pre', 'sa-go');
            el.style.removeProperty('--sa-delay');
            if (el.__saAuto) { el.removeAttribute('data-sa'); delete el.__saAuto; }
            done.add(el);
        };
        const onEnd = ev => { if (ev.target === el && ev.propertyName === 'opacity') finish(); };
        el.addEventListener('transitionend', onEnd);
        el.classList.add('sa-go');
        const delay = parseFloat(el.style.getPropertyValue('--sa-delay')) || 0;
        setTimeout(finish, (DUR + delay) * 1000 + 250);   // jaga-jaga kalau transitionend tidak terpicu
    }

    /* ---------- cari & tandai elemen ---------- */
    function scan() {
        /* bersihkan elemen yang sudah hilang dari halaman (mis. konten di-render ulang) */
        tagged.forEach(el => { if (!el.isConnected) { io.unobserve(el); tagged.delete(el); } });

        const found = new Map();   // el -> gaya
        RULES.forEach(([sel, variant]) => {
            let list;
            try { list = document.querySelectorAll(sel); } catch (e) { return; }
            list.forEach(el => {
                if (found.has(el)) return;
                found.set(el, variant || el.getAttribute('data-sa') || 'up');
            });
        });

        const els = Array.from(found.keys()).filter(el => {
            if (done.has(el) || el.classList.contains('sa-pre') || tagged.has(el)) return false;
            if (el.closest(SKIP) && el.getAttribute('data-sa') !== 'force') return false;
            if (!el.getClientRects().length) return false;              // halaman belum aktif / disembunyikan -> nanti dicek lagi
            return true;
        });

        /* jangan animasikan anak kalau induknya sudah ikut dianimasikan */
        const set = new Set(els);
        const finalList = els.filter(el => {
            for (let p = el.parentElement; p; p = p.parentElement) if (set.has(p) || done.has(p) || p.classList.contains('sa-pre')) return false;
            return true;
        });

        finalList.forEach(el => {
            const r = el.getBoundingClientRect();
            if (!r.width && !r.height) return;
            if (getComputedStyle(el).position === 'fixed') return;
            const docY = r.top + (window.pageYOffset || 0);
            if (docY < window.innerHeight * FOLD) return;                // sudah terlihat di layar awal -> biarkan
            if (!el.hasAttribute('data-sa')) el.__saAuto = true;      // atribut buatan script -> nanti dibersihkan
            el.setAttribute('data-sa', found.get(el));
            el.classList.add('sa-pre');
            tagged.add(el);
            io.observe(el);
        });
    }

    /* ---------- jadwal scan (dirapikan supaya ringan) ---------- */
    let timer = 0;
    function schedule(ms) {
        clearTimeout(timer);
        timer = setTimeout(scan, ms == null ? 120 : ms);
    }

    function boot() {
        scan();

        /* konten baru (halaman dirender lewat JS) */
        new MutationObserver(() => schedule(150)).observe(document.body, { childList: true, subtree: true });

        /* pindah halaman: showPage() dibungkus supaya scan jalan setelah halaman tampil */
        if (typeof window.showPage === 'function' && !window.showPage.__sa) {
            const orig = window.showPage;
            const wrapped = function () {
                const out = orig.apply(this, arguments);
                schedule(60); setTimeout(scan, 450); setTimeout(scan, 1200);
                return out;
            };
            wrapped.__sa = true;
            window.showPage = wrapped;
        }

        /* Scroll sudah mentok di bawah: elemen terakhir tidak bisa lewat garis trigger,
           jadi semua yang sudah kelihatan langsung dimunculkan. */
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking || !tagged.size) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                const de = document.documentElement;
                if (window.innerHeight + (window.pageYOffset || 0) < de.scrollHeight - 4) return;
                const vis = [];
                tagged.forEach(el => {
                    if (!el.isConnected || !el.getClientRects().length) return;
                    const r = el.getBoundingClientRect();
                    if (r.top < window.innerHeight && r.bottom > 0) vis.push({ isIntersecting: true, target: el });
                });
                if (vis.length) onIntersect(vis);
            });
        }, { passive: true });

        window.addEventListener('load', () => schedule(60));
        window.addEventListener('resize', () => schedule(250));
    }

    /* ---------- API kecil ---------- */
    window.ScrollAnimation = {
        refresh: () => schedule(0),
        add: function (selector, variant) { RULES.splice(RULES.length - 1, 0, [selector, variant || 'up']); schedule(0); }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
