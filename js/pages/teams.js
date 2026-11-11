/* =====================================================================
   DATA TIM 2026
   ===================================================================== */
const teamsData = [
    { name: "Mercedes",     full: "Mercedes-AMG Petronas F1 Team", color: "#27f4d2", base: "Brackley, Inggris",     pu: "Mercedes",       car: "assets/images/cars/mercedes.jpg",     drivers: ["George Russell", "Andrea Kimi Antonelli"] },
    { name: "Ferrari",      full: "Scuderia Ferrari HP",           color: "#ff1f3d", base: "Maranello, Italia",     pu: "Ferrari",        car: "assets/images/cars/ferrari.jpg",      drivers: ["Charles Leclerc", "Lewis Hamilton"] },
    { name: "McLaren",      full: "McLaren Formula 1 Team",        color: "#ff8000", base: "Woking, Inggris",       pu: "Mercedes",       car: "assets/images/cars/mclaren.jpg",      drivers: ["Lando Norris", "Oscar Piastri"] },
    { name: "Red Bull",     full: "Oracle Red Bull Racing",        color: "#4a7bd6", base: "Milton Keynes, Inggris", pu: "Red Bull Ford", car: "assets/images/cars/red-bull.jpg",     drivers: ["Max Verstappen", "Isack Hadjar"] },
    { name: "Racing Bulls", full: "Visa Cash App Racing Bulls",    color: "#6c8cff", base: "Faenza, Italia",        pu: "Red Bull Ford",  car: "assets/images/cars/racing-bulls.jpg", drivers: ["Liam Lawson", "Arvid Lindblad"] },
    { name: "Alpine",       full: "BWT Alpine F1 Team",            color: "#2aa8e8", base: "Enstone, Inggris",      pu: "Mercedes",       car: "assets/images/cars/alpine.jpg",       drivers: ["Pierre Gasly", "Franco Colapinto"] },
    { name: "Aston Martin", full: "Aston Martin Aramco F1 Team",   color: "#1fa67a", base: "Silverstone, Inggris",  pu: "Honda",          car: "assets/images/cars/aston-martin.jpg", drivers: ["Fernando Alonso", "Lance Stroll"] },
    { name: "Williams",     full: "Atlassian Williams Racing",     color: "#5bb8ff", base: "Grove, Inggris",        pu: "Mercedes",       car: "assets/images/cars/williams.jpg",     drivers: ["Alex Albon", "Carlos Sainz"] },
    { name: "Haas",         full: "TGR Haas F1 Team",              color: "#d5d9e0", base: "Kannapolis, AS",        pu: "Ferrari",        car: "assets/images/cars/haas.jpg",         drivers: ["Esteban Ocon", "Oliver Bearman"] },
    { name: "Audi",         full: "Audi Revolut F1 Team",          color: "#a9b2c0", base: "Hinwil, Swiss",         pu: "Audi",           car: "assets/images/cars/audi.jpg",         drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"] },
    { name: "Cadillac",     full: "Cadillac Formula 1 Team",       color: "#d4ad4f", base: "Fishers, AS",           pu: "Ferrari",        car: "assets/images/cars/cadillac.jpg",     drivers: ["Sergio Pérez", "Valtteri Bottas"] }
];

/* =====================================================================
   TUMPUKAN KARTU TIM (port vanilla JS dari React Bits "Stack")
   ===================================================================== */
(function () {
    var cleanup = null;

    window.initTeamStack = function (options) {
        if (cleanup) { cleanup(); cleanup = null; }

        var opt = Object.assign({
            gridSelector: '#teams-grid',
            sensitivity: 200,
            randomRotation: false,
            sendToBackOnClick: false,
            autoplay: false,
            autoplayDelay: 3000,
            pauseOnHover: false,
            mobileClickOnly: false,   // true = di HP kartu tidak bisa digeser, hanya diketuk
            mobileBreakpoint: 768,
            maxVisible: 5
        }, options || {});

        var grid = document.querySelector(opt.gridSelector);
        if (!grid) return;
        var teamCards = Array.prototype.filter.call(grid.children, function (el) {
            return el.classList && el.classList.contains('team-card');
        });
        grid.classList.remove('is-stack');
        if (!teamCards.length) return;

        var container = document.createElement('div');
        container.className = 'stack-container';

        var items = teamCards.map(function (tc) {
            var wrap = document.createElement('div');
            wrap.className = 'card-rotate';
            var card = document.createElement('div');
            card.className = 'card';
            card.appendChild(tc);
            wrap.appendChild(card);
            container.appendChild(wrap);
            return { wrap: wrap, card: card, rand: opt.randomRotation ? Math.random() * 10 - 5 : 0 };
        });
        items.reverse(); // elemen terakhir = kartu paling atas (tim No. 01)

        grid.classList.add('is-stack');
        grid.appendChild(container);
        var hint = document.createElement('p');
        hint.className = 'tm-stack-hint';
        hint.textContent = 'Geser atau klik kartu untuk melihat tim berikutnya';
        grid.appendChild(hint);

        function isMobile() { return window.innerWidth < opt.mobileBreakpoint; }
        function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
        function topItem() { return items[items.length - 1]; }

        function render() {
            var n = items.length;
            items.forEach(function (it, i) {
                var d = n - 1 - i;
                var dv = Math.min(d, opt.maxVisible - 1);
                it.card.style.transform = 'rotateZ(' + (dv * 4 + it.rand) + 'deg) scale(' + (0.94 - dv * 0.06) + ')';
                it.card.style.opacity = d >= opt.maxVisible ? '0' : '1';
                it.wrap.style.zIndex = i;
                it.wrap.style.pointerEvents = d === 0 ? 'auto' : 'none';
            });
        }
        function sendToBack(it) {
            var idx = items.indexOf(it);
            if (idx < 0) return;
            items.splice(idx, 1);
            items.unshift(it);
            it.wrap.style.transform = '';
            render();
            remember();
        }
        function nameOf(it) {
            var el = it.card.querySelector('.tc-name');
            return el ? el.textContent : '';
        }
        function remember() { window.__teamStackTop = nameOf(topItem()); }

        var drag = null, suppressClick = false, lastPointerType = 'mouse';

        function onDown(e) {
            lastPointerType = e.pointerType || 'mouse';
            if (e.button !== undefined && e.button !== 0) return;
            if (isMobile() && opt.mobileClickOnly) return;
            var it = topItem();
            if (!it || !it.wrap.contains(e.target)) return;
            drag = { it: it, id: e.pointerId, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0, moved: false };
        }
        function onMove(e) {
            if (!drag || e.pointerId !== drag.id) return;
            var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
            if (!drag.moved) {
                if (Math.hypot(dx, dy) < 5) return;
                drag.moved = true;
                drag.it.wrap.classList.add('dragging');
                try { drag.it.wrap.setPointerCapture(e.pointerId); } catch (err) {}
            }
            drag.dx = dx; drag.dy = dy;
            drag.it.wrap.style.transform = 'translate(' + dx * 0.6 + 'px,' + dy * 0.6 + 'px) rotateX(' +
                clamp(dy / 100 * -60, -60, 60) + 'deg) rotateY(' + clamp(dx / 100 * 60, -60, 60) + 'deg)';
        }
        function onUp(e) {
            if (!drag || e.pointerId !== drag.id) return;
            var d = drag; drag = null;
            if (!d.moved) return;
            suppressClick = true;
            setTimeout(function () { suppressClick = false; }, 60);
            d.it.wrap.classList.remove('dragging');
            var need = (isMobile() || lastPointerType === 'touch') ? Math.min(opt.sensitivity, 80) : opt.sensitivity;
            if (Math.abs(d.dx) > need || Math.abs(d.dy) > need) sendToBack(d.it);
            else d.it.wrap.style.transform = '';
        }
        function onClick(e) {
            if (suppressClick) { e.stopPropagation(); e.preventDefault(); return; }
            var it = topItem();
            if (!it || !it.wrap.contains(e.target)) return;
            // layar sentuh: ketuk kartu = kirim ke belakang (tombol pembalap tetap normal)
            if (!(opt.sendToBackOnClick || isMobile() || lastPointerType === 'touch')) return;
            if (e.target.closest('.tc-driver')) return;
            sendToBack(it);
        }

        container.addEventListener('pointerdown', onDown);
        container.addEventListener('click', onClick, true);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);

        var paused = false, timer = null;
        if (opt.pauseOnHover) {
            container.addEventListener('mouseenter', function () { paused = true; });
            container.addEventListener('mouseleave', function () { paused = false; });
        }
        if (opt.autoplay) {
            timer = setInterval(function () {
                if (!paused && !drag && items.length > 1) sendToBack(topItem());
            }, opt.autoplayDelay);
        }

        cleanup = function () {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            if (timer) clearInterval(timer);
        };

        // pulihkan tim yang tadi di atas (mis. setelah kembali dari profil pembalap)
        if (window.__teamStackTop) {
            for (var k = 0; k < items.length && nameOf(topItem()) !== window.__teamStackTop; k++) {
                var t = items.pop();
                items.unshift(t);
            }
        }
        render();
    };
})();

(function () {
    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let fromTeams = false; // true bila profil pembalap dibuka dari halaman Tim

    /* ---------------- HALAMAN TIM ---------------- */
    function driverId(name) {
        return Object.keys(driversData).find(k => driversData[k].name === name);
    }

    function renderTeams(filter = "") {
        const box = document.getElementById('teams-grid');
        if (!box) return;
        const q = filter.trim().toLowerCase();

        const html = teamsData
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => [t.name, t.full, t.base, t.pu, ...t.drivers].join(' ').toLowerCase().includes(q))
            .map(({ t, i }) => `
                <article class="team-card" style="--tc:${t.color}">
                    <span class="tc-index">${String(i + 1).padStart(2, '0')}</span>
                    <h3 class="tc-name">${t.name}</h3>
                    <p class="tc-full">${t.full}</p>
                    <div class="tc-drivers">
                        ${t.drivers.map(n => {
                            const id = driverId(n);
                            const photo = id ? driversData[id].photo : "";
                            return `<button class="tc-driver" ${id ? `onclick="openDetail(${id})"` : ''}><i class="tc-face">${photo ? `<img src="${photo}" alt="${n}" loading="lazy" draggable="false" onerror="this.hidden=true">` : ''}</i><span>${n}</span></button>`;
                        }).join('')}
                    </div>
                    <div class="tc-meta">
                        <div><span>Markas</span><b>${t.base}</b></div>
                        <div><span>Power unit</span><b>${t.pu}</b></div>
                    </div>
                    <div class="tc-car"><img src="${t.car}" alt="Mobil ${t.name} 2026" loading="lazy"></div>
                </article>
            `).join('');

        box.classList.remove('is-stack');
        box.innerHTML = html || '<p class="cc-empty">Tim tidak ditemukan. Coba kata kunci lain.</p>';
        if (window.initTeamStack) window.initTeamStack();
        const cnt = document.getElementById('tm-count');
        if (cnt) cnt.textContent = `${teamsData.length} tim · ${Object.keys(driversData).length} pembalap`;
    }

    /* ---------------- TEMA + NAVBAR AKTIF ---------------- */
    PAGE_THEMES['teams-page'] = 'theme-teams';

    const SECTION = {
        'home-page': 0, 'drivers-page': 1, 'detail-page': 1,
        'teams-page': 2, 'circuits-page': 3, 'circuit-detail-page': 3,
        'history-page': 4, 'reflek-page': 5, 'profile-page': -1, 'part-detail-page': -1
    };
    const navLinks = document.querySelector('.nav-links');
    const navGlow = document.createElement('span');
    navGlow.className = 'nav-glow';
    navGlow.setAttribute('aria-hidden', 'true');
    if (navLinks) navLinks.appendChild(navGlow);
    let hoveredNavLink = null;

    function moveNavGlow(link) {
        if (!navLinks || !navGlow || navLinks.getClientRects().length === 0) return;
        hoveredNavLink = link;
        const parentRect = navLinks.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        navGlow.style.width = `${linkRect.width}px`;
        navGlow.style.transform = `translateX(${linkRect.left - parentRect.left + navLinks.scrollLeft}px)`;
        navGlow.style.opacity = '1';
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => moveNavGlow(link));
        });
        navLinks.addEventListener('mouseleave', () => {
            hoveredNavLink = null;
            navGlow.style.opacity = '0';
        });
    }

    function afterShow(id) {
        document.querySelectorAll('.nav-links a').forEach((a, i) => a.classList.toggle('active', i === SECTION[id]));
        const si = document.getElementById('search-input');
        if (id === 'teams-page') {
            if (si) si.placeholder = 'Cari Tim';
            renderTeams(si ? si.value : '');
        }
        document.querySelectorAll('.page.active .team-card, .page.active .driver-card, .page.active .circuit-card, .page.active .stat-card')
            .forEach((el, i) => el.style.setProperty('--i', Math.min(i, 12)));
    }

    /* ---------------- TRANSISI ---------------- */
    const KIND = {
        'home-page': 'warp', 'drivers-page': 'grid', 'detail-page': 'spot',
        'teams-page': 'fly', 'circuits-page': 'road', 'circuit-detail-page': 'road',
        'history-page': 'warp', 'reflek-page': 'warp', 'profile-page': 'warp', 'part-detail-page': 'fly'
    };
    const TBASE = { warp: 380, grid: 260, spot: 250, fly: 420, road: 330 };

    const overlay = document.createElement('div');
    overlay.id = 'f1-tr';
    document.body.appendChild(overlay);

    const live = [];
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const A = (el, kf, o) => {
        const an = el.animate(kf, Object.assign({ fill: 'both' }, o));
        live.push(an);
        return an.finished.catch(() => {});
    };
    const EASE = 'cubic-bezier(.7,0,.3,1)';
    const OUT = 'cubic-bezier(.2,.8,.2,1)';
    const baseShow = window.showPage;
    let busy = false, pending = null;

    const curPage = () => document.querySelector('.page.active');
    const T = {};

    // BERANDA
    T.warp = async (id, go) => {
        overlay.innerHTML = `<div class="tw-lines"></div><div class="tw-glow"></div>`;
        const lines = overlay.querySelector('.tw-lines'), glow = overlay.querySelector('.tw-glow');
        A(lines, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.1)' }], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)' });
        A(glow, [{ opacity: 0 }, { opacity: 1 }], { duration: 380 });
        await A(curPage(), [{ transform: 'none', filter: 'blur(0)', opacity: 1 }, { transform: 'translateZ(520px) scale(1.15)', filter: 'blur(10px)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.55,0,1,.7)' });
        go();
        A(lines, [{ opacity: 1, transform: 'scale(1.1)' }, { opacity: 0, transform: 'scale(2.4)' }], { duration: 520, easing: 'ease-out' });
        A(glow, [{ opacity: 1 }, { opacity: 0 }], { duration: 520 });
        await A(curPage(), [{ transform: 'translateZ(-420px) scale(.88)', filter: 'blur(10px)', opacity: 0 }, { transform: 'none', filter: 'blur(0)', opacity: 1 }], { duration: 540, easing: OUT });
    };

    // PEMBALAP
    T.grid = async (id, go) => {
        const C = 6, R = 4, list = Object.values(driversData);
        let tiles = '';
        for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            const d = list[r * C + c];
            if (!d) { tiles += `<i class="blank" style="--c:${teamsData[(r + c) % teamsData.length].color}"><b>F1</b></i>`; continue; }
            const tm = teamsData.find(t => t.drivers.includes(d.name));
            tiles += `<i style="--c:${tm ? tm.color : '#fff'}"><img src="${d.photo}" alt=""><b>${d.stats["Nomor"]}</b></i>`;
        }
        overlay.innerHTML = `<div class="pw">${tiles}</div>`;
        const pw = overlay.querySelector('.pw'), els = [...overlay.querySelectorAll('.pw i')];
        const dist = i => Math.hypot((i % C) - (C - 1) / 2, (Math.floor(i / C) - (R - 1) / 2) * 1.5);
        A(pw, [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }], { duration: 1150, easing: 'linear' });
        await Promise.all(els.map((t, i) => A(t, [{ transform: 'rotateY(90deg) scale(.9)' }, { transform: 'none' }], { duration: 240, delay: dist(i) * 55, easing: EASE })));
        go();
        A(curPage(), [{ transform: 'translateZ(-240px) scale(.94)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 620, easing: OUT });
        await sleep(300);
        await Promise.all(els.map((t, i) => A(t, [{ transform: 'none' }, { transform: 'rotateX(-90deg) scale(.9)' }], { duration: 240, delay: dist(i) * 45, easing: EASE })));
    };

    // PROFIL
    const poly = (y, x) => `polygon(${y}% 0, ${x}% 0, ${x - 30}% 100%, ${y - 30}% 100%)`;
    T.spot = async (id, go) => {
        overlay.innerHTML = `<div class="sp-a"></div><div class="sp-b"><div class="sp-no"></div>
            <div class="sp-photo"><img alt=""></div><div class="sp-name"><small></small><strong></strong></div></div>`;
        const pa = overlay.querySelector('.sp-a'), pb = overlay.querySelector('.sp-b');
        const no = overlay.querySelector('.sp-no'), ph = overlay.querySelector('.sp-photo'), nm = overlay.querySelector('.sp-name');
        const cover = [{ clipPath: poly(-70, -10) }, { clipPath: poly(-40, 140) }];
        A(pa, cover, { duration: 340, easing: EASE });
        const coverB = A(pb, cover, { duration: 340, delay: 80, easing: EASE });
        A(curPage(), [{ transform: 'none', opacity: 1 }, { transform: 'translateZ(-300px) scale(.9)', opacity: 0 }], { duration: 340, easing: 'ease-in' });

        await sleep(0);
        const name = (document.getElementById('photo-caption').textContent || '').trim();
        const dEntry = Object.values(driversData).find(d => d.name === name);
        const tm = teamsData.find(t => t.drivers.includes(name));
        const color = tm ? tm.color : '#e10600';
        const parts = name.split(' ');
        pa.style.setProperty('--c', color); pb.style.setProperty('--c', color);
        no.textContent = dEntry ? dEntry.stats["Nomor"] : '';
        ph.querySelector('img').src = document.getElementById('main-photo').src;
        nm.querySelector('small').textContent = parts[0] || '';
        nm.querySelector('strong').textContent = parts.slice(1).join(' ');

        await coverB;
        go();
        A(no, [{ opacity: 0, transform: 'translateY(-50%) translateX(12vw)' }, { opacity: .9, transform: 'translateY(-50%)' }], { duration: 480, easing: OUT });
        A(ph, [{ opacity: 0, transform: 'translateY(60px) rotateY(-18deg)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: OUT });
        A(nm, [{ opacity: 0, transform: 'translateX(-40px) skewX(-8deg)' }, { opacity: 1, transform: 'skewX(-8deg)' }], { duration: 480, delay: 120, easing: OUT });
        await sleep(620);
        const out = [{ clipPath: poly(-40, 140) }, { clipPath: poly(140, 140) }];
        A(curPage(), [{ transform: 'translateZ(-300px) scale(.92)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 560, delay: 100, easing: OUT });
        A(pa, out, { duration: 380, delay: 90, easing: EASE });
        await A(pb, out, { duration: 380, easing: EASE });
        await sleep(90);
    };

    // =====================================================================
    // TIM: satu logo F1 masuk dan keluar dalam ruang 3D sederhana.
    // =====================================================================
    T.fly = async (id, go) => {
        const ENTRY_MS = 420, HOLD_MS = 330, EXIT_MS = 200;
        overlay.innerHTML = `
            <div class="tm-logo-stage"><img class="tm-logo" src="assets/images/logo-f1.png" alt="F1"></div>
        `;
        const logo = overlay.querySelector('.tm-logo');

        await A(logo, [
            { transform: 'translateZ(-600px) rotateY(-90deg) scale(.6)', opacity: 0 },
            { transform: 'translateZ(0) rotateY(0deg) scale(1)', opacity: 1 }
        ], { duration: ENTRY_MS, easing: OUT });
        await sleep(HOLD_MS);
        go();
        await A(logo, [
            { transform: 'translateZ(0) rotateY(0deg) scale(1)', opacity: 1 },
            { transform: 'translateZ(520px) rotateY(90deg) scale(1.2)', opacity: 0 }
        ], { duration: EXIT_MS, easing: EASE });
    };

    // SIRKUIT (TIDAK DIUBAH)
    const TRACK = 'M140 330 C100 300 110 230 170 215 L330 190 C370 183 385 150 360 120 C340 92 380 70 430 80 L600 110 C660 120 690 170 650 210 C620 240 560 230 540 260 C520 295 570 330 620 335 C690 342 720 390 670 425 C620 455 520 440 450 420 L260 380 C200 372 160 362 140 330 Z';
    T.road = async (id, go) => {
        overlay.innerHTML = `<div class="tk-bg"></div>
            <div class="tk-stage"><svg class="tk-svg" viewBox="0 0 800 500" aria-hidden="true">
                <g class="tk-base">
                    <path class="tk-k1" d="${TRACK}"/><path class="tk-k2" d="${TRACK}"/>
                    <path class="tk-asphalt" d="${TRACK}"/><path class="tk-mid" d="${TRACK}"/>
                </g>
                <path class="tk-prog" d="${TRACK}"/>
                <g class="tk-car"><circle class="tk-halo" r="22"/><circle class="tk-core" r="6"/></g>
            </svg></div>`;
        const bg = overlay.querySelector('.tk-bg'), stage = overlay.querySelector('.tk-stage'), svg = overlay.querySelector('.tk-svg');
        const base = overlay.querySelector('.tk-base'), prog = overlay.querySelector('.tk-prog'), car = overlay.querySelector('.tk-car');

        const len = prog.getTotalLength();
        prog.style.strokeDasharray = len;
        const pts = [];
        for (let k = 0; k <= 70; k++) { const p = prog.getPointAtLength(len * k / 70); pts.push({ transform: `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)` }); }
        car.style.opacity = 0;

        A(bg, [{ opacity: 0 }, { opacity: 1 }], { duration: 280 });
        A(base, [{ opacity: 0 }, { opacity: .5 }], { duration: 420, delay: 80 });
        await A(curPage(), [{ transform: 'none', opacity: 1 }, { transform: 'translateZ(-260px) translateY(30px) scale(.92)', opacity: 0 }], { duration: 300, easing: 'ease-in' });

        const LAP = 1050, LE = 'cubic-bezier(.45,.05,.35,1)';
        A(prog, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: LAP, easing: LE });
        A(car, pts, { duration: LAP, easing: LE });
        A(car, [{ opacity: 0 }, { opacity: 1 }], { duration: 120, composite: 'replace' });
        A(svg, [{ transform: 'rotateX(76deg) rotateZ(-22deg) scale(.88)' }, { transform: 'rotateX(58deg) rotateZ(-6deg) scale(1.04)' }], { duration: LAP + 200, easing: 'cubic-bezier(.3,.1,.3,1)' });
        await sleep(520);
        go();
        await sleep(LAP - 520 + 60);

        A(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: 520, delay: 80 });
        A(curPage(), [{ transform: 'translateZ(-240px) translateY(-24px) scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 620, delay: 120, easing: OUT });
        await A(stage, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(3.6)', opacity: 0 }], { duration: 600, easing: EASE });
    };

    function swap(id) {
        baseShow(id);
        window.scrollTo(0, 0);
        afterShow(id);
    }

    async function play() {
        const kind = KIND[pending] || 'warp';
        let shown;
        const go = () => {
            document.body.style.setProperty('--tbase', TBASE[kind] + 'ms');
            shown = pending;
            swap(shown);
        };
        document.documentElement.classList.add('tr-run');
        overlay.classList.add('on');
        try { await T[kind](pending, go); } catch (e) { console.warn(e); }
        if (shown === undefined) { shown = pending; swap(shown); }

        live.splice(0).forEach(an => an.cancel());
        overlay.innerHTML = '';
        overlay.classList.remove('on');
        document.documentElement.classList.remove('tr-run');
        document.body.style.setProperty('--tbase', '0ms');
        busy = false;
        if (pending !== shown) swap(pending);
    }

    window.showPage = function (id) {
        if (id !== 'profile-page' && id !== 'detail-page') fromTeams = false;
        const cur = document.querySelector('.page.active');
        if (busy) { pending = id; return; }
        if (REDUCE || !cur || cur.id === id) { swap(id); return; }
        pending = id;
        busy = true;
        play();
    };

    /* ---------------- BACKGROUND 3D HALAMAN PROFIL ---------------- */
    const dt = document.createElement('div');
    dt.id = 'dt-bg';
    dt.innerHTML = `<div class="dt-scene">
        <div class="dt-bar b1"></div><div class="dt-bar b2"></div><div class="dt-bar b3"></div>
        <div class="dt-floor"><div class="dt-grid"></div></div>
        <div class="dt-no"></div></div>`;
    document.body.prepend(dt);
    const dtNo = dt.querySelector('.dt-no');
    const dtScene = dt.querySelector('.dt-scene');

    function setDetailBg(id) {
        const d = driversData[id];
        if (!d) return;
        const tm = teamsData.find(t => t.drivers.includes(d.name));
        dt.style.setProperty('--c', tm ? tm.color : '#e10600');
        dtNo.textContent = d.stats["Nomor"];
        dt.classList.remove('go'); void dt.offsetWidth; dt.classList.add('go');
    }
    const baseOpen = window.openDetail;
    window.openDetail = function (id) { baseOpen(id); setDetailBg(id); };

    // Klik pembalap dari halaman Tim -> tombol Back di profil kembali ke halaman Tim
    // (listener ini berdiri sendiri, jadi tetap jalan walau profil.js menimpa openDetail)
    document.addEventListener('click', e => {
        // 1) tandai: profil dibuka dari kartu tim
        if (e.target.closest('.tc-driver')) { fromTeams = true; return; }

        // 2) tombol Back di halaman profil / detail pembalap
        if (!fromTeams) return;
        const btn = e.target.closest('a, button');
        if (!btn || !btn.closest('#profile-page, #detail-page')) return;
        const isBack = /back/i.test(btn.className) || /^\s*(back|kembali)\s*$/i.test(btn.textContent);
        if (!isBack) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        fromTeams = false;
        window.showPage('teams-page');
    }, true);

    if (window.matchMedia('(hover: hover)').matches && !REDUCE) {
        let px = 0, py = 0, raf = 0;
        document.addEventListener('mousemove', e => {
            if (!document.body.classList.contains('theme-detail')) return;
            px = (e.clientX / innerWidth - 0.5) * 2;
            py = (e.clientY / innerHeight - 0.5) * 2;
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                dtScene.style.transform = `translate3d(${(px * -14).toFixed(1)}px, ${(py * -8).toFixed(1)}px, 0)`;
            });
        }, { passive: true });
    }

    /* ---------------- INIT ---------------- */
    const si = document.getElementById('search-input');
    if (si) si.addEventListener('input', e => {
        if (document.getElementById('teams-page').classList.contains('active')) renderTeams(e.target.value);
    });

    document.addEventListener('DOMContentLoaded', () => {
        renderTeams();
        afterShow('home-page');
    });
    window.addEventListener('resize', () => {
        if (hoveredNavLink) moveNavGlow(hoveredNavLink);
    }, { passive: true });
})();