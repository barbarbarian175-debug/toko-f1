/* =========================================================
   PENGINGAT — tambah balapan ke kalender HP (.ics)
   - Tombol "Ingatkan saya" muncul di kartu jadwal (Schedule)
     untuk balapan yang akan datang / sedang berlangsung.
   - Klik -> unduh file .ics (judul, sirkuit, waktu UTC, alarm
     15 menit sebelum start). Buka file-nya untuk menambah ke
     kalender HP. Jadwal dari Jolpica, cache 1 jam.
   ========================================================= */
(function () {
    'use strict';

    var JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    var SCHED_KEY = 'f1_rem_sched';
    var escIcs = function (s) { return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); };
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var fmtUtc = function (d) {
        return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
            pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
    };

    var toastEl = null, toastTimer = null;
    function toast(msg) {
        if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'rm-toast'; document.body.appendChild(toastEl); }
        toastEl.textContent = msg;
        toastEl.classList.add('on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
    }

    var css = document.createElement('style');
    css.textContent = `
        .rm-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 7px 13px; border-radius: 999px;
            border: 1.5px solid #14151a; background: #fff; color: #14151a; font: 700 .78rem var(--f-body, 'Inter', sans-serif); cursor: pointer; }
        .rm-btn:hover { background: #14151a; color: #fff; }
        .rm-toast { position: fixed; left: 50%; bottom: 26px; transform: translate(-50%, 20px); z-index: 9999;
            background: #14151a; color: #fff; border: 1px solid rgba(255,255,255,.2); border-radius: 999px;
            padding: 10px 18px; font-size: .85rem; font-weight: 600; opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease; }
        .rm-toast.on { opacity: 1; transform: translate(-50%, 0); }`;
    document.head.appendChild(css);

    function raceStart(r) { return new Date(r.date + 'T' + (r.time || '12:00:00Z')); }
    function buildIcs(race) {
        var start = raceStart(race), end = new Date(start.getTime() + 2 * 3600 * 1000);
        var loc = [race.Circuit.circuitName, race.Circuit.Location.locality, race.Circuit.Location.country].filter(Boolean).join(', ');
        var lines = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//F1 Driver Articles//Race Reminder//ID',
            'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
            'UID:f1-' + race.season + '-' + race.round + '@toko-f1',
            'DTSTAMP:' + fmtUtc(new Date()),
            'DTSTART:' + fmtUtc(start),
            'DTEND:' + fmtUtc(end),
            'SUMMARY:' + escIcs('F1: ' + race.raceName),
            'LOCATION:' + escIcs(loc),
            'DESCRIPTION:' + escIcs('Jadwal dan klasemen: https://barbarbarian175-debug.github.io/toko-f1/'),
            'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY',
            'DESCRIPTION:' + escIcs('F1: ' + race.raceName + ' dimulai 15 menit lagi'),
            'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'
        ];
        return lines.join('\r\n');
    }
    function downloadIcs(race) {
        var blob = new Blob([buildIcs(race)], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        var slug = String(race.raceName || 'balapan').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        a.href = url; a.download = 'F1-' + race.season + '-R' + race.round + '-' + slug + '.ics';
        document.body.appendChild(a); a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
        toast('File kalender diunduh — buka untuk menambah ke kalender HP');
    }

    function loadSchedule(cb) {
        var cached = null;
        try { var c = JSON.parse(localStorage.getItem(SCHED_KEY) || 'null'); if (c && Date.now() - c.ts < 3600e3) cached = c.data; } catch (e) {}
        if (cached) { cb(cached); return; }
        fetch(JOLPICA + 'current.json')
            .then(function (r) { return r.json(); })
            .then(function (j) {
                var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                try { localStorage.setItem(SCHED_KEY, JSON.stringify({ ts: Date.now(), data: races })); } catch (e) {}
                cb(races);
            })
            .catch(function () { cb([]); });
    }

    window.f1Remind = function (round) {
        loadSchedule(function (races) {
            var race = races.find(function (r) { return String(r.round) === String(round); });
            if (!race) { toast('Jadwal balapan belum bisa dimuat. Coba lagi sebentar.'); return; }
            downloadIcs(race);
        });
    };

    /* ---------- tombol di kartu jadwal ---------- */
    function decorate() {
        document.querySelectorAll('.sch-card:not([data-rem])').forEach(function (card) {
            card.setAttribute('data-rem', '1');
            if (card.classList.contains('done')) return;
            var round = card.getAttribute('data-round');
            if (!round) return;
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'rm-btn';
            b.textContent = '⏰ Ingatkan saya';
            b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); window.f1Remind(round); });
            card.appendChild(b);
        });
    }

    function init() {
        decorate();
        if (typeof MutationObserver !== 'undefined') {
            var obs = new MutationObserver(function () { decorate(); });
            var root = document.getElementById('main-wrapper') || document.body;
            obs.observe(root, { childList: true, subtree: true });
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
