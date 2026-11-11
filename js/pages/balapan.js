/* =========================================================
   BALAPAN.JS
   1) Countdown ke balapan F1 berikutnya (otomatis ikut jadwal)
   2) Bendera negara di tiap sirkuit (daftar sirkuit + halaman detail)

   Cara pasang: taruh file ini sefolder dengan index.html, lalu di index.html
   tambahkan SETELAH <script src="script.js"></script>:
       <script src="balapan.js"></script>
   ========================================================= */
(function () {
    'use strict';

    /* ---------------------------------------------------------
       JADWAL RACE F1 2026 (jam start pakai UTC supaya akurat
       di zona waktu mana pun). Sumber: formula1.com + ESPN.
       Kalau ada perubahan jadwal, cukup edit daftar ini.
       --------------------------------------------------------- */
    const RACES = [
        { name: 'Bahrain',         code: 'bh', start: '2026-10-04T07:00:00Z' }, // diadakan di Sepang, Malaysia
        { name: 'Singapura',       code: 'sg', start: '2026-10-11T12:00:00Z' }, // 20.00 waktu Singapura
        { name: 'Amerika Serikat', code: 'us', start: '2026-10-25T20:00:00Z' }, // 15.00 CDT, Austin
        { name: 'Meksiko',         code: 'mx', start: '2026-11-01T20:00:00Z' }, // 14.00 waktu setempat
        { name: 'São Paulo',       code: 'br', start: '2026-11-08T17:00:00Z' }, // 14.00 BRT
        { name: 'Las Vegas',       code: 'us', start: '2026-11-22T04:00:00Z' }, // Sabtu 20.00 PST
        { name: 'Qatar',           code: 'qa', start: '2026-11-29T16:00:00Z' }, // 19.00 waktu Qatar
        { name: 'Abu Dhabi',       code: 'ae', start: '2026-12-06T13:00:00Z' }  // 17.00 waktu UEA
    ];
    const RACE_LENGTH_MS = 2.5 * 60 * 60 * 1000; // setelah start + 2,5 jam, otomatis pindah ke race berikutnya
    const flagUrl = (code, w) => 'https://flagcdn.com/w' + w + '/' + code + '.png';

    /* ---------- gaya tambahan (disuntik lewat JS, tidak perlu edit style.css) ---------- */
    const css = document.createElement('style');
    css.textContent = `
        .nr-flag { width: 18px; height: 13px; object-fit: cover; border-radius: 2px; display: block;
                   box-shadow: 0 0 0 1px rgba(255,255,255,.2); }
        .nr-when { margin-top: 6px; font-size: .68rem; color: #a9a9b3; letter-spacing: .02em; }
        .cc-flag { height: 14px; width: auto; border-radius: 2px; margin-right: 8px; vertical-align: -2px;
                   box-shadow: 0 0 0 1px rgba(255,255,255,.2); }`;
    document.head.appendChild(css);

    /* =========================================================
       1) COUNTDOWN
       ========================================================= */
    function pad(n) { return String(n).padStart(2, '0'); }

    function pickRace(now) {
        for (const r of RACES) {
            if (now < new Date(r.start).getTime() + RACE_LENGTH_MS) return r;
        }
        return null; // semua race musim ini sudah selesai
    }

    function startCountdown() {
        const box = document.querySelector('.next-race');
        const nameEl = document.getElementById('nr-name');
        const timeEl = document.getElementById('nr-time');
        if (!box || !nameEl || !timeEl) return;

        // ganti titik merah dengan bendera negara
        let flag = box.querySelector('.nr-flag');
        if (!flag) {
            flag = document.createElement('img');
            flag.className = 'nr-flag';
            flag.alt = '';
            flag.addEventListener('error', () => { flag.style.display = 'none'; });
            const dot = box.querySelector('.nr-dot');
            if (dot) dot.replaceWith(flag); else nameEl.parentNode.prepend(flag);
        }

        // baris jam lokal pengunjung (WIB di Indonesia)
        let when = box.querySelector('.nr-when');
        if (!when) {
            when = document.createElement('div');
            when.className = 'nr-when';
            box.appendChild(when);
        }

        let shownCode = null;
        function tick() {
            const now = Date.now();
            const race = pickRace(now);

            if (!race) {
                nameEl.textContent = 'Musim 2026';
                timeEl.textContent = 'Selesai';
                when.textContent = '';
                flag.style.display = 'none';
                return;
            }

            if (shownCode !== race.name) {
                shownCode = race.name;
                nameEl.textContent = race.name;
                flag.style.display = '';
                flag.src = flagUrl(race.code, 40);
                flag.srcset = flagUrl(race.code, 80) + ' 2x';
                const d = new Date(race.start);
                try {
                    when.textContent = d.toLocaleString('id-ID', {
                        weekday: 'short', day: 'numeric', month: 'short',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    }).replace(/\./g, ':') + ' ' + (new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' })
                        .formatToParts(d).find(p => p.type === 'timeZoneName') || { value: '' }).value;
                } catch (e) { when.textContent = ''; }
            }

            const diff = new Date(race.start).getTime() - now;
            if (diff <= 0) { timeEl.textContent = 'Sedang berlangsung'; return; }

            const s = Math.floor(diff / 1000);
            const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600);
            const m = Math.floor(s % 3600 / 60), sc = s % 60;
            timeEl.innerHTML = (d ? d + '<small>HR</small>' : '') +
                pad(h) + '<small>J</small>' + pad(m) + '<small>M</small>' + pad(sc) + '<small>D</small>';
        }

        tick();
        setInterval(tick, 1000);
    }

    /* =========================================================
       2) BENDERA DI TIAP SIRKUIT
       ========================================================= */
    const COUNTRY_CODES = {
        'Australia': 'au', 'Meksiko': 'mx', 'Azerbaijan': 'az', 'Spanyol': 'es', 'Monako': 'mc',
        'Belgia': 'be', 'Kanada': 'ca', 'Amerika Serikat': 'us', 'Belanda': 'nl', 'Hungaria': 'hu',
        'Brasil': 'br', 'Qatar': 'qa', 'Singapura': 'sg', 'Italia': 'it', 'Austria': 'at',
        'Tiongkok': 'cn', 'Inggris': 'gb', 'Jepang': 'jp', 'Uni Emirat Arab': 'ae',
        'Bahrain': 'bh', 'Arab Saudi': 'sa'
    };

    function makeFlag(country) {
        const code = COUNTRY_CODES[country];
        if (!code) return null;
        const img = document.createElement('img');
        img.className = 'cc-flag';
        img.src = flagUrl(code, 40);
        img.srcset = flagUrl(code, 80) + ' 2x';
        img.alt = 'Bendera ' + country;
        img.loading = 'lazy';
        img.addEventListener('error', () => img.remove());
        return img;
    }

    // Daftar kartu sirkuit: sisipkan bendera sebelum "Kota, Negara"
    function decorateCards() {
        document.querySelectorAll('.circuit-card').forEach(card => {
            const loc = card.querySelector('.cc-loc');
            if (!loc || loc.querySelector('.cc-flag')) return;
            const m = /openCircuit\((\d+)\)/.exec(card.getAttribute('onclick') || '');
            const c = m && typeof circuitsData !== 'undefined' ? circuitsData[Number(m[1])] : null;
            const flag = c && makeFlag(c.country);
            if (flag) loc.prepend(flag);
        });
    }

    // Halaman detail sirkuit
    function decorateDetail(i) {
        const loc = document.getElementById('cd-loc');
        const c = typeof circuitsData !== 'undefined' ? circuitsData[i] : null;
        if (!loc || !c) return;
        const text = c.city + ', ' + c.country;
        loc.textContent = '';
        const flag = makeFlag(c.country);
        if (flag) loc.appendChild(flag);
        loc.appendChild(document.createTextNode(text));
    }

    // Bungkus fungsi bawaan script.js supaya bendera ikut muncul setiap kali dirender ulang
    if (typeof window.renderCircuits === 'function') {
        const origRender = window.renderCircuits;
        window.renderCircuits = function () {
            const out = origRender.apply(this, arguments);
            decorateCards();
            return out;
        };
    }
    if (typeof window.openCircuit === 'function') {
        const origOpen = window.openCircuit;
        window.openCircuit = function (i) {
            const out = origOpen.apply(this, arguments);
            decorateDetail(i);
            return out;
        };
    }

    /* ---------- jalankan ---------- */
    function init() {
        startCountdown();
        decorateCards(); // kartu yang sudah terlanjur dirender sebelum file ini dimuat
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
