/* Daftar pembalap: geser dengan drag mouse / sentuh / tombol panah.
   Tidak mengubah script.js maupun pembalap.js. */
(function () {
    'use strict';
    function init() {
        var grid = document.getElementById('drivers-grid-container');
        if (!grid || grid.dataset.dgReady) return;
        grid.dataset.dgReady = '1';

        // ---- drag dengan mouse ----
        var down = false, moved = false, startX = 0, startLeft = 0;
        grid.addEventListener('pointerdown', function (e) {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            down = true; moved = false; startX = e.clientX; startLeft = grid.scrollLeft;
        });
        window.addEventListener('pointermove', function (e) {
            if (!down) return;
            var dx = e.clientX - startX;
            if (!moved && Math.abs(dx) > 5) { moved = true; grid.classList.add('is-dragging'); }
            if (moved) grid.scrollLeft = startLeft - dx;
        });
        window.addEventListener('pointerup', function () {
            if (!down) return;
            down = false;
            // tunda agar klik setelah drag tidak membuka detail pembalap
            setTimeout(function () { grid.classList.remove('is-dragging'); }, 0);
        });
        // kalau habis drag, jangan buka detail
        grid.addEventListener('click', function (e) {
            if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
        }, true);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
