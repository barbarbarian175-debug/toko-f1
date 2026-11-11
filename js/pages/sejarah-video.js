/* =========================================================
   VIDEO "ENGINE SOUND" DI BAWAH HALAMAN SEJARAH
   - Disisipkan di bawah slider (sejarah.js & sejarah.css tidak diubah)
   - Video dengan suara + kontrol buatan sendiri (play, progres, volume) bertema arsip emas
   - Otomatis pause saat pindah halaman
   ========================================================= */
(function () {
    const CFG = {
        src: 'assets/images/bg/sound-engine.mp4',   // lokasi file video
        title: 'Engine Sound',               // tulisan di atas video
        poster: '',                          // (opsional) gambar sampul video, contoh: 'assets/images/bg/engine-poster.jpg'

        /* DAFTAR ENGINE: t = detik mulai (menit:detik dihitung manual, 1:30 = 90), name = teks yang diketik.
           Urutkan dari detik terkecil. Contoh isi:
           { t: 0,  name: 'V10 - Ferrari F2004' },
           { t: 12, name: 'V8 - Red Bull RB7' },
           { t: 25, name: 'V6 Turbo Hybrid - Mercedes W11' } */
        engines: [
            { t: 0,  name: 'V6' },
            { t: 9,  name: 'V8' },
            { t: 18, name: 'V10' },
            { t: 27, name: 'V12' }
        ],
        typeSpeed: 45                        // kecepatan ketik (ms per huruf), makin kecil makin cepat
    };

    const root = document.getElementById('history-page');
    if (!root) return;

    const css = document.createElement('style');
    css.textContent = `
        .hv-section { margin-top: clamp(28px, 5vw, 56px); }
        .hv-title { margin: 0 0 16px; display: flex; align-items: center; gap: 16px;
            font: 700 clamp(1.4rem, 3vw, 2.1rem)/1.1 'Playfair Display', Georgia, 'Times New Roman', serif;
            letter-spacing: .14em; text-transform: uppercase; color: #efe4c8; }
        .hv-title::after { content: none; }
        .hv-title .hv-now { order: 2; }
        .hv-frame { overflow: hidden; border-radius: 16px; background: #0a0806;
            border: 1px solid rgba(195,165,106,.28);
            box-shadow: 0 30px 70px rgba(0,0,0,.55), inset 0 0 0 6px rgba(10,8,6,.6); }
        .hv-stage { position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: min(78vh, 720px); background: #000; overflow: hidden; }
        .hv-frame video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; background: #000; object-fit: contain; }
        .hv-vis { display: none; position: absolute; inset: 0; cursor: pointer;
            background: radial-gradient(ellipse at 50% 38%, rgba(195,165,106,.20), transparent 62%), linear-gradient(180deg, #17120b, #0a0806); }
        .hv-vis canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .hv-vis-label { position: absolute; left: 0; right: 0; top: 16%; text-align: center; pointer-events: none;
            font: 800 clamp(2.6rem, 11vw, 7rem)/1 'Playfair Display', Georgia, serif; letter-spacing: .06em; color: rgba(239,228,200,.92);
            text-shadow: 0 6px 30px rgba(0,0,0,.6); }
        .hv-vis-sub { position: absolute; left: 0; right: 0; top: calc(16% + clamp(3rem, 12vw, 7.6rem)); text-align: center; pointer-events: none;
            font: 600 clamp(.7rem, 1.4vw, .95rem)/1 Georgia, serif; letter-spacing: .32em; text-transform: uppercase; color: #c3a56a; }
        .hv-vis-note { position: absolute; left: 0; right: 0; bottom: 10px; text-align: center; pointer-events: none;
            font: 400 .72rem/1 Georgia, serif; letter-spacing: .08em; color: rgba(217,204,171,.5); }
        .hv-frame.audio-only .hv-vis { display: block; }
        .hv-frame.audio-only video { visibility: hidden; }
        .hv-now { font: 700 clamp(.85rem, 1.6vw, 1.15rem)/1.2 'Playfair Display', Georgia, serif;
            letter-spacing: .12em; text-transform: uppercase; color: #c3a56a; text-align: right; }
        .hv-now.typing::after { content: "|"; margin-left: 2px; animation: hv-blink .7s steps(1) infinite; }
        @keyframes hv-blink { 50% { opacity: 0; } }
        .hv-title { flex-wrap: wrap; justify-content: center; text-align: center; }
        .hv-title .hv-now { display: none; }
        .hv-frame video { cursor: pointer; }
        .hv-bar { display: flex; align-items: center; gap: clamp(8px, 1.6vw, 16px); padding: 10px clamp(12px, 2vw, 20px);
            background: #14100b; border-top: 1px solid rgba(195,165,106,.28); color: #efe4c8; }
        .hv-btn { flex: none; width: 40px; height: 40px; padding: 0; display: grid; place-items: center; cursor: pointer;
            border: 1px solid rgba(195,165,106,.55); border-radius: 50%; background: transparent; color: #c3a56a;
            transition: background .2s ease, color .2s ease; }
        .hv-btn:hover { background: #c3a56a; color: #14100b; }
        .hv-btn:focus-visible { outline: 2px solid #efe4c8; outline-offset: 2px; }
        .hv-btn svg { width: 18px; height: 18px; fill: currentColor; display: block; }
        .hv-btn .i-pause, .hv-btn .i-mute { display: none; }
        .hv-btn.playing .i-play, .hv-btn.muted .i-vol { display: none; }
        .hv-btn.playing .i-pause, .hv-btn.muted .i-mute { display: block; }
        .hv-time { flex: none; min-width: 88px; font: 600 .82rem/1 Georgia, 'Times New Roman', serif; letter-spacing: .06em; color: #d9ccab; font-variant-numeric: tabular-nums; }
        .hv-bar input[type=range] { -webkit-appearance: none; appearance: none; height: 18px; margin: 0; background: transparent; cursor: pointer; --pct: 0%; }
        .hv-seek { flex: 1; min-width: 0; }
        .hv-vol { flex: none; width: clamp(60px, 9vw, 100px); }
        .hv-bar input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px;
            background: linear-gradient(90deg, #c3a56a var(--pct), rgba(239,228,200,.2) var(--pct)); }
        .hv-bar input[type=range]::-moz-range-track { height: 4px; border-radius: 2px; background: rgba(239,228,200,.2); }
        .hv-bar input[type=range]::-moz-range-progress { height: 4px; border-radius: 2px; background: #c3a56a; }
        .hv-bar input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; margin-top: -5px; border-radius: 50%;
            background: #efe4c8; border: 2px solid #c3a56a; }
        .hv-bar input[type=range]::-moz-range-thumb { width: 10px; height: 10px; border-radius: 50%; background: #efe4c8; border: 2px solid #c3a56a; }
        @media (max-width: 520px) { .hv-vol { display: none; } .hv-time { min-width: 0; font-size: .74rem; } }
        .hv-miss { padding: 28px; text-align: center; color: #8d8672; font-size: .9rem; }`;
    document.head.appendChild(css);

    const sec = document.createElement('section');
    sec.className = 'hv-section';
    sec.innerHTML =
        '<h2 class="hv-title">' + CFG.title + '<span class="hv-now" aria-live="polite"></span></h2>' +
        '<div class="hv-frame"><div class="hv-stage"><video playsinline preload="metadata"' + (CFG.poster ? ' poster="' + CFG.poster + '"' : '') + '></video>' +
        '<div class="hv-vis"><canvas></canvas><div class="hv-vis-label"></div><div class="hv-vis-sub">Engine Sound</div><div class="hv-vis-note">Gambar video tidak terbaca di browser ini</div></div></div>' +
        '<div class="hv-bar">' +
            '<button type="button" class="hv-btn hv-play" aria-label="Putar / jeda">' +
                '<svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>' +
                '<svg class="i-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button>' +
            '<span class="hv-time">0:00 / 0:00</span>' +
            '<input type="range" class="hv-seek" min="0" max="1000" value="0" step="1" aria-label="Posisi video">' +
            '<button type="button" class="hv-btn hv-mute" aria-label="Bisukan / nyalakan suara">' +
                '<svg class="i-vol" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>' +
                '<svg class="i-mute" viewBox="0 0 24 24"><path d="M16.5 12a4.5 4.5 0 0 0-2.5-4v2.2l2.5 2.5V12zM19 12a7 7 0 0 1-.9 3.4l1.5 1.5A9 9 0 0 0 21 12a9 9 0 0 0-7-8.8v2.1a7 7 0 0 1 5 6.7zM4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.2v2.1a9 9 0 0 0 3.7-1.9l2 2 1.3-1.3L4.3 3zM12 4 9.9 6.1 12 8.2V4z"/></svg></button>' +
            '<input type="range" class="hv-vol" min="0" max="1" value="0.8" step="0.05" aria-label="Volume">' +
        '</div></div>';
    const v = sec.querySelector('video');
    v.src = encodeURI(CFG.src);
    v.addEventListener('error', () => {
        sec.querySelector('.hv-frame').innerHTML =
            '<p class="hv-miss">Video tidak ditemukan: ' + CFG.src + '</p>';
    });

    // ---------- kontrol buatan sendiri ----------
    const bar = sec.querySelector('.hv-bar');
    const bPlay = bar.querySelector('.hv-play'), bMute = bar.querySelector('.hv-mute');
    const seek = bar.querySelector('.hv-seek'), vol = bar.querySelector('.hv-vol');
    const timeEl = bar.querySelector('.hv-time');
    const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
    const paint = el => el.style.setProperty('--pct', (el.value - el.min) / (el.max - el.min) * 100 + '%');

    v.volume = +vol.value; paint(vol);
    function toggle() { v.paused ? v.play().catch(() => {}) : v.pause(); }
    bPlay.addEventListener('click', toggle);
    v.addEventListener('click', toggle);
    v.addEventListener('play', () => bPlay.classList.add('playing'));
    v.addEventListener('pause', () => bPlay.classList.remove('playing'));
    v.addEventListener('ended', () => bPlay.classList.remove('playing'));

    function refresh() {
        timeEl.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration);
        if (v.duration && !seeking) { seek.value = v.currentTime / v.duration * 1000; paint(seek); }
    }
    let seeking = false;
    seek.addEventListener('input', () => { seeking = true; paint(seek); if (v.duration) v.currentTime = seek.value / 1000 * v.duration; timeEl.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration); });
    seek.addEventListener('change', () => { seeking = false; });
    v.addEventListener('timeupdate', refresh);
    v.addEventListener('loadedmetadata', refresh);
    v.addEventListener('durationchange', refresh);

    bMute.addEventListener('click', () => { v.muted = !v.muted; });
    vol.addEventListener('input', () => { v.volume = +vol.value; v.muted = v.volume === 0; paint(vol); });
    v.addEventListener('volumechange', () => bMute.classList.toggle('muted', v.muted || v.volume === 0));

    // ---------- nama engine diketik sesuai detik video ----------
    const now = sec.querySelector('.hv-now');
    const list = CFG.engines.slice().sort((a, b) => a.t - b.t);
    let cur = -1, typer = null;

    function typeText(text) {
        clearInterval(typer);
        now.textContent = '';
        if (!text) { now.classList.remove('typing'); return; }
        let i = 0;
        now.classList.add('typing');
        typer = setInterval(() => {
            now.textContent = text.slice(0, ++i);
            if (i >= text.length) { clearInterval(typer); now.classList.remove('typing'); }
        }, CFG.typeSpeed);
    }

    function updateEngine() {
        let idx = -1;
        for (let i = 0; i < list.length; i++) if (v.currentTime >= list[i].t) idx = i;
        if (idx !== cur) { cur = idx; typeText(idx >= 0 ? list[idx].name : ''); visLabel.textContent = idx >= 0 ? list[idx].name : ''; }
    }
    v.addEventListener('timeupdate', updateEngine);
    v.addEventListener('seeked', updateEngine);
    v.addEventListener('loadedmetadata', updateEngine);

    // ---------- tampilan visual ----------
    const frame = sec.querySelector('.hv-frame');
    const stage = sec.querySelector('.hv-stage');
    const vis = sec.querySelector('.hv-vis');
    const visLabel = sec.querySelector('.hv-vis-label');
    const cv = vis.querySelector('canvas');
    const g = cv.getContext('2d');
    let raf = 0;

    // kalau file hanya berisi suara (tidak ada gambar), tampilkan visual equalizer bergaya emas;
    // kalau ada gambar, kotak mengikuti rasio video yang sebenarnya
    function checkVisual() {
        if (!v.videoWidth) { frame.classList.add('audio-only'); }
        else { frame.classList.remove('audio-only'); stage.style.aspectRatio = v.videoWidth + ' / ' + v.videoHeight; }
        draw();
    }
    v.addEventListener('loadedmetadata', checkVisual);
    vis.addEventListener('click', toggle);

    function draw() {
        cancelAnimationFrame(raf);
        if (!frame.classList.contains('audio-only')) return;
        const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
        if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, w, h);
        const n = 56, gap = w / n, bw = gap * 0.56, base = h * 0.92, maxH = h * 0.5;
        const t = performance.now() / 1000, on = !v.paused && !v.ended;
        const grad = g.createLinearGradient(0, base - maxH, 0, base);
        grad.addColorStop(0, '#efe4c8'); grad.addColorStop(1, '#8a6e3a');
        g.fillStyle = grad;
        for (let i = 0; i < n; i++) {
            const a = Math.abs(Math.sin(t * 3.1 + i * 0.55)) * 0.55 + Math.abs(Math.sin(t * 5.3 + i * 1.3)) * 0.45;
            const mid = 1 - Math.abs(i - n / 2) / (n / 2) * 0.55;   // tengah lebih tinggi
            const bh = Math.max(3, (on ? a * mid : 0.04) * maxH);
            g.fillRect(i * gap + (gap - bw) / 2, base - bh, bw, bh);
        }
        if (on) raf = requestAnimationFrame(draw);
    }
    v.addEventListener('play', draw);
    v.addEventListener('pause', draw);
    v.addEventListener('ended', draw);
    window.addEventListener('resize', draw);

    function place() {
        const stage = root.querySelector('.hs-stage');
        if (stage && sec.previousElementSibling !== stage) stage.after(sec);
    }
    place();
    // kalau sejarah.js menggambar ulang halaman, sisipkan lagi
    new MutationObserver(place).observe(root, { childList: true });

    // pause saat pindah dari halaman Sejarah
    new MutationObserver(() => {
        if (!document.body.classList.contains('theme-history')) v.pause();
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();