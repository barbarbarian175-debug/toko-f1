/* =========================================================
   PREDIKSI — tebak pemenang balapan berikutnya
   - Balapan berikutnya dari jadwal Jolpica (gratis, tanpa key).
   - Satu tebakan per ronde, tersimpan di localStorage 'f1_pred'.
   - Setelah balapan selesai, hasil dicek otomatis dari API:
     juara tepat = 10 poin, podium = 5 poin. Total skor dan
     riwayat tersimpan di 'f1_pred_hist'.
   ========================================================= */
(function () {
    'use strict';

    var JOLPICA = 'https://api.jolpi.ca/ergast/f1/';
    var YEAR = new Date().getFullYear();
    var PRED_KEY = 'f1_pred';
    var HIST_KEY = 'f1_pred_hist';
    var SCHED_KEY = 'f1_pred_sched';
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

    var css = document.createElement('style');
    css.textContent = `
        .pr-wrap { max-width: 1060px; margin: 0 auto; padding: 8px 16px 60px; color: #fff; text-align: left; }
        .pr-wrap h2 { font-family: var(--f-head, 'Barlow Condensed', sans-serif); font-size: clamp(2rem, 6vw, 3rem); margin: 10px 0 4px; text-transform: uppercase; }
        .pr-wrap .pr-sub { color: #a9a9b3; margin: 0 0 20px; }
        .pr-score { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background: #e10600; color: #fff; font-weight: 800; margin-bottom: 18px; }
        .pr-race { border: 1px solid rgba(255,255,255,.14); border-radius: 18px; background: #17181d; padding: 18px 20px; margin-bottom: 20px; }
        .pr-race .pr-round { font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #a9a9b3; }
        .pr-race h3 { margin: 6px 0 4px; font-size: 1.5rem; }
        .pr-race .pr-when { color: #d7d7de; }
        .pr-race .pr-pick { margin-top: 12px; padding: 10px 14px; border-radius: 12px; background: rgba(225,6,0,.14); border: 1px solid rgba(225,6,0,.4); }
        .pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin: 14px 0; }
        .pr-chip { border: 1.5px solid rgba(255,255,255,.16); border-radius: 14px; overflow: hidden; background: #17181d; color: #fff; cursor: pointer; padding: 0; text-align: left; }
        .pr-chip img { display: block; width: 100%; height: 110px; object-fit: cover; object-position: center top; background: #222; }
        .pr-chip .pr-nm { padding: 8px 10px 2px; font-weight: 700; font-size: .88rem; }
        .pr-chip .pr-tm { padding: 0 10px 10px; color: #a9a9b3; font-size: .75rem; }
        .pr-chip.sel { border-color: #e10600; box-shadow: 0 0 0 2px rgba(225,6,0,.45); }
        .pr-save { padding: 13px 26px; border-radius: 999px; border: 0; background: #e10600; color: #fff; font: 700 1rem var(--f-body, 'Inter', sans-serif); cursor: pointer; }
        .pr-save:disabled { opacity: .45; cursor: default; }
        .pr-hist { margin-top: 28px; }
        .pr-hist h3 { margin: 0 0 10px; font-size: 1.05rem; letter-spacing: .06em; text-transform: uppercase; color: #d7d7de; }
        .pr-row { display: flex; justify-content: space-between; gap: 10px; padding: 12px 4px; border-top: 1px solid rgba(255,255,255,.1); font-size: .92rem; }
        .pr-row .pr-pts { font-weight: 800; white-space: nowrap; }
        .pr-row .pr-pts.good { color: #4ed17a; }
        .pr-row .pr-pts.zero { color: #a9a9b3; }
        .pr-msg { padding: 22px; text-align: center; color: #a9a9b3; border: 1px dashed rgba(255,255,255,.25); border-radius: 14px; }
        @media (max-width: 640px) { .pr-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } .pr-chip img { height: 84px; } }`;
    document.head.appendChild(css);

    function loadPred() { try { return JSON.parse(localStorage.getItem(PRED_KEY) || 'null'); } catch (e) { return null; } }
    function savePred(p) { try { localStorage.setItem(PRED_KEY, JSON.stringify(p)); } catch (e) {} }
    function loadHist() { try { var h = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); return Array.isArray(h) ? h : []; } catch (e) { return []; } }
    function saveHist(h) { try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch (e) {} }

    function drivers() {
        if (typeof driversData === 'undefined') return [];
        return Object.keys(driversData).map(function (id) {
            var d = driversData[id];
            return { id: id, name: d.name, team: d.team, photo: d.photo || '' };
        }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    function raceStart(r) {
        var t = r.time || '12:00:00Z';
        return new Date(r.date + 'T' + t);
    }
    function fmtDate(d) {
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
            ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    var nextRace = null, selectedId = null;
    var raceEl = null, gridEl = null, saveBtn = null, histEl = null, scoreEl = null, msgEl = null;

    function totalScore() {
        return loadHist().reduce(function (a, h) { return a + (Number(h.points) || 0); }, 0);
    }
    function renderScore() { scoreEl.textContent = 'Skormu: ' + totalScore() + ' poin'; }

    function renderHist() {
        var h = loadHist().slice().reverse();
        if (!h.length) { histEl.innerHTML = '<div class="pr-msg">Belum ada riwayat tebakan.</div>'; return; }
        histEl.innerHTML = h.map(function (x) {
            var good = (Number(x.points) || 0) > 0;
            return '<div class="pr-row"><span>Ronde ' + esc(x.round) + ' • ' + esc(x.raceName) + '<br><span style="color:#a9a9b3">Tebakanmu: ' + esc(x.driver) + ' • Juara: ' + esc(x.winner || '—') + '</span></span>' +
                '<span class="pr-pts ' + (good ? 'good' : 'zero') + '">+' + (Number(x.points) || 0) + '</span></div>';
        }).join('');
    }

    function renderRace(schedOk) {
        if (!nextRace) {
            if (schedOk === false) {
                raceEl.innerHTML = '<div class="pr-msg">Jadwal balapan belum bisa dimuat (periksa koneksi internet), lalu buka lagi halaman ini.</div>';
            } else {
                raceEl.innerHTML = '<div class="pr-msg">Musim ' + YEAR + ' sudah selesai. Terima kasih sudah ikut menebak!</div>';
            }
            gridEl.innerHTML = '';
            saveBtn.disabled = true;
            return;
        }
        var cur = loadPred();
        var mine = (cur && String(cur.round) === String(nextRace.round)) ? cur : null;
        raceEl.innerHTML = '<div class="pr-round">Ronde ' + esc(nextRace.round) + ' • ' + esc(nextRace.Circuit.Location.country || '') + '</div>' +
            '<h3>' + esc(nextRace.raceName) + '</h3>' +
            '<div class="pr-when">' + esc(nextRace.Circuit.circuitName || '') + ' • ' + fmtDate(raceStart(nextRace)) + '</div>' +
            (mine ? '<div class="pr-pick">Prediksimu: <b>' + esc(mine.driverName) + '</b> — kamu bisa mengubahnya sampai balapan dimulai.</div>' : '');
        gridEl.innerHTML = '';
        drivers().forEach(function (d) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'pr-chip' + ((mine && String(mine.driverId) === String(d.id)) || String(selectedId) === String(d.id) ? ' sel' : '');
            chip.innerHTML = (d.photo ? '<img src="' + esc(d.photo) + '" alt="' + esc(d.name) + '" loading="lazy" onerror="this.remove()">' : '') +
                '<div class="pr-nm">' + esc(d.name) + '</div><div class="pr-tm">' + esc(d.team) + '</div>';
            chip.addEventListener('click', function () {
                selectedId = d.id;
                gridEl.querySelectorAll('.pr-chip').forEach(function (c) { c.classList.remove('sel'); });
                chip.classList.add('sel');
                saveBtn.disabled = false;
            });
            gridEl.appendChild(chip);
        });
        if (mine) selectedId = mine.driverId;
        saveBtn.disabled = !selectedId;
    }

    function saveCurrent() {
        if (!nextRace || !selectedId) return;
        var d = drivers().find(function (x) { return String(x.id) === String(selectedId); });
        if (!d) return;
        savePred({ round: String(nextRace.round), raceName: nextRace.raceName, driverId: String(d.id), driverName: d.name, created: Date.now() });
        renderRace();
        renderScore();
    }

    /* Nilai tebakan yang sudah lewat balapannya. */
    function settle() {
        var cur = loadPred();
        if (!cur) return;
        fetch(JOLPICA + YEAR + '/' + cur.round + '/results.json')
            .then(function (r) { return r.json(); })
            .then(function (j) {
                var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                if (!races.length || !(races[0].Results || []).length) return;
                var res = races[0].Results;
                var winner = res[0] && res[0].Driver ? (res[0].Driver.givenName + ' ' + res[0].Driver.familyName) : '';
                var podium = res.slice(0, 3).map(function (x) { return x.Driver.givenName + ' ' + x.Driver.familyName; });
                var norm = function (v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
                var pts = norm(cur.driverName) === norm(winner) ? 10 : (podium.some(function (n) { return norm(n) === norm(cur.driverName); }) ? 5 : 0);
                var h = loadHist();
                h.push({ round: cur.round, raceName: cur.raceName, driver: cur.driverName, winner: winner, points: pts, at: Date.now() });
                saveHist(h);
                try { localStorage.removeItem(PRED_KEY); } catch (e) {}
                renderHist(); renderScore(); renderRace();
            })
            .catch(function () {});
    }

    function loadSchedule(cb) {
        var cached = null;
        try { var c = JSON.parse(localStorage.getItem(SCHED_KEY) || 'null'); if (c && Date.now() - c.ts < 3600e3) cached = c.data; } catch (e) {}
        if (cached) { cb(cached, true); return; }
        fetch(JOLPICA + 'current.json')
            .then(function (r) { return r.json(); })
            .then(function (j) {
                var races = (j.MRData && j.MRData.RaceTable && j.MRData.RaceTable.Races) || [];
                try { localStorage.setItem(SCHED_KEY, JSON.stringify({ ts: Date.now(), data: races })); } catch (e) {}
                cb(races, true);
            })
            .catch(function () { cb([], false); });
    }

    function mount() {
        var wrapper = document.getElementById('main-wrapper') || document.body;
        var page = document.createElement('div');
        page.id = 'prediksi-page';
        page.className = 'page';
        page.innerHTML = '<div class="pr-wrap"><h2>Tebak Pemenang</h2>' +
            '<p class="pr-sub">Pilih jagoanmu sebelum balapan dimulai. Juara tepat +10 poin, podium +5 poin.</p>' +
            '<div class="pr-score" id="pr-score">Skormu: 0 poin</div>' +
            '<div class="pr-race" id="pr-race"><div class="pr-msg">Memuat jadwal balapan…</div></div>' +
            '<div class="pr-grid" id="pr-grid"></div>' +
            '<button type="button" class="pr-save" id="pr-save" disabled>Simpan prediksiku</button>' +
            '<div class="pr-hist"><h3>Riwayat tebakan</h3><div id="pr-hist"></div></div></div>';
        var after = document.getElementById('banding-page');
        if (after) after.after(page); else wrapper.appendChild(page);
        raceEl = page.querySelector('#pr-race');
        gridEl = page.querySelector('#pr-grid');
        saveBtn = page.querySelector('#pr-save');
        histEl = page.querySelector('#pr-hist');
        scoreEl = page.querySelector('#pr-score');
        saveBtn.addEventListener('click', saveCurrent);
        var menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-prediksi]')) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#" data-prediksi onclick="showPage(\'prediksi-page\'); return false;">Prediksi</a>';
            var links = Array.prototype.slice.call(menu.querySelectorAll('li'));
            var bd = links.find(function (l) { return /bandingkan/i.test(l.textContent); });
            if (bd) bd.after(li); else menu.appendChild(li);
        }
        renderHist(); renderScore();
        loadSchedule(function (races, ok) {
            var now = Date.now();
            nextRace = null;
            races.forEach(function (r) {
                if (!nextRace && raceStart(r).getTime() > now) nextRace = r;
            });
            if (!nextRace && races.length) {
                var last = races[races.length - 1];
                if (raceStart(last).getTime() <= now) nextRace = null;
            }
            renderRace(ok);
            settle();
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
