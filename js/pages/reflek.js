/* =========================================================
   HALAMAN REFLEK START
   Lima lampu merah menyala satu per satu, lalu padam acak.
   Tekan tombol (atau Spasi) secepat mungkin setelah padam.
   Terlalu cepat = gerak sebelum start (jump start).
   Rekor terbaik disimpan di browser (localStorage).
   ========================================================= */
(function () {
    const root = document.getElementById('reflek-page');
    if (!root) return;

    const LIGHT_STEP = 600;            // jeda antar lampu menyala (ms)
    const HOLD_MIN = 250, HOLD_MAX = 1400;   // jeda acak setelah lampu ke-5 sebelum padam (ms)
    const KEY = 'f1-reflek-start';

    /* ---------- penyimpanan ---------- */
    function load() {
        try {
            const d = JSON.parse(localStorage.getItem(KEY) || '{}');
            return { best: Number(d.best) || null, hist: Array.isArray(d.hist) ? d.hist.slice(-6) : [] };
        } catch (e) { return { best: null, hist: [] }; }
    }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
    let data = load();

    /* ---------- tampilan ---------- */
    root.innerHTML = `
        <section class="rf" data-state="idle">
            <p class="rf-kicker">F1 / Uji Refleks</p>
            <h1>Start</h1>
            <p class="rf-sub">Tunggu lima lampu merah padam, lalu tekan tombol secepat mungkin. Terlalu cepat berarti gerak sebelum start.</p>
            <div class="rf-gantry" aria-hidden="true">
                ${[0, 1, 2, 3, 4].map(() => '<div class="rf-pod"><i></i><i></i></div>').join('')}
            </div>
            <p class="rf-status" aria-live="assertive">Siap?</p>
            <p class="rf-time" aria-live="polite"></p>
            <p class="rf-note"></p>
            <button class="rf-btn" type="button">Mulai</button>
            <p class="rf-hint">Bisa juga pakai tombol Spasi atau Enter</p>
            <div class="rf-stats">
                <div class="rf-best"><b data-k="best">-</b><span>Terbaik</span></div>
                <div><b data-k="last">-</b><span>Terakhir</span></div>
                <div><b data-k="avg">-</b><span>Rata-rata</span></div>
            </div>
            <ul class="rf-hist" aria-label="Riwayat percobaan"></ul>
            <button class="rf-reset" type="button">Reset rekor</button>
        </section>`;

    const box = root.querySelector('.rf');
    const pods = [...root.querySelectorAll('.rf-pod')];
    const elStatus = root.querySelector('.rf-status');
    const elTime = root.querySelector('.rf-time');
    const elNote = root.querySelector('.rf-note');
    const btn = root.querySelector('.rf-btn');
    const elHist = root.querySelector('.rf-hist');
    const stat = k => root.querySelector(`[data-k="${k}"]`);

    const ms = v => `${Math.round(v)} ms`;
    function rating(t) {
        if (t < 120) return 'Terlalu cepat untuk manusia biasa. Jangan-jangan menebak?';
        if (t <= 200) return 'Refleks sekelas pembalap F1!';
        if (t <= 250) return 'Cepat. Di atas rata-rata orang kebanyakan.';
        if (t <= 350) return 'Lumayan. Masih bisa lebih cepat.';
        return 'Perlu latihan lagi. Fokus ke lampunya.';
    }

    function renderStats() {
        const times = data.hist.filter(h => typeof h === 'number');
        stat('best').textContent = data.best ? ms(data.best) : '-';
        const last = data.hist[data.hist.length - 1];
        stat('last').textContent = typeof last === 'number' ? ms(last) : (last === 'x' ? 'Gerak dini' : '-');
        stat('avg').textContent = times.length ? ms(times.reduce((a, b) => a + b, 0) / times.length) : '-';
        elHist.innerHTML = data.hist.map(h => {
            if (h === 'x') return '<li class="bad">Gerak dini</li>';
            return `<li class="${h === data.best ? 'best' : ''}">${ms(h)}</li>`;
        }).join('');
    }

    /* ---------- mesin status ---------- */
    let state = 'idle';     // idle | arm | wait | go | done
    let timers = [];
    let t0 = 0;

    const setState = s => { state = s; box.dataset.state = s === 'done' ? box.dataset.state : s; };
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const lights = n => pods.forEach((p, i) => p.classList.toggle('on', i < n));

    function reset() {
        clearTimers();
        lights(0);
        setState('idle');
        box.dataset.state = 'idle';
        elStatus.textContent = 'Siap?';
        elTime.innerHTML = '';
        elNote.textContent = '';
        btn.textContent = 'Mulai';
    }

    function start() {
        clearTimers();
        elTime.innerHTML = '';
        elNote.textContent = '';
        elStatus.textContent = 'Lampu menyala satu per satu...';
        btn.textContent = 'Tunggu';
        box.dataset.state = 'arm';
        state = 'arm';
        lights(0);
        for (let i = 1; i <= 5; i++) timers.push(setTimeout(() => lights(i), i * LIGHT_STEP));
        timers.push(setTimeout(() => {
            state = 'wait';
            box.dataset.state = 'wait';
            elStatus.textContent = 'Lima lampu penuh. Tunggu padam, jangan ditekan dulu!';
            const hold = HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN);
            timers.push(setTimeout(go, hold));
        }, 5 * LIGHT_STEP));
    }

    function go() {
        lights(0);
        state = 'go';
        box.dataset.state = 'go';
        elStatus.textContent = 'Tekan sekarang!';
        btn.textContent = 'Tekan!';
        requestAnimationFrame(() => { t0 = performance.now(); });   // waktu dihitung setelah lampu benar-benar padam di layar
    }

    function finish(t) {
        const now = performance.now();
        const rt = Math.max(1, now - (t0 || now));
        state = 'done';
        box.dataset.state = 'done';
        elStatus.textContent = 'Waktu reaksimu';
        elTime.innerHTML = `${Math.round(rt)}<small>ms</small>`;
        const isBest = !data.best || rt < data.best;
        if (isBest) data.best = rt;
        data.hist.push(rt);
        data.hist = data.hist.slice(-6);
        save();
        elNote.textContent = (isBest ? 'Rekor baru! ' : '') + rating(rt);
        btn.textContent = 'Coba lagi';
        renderStats();
    }

    function fault() {
        clearTimers();
        state = 'done';
        box.dataset.state = 'fault';
        lights(5);
        elStatus.textContent = 'Gerak sebelum start!';
        elTime.innerHTML = '';
        elNote.textContent = 'Kamu menekan sebelum lampu padam. Di balapan sungguhan ini kena penalti. Sabar, tunggu lampunya padam.';
        btn.textContent = 'Coba lagi';
        data.hist.push('x');
        data.hist = data.hist.slice(-6);
        save();
        renderStats();
    }

    function press() {
        if (state === 'idle' || state === 'done') { start(); return; }
        if (state === 'arm' || state === 'wait') { fault(); return; }
        if (state === 'go') finish();
    }

    /* ---------- input ---------- */
    btn.addEventListener('pointerdown', e => { if (e.button === 0 || e.pointerType !== 'mouse') { e.preventDefault(); press(); } });
    btn.addEventListener('click', e => e.preventDefault());   // klik sudah ditangani lewat pointerdown
    document.addEventListener('keydown', e => {
        if (!root.classList.contains('active') || e.repeat) return;
        if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); press(); }
    });
    root.querySelector('.rf-reset').addEventListener('click', () => {
        data = { best: null, hist: [] };
        save();
        renderStats();
        reset();
    });

    /* ---------- tema + keluar halaman ---------- */
    PAGE_THEMES['reflek-page'] = 'theme-reflek';
    new MutationObserver(() => { if (!root.classList.contains('active')) reset(); })
        .observe(root, { attributes: true, attributeFilter: ['class'] });

    renderStats();
})();