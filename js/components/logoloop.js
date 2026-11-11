/* =========================================================
   LOGO LOOP - versi JavaScript biasa (tanpa React)
   Pakai: beri atribut data-logoloop pada elemen .logoloop.
   Opsi lewat atribut data:
     data-speed="80"          kecepatan (piksel per detik)
     data-direction="left"    left | right
     data-hover-speed="0"     kecepatan saat disorot (0 = berhenti pelan-pelan)
   ========================================================= */
(function () {
    'use strict';

    var SMOOTH_TAU = 0.25;   // makin besar, makin halus perubahan kecepatannya
    var MIN_COPIES = 2;
    var COPY_HEADROOM = 2;

    function LogoLoop(root) {
        var track = root.querySelector('.logoloop__track');
        var seq = track && track.querySelector('.logoloop__list');
        if (!track || !seq) return;

        var speed = parseFloat(root.dataset.speed || '80');
        var direction = root.dataset.direction === 'right' ? -1 : 1;
        var hoverSpeed = parseFloat(root.dataset.hoverSpeed || '0');
        var target = Math.abs(speed) * direction * (speed < 0 ? -1 : 1);

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var seqWidth = 0, offset = 0, velocity = 0;
        var hovered = false, running = false, raf = null, last = null;

        // Gandakan daftar logo supaya cukup menutupi lebar layar
        function build() {
            track.querySelectorAll('.logoloop__list[data-clone]').forEach(function (n) { n.remove(); });
            seqWidth = Math.ceil(seq.getBoundingClientRect().width);
            if (!seqWidth) return;   // halaman sedang disembunyikan; dihitung ulang saat tampil
            var copies = Math.max(MIN_COPIES, Math.ceil(root.clientWidth / seqWidth) + COPY_HEADROOM);
            for (var i = 1; i < copies; i++) {
                var clone = seq.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.setAttribute('data-clone', '1');
                track.appendChild(clone);
            }
        }

        function frame(ts) {
            if (last === null) last = ts;
            var dt = Math.max(0, ts - last) / 1000;
            last = ts;

            var goal = hovered ? hoverSpeed : target;
            velocity += (goal - velocity) * (1 - Math.exp(-dt / SMOOTH_TAU));

            if (seqWidth > 0) {
                offset = (((offset + velocity * dt) % seqWidth) + seqWidth) % seqWidth;
                track.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
            }
            raf = requestAnimationFrame(frame);
        }

        function start() {
            if (running || reduceMotion) return;
            running = true;
            last = null;
            raf = requestAnimationFrame(frame);
        }
        function stop() {
            running = false;
            if (raf !== null) cancelAnimationFrame(raf);
            raf = null;
        }

        track.addEventListener('mouseenter', function () { hovered = true; });
        track.addEventListener('mouseleave', function () { hovered = false; });

        // Hitung ulang saat ukuran berubah (termasuk saat Beranda kembali ditampilkan)
        if (window.ResizeObserver) {
            new ResizeObserver(build).observe(root);
        } else {
            window.addEventListener('resize', build);
        }
        build();

        // Animasi hanya jalan saat terlihat di layar (hemat baterai & GPU)
        if (window.IntersectionObserver) {
            new IntersectionObserver(function (entries) {
                entries[0].isIntersecting ? start() : stop();
            }).observe(root);
        } else {
            start();
        }
    }

    document.querySelectorAll('[data-logoloop]').forEach(LogoLoop);
})();
