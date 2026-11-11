/* =========================================================
   KLASEMEN PEMBALAP (update otomatis)
   Data: Jolpica F1 API (gratis, tanpa API key)
         https://api.jolpi.ca/ergast/f1/current/driverStandings.json

   Cara pasang: taruh file ini sefolder dengan index.html, lalu di
   index.html tambahkan di bawah <script src="balapan.js"></script>:
       <script src="klasemen.js"></script>
   Otomatis muncul menu "Klasemen" di navbar (setelah Sirkuit) dan
   halaman klasemennya. Tidak perlu edit HTML atau CSS lain.
   ========================================================= */
(function () {
    'use strict';

    const API = 'https://api.jolpi.ca/ergast/f1/current/driverStandings.json';
    const CACHE_KEY = 'klasemen-pembalap-v1';
    const REFRESH_MS = 5 * 60 * 1000;   // cek data baru tiap 5 menit selama halaman terbuka

    // kebangsaan (bahasa Inggris dari API) -> kode negara untuk bendera
    const FLAG = {
        Italian: 'it', British: 'gb', Monegasque: 'mc', Dutch: 'nl', Australian: 'au', French: 'fr',
        'New Zealander': 'nz', Argentine: 'ar', Argentinian: 'ar', Brazilian: 'br', German: 'de',
        Spanish: 'es', Thai: 'th', Japanese: 'jp', Canadian: 'ca', Finnish: 'fi', Mexican: 'mx',
        Chinese: 'cn', Danish: 'dk', American: 'us'
    };
    // kata kunci nama tim -> warna
    const TEAM_COLOR = [
        ['mercedes', '#27F4D2'], ['ferrari', '#E8002D'], ['mclaren', '#FF8000'], ['red bull', '#3671C6'],
        ['racing bulls', '#6692FF'], ['rb ', '#6692FF'], ['alpine', '#00A1E8'], ['haas', '#B6BABD'],
        ['audi', '#F50537'], ['sauber', '#F50537'], ['williams', '#1868DB'], ['aston', '#229971'],
        ['cadillac', '#AAAAAD']
    ];
    // Logo tim (link yang sama dengan yang dipakai di script.js)
    const TEAM_LOGO = {
        'mclaren': 'assets/images/pin/72644aef0c75a11905a848d485ba2fad.jpg',
        'haas': 'assets/images/pin/92fd431a41b0fadeee14fd11702680cb.jpg',
        'alpine': 'assets/images/pin/89652d94b80ad8d9bf6a59b2be5210d7.jpg',
        'ferrari': 'assets/images/pin/257ffe9204fa0004ff97fe9fdcb5c99b.jpg',
        'racing bulls': 'assets/images/pin/42ad594511fbde88971da4812f72e293.jpg',
        'red bull': 'assets/images/pin/28ee6c55b8e3d6414342daf10d97fe5a.jpg',
        'cadillac': 'assets/images/pin/923d581d5325793b207ccba147d50ed5.jpg',
        'mercedes': 'assets/images/pin/31fb0838a14408a5cd6fa946d277cbbb.jpg',
        'williams': 'assets/images/pin/ea35df160123cc7a1383d329e63c7ddb.jpg',
        'audi': 'assets/images/pin/b0f7eb6e9c6d5923a044bf4bfa9bcd68.jpg',
        'aston martin': 'assets/images/pin/b64a5745c7786e8b5c96df096eeebb69.jpg'
    };
    // nama lain yang mungkin dikirim API untuk tim yang sama
    const TEAM_ALIAS = [['rb f1', 'racing bulls'], ['visa cash', 'racing bulls'], ['sauber', 'audi']];
    function teamLogo(name) {
        let n = (name || '').toLowerCase();
        const a = TEAM_ALIAS.find(([k]) => n.includes(k));
        if (a) n = a[1];
        // "racing bulls" dicek lebih dulu supaya tidak tertukar dengan "red bull"
        const key = Object.keys(TEAM_LOGO).find(k => n.includes(k));
        return key ? TEAM_LOGO[key] : '';
    }
    const teamColor = n => { n = (n || '').toLowerCase() + ' '; const t = TEAM_COLOR.find(([k]) => n.includes(k)); return t ? t[1] : '#777'; };
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const teamLogoHtml = name => {
        const dot = `<i class="kl-dot" style="background:${teamColor(name)}"></i>`;
        const src = teamLogo(name);
        return src
            ? `<img class="kl-logo" src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=this.dataset.dot" data-dot="${esc(dot)}">`
            : dot;
    };

    // Tim pembalap diambil dari data situs sendiri (teams.js) supaya selalu sama dengan halaman Tim.
    // Kalau pembalap tidak ketemu di sana, baru pakai nama tim dari API.
    const norm = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    function siteTeam(given, family) {
        if (typeof teamsData === 'undefined' || !Array.isArray(teamsData)) return '';
        const full = norm(given + ' ' + family), last = norm(family), ini = norm(given).charAt(0);
        let hit = teamsData.find(t => (t.drivers || []).some(n => norm(n) === full));
        if (!hit) hit = teamsData.find(t => (t.drivers || []).some(n => {
            const w = norm(n).split(/\s+/);
            return w[w.length - 1] === last && w[0].charAt(0) === ini;
        }));
        return hit ? (hit.name || hit.short || hit.team || '') : '';
    }

    /* ---------- gaya ---------- */
    const css = document.createElement('style');
    css.textContent = `
        .kl-wrap { max-width: 1100px; margin: 28px auto 48px; padding: 0 18px; }
        .kl-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .kl-head h2 { margin: 0; font-size: clamp(1.4rem, 3vw, 2rem); }
        .kl-sub { font-size: .82rem; color: #a9a9b3; }
        .kl-card { background: rgba(14, 15, 20, .82); border: 1px solid rgba(255,255,255,.1); border-radius: 18px;
                   padding: 6px 18px 10px; overflow-x: auto; }
        .kl-table { width: 100%; border-collapse: collapse; min-width: 560px; }
        .kl-table th { text-align: left; font-size: .68rem; letter-spacing: .08em; text-transform: uppercase;
                       color: #8d8d98; font-weight: 600; padding: 14px 8px 10px; border-bottom: 1px solid rgba(255,255,255,.14); }
        .kl-table td { padding: 11px 8px; border-bottom: 1px solid rgba(255,255,255,.07); font-size: .9rem; color: #f2efea; }
        .kl-table tr:last-child td { border-bottom: 0; }
        .kl-table .kl-pos { width: 48px; color: #a9a9b3; }
        .kl-table .kl-pts { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
        .kl-table th.kl-pts { text-align: right; }
        .kl-table tbody tr:nth-child(-n+3) .kl-pos { color: #fff; font-weight: 700; }
        .kl-name b { font-weight: 600; }
        .kl-name small { color: #8d8d98; margin-left: 6px; }
        .kl-flag { height: 12px; width: auto; border-radius: 2px; margin-right: 8px; vertical-align: -1px; box-shadow: 0 0 0 1px rgba(255,255,255,.18); }
        .kl-logo { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 10px; vertical-align: middle;
                   background: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,.18); }
        .kl-team { white-space: nowrap; }
        .kl-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 9px; vertical-align: -1px; }
        .kl-msg { padding: 28px 8px; text-align: center; color: #a9a9b3; }
        @media (max-width: 640px) { .kl-hide-sm { display: none; } .kl-table { min-width: 0; } }`;
    document.head.appendChild(css);

    /* ---------- kerangka ---------- */
    const sec = document.createElement('section');
    sec.className = 'kl-wrap';
    sec.setAttribute('aria-label', 'Klasemen pembalap');
    sec.innerHTML = `
        <div class="kl-head"><h2 id="kl-title">Klasemen Pembalap</h2><span class="kl-sub" id="kl-sub"></span></div>
        <div class="kl-card"><div class="kl-msg" id="kl-body">Memuat klasemen…</div></div>`;

    function mount() {
        const wrapper = document.getElementById('main-wrapper') || document.body;
        const page = document.createElement('div');
        page.id = 'klasemen-page';
        page.className = 'page';
        page.appendChild(sec);
        const after = document.getElementById('circuits-page');
        if (after) after.after(page); else wrapper.appendChild(page);

        // menu "Klasemen" di navbar, setelah "Sirkuit"
        const menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-klasemen]')) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="#" data-klasemen onclick="showPage(\'klasemen-page\'); return false;">Klasemen</a>';
            const links = [...menu.querySelectorAll('li')];
            const sirkuit = links.find(l => /sirkuit/i.test(l.textContent));
            if (sirkuit) sirkuit.after(li); else menu.appendChild(li);
        }
        return true;
    }

    /* ---------- tampilkan data ---------- */
    function render(table) {
        const list = table.StandingsLists && table.StandingsLists[0];
        const rows = list ? list.DriverStandings : [];
        const body = document.getElementById('kl-body');
        if (!rows.length) { body.className = 'kl-msg'; body.textContent = 'Klasemen belum tersedia.'; return; }

        document.getElementById('kl-title').textContent = 'Klasemen Pembalap ' + (list.season || table.season || '');
        document.getElementById('kl-sub').textContent = 'Setelah ronde ' + (list.round || table.round || '?') + ' • diperbarui otomatis';

        const html = rows.map(r => {
            const d = r.Driver || {}, apiTeam = (r.Constructors && r.Constructors[r.Constructors.length - 1]) || {};
            const team = { name: siteTeam(d.givenName, d.familyName) || apiTeam.name };
            const code = FLAG[d.nationality];
            const flag = code ? `<img class="kl-flag" src="https://flagcdn.com/w40/${code}.png" alt="" loading="lazy" onerror="this.remove()">` : '';
            return `<tr>
                <td class="kl-pos">${esc(r.position || r.positionText)}</td>
                <td class="kl-name"><b>${esc(d.givenName)} ${esc(d.familyName)}</b></td>
                <td class="kl-hide-sm">${flag}${esc(d.nationality)}</td>
                <td class="kl-team">${teamLogoHtml(team.name)}${esc(team.name)}</td>
                <td class="kl-pts">${esc(r.points)}</td>
            </tr>`;
        }).join('');

        body.className = '';
        body.outerHTML = `<table class="kl-table" id="kl-body"><thead><tr>
            <th class="kl-pos">Pos</th><th>Pembalap</th><th class="kl-hide-sm">Negara</th><th>Tim</th><th class="kl-pts">Poin</th>
            </tr></thead><tbody>${html}</tbody></table>`;
    }

    /* ---------- ambil data (dengan cache supaya tetap tampil kalau API sibuk/offline) ---------- */
    function fromCache() {
        try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; }
    }
    async function load() {
        try {
            const res = await fetch(API, { cache: 'no-cache' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const json = await res.json();
            const table = json.MRData && json.MRData.StandingsTable;
            if (!table) throw new Error('format tidak dikenal');
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(table)); } catch (e) { /* abaikan */ }
            render(table);
        } catch (err) {
            const cached = fromCache();
            if (cached) render(cached);
            else {
                const body = document.getElementById('kl-body');
                if (body) { body.className = 'kl-msg'; body.textContent = 'Klasemen belum bisa dimuat. Coba muat ulang beberapa saat lagi.'; }
            }
        }
    }

    function init() {
        if (!mount()) return;
        const cached = fromCache();
        if (cached) render(cached);   // tampil cepat dulu, lalu diperbarui
        load();
        setInterval(() => { if (!document.hidden) load(); }, REFRESH_MS);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();