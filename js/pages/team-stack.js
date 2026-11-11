/* =========================================================
   TUMPUKAN KARTU TIM (port vanilla JS dari React Bits "Stack")
   VERSI PERBAIKAN: drag di HP sudah bisa
   ========================================================= */
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
            mobileClickOnly: false,
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
        items.reverse();

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
        var startX = 0, startY = 0;

        function onDown(e) {
            lastPointerType = e.pointerType || 'mouse';
            if (e.button !== undefined && e.button !== 0) return;

            var it = topItem();
            if (!it || !it.wrap.contains(e.target)) return;

            // jangan drag kalau yang disentuh tombol pembalap / link
            if (e.target.closest('.tc-driver, a, button')) return;

            drag = {
                it: it,
                id: e.pointerId,
                sx: e.clientX,
                sy: e.clientY,
                dx: 0,
                dy: 0,
                moved: false
            };
            startX = e.clientX;
            startY = e.clientY;

            // PENTING: cegah scroll halaman saat drag di HP
            if (e.pointerType === 'touch') {
                e.preventDefault();
            }
        }

        function onMove(e) {
            if (!drag || e.pointerId !== drag.id) return;

            var dx = e.clientX - drag.sx;
            var dy = e.clientY - drag.sy;

            if (!drag.moved) {
                if (Math.hypot(dx, dy) < 3) return;   // threshold lebih kecil dari 5px
                drag.moved = true;
                drag.it.wrap.classList.add('dragging');
                try { drag.it.wrap.setPointerCapture(e.pointerId); } catch (err) {}
            }

            e.preventDefault();   // cegah scroll

            drag.dx = dx;
            drag.dy = dy;
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
            if (Math.abs(d.dx) > need || Math.abs(d.dy) > need) {
                sendToBack(d.it);
            } else {
                d.it.wrap.style.transform = '';
            }
        }

        function onClick(e) {
            if (suppressClick) { e.stopPropagation(); e.preventDefault(); return; }
            var it = topItem();
            if (!it || !it.wrap.contains(e.target)) return;
            if (!(opt.sendToBackOnClick || isMobile() || lastPointerType === 'touch')) return;
            if (e.target.closest('.tc-driver')) return;
            sendToBack(it);
        }

        // PENTING: pakai passive: false supaya preventDefault() jalan di HP
        container.addEventListener('pointerdown', onDown, { passive: false });
        container.addEventListener('click', onClick, true);
        window.addEventListener('pointermove', onMove, { passive: false });
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

        if (window.__teamStackTop) {
            for (var k = 0; k < items.length && nameOf(topItem()) !== window.__teamStackTop; k++) {
                var t = items.pop();
                items.unshift(t);
            }
        }
        render();
    };
})();