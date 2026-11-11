/* =========================================================
   DEPTH CAROUSEL - versi JavaScript biasa (tanpa React dan tanpa GSAP)
   Kartu bertumpuk ke arah dalam, kartu depan ada di tengah.
   Bisa di-drag, di-swipe, dan pakai tombol panah keyboard.

   Pemakaian:
     const dc = DepthCarousel(elemenWadah, { onChange: (index, item) => {...} });
     dc.setItems([{ image: 'a.jpg', alt: 'A', label: 'A' }, ...], 0);
     dc.goTo(3);                    // pindah ke kartu ke-4 (dengan animasi)
     dc.configure({ cardWidth: 250 });
   ========================================================= */
(function (global) {
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const easeOut = t => 1 - Math.pow(1 - t, 3);          /* sama dengan power3.out di GSAP */
    const px = v => (typeof v === 'number' ? v + 'px' : v);

    const DEFAULTS = {
        cardWidth: 300, cardHeight: 380, radius: 18, tint: '#05060a',
        depth: 220,            /* seberapa jauh tiap kartu masuk ke belakang */
        spread: 90,            /* geser ke samping tiap kartu */
        tilt: 22,              /* putaran kartu di belakang kartu depan (derajat) */
        tiltDirection: 'right',
        perspective: 1400,
        visibleCards: 4,       /* jumlah kartu di belakang yang masih terlihat */
        falloff: 0.2,          /* makin ke belakang makin gelap */
        blur: 6,
        duration: 700,         /* ms */
        loop: true,
        wheel: 'horizontal',   /* 'horizontal' = hanya geser samping (scroll halaman tetap normal), 'all', atau 'off' */
        onChange: null
    };

    function DepthCarousel(host, options) {
        const cfg = Object.assign({}, DEFAULTS, options);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let data = [], cards = [], overlays = [];
        let pos = 0, focus = 0, scale = 1, raf = 0;
        let drag = null, wheelTimer = null, suppressClick = false;

        /* ---------- elemen ---------- */
        const root = document.createElement('div');
        root.className = 'depth-carousel';
        root.tabIndex = 0;
        root.setAttribute('role', 'group');
        root.setAttribute('aria-roledescription', 'carousel');
        root.setAttribute('aria-label', 'Galeri kartu');
        root.style.setProperty('--dc-perspective', cfg.perspective + 'px');
        const stage = document.createElement('div');
        stage.className = 'depth-carousel__stage';
        root.appendChild(stage);
        host.appendChild(root);

        /* ---------- posisi semua kartu untuk nilai pos tertentu ---------- */
        function layout(p) {
            const n = data.length;
            if (!n) return;
            const dir = cfg.tiltDirection === 'left' ? -1 : 1;

            for (let i = 0; i < n; i++) {
                const el = cards[i];
                if (!el) continue;

                let d = i - p;
                if (cfg.loop && n > 1) {
                    d = ((d % n) + n) % n;
                    if (d > n / 2) d -= n;
                }

                const back = Math.max(0, d);
                const shown = Math.abs(d) <= cfg.visibleCards + 0.5;

                const tz = -cfg.depth * d;
                const tx = dir * cfg.spread * d;
                const ry = dir * cfg.tilt * clamp(d, 0, 1);

                let opacity = d < 0 ? Math.max(0, 1 + d) : 1;   /* kartu yang sudah lewat memudar */
                if (!shown) opacity = 0;

                const brightness = Math.max(0.15, 1 - back * cfg.falloff);
                const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;

                el.style.transform = `translate(-50%, -50%) scale(${scale}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
                el.style.opacity = opacity.toFixed(3);
                el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
                el.style.zIndex = String(Math.round(2000 - d * 20));
                el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

                const ov = overlays[i];
                if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
            }
        }

        /* ---------- animasi ---------- */
        function settle() {
            const n = data.length;
            if (n) pos = ((pos % n) + n) % n;
            layout(pos);
        }

        function tweenTo(target, animate) {
            cancelAnimationFrame(raf);
            const from = pos;
            const dur = animate && !reduced ? cfg.duration : 0;
            if (!dur || from === target) { pos = target; settle(); return; }
            const t0 = performance.now();
            const step = now => {
                const t = Math.min((now - t0) / dur, 1);
                pos = from + (target - from) * easeOut(t);
                layout(pos);
                if (t < 1) raf = requestAnimationFrame(step); else settle();
            };
            raf = requestAnimationFrame(step);
        }

        function updateAria() {
            cards.forEach((el, i) => el.setAttribute('aria-hidden', String(i !== focus)));
        }

        function setFocus(rawIndex, animate, silent) {
            const n = data.length;
            if (!n) return;
            const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
            let delta = idx - pos;
            if (cfg.loop && n > 1) {
                delta = ((delta % n) + n) % n;
                if (delta > n / 2) delta -= n;      /* ambil jalur terpendek */
            }
            tweenTo(pos + delta, animate !== false);
            if (idx !== focus) {
                focus = idx;
                updateAria();
                if (!silent && typeof cfg.onChange === 'function') cfg.onChange(idx, data[idx]);
            }
        }

        /* ---------- ukuran ---------- */
        function fit() {
            const w = root.clientWidth, h = root.clientHeight;
            const needW = cfg.cardWidth + Math.abs(cfg.spread) * 2 + 120;
            const needH = cfg.cardHeight + 30;
            scale = clamp(Math.min(w / needW, h ? h / needH : 1), 0.4, 1);
            layout(pos);
        }

        function applySize() {
            cards.forEach(el => {
                el.style.width = cfg.cardWidth + 'px';
                el.style.height = cfg.cardHeight + 'px';
                el.style.borderRadius = px(cfg.radius);
            });
        }

        /* ---------- membuat kartu ---------- */
        function build() {
            stage.innerHTML = '';
            cards = []; overlays = [];
            const n = data.length;
            data.forEach((item, i) => {
                const el = document.createElement('div');
                el.className = 'depth-carousel__card';
                el.setAttribute('aria-roledescription', 'slide');
                el.setAttribute('aria-label', `${i + 1} / ${n}`);

                const label = () => {
                    const s = document.createElement('span');
                    s.className = 'depth-carousel__label';
                    s.textContent = item.label || item.alt || '';
                    el.insertBefore(s, el.firstChild);
                };
                if (item.image) {
                    const img = new Image();
                    img.className = 'depth-carousel__img';
                    img.src = item.image;
                    img.alt = item.alt || '';
                    img.draggable = false;
                    img.decoding = 'async';
                    img.onerror = () => { img.remove(); label(); };   /* gambar gagal dimuat: tampilkan nama saja */
                    el.appendChild(img);
                } else {
                    label();
                }

                const tint = document.createElement('span');
                tint.className = 'depth-carousel__tint';
                tint.style.background = cfg.tint;
                el.appendChild(tint);

                el.addEventListener('click', () => { if (!suppressClick) setFocus(i, true); });
                stage.appendChild(el);
                cards.push(el); overlays.push(tint);
            });
            applySize();
        }

        /* ---------- event: roda mouse / trackpad ---------- */
        function onWheel(e) {
            if (cfg.wheel === 'off' || data.length < 2) return;
            const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (cfg.wheel === 'horizontal' && !horizontal) return;   /* scroll vertikal tetap menggulung halaman */
            e.preventDefault();
            cancelAnimationFrame(raf);
            const raw = horizontal ? e.deltaX : e.deltaY;
            const delta = e.deltaMode === 1 ? raw * 24 : raw;
            pos += clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
            layout(pos);
            clearTimeout(wheelTimer);
            wheelTimer = setTimeout(() => setFocus(Math.round(pos), true), 130);
        }

        /* ---------- event: drag / swipe ---------- */
        const stepPx = () => Math.max(cfg.cardWidth * 0.55 * scale, 40);

        function onPointerDown(e) {
            if (data.length < 2) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            cancelAnimationFrame(raf);
            drag = { x: e.clientX, startPos: pos, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
        }
        function onPointerMove(e) {
            if (!drag) return;
            const dx = e.clientX - drag.x;
            if (!drag.moved && Math.abs(dx) > 4) {
                drag.moved = true;
                try { root.setPointerCapture(drag.id); } catch (_) { /* abaikan */ }
            }
            if (!drag.moved) return;
            const now = performance.now();
            drag.v = (e.clientX - drag.lastX) / Math.max(now - drag.lastT, 1);
            drag.lastX = e.clientX; drag.lastT = now;
            pos = drag.startPos - dx / stepPx();
            layout(pos);
        }
        function onPointerEnd() {
            if (!drag) return;
            const d = drag; drag = null;
            if (!d.moved) return;
            suppressClick = true;
            setTimeout(() => { suppressClick = false; }, 0);   /* jangan hitung lepas drag sebagai klik */
            setFocus(Math.round(pos - (d.v * 180) / stepPx()), true);
        }

        function onKeyDown(e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setFocus(focus - 1, true); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); setFocus(focus + 1, true); }
        }

        root.addEventListener('wheel', onWheel, { passive: false });
        root.addEventListener('pointerdown', onPointerDown);
        root.addEventListener('pointermove', onPointerMove);
        root.addEventListener('pointerup', onPointerEnd);
        root.addEventListener('pointercancel', onPointerEnd);
        root.addEventListener('keydown', onKeyDown);

        const ro = new ResizeObserver(fit);
        ro.observe(root);

        /* ---------- API ---------- */
        return {
            setItems(items, startIndex) {
                cancelAnimationFrame(raf);
                data = (Array.isArray(items) ? items : []).map(it => (typeof it === 'string' ? { image: it, alt: '' } : it));
                focus = clamp(startIndex || 0, 0, Math.max(0, data.length - 1));
                pos = focus;
                build();
                updateAria();
                fit();
            },
            goTo(i, animate, silent) { setFocus(i, animate !== false, silent !== false); },
            next() { setFocus(focus + 1, true); },
            prev() { setFocus(focus - 1, true); },
            configure(partial) {
                Object.assign(cfg, partial);
                root.style.setProperty('--dc-perspective', cfg.perspective + 'px');
                applySize();
                fit();
            },
            get index() { return focus; },
            destroy() {
                cancelAnimationFrame(raf);
                clearTimeout(wheelTimer);
                ro.disconnect();
                root.remove();
            }
        };
    }

    global.DepthCarousel = DepthCarousel;
})(window);
