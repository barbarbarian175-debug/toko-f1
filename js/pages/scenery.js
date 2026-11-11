/* =====================================================================
   BACKGROUND BERANDA: scenery bergerak mengikuti scroll
   Progress scroll 0 -> 1 = siang -> senja -> malam.
   Tanpa library (tidak butuh GSAP). Hanya jalan saat di halaman Beranda.
   ===================================================================== */
(function () {
    const bg = document.getElementById('home-bg');
    const svg = document.getElementById('sc-svg');
    if (!bg || !svg) return;

    const $ = id => document.getElementById(id);
    const sun = $('sc-sun'), stars = $('sc-stars'), clouds = $('sc-clouds'), birds = $('sc-birds');
    const m1 = $('sc-m1'), m2 = $('sc-m2'), m3 = $('sc-m3'), trees = $('sc-trees');
    const tl = $('sc-tl'), tr = $('sc-tr');
    const cloudEls = [...document.querySelectorAll('.sc-cloud')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- bintang ---------- */
    const NS = 'http://www.w3.org/2000/svg';
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 140; i++) {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', (-700 + rnd() * 3000).toFixed(1));
        c.setAttribute('cy', (rnd() * 560).toFixed(1));
        c.setAttribute('r', (0.8 + rnd() * 1.6).toFixed(2));
        c.style.animationDelay = (-rnd() * 3).toFixed(2) + 's';
        c.style.animationDuration = (2 + rnd() * 3).toFixed(2) + 's';
        stars.appendChild(c);
    }

    /* ---------- palet: [siang, senja, malam] ---------- */
    const COLORS = {
        '--sky-top': ['#f7a07c', '#6b3a86', '#07061f'],
        '--sky-mid': ['#fbb38a', '#c4688f', '#1a0f4a'],
        '--sky-bot': ['#ffd2a1', '#f19a8e', '#7a2a8f'],
        '--sun':     ['#fff1a8', '#ffe814', '#ffe814'],
        '--cloud':   ['#ffffff', '#f6c1c9', '#6a4a9a'],
        '--m1':      ['#e4857f', '#a2507f', '#3a1f6e'],
        '--m2':      ['#a1558f', '#6d3f86', '#241657'],
        '--m3':      ['#4a3a86', '#35296e', '#120d3a'],
        '--tree':    ['#1f2a5c', '#151a45', '#070a22']
    };
    const SUN_Y     = [400, 410, 820];   // posisi matahari
    const SUN_SCALE = [0.5, 1.15, 1.0];
    const SUN_OP    = [1, 1, 0];
    const CLOUD_OP  = [1, 0.7, 0];

    /* ---------- helper ---------- */
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const ease = t => t * t * (3 - 2 * t);
    const seg = p => { const s = clamp(p) * 2, i = Math.min(Math.floor(s), 1); return [i, ease(s - i)]; };
    const lerp = (a, b, t) => a + (b - a) * t;
    const num = (arr, p) => { const [i, t] = seg(p); return lerp(arr[i], arr[i + 1], t); };
    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const col = (arr, p) => {
        const [i, t] = seg(p), a = hex(arr[i]), b = hex(arr[i + 1]);
        return 'rgb(' + a.map((v, k) => Math.round(lerp(v, b[k], t))).join(',') + ')';
    };

    /* ---------- viewBox menyesuaikan layar (HP / tablet / lebar) ---------- */
    let vl = 0, vr = 1600;
    function fit() {
        const aspect = innerWidth / innerHeight;
        const w = clamp(900 * aspect, 450, 2400);
        vl = 800 - w / 2;
        vr = 800 + w / 2;
        svg.setAttribute('viewBox', vl.toFixed(1) + ' 0 ' + w.toFixed(1) + ' 900');
    }
    fit();
    addEventListener('resize', fit);

    /* ---------- gambar satu frame ---------- */
    function render(p) {
        for (const k in COLORS) bg.style.setProperty(k, col(COLORS[k], p));

        const s = num(SUN_SCALE, p);
        sun.setAttribute('transform', 'translate(800 ' + num(SUN_Y, p).toFixed(1) + ') scale(' + s.toFixed(3) + ')');
        sun.style.opacity = num(SUN_OP, p).toFixed(3);

        stars.style.opacity = clamp((p - 0.55) / 0.3).toFixed(3);
        clouds.style.opacity = num(CLOUD_OP, p).toFixed(3);
        cloudEls.forEach(c => {
            const x = +c.dataset.x + p * +c.dataset.sp;
            c.setAttribute('x', x.toFixed(1));
            c.setAttribute('y', c.dataset.y);
        });

        // burung terbang melintas di sekitar senja
        const bp = clamp((p - 0.18) / 0.5);
        birds.setAttribute('transform', 'translate(' + lerp(vl - 160, vr + 160, bp).toFixed(1) + ' ' + (320 - Math.sin(bp * Math.PI) * 70).toFixed(1) + ') scale(1.8)');
        birds.style.opacity = (Math.sin(clamp((p - 0.12) / 0.6) * Math.PI)).toFixed(3);

        // paralaks gunung
        m1.setAttribute('transform', 'translate(0 ' + (p * 25).toFixed(1) + ')');
        m2.setAttribute('transform', 'translate(0 ' + (p * 55).toFixed(1) + ')');
        m3.setAttribute('transform', 'translate(0 ' + (p * 95).toFixed(1) + ')');

        // pohon di kiri-kanan layar
        trees.setAttribute('transform', 'translate(0 ' + (p * 30).toFixed(1) + ')');
        const k = (vr - vl) < 900 ? 0.62 : 1;   // pohon lebih kecil di HP
        tl.setAttribute('transform', 'translate(' + (vl - p * 30).toFixed(1) + ' 840) scale(' + k + ') translate(0 -840)');
        tr.setAttribute('transform', 'translate(' + (vr + p * 30).toFixed(1) + ' 840) scale(' + k + ') translate(-1600 -840)');
    }

    /* ---------- loop: ikut scroll dengan gerakan halus ---------- */
    let cur = -1;
    function loop() {
        if (document.body.classList.contains('theme-home')) {
            const max = document.documentElement.scrollHeight - innerHeight;
            const target = max > 0 ? clamp(scrollY / max) : 0;
            cur = cur < 0 ? target : (reduce ? target : cur + (target - cur) * 0.08);
            if (Math.abs(target - cur) < 0.0005) cur = target;
            render(cur);
        }
        requestAnimationFrame(loop);
    }
    loop();
})();
