/* =========================================================
   BACKGROUND VIDEO HALAMAN SIRKUIT (dengan suara)
   - Video hanya dimuat saat halaman Sirkuit dibuka (Beranda tetap ringan)
   - Video diputar SEKALI saja selama pengunjung masih di halaman Sirkuit (berhenti di frame terakhir, tidak diulang)
   - Video diputar dari awal lagi hanya kalau pengunjung masuk dari halaman luar ke halaman Sirkuit
   - Selalu kualitas HD: 1440p (layar besar) / 1080p (lainnya), 720p hanya cadangan kalau file HD tidak ada
   - Mulai muted (aturan autoplay browser), suara menyala saat interaksi pertama
   - Tombol 🔊/🔇 untuk mute/unmute manual
   - Suara otomatis berhenti saat pindah halaman
   ========================================================= */
(function () {
    /* ---------- PENGATURAN ---------- */
    const CFG = {
        src: 'assets/images/bg/sirkuit.mp4',            // 1080p (laptop / desktop)
        srcMobile: 'assets/images/bg/sirkuit-720.mp4',  // 720p (HP)
        srcHD: 'assets/images/bg/sirkuit-1440.mp4',     // 1440p (tablet / layar besar)
        poster: '',
        themes: ['theme-circuits', 'theme-circuit-detail'],
        dim: 0.40,                               // makin kecil = video makin terang & tajam
        dimDetail: 0.52,
        volume: 0.5                              // volume suara (0 - 1)
    };

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SAVE = navigator.connection && navigator.connection.saveData;
    if (REDUCE || SAVE) return;

    const css = document.createElement('style');
    css.textContent = `
        #cv-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; background: #0d0f13;
                 opacity: 0; visibility: hidden; transition: opacity .6s ease, visibility .6s; }
        #cv-bg.on { opacity: 1; visibility: visible; }
        #cv-bg video { width: 100%; height: 100%; object-fit: cover; display: block; }
        #cv-bg::after { content: ""; position: absolute; inset: 0;
                 background: linear-gradient(rgba(8,9,12,var(--d)), rgba(8,9,12,calc(var(--d) + .18))); }
        #cv-sound { position: fixed; right: 16px; bottom: 16px; z-index: 9999;
                 width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.25);
                 background: rgba(15,17,22,.75); color: #fff; font-size: 20px; cursor: pointer;
                 display: none; align-items: center; justify-content: center;
                 backdrop-filter: blur(6px); }
        #cv-sound.show { display: flex; }`;
    document.head.appendChild(css);

    const box = document.createElement('div');
    box.id = 'cv-bg';
    // tanpa atribut "loop" -> video hanya diputar satu kali
    box.innerHTML = '<video muted playsinline preload="none" aria-hidden="true"></video>';
    document.body.prepend(box);

    const btn = document.createElement('button');
    btn.id = 'cv-sound';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Nyalakan / matikan suara video');
    document.body.appendChild(btn);

    const v = box.firstChild;
    v.muted = true;                                   // mulai muted supaya autoplay diizinkan
    v.loop = false;                                   // pastikan tidak diulang
    v.volume = CFG.volume;

    let loaded = false;
    let wasOn = false;         // sebelumnya sedang di halaman Sirkuit? (untuk deteksi "baru masuk")
    let wantSound = true;      // pengunjung ingin suara (berubah kalau dia menekan tombol mute)
    let interacted = false;    // sudah ada interaksi pertama?
    let queue = [];            // daftar cadangan file video

    function tryPlay() {
        // kalau video sudah selesai, jangan diputar ulang (play() pada video yang selesai akan mengulang dari awal)
        if (v.ended) return;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
    }

    // kalau file gagal dimuat, coba file cadangan berikutnya; hapus hanya kalau semua gagal
    v.addEventListener('error', () => {
        if (queue.length) {
            v.src = queue.shift();
            v.load();
            tryPlay();
        } else {
            box.remove();
            btn.remove();
        }
    });

    function pickSources() {
        // selalu HD: 1440p untuk layar besar, 1080p untuk lainnya (termasuk HP)
        // 720p hanya dipakai sebagai cadangan terakhir kalau file HD tidak ada
        const px = window.innerWidth * (window.devicePixelRatio || 1);
        let list;
        if (px >= 2200) list = [CFG.srcHD, CFG.src, CFG.srcMobile];
        else            list = [CFG.src, CFG.srcHD, CFG.srcMobile];
        return list.filter(Boolean);
    }

    function updateBtn() {
        btn.textContent = v.muted ? '🔇' : '🔊';
    }

    function applySound() {
        const onPage = box.classList.contains('on');
        v.muted = !(onPage && interacted && wantSound);
        updateBtn();
    }

    // interaksi pertama -> izin suara dari browser
    function firstInteraction() {
        interacted = true;
        applySound();
        tryPlay();
        ['click', 'touchstart', 'keydown'].forEach(e => window.removeEventListener(e, firstInteraction, true));
    }
    ['click', 'touchstart', 'keydown'].forEach(e => window.addEventListener(e, firstInteraction, true));

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        interacted = true;
        wantSound = v.muted;       // kalau sedang muted -> nyalakan, sebaliknya matikan
        applySound();
        tryPlay();                 // tidak akan memutar ulang kalau video sudah selesai
    });

    function sync() {
        const on = CFG.themes.some(t => document.body.classList.contains(t));
        const justEntered = on && !wasOn;   // baru masuk ke Sirkuit dari halaman luar
        wasOn = on;

        box.classList.toggle('on', on);
        btn.classList.toggle('show', on);
        box.style.setProperty('--d', document.body.classList.contains('theme-circuit-detail') ? CFG.dimDetail : CFG.dim);

        if (on) {
            if (!loaded) {
                loaded = true;
                if (CFG.poster) v.poster = CFG.poster;
                queue = pickSources();
                v.src = queue.shift();
            } else if (justEntered) {
                // masuk dari halaman luar -> putar dari awal (sekali)
                try { v.currentTime = 0; } catch (err) {}
            }
            // sudah di halaman Sirkuit (daftar <-> detail): tidak diulang, berhenti di frame terakhir kalau sudah selesai
            applySound();
            tryPlay();
        } else {
            v.muted = true;        // pindah halaman: suara mati
            v.pause();
            updateBtn();
        }
    }

    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    sync();
})();