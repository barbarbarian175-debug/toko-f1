/* =====================================================================
   HALAMAN KATALOG BAJU (gaya UGMONK) - diisi otomatis ke #katalog-page
   CARA TAMBAH BAJU: cukup tambah 1 baris di daftar PRODUK di bawah,
   lalu taruh fotonya di folder  assets/images/katalog/
   ===================================================================== */
(function () {
    const FOLDER = 'assets/images/katalog/';          // folder tempat semua foto baju
    const TOKO   = 'Katalog';                  // nama di kiri atas halaman
    const WA     = '62881024689670';           // nomor WhatsApp penjual (awali 62, tanpa 0 / +)                         // nomor WhatsApp penjual untuk checkout, contoh '6281234567890' (kosong = checkout belum aktif)


    /* ---------- PENGATURAN CHECKOUT (ubah sesuai tokomu) ---------- */
    const ONGKIR = [                           // pilihan pengiriman: harga 0 = gratis
        { id: 'ambil',   nama: 'Ambil di tempat',        ket: '',                harga: 0 },
        { id: 'reguler', nama: 'Reguler (JNE / J&T)',    ket: '3-5 hari kerja',  harga: 15000 },
        { id: 'ekspres', nama: 'Ekspres',                ket: '1-2 hari kerja',  harga: 25000 }
    ];
    const BANK = [                             // isi no rekening & atas nama; kosong = dikirim lewat WhatsApp
        { nama: 'BNI',     no: '', an: '' },
        { nama: 'BRI',     no: '', an: '' },
        { nama: 'Mandiri', no: '', an: '' }
    ];
    const KODE_DISKON = { HEMAT10: 0.10 };     // kode diskon: 0.10 = potongan 10%

    /* QRIS: pakai QRIS ASLI tokomu (dari GoPay Merchant, DANA Bisnis, ShopeePay, atau aplikasi bank).
       Cara 1 (disarankan): scan QRIS tokomu dengan aplikasi pembaca QR, lalu tempel teks hasilnya
       (diawali 000201...) di QRIS_TEKS. Nominal pesanan otomatis masuk ke kode QR pembeli.
       Cara 2: simpan gambar QRIS tokomu di assets/images/katalog/ lalu isi nama filenya di QRIS_GAMBAR.   */
    const QRIS_TEKS   = '00020101021126570011ID.DANA.WWW011893600915395590044402099559004440303UMI51440014ID.CO.QRIS.WWW0215ID10254191767360303UMI5204594553033605802ID5909Bar store6015Kota Jakarta Se6105126206304F701';   // QRIS DANA "Bar store"
    const QRIS_GAMBAR = '';                    // contoh 'qris.png'

    /* ---------- gambar besar di atas (taruh file ini di folder yang sama) ---------- */
    const HERO = {
        gambar: 'https://i.pinimg.com/1200x/e0/27/a9/e027a96eece094102e7f34d7a7cc4b4b.jpg',   // foto banner (link atau nama file di assets/images/katalog/)
        warna:  '#c99a82',                     // warna latar kalau foto belum ada
        judul:  'Koleksi Terbaru',
        link:   'Lihat semua'
    };

    /* ---------- DAFTAR PRODUK: ubah / tambah di sini ----------
       nama     : nama baju
       warna    : nama warna (tampil abu-abu di samping nama)
       harga    : angka saja, tanpa titik (contoh 89000)
       gambar   : nama file foto di assets/images/katalog/
       kategori : 'pria' atau 'wanita'
       kode     : (opsional) warna hex untuk gambar cadangan kalau foto belum ada
       link     : (opsional) alamat WA/Shopee/Tokopedia, kartu jadi bisa diklik     */
    const PRODUK = [
        { nama: 'Kaos Pria 01', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/736x/60/35/b0/6035b0cc7efb71ec87eeb54a0afb6653.jpg',  kategori: 'pria' },
        { nama: 'Kaos Pria 02', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/736x/e7/b6/87/e7b687054be2fdf955cd78ea72917f06.jpg',  kategori: 'pria' },
        { nama: 'Kaos Pria 03', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/1200x/70/e2/4c/70e24c956761b0c19a77ecaa7829c577.jpg', kategori: 'pria' },
        { nama: 'Kaos Pria 04', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/1200x/a5/24/17/a52417f06665eb0b00245c63982b3559.jpg', kategori: 'pria' },
        { nama: 'Kaos Pria 05', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/1200x/4f/ec/9d/4fec9d24e67ddec838bd45f628d8d59e.jpg', kategori: 'pria' },
        { nama: 'Kaos Pria 06', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/1200x/ec/63/8b/ec638be416296d6a6d427875ce2f94fc.jpg', kategori: 'pria' },
        { nama: 'Kaos Pria 07', warna: '', harga: 89000, gambar: 'https://i.pinimg.com/1200x/65/69/a1/6569a1bf2fd25635b6826f33c0a7bc47.jpg', kategori: 'pria' },
        { nama: 'Polo Wanita 01', warna: '', harga: 249000, gambar: 'https://i.pinimg.com/1200x/d9/ce/f3/d9cef35302e6f8fd10a1ae4d92ce1db7.jpg', kategori: 'wanita', kode: '#a98466' },
        { nama: 'Polo Wanita 02', warna: '', harga: 249000, gambar: 'https://i.pinimg.com/736x/4c/3b/ca/4c3bca0aa46347e5d16ef3cead776694.jpg',  kategori: 'wanita', kode: '#9aab94' }
    ];



    const TABS = [
        { id: 'semua',  label: 'Semua' },
        { id: 'pria',   label: 'Pria' },
        { id: 'wanita', label: 'Wanita' }
    ];

    // kalau <div id="katalog-page"> belum ada di index.html, dibuat otomatis
    let page = document.getElementById('katalog-page');
    if (!page) {
        page = document.createElement('div');
        page.id = 'katalog-page';
        page.className = 'page';
        const wrapper = document.getElementById('main-wrapper') || document.body;
        wrapper.appendChild(page);
    }

    /* ---------- bantu ---------- */
    function el(tag, cls, text) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    const src = f => /^https?:\/\//.test(f) ? f : FOLDER + f;   // boleh link penuh atau nama file
    const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');
    const ICON_CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8a1.6 1.6 0 0 0 1.6-1.2L20 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>';
    const ICON_HIST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>';
    const ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';

    /* gambar cadangan (kaos / gamis) kalau foto belum ada */
    function cadangan(p) {
        const c = p.kode || '#999';
        const tee = '<path d="M30 14 L14 24 L20 38 L31 33 V86 H69 V33 L80 38 L86 24 L70 14 Q50 26 30 14Z" fill="' + c + '"/>';
        const gamis = '<path d="M38 12 L24 22 L28 40 L36 36 L26 90 H74 L64 36 L72 40 L76 22 L62 12 Q50 22 38 12Z" fill="' + c + '"/>';
        const wrap = document.createElement('div');
        wrap.className = 'kt-fallback';
        wrap.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' + (p.jenis === 'gamis' ? gamis : tee) + '</svg>';
        return wrap;
    }
    function gambarEl(p) {
        const img = new Image();
        img.loading = 'lazy';
        img.alt = p.nama + ' ' + (p.warna || '');
        img.referrerPolicy = 'no-referrer';
        img.src = src(p.gambar);
        img.onerror = () => { img.replaceWith(cadangan(p)); };
        return img;
    }

    /* ---------- KERANJANG (disimpan di browser, tetap ada setelah refresh) ---------- */
    const KEY = 'katalog-keranjang';
    let cart = [];                                   // [{ id, qty }]  id = alamat gambar produk
    try { cart = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { cart = []; }
    if (!Array.isArray(cart)) cart = [];
    const saveCart = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
    const cariProduk = id => PRODUK.find(p => p.gambar === id);
    cart = cart.filter(i => i && cariProduk(i.id) && i.qty > 0);      // buang produk yang sudah dihapus dari daftar

    const jumlahItem = () => cart.reduce((a, i) => a + i.qty, 0);
    const totalHarga = () => cart.reduce((a, i) => a + i.qty * cariProduk(i.id).harga, 0);

    function tambah(p) {
        const f = cart.find(i => i.id === p.gambar);
        if (f) f.qty++; else cart.unshift({ id: p.gambar, qty: 1 });   // yang baru dimasukkan tampil paling atas
        saveCart(); updateHeader(); toast(p.nama + ' ditambahkan ke keranjang');
        cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
    }

    /* ---------- elemen utama ---------- */
    let aktif = 'semua', q = '';
    let sheet, grid, shopView, cartView, checkoutView, histView, cartBody, histList, histClear, histBtn, cartBtn, badge, totalTxt, catSel, tabsBox, cartList, sumBox, toastEl, toastTimer;

    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2000);
    }
    function updateHeader() {
        const n = jumlahItem();
        badge.textContent = n > 99 ? '99+' : String(n);
        badge.hidden = n === 0;
        totalTxt.textContent = '(' + rupiah(totalHarga()) + ')';
        cartBtn.setAttribute('aria-label', 'Keranjang, ' + n + ' barang');
    }

    /* ---------- kartu produk ---------- */
    function kartu(p) {
        const tag = p.link ? 'a' : 'div';
        const card = el(tag, 'kt-card');
        if (p.link) { card.href = p.link; card.target = '_blank'; card.rel = 'noopener'; }
        const box = el('div', 'kt-img');
        box.appendChild(gambarEl(p));
        const nama = el('p', 'kt-name', p.nama);
        if (p.warna) { nama.append(' '); nama.appendChild(el('span', 'kt-color', '(' + p.warna + ')')); }
        const add = el('button', 'kt-add');
        add.type = 'button';
        add.innerHTML = '<span>Tambah ke keranjang</span>' + ICON_CART;
        add.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); tambah(p); });
        card.append(box, nama, el('p', 'kt-price', rupiah(p.harga)), add);
        return card;
    }

    function render() {
        grid.textContent = '';
        const list = PRODUK.filter(p => {
            if (aktif !== 'semua' && p.kategori !== aktif) return false;
            if (!q) return true;
            return (p.nama + ' ' + (p.warna || '') + ' ' + p.kategori).toLowerCase().includes(q);
        });
        if (!list.length) {
            grid.appendChild(el('p', 'kt-empty', q ? 'Tidak ada baju dengan nama "' + q + '".' : 'Belum ada produk di kategori ini.'));
            return;
        }
        list.forEach(p => grid.appendChild(kartu(p)));
    }

    function setKategori(id) {
        aktif = id;
        tabsBox.querySelectorAll('.kt-tab').forEach(x => x.classList.toggle('on', x.dataset.id === id));
        catSel.value = id;
        render();
    }

    /* ---------- tampilan: belanja <-> keranjang ---------- */
    function showShop() {
        cartView.hidden = true;
        checkoutView.hidden = true;
        histView.hidden = true;
        sheet.classList.remove('co');
        shopView.hidden = false;
    }
    function showCart() {
        renderCart();
        shopView.hidden = true;
        checkoutView.hidden = true;
        histView.hidden = true;
        sheet.classList.remove('co');
        cartView.hidden = false;
        sheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderCart() {
        cartList.textContent = '';
        sumBox.textContent = '';
        cartBody.classList.toggle('empty', !cart.length);
        if (!cart.length) {
            const kosong = el('div', 'kt-cart-empty');
            kosong.append(el('p', null, 'Keranjang masih kosong.'));
            const b = el('button', 'kt-btn-line', 'Mulai belanja');
            b.type = 'button';
            b.addEventListener('click', showShop);
            kosong.appendChild(b);
            cartList.appendChild(kosong);
            sumBox.hidden = true;
            return;
        }
        sumBox.hidden = false;
        cart.forEach(item => {
            const p = cariProduk(item.id);
            const row = el('div', 'kt-row');

            const th = el('div', 'kt-row-img');
            th.appendChild(gambarEl(p));

            const nm = el('div', 'kt-row-name', p.nama);
            if (p.warna) nm.appendChild(el('small', null, p.warna));

            const unit = el('div', 'kt-row-unit', rupiah(p.harga));

            const step = el('div', 'kt-step');
            const min = el('button', null, '‹'); min.type = 'button'; min.setAttribute('aria-label', 'Kurangi');
            const val = el('span', null, String(item.qty));
            const plus = el('button', null, '›'); plus.type = 'button'; plus.setAttribute('aria-label', 'Tambah');
            step.append(el('em', null, 'Jumlah'), min, val, plus);
            min.addEventListener('click', () => { if (item.qty > 1) { item.qty--; ubah(); } });
            plus.addEventListener('click', () => { item.qty++; ubah(); });

            const sub = el('div', 'kt-row-sub', rupiah(p.harga * item.qty));

            const del = el('button', 'kt-cancel', 'Batalkan');
            del.type = 'button';
            del.addEventListener('click', () => { cart = cart.filter(i => i !== item); ubah(); });

            row.append(th, nm, unit, step, sub, del);
            cartList.appendChild(row);
        });

        const t = totalHarga();
        sumBox.append(
            el('p', 'kt-sum-title', 'Sub ' + rupiah(t)),
            el('p', 'kt-sum-note', jumlahItem() + ' barang · ongkir dihitung saat checkout'),
            el('p', 'kt-sum-label', 'Total Harga'),
            el('p', 'kt-sum-total', rupiah(t))
        );
        const co = el('button', 'kt-checkout', 'Checkout');
        co.type = 'button';
        co.addEventListener('click', showCheckout);
        sumBox.appendChild(co);
    }
    function ubah() { saveCart(); updateHeader(); renderCart(); }

    /* =====================================================================
       PEMBUAT KODE QR (ditulis sendiri, tanpa internet / library luar)
       + QRIS dinamis: nominal otomatis masuk ke kode QRIS tokomu
       ===================================================================== */
    const QR = (function () {
        const EXP = new Array(512), LOG = new Array(256);
        let x = 1;
        for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
        const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
        function rsGen(n) {
            let g = [1];
            for (let i = 0; i < n; i++) {
                const ng = new Array(g.length + 1).fill(0);
                for (let j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= mul(g[j], EXP[i]); }
                g = ng;
            }
            return g;
        }
        function rsEnc(data, n) {
            const g = rsGen(n), res = new Array(n).fill(0);
            data.forEach(b => {
                const f = b ^ res[0];
                res.shift(); res.push(0);
                if (f) for (let i = 0; i < n; i++) res[i] ^= mul(g[i + 1], f);
            });
            return res;
        }
        /* tingkat koreksi M: [ec per blok, blok grup1, data grup1, blok grup2, data grup2] */
        const T = [null,
            [10,1,16,0,0],[16,1,28,0,0],[26,1,44,0,0],[18,2,32,0,0],[24,2,43,0,0],[16,4,27,0,0],[18,4,31,0,0],
            [22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44],[30,1,50,4,51],[22,6,36,2,37],[22,8,37,1,38],
            [24,4,40,5,41],[24,5,41,5,42],[28,7,45,3,46],[28,10,46,1,47],[26,9,43,4,44],[26,3,44,11,45],[26,3,41,13,42]];
        const ALIGN = [null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],
            [6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90]];
        const dataCW = v => T[v][1] * T[v][2] + T[v][3] * T[v][4];
        const bit = (n, i) => ((n >>> i) & 1) === 1;

        function utf8(s) {
            const out = [];
            for (const ch of unescape(encodeURIComponent(s))) out.push(ch.charCodeAt(0));
            return out;
        }

        function buat(teks) {
            const bytes = utf8(teks);
            let v = 1;
            for (; v <= 20; v++) {
                const cc = v < 10 ? 8 : 16;
                if (4 + cc + bytes.length * 8 <= dataCW(v) * 8) break;
            }
            if (v > 20) return null;                                  // terlalu panjang

            /* susun bit data */
            const bits = [];
            const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
            put(4, 4); put(bytes.length, v < 10 ? 8 : 16);
            bytes.forEach(b => put(b, 8));
            const cap = dataCW(v) * 8;
            put(0, Math.min(4, cap - bits.length));
            while (bits.length % 8) bits.push(0);
            const cw = [];
            for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; cw.push(b); }
            for (let p = 0; cw.length < dataCW(v); p ^= 1) cw.push(p ? 0x11 : 0xEC);

            /* bagi blok + koreksi kesalahan, lalu selang-seling */
            const [ec, b1, d1, b2, d2] = T[v];
            const blocks = [], eccs = [];
            let pos = 0;
            for (let i = 0; i < b1 + b2; i++) {
                const len = i < b1 ? d1 : d2;
                const blk = cw.slice(pos, pos + len); pos += len;
                blocks.push(blk); eccs.push(rsEnc(blk, ec));
            }
            const all = [];
            for (let i = 0; i < Math.max(d1, d2); i++) blocks.forEach(b => { if (i < b.length) all.push(b[i]); });
            for (let i = 0; i < ec; i++) eccs.forEach(e => all.push(e[i]));

            /* matriks */
            const size = 17 + 4 * v;
            const m = Array.from({ length: size }, () => new Array(size).fill(false));
            const fn = Array.from({ length: size }, () => new Array(size).fill(false));
            const set = (x, y, val) => { m[y][x] = val; fn[y][x] = true; };

            for (let i = 0; i < size; i++) { if (i > 7 && i < size - 8) { set(i, 6, i % 2 === 0); set(6, i, i % 2 === 0); } }
            [[0, 0], [size - 7, 0], [0, size - 7]].forEach(([fx, fy]) => {
                for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
                    const x = fx + dx, y = fy + dy;
                    if (x < 0 || y < 0 || x >= size || y >= size) continue;
                    const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
                    set(x, y, inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)));
                }
            });
            const ap = ALIGN[v];
            ap.forEach((ay, i) => ap.forEach((ax, j) => {
                const last = ap.length - 1;
                if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
                for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
            }));
            if (v >= 7) {
                let rem = v;
                for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
                const vb = (v << 12) | rem;
                for (let i = 0; i < 18; i++) { const a = size - 11 + (i % 3), b = Math.floor(i / 3); set(a, b, bit(vb, i)); set(b, a, bit(vb, i)); }
            }
            const formatBits = mask => {
                const d = mask;                                           // tingkat M = 00
                let rem = d;
                for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
                const bits = ((d << 10) | rem) ^ 0x5412;
                for (let i = 0; i <= 5; i++) set(8, i, bit(bits, i));
                set(8, 7, bit(bits, 6)); set(8, 8, bit(bits, 7)); set(7, 8, bit(bits, 8));
                for (let i = 9; i < 15; i++) set(14 - i, 8, bit(bits, i));
                for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(bits, i));
                for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(bits, i));
                set(8, size - 8, true);
            };
            formatBits(0);                                                // sekadar menandai area

            /* tempatkan data zig-zag */
            let k = 0;
            for (let right = size - 1; right >= 1; right -= 2) {
                if (right === 6) right = 5;
                for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
                    const x = right - j;
                    const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
                    if (!fn[y][x] && k < all.length * 8) { m[y][x] = bit(all[k >>> 3], 7 - (k & 7)); k++; }
                }
            }

            const mask = (mk, grid) => {
                for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
                    let inv;
                    switch (mk) {
                        case 0: inv = (x + y) % 2 === 0; break;
                        case 1: inv = y % 2 === 0; break;
                        case 2: inv = x % 3 === 0; break;
                        case 3: inv = (x + y) % 3 === 0; break;
                        case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
                        case 5: inv = ((x * y) % 2) + ((x * y) % 3) === 0; break;
                        case 6: inv = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
                        default: inv = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
                    }
                    if (!fn[y][x] && inv) grid[y][x] = !grid[y][x];
                }
            };
            const penalty = g => {
                let p = 0, dark = 0;
                const line = (get) => {
                    for (let a = 0; a < size; a++) {
                        let run = 1;
                        for (let b = 1; b < size; b++) {
                            if (get(a, b) === get(a, b - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1;
                        }
                        for (let b = 0; b + 10 < size; b++) {
                            const s = [];
                            for (let t = 0; t < 11; t++) s.push(get(a, b + t) ? 1 : 0);
                            const j = s.join('');
                            if (j === '10111010000' || j === '00001011101') p += 40;
                        }
                    }
                };
                line((a, b) => g[a][b]);
                line((a, b) => g[b][a]);
                for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
                    if (g[y][x]) dark++;
                    if (x < size - 1 && y < size - 1 && g[y][x] === g[y][x + 1] && g[y][x] === g[y + 1][x] && g[y][x] === g[y + 1][x + 1]) p += 3;
                }
                p += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
                return p;
            };
            let best = null, bestP = Infinity, bestMask = 0;
            for (let mk = 0; mk < 8; mk++) {
                const g = m.map(r => r.slice());
                mask(mk, g);
                const pn = penalty(g);
                if (pn < bestP) { bestP = pn; best = g; bestMask = mk; }
            }
            for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) m[y][x] = best[y][x];
            formatBits(bestMask);
            return { size, modules: m, versi: v };
        }

        /* gambar SVG (zona tenang 4 modul supaya mudah di-scan) */
        function svg(teks, px) {
            const q = buat(teks);
            if (!q) return '';
            const n = q.size + 8;
            let d = '';
            for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.modules[y][x]) d += 'M' + (x + 4) + ',' + (y + 4) + 'h1v1h-1z';
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="' + px + '" height="' + px + '" shape-rendering="crispEdges" role="img" aria-label="Kode QR"><rect width="' + n + '" height="' + n + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
        }
        return { buat, svg, T, dataCW };
    })();

    /* ---------- QRIS: cek, hitung CRC, dan isi nominal otomatis ---------- */
    function crc16(s) {
        let c = 0xFFFF;
        for (let i = 0; i < s.length; i++) {
            c ^= s.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
        }
        return c.toString(16).toUpperCase().padStart(4, '0');
    }
    function tlv(s) {                                                   // pecah kode QRIS jadi bagian-bagian
        const out = [];
        let i = 0;
        while (i + 4 <= s.length) {
            const tag = s.substr(i, 2), len = parseInt(s.substr(i + 2, 2), 10);
            if (isNaN(len) || i + 4 + len > s.length) return null;
            out.push([tag, s.substr(i + 4, len)]);
            i += 4 + len;
        }
        return i === s.length ? out : null;
    }
    function qrisDinamis(statis, nominal) {
        const s = (statis || '').replace(/[\r\n]+/g, '').trim();
        if (!s.startsWith('000201') || s.length < 40) return null;
        if (crc16(s.slice(0, -4)) !== s.slice(-4).toUpperCase()) return null;   // kode QRIS rusak / salah salin
        const parts = tlv(s.slice(0, -8));
        if (!parts) return null;
        const hasil = [];
        let sisip = false;
        const amt = String(Math.round(nominal));
        parts.forEach(([tag, val]) => {
            if (tag === '54' || tag === '63') return;
            if (!sisip && tag > '54') { hasil.push(['54', amt]); sisip = true; }
            hasil.push([tag, tag === '01' ? '12' : val]);                // 11 = statis, 12 = dinamis
        });
        if (!sisip) hasil.push(['54', amt]);
        const p = hasil.map(([t, v]) => t + String(v.length).padStart(2, '0') + v).join('') + '6304';
        return p + crc16(p);
    }

    /* =====================================================================
       CHECKOUT (gaya Shopify, bahasa Indonesia)
       ===================================================================== */
    const PROV = ['Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau','Jambi','Sumatera Selatan','Bangka Belitung','Bengkulu','Lampung','DKI Jakarta','Banten','Jawa Barat','Jawa Tengah','DI Yogyakarta','Jawa Timur','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara','Maluku','Maluku Utara','Papua','Papua Barat','Papua Selatan','Papua Tengah','Papua Pegunungan','Papua Barat Daya'];
    const BAYAR = [
        { id: 'transfer', nama: 'Transfer Bank',          chips: BANK.map(b => b.nama) },
        { id: 'qris',     nama: 'QRIS',                   chips: [] },
        { id: 'ewallet',  nama: 'E-Wallet (GoPay, OVO, DANA)', chips: [] },
        { id: 'cod',      nama: 'Bayar di tempat (COD)',  chips: [] }
    ];
    const INFO_KEY = 'katalog-info';           // format lama (dipindahkan otomatis)
    const ALAMAT_KEY = 'katalog-alamat';
    const FIELDS = ['kontak','depan','belakang','alamat','detail','kota','provinsi','pos','telp'];
    const co = { ongkir: (ONGKIR[1] || ONGKIR[0]).id, bayar: 'transfer', kode: '', persen: 0 };
    let sumRefs = {};

    const ongkirDipilih = () => ONGKIR.find(o => o.id === co.ongkir) || ONGKIR[0];
    function hitung() {
        const sub = totalHarga();
        const diskon = Math.round(sub * co.persen);
        const ongkir = ongkirDipilih().harga;
        return { sub, diskon, ongkir, total: sub - diskon + ongkir };
    }
    /* ---------- BUKU ALAMAT (disimpan di browser) ---------- */
    function muatAlamat() {
        let l = [];
        try { l = JSON.parse(localStorage.getItem(ALAMAT_KEY) || '[]'); } catch (e) { l = []; }
        if (!Array.isArray(l)) l = [];
        try {                                                   // pindahkan alamat tunggal versi lama
            const lama = JSON.parse(localStorage.getItem(INFO_KEY) || 'null');
            if (lama && lama.alamat && !l.length) {
                l = [Object.assign({ id: 'a' + Date.now().toString(36) }, lama)];
                localStorage.setItem(ALAMAT_KEY, JSON.stringify(l));
            }
            if (lama) localStorage.removeItem(INFO_KEY);
        } catch (e) {}
        return l.filter(a => a && a.id && a.alamat);
    }
    function simpanAlamat(l) { try { localStorage.setItem(ALAMAT_KEY, JSON.stringify(l.slice(0, 10))); } catch (e) {} }
    const labelAlamat = a => ((a.depan || '') + ' ' + (a.belakang || '')).trim() + ' · ' + a.alamat.slice(0, 34) + (a.alamat.length > 34 ? '…' : '') + ', ' + a.kota;

    /* kolom isian dengan label yang naik saat diisi */
    function kolom(label, name, o) {
        o = o || {};
        const w = el('label', 'kt-f' + (o.select ? ' sel' : ''));
        let inp;
        if (o.select) {
            inp = el('select');
            const k = el('option', null, ''); k.value = ''; inp.appendChild(k);
            o.select.forEach(v => { const op = el('option', null, v); op.value = v; inp.appendChild(op); });
            if (o.def) inp.value = o.def;
        } else {
            inp = el('input'); inp.type = o.type || 'text'; inp.placeholder = ' ';
            if (o.mode) inp.inputMode = o.mode;
        }
        inp.name = name;
        if (o.auto) inp.autocomplete = o.auto;
        inp.dataset.req = o.req ? '1' : '';
        inp.addEventListener('input', () => { w.classList.remove('bad'); });
        const sp = el('span', null, label + (o.req || o.def ? '' : ' (opsional)'));
        const er = el('small', 'kt-err', '');
        w.append(inp, sp, er);
        return w;
    }
    const baris = (...k) => { const r = el('div', 'kt-frow c' + k.length); r.append(...k); return r; };
    const judul = (t, s) => { const d = el('div', 'kt-co-h'); d.appendChild(el('h3', null, t)); if (s) d.appendChild(el('p', null, s)); return d; };

    function renderRingkasan() {
        const h = hitung();
        sumRefs.sub.textContent = rupiah(h.sub);
        sumRefs.diskonRow.hidden = h.diskon === 0;
        sumRefs.diskon.textContent = '- ' + rupiah(h.diskon);
        sumRefs.ongkir.textContent = h.ongkir === 0 ? 'Gratis' : rupiah(h.ongkir);
        sumRefs.total.textContent = rupiah(h.total);
    }

    function showCheckout() {
        if (!cart.length) return;
        buildCheckout();
        shopView.hidden = true;
        cartView.hidden = true;
        histView.hidden = true;
        checkoutView.hidden = false;
        sheet.classList.add('co');
        sheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function buildCheckout() {
        checkoutView.textContent = '';
        let alamatList = muatAlamat();
        const wrap = el('div', 'kt-co');

        /* ---------- KIRI: formulir ---------- */
        const left = el('div', 'kt-co-left');
        const inner = el('div', 'kt-co-inner');
        inner.appendChild(el('div', 'kt-co-brand', TOKO));

        const nav = el('nav', 'kt-crumb');
        const c1 = el('a', null, 'Keranjang'); c1.href = '#';
        c1.addEventListener('click', e => { e.preventDefault(); showCart(); });
        nav.append(c1, el('i', null, '›'), el('b', null, 'Pengiriman & Pembayaran'));
        inner.appendChild(nav);

        const form = el('form', 'kt-co-form');
        form.noValidate = true;

        /* kontak */
        form.appendChild(judul('Kontak'));
        form.appendChild(kolom('Email atau nomor HP', 'kontak', { req: true, auto: 'email' }));

        /* alamat */
        form.appendChild(judul('Alamat pengiriman'));
        let pilih = null, hapus = null, swrap = null;
        const isiOpsi = idPilih => {
            pilih.textContent = '';
            const o0 = el('option', null, '+ Pakai alamat baru'); o0.value = ''; pilih.appendChild(o0);
            alamatList.forEach(a => { const o = el('option', null, labelAlamat(a)); o.value = a.id; pilih.appendChild(o); });
            pilih.value = idPilih || '';
        };
        if (alamatList.length) {
            swrap = el('div', 'kt-saved');
            const lb = el('label', 'kt-f sel');
            pilih = el('select'); pilih.name = 'tersimpan'; pilih.dataset.req = '';
            lb.append(pilih, el('span', null, 'Alamat tersimpan'), el('small', 'kt-err', ''));
            hapus = el('button', 'kt-del-addr', 'Hapus alamat ini'); hapus.type = 'button'; hapus.hidden = true;
            swrap.append(lb, hapus);
            form.appendChild(swrap);
        }
        form.appendChild(kolom('Negara', 'negara', { select: ['Indonesia'], def: 'Indonesia' }));
        form.appendChild(baris(kolom('Nama depan', 'depan', { req: true, auto: 'given-name' }), kolom('Nama belakang', 'belakang', { auto: 'family-name' })));
        form.appendChild(kolom('Alamat lengkap (jalan, nomor rumah, RT/RW)', 'alamat', { req: true, auto: 'street-address' }));
        form.appendChild(kolom('Kelurahan, kecamatan, patokan', 'detail'));
        form.appendChild(baris(kolom('Kota / Kabupaten', 'kota', { req: true }), kolom('Provinsi', 'provinsi', { req: true, select: PROV }), kolom('Kode pos', 'pos', { req: true, mode: 'numeric', auto: 'postal-code' })));
        form.appendChild(kolom('Nomor HP / WhatsApp', 'telp', { req: true, type: 'tel', auto: 'tel' }));

        const simpan = el('label', 'kt-check');
        const cb = el('input'); cb.type = 'checkbox'; cb.name = 'simpan'; cb.checked = true;
        simpan.append(cb, el('span', null, 'Simpan alamat ini untuk checkout berikutnya'));
        form.appendChild(simpan);

        /* metode pengiriman */
        form.appendChild(judul('Metode pengiriman'));
        const boxS = el('div', 'kt-box');
        ONGKIR.forEach(o => {
            const row = el('label', 'kt-opt');
            const r = el('input'); r.type = 'radio'; r.name = 'ongkir'; r.value = o.id; r.checked = o.id === co.ongkir;
            r.addEventListener('change', () => { co.ongkir = o.id; renderRingkasan(); });
            const t = el('span', 'kt-opt-t', o.nama);
            if (o.ket) t.appendChild(el('small', null, o.ket));
            row.append(r, t, el('b', 'kt-opt-p', o.harga === 0 ? 'Gratis' : rupiah(o.harga)));
            boxS.appendChild(row);
        });
        form.appendChild(boxS);

        /* pembayaran */
        form.appendChild(judul('Pembayaran', 'Semua transaksi aman. Petunjuk bayar dikirim lewat WhatsApp setelah pesanan dibuat.'));
        const boxP = el('div', 'kt-box');
        BAYAR.forEach(m => {
            const row = el('div', 'kt-pay' + (m.id === co.bayar ? ' open' : ''));
            const head = el('label', 'kt-opt');
            const r = el('input'); r.type = 'radio'; r.name = 'bayar'; r.value = m.id; r.checked = m.id === co.bayar;
            head.append(r, el('span', 'kt-opt-t', m.nama));
            if (m.chips.length) { const ch = el('span', 'kt-chips'); m.chips.forEach(c => ch.appendChild(el('i', null, c))); head.appendChild(ch); }
            const det = el('div', 'kt-pay-det');
            if (m.id === 'transfer') {
                det.appendChild(el('p', null, 'Transfer sesuai total pesanan ke salah satu rekening di bawah, lalu kirim bukti transfer lewat WhatsApp.'));
                BANK.forEach(b => { const li = el('p', 'kt-bank'); li.append(el('b', null, b.nama), el('span', null, b.no ? b.no + (b.an ? ' · a.n. ' + b.an : '') : 'nomor rekening dikirim lewat WhatsApp')); det.appendChild(li); });
            } else if (m.id === 'qris') det.appendChild(el('p', null, 'Kode QRIS dikirim lewat WhatsApp setelah pesanan dibuat. Bisa dibayar dari aplikasi bank atau e-wallet apa saja.'));
            else if (m.id === 'ewallet') det.appendChild(el('p', null, 'Nomor GoPay, OVO, atau DANA penjual dikirim lewat WhatsApp setelah pesanan dibuat.'));
            else det.appendChild(el('p', null, 'Bayar tunai saat barang sampai. Tersedia untuk area tertentu, penjual akan konfirmasi lewat WhatsApp.'));
            r.addEventListener('change', () => { co.bayar = m.id; boxP.querySelectorAll('.kt-pay').forEach(x => x.classList.toggle('open', x === row)); });
            row.append(head, det);
            boxP.appendChild(row);
        });
        form.appendChild(boxP);

        /* tombol */
        const act = el('div', 'kt-co-act');
        const back = el('a', null, '‹ Kembali ke keranjang'); back.href = '#';
        back.addEventListener('click', e => { e.preventDefault(); showCart(); });
        const pay = el('button', 'kt-pay-now', 'Bayar sekarang'); pay.type = 'submit';
        act.append(back, pay);
        form.appendChild(act);
        form.addEventListener('submit', e => { e.preventDefault(); kirimPesanan(form); });

        inner.appendChild(form);
        const foot = el('div', 'kt-co-foot');
        foot.append(el('span', null, 'Kebijakan pengembalian'), el('span', null, 'Kebijakan pengiriman'), el('span', null, 'Syarat & ketentuan'));
        inner.appendChild(foot);
        left.appendChild(inner);

        /* alamat tersimpan: pilih / isi otomatis / hapus */
        const isi = a => {
            FIELDS.forEach(n => {
                const f = form.elements[n];
                if (!f) return;
                if (a) f.value = a[n] || ''; else if (n !== 'kontak') f.value = '';
            });
            form.querySelectorAll('.kt-f').forEach(w => { w.classList.remove('bad'); const er = w.querySelector('.kt-err'); if (er) er.textContent = ''; });
            if (hapus) hapus.hidden = !a;
        };
        if (pilih) {
            pilih.addEventListener('change', () => isi(alamatList.find(x => x.id === pilih.value) || null));
            hapus.addEventListener('click', () => {
                alamatList = alamatList.filter(x => x.id !== pilih.value);
                simpanAlamat(alamatList);
                if (!alamatList.length) swrap.hidden = true; else isiOpsi('');
                isi(null);
            });
            isiOpsi(alamatList[0].id);
            isi(alamatList[0]);
        }

        /* ---------- KANAN: ringkasan pesanan ---------- */
        const right = el('aside', 'kt-co-right');
        const rin = el('div', 'kt-co-inner');
        const list = el('div', 'kt-co-items');
        cart.forEach(it => {
            const p = cariProduk(it.id);
            const row = el('div', 'kt-co-item');
            const th = el('div', 'kt-co-th'); th.appendChild(gambarEl(p));
            th.appendChild(el('b', null, String(it.qty)));
            const nm = el('div', 'kt-co-nm', p.nama);
            if (p.warna) nm.appendChild(el('small', null, p.warna));
            row.append(th, nm, el('span', 'kt-co-pr', rupiah(p.harga * it.qty)));
            list.appendChild(row);
        });
        rin.appendChild(list);

        const dc = el('div', 'kt-disc');
        const dIn = el('input'); dIn.type = 'text'; dIn.placeholder = 'Kode diskon'; dIn.value = co.kode; dIn.autocomplete = 'off';
        const dBtn = el('button', null, 'Terapkan'); dBtn.type = 'button'; dBtn.disabled = !dIn.value.trim();
        const dMsg = el('small', 'kt-disc-msg', co.persen ? 'Kode ' + co.kode + ' dipakai (potongan ' + Math.round(co.persen * 100) + '%).' : '');
        dIn.addEventListener('input', () => { dBtn.disabled = !dIn.value.trim(); });
        const pakai = () => {
            const k = dIn.value.trim().toUpperCase();
            if (!k) return;
            if (KODE_DISKON[k]) { co.kode = k; co.persen = KODE_DISKON[k]; dMsg.textContent = 'Kode ' + k + ' dipakai (potongan ' + Math.round(co.persen * 100) + '%).'; dMsg.className = 'kt-disc-msg ok'; }
            else { co.kode = ''; co.persen = 0; dMsg.textContent = 'Kode diskon tidak valid.'; dMsg.className = 'kt-disc-msg bad'; }
            renderRingkasan();
        };
        dBtn.addEventListener('click', pakai);
        dIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); pakai(); } });
        dc.append(dIn, dBtn);
        rin.append(dc, dMsg);

        const tot = el('div', 'kt-co-tot');
        const r1 = el('p'); r1.append(el('span', null, 'Subtotal'), sumRefs.sub = el('b'));
        const r2 = el('p'); r2.append(el('span', null, 'Diskon'), sumRefs.diskon = el('b')); sumRefs.diskonRow = r2;
        const r3 = el('p'); r3.append(el('span', null, 'Ongkos kirim'), sumRefs.ongkir = el('b'));
        const r4 = el('p', 'grand'); const tb = el('span', 'amt'); tb.append(el('small', null, 'IDR'), sumRefs.total = el('strong'));
        r4.append(el('span', null, 'Total'), tb);
        tot.append(r1, r2, r3, r4);
        rin.appendChild(tot);
        right.appendChild(rin);

        wrap.append(left, right);
        checkoutView.appendChild(wrap);
        renderRingkasan();
    }

    function kirimPesanan(form) {
        /* cek isian wajib */
        let pertama = null;
        form.querySelectorAll('.kt-f').forEach(w => {
            const inp = w.querySelector('input,select');
            let msg = '';
            const v = inp.value.trim();
            if (inp.dataset.req && !v) msg = 'Wajib diisi';
            else if (inp.name === 'kontak' && v && !(v.includes('@') || v.replace(/\D/g, '').length >= 8)) msg = 'Masukkan email atau nomor HP yang benar';
            else if (inp.name === 'pos' && v && !/^\d{5}$/.test(v)) msg = 'Kode pos 5 angka';
            else if (inp.name === 'telp' && v && v.replace(/\D/g, '').length < 8) msg = 'Nomor HP tidak valid';
            w.classList.toggle('bad', !!msg);
            w.querySelector('.kt-err').textContent = msg;
            if (msg && !pertama) pertama = inp;
        });
        if (pertama) { pertama.focus(); return; }

        const f = n => form.elements[n].value.trim();
        const data = {};
        ['kontak','depan','belakang','alamat','detail','kota','provinsi','pos','telp'].forEach(n => data[n] = f(n));
        if (form.elements.simpan.checked) {
            const l = muatAlamat();
            const sama = l.findIndex(a => (a.alamat || '').toLowerCase() === data.alamat.toLowerCase() && a.pos === data.pos && (a.depan || '').toLowerCase() === data.depan.toLowerCase());
            const rec = Object.assign({ id: sama >= 0 ? l[sama].id : 'a' + Date.now().toString(36) }, data);
            if (sama >= 0) l.splice(sama, 1);
            l.unshift(rec);                                      // alamat yang baru dipakai ada paling atas
            simpanAlamat(l);
        }

        const h = hitung();
        const pesanan = {
            no: 'KT-' + Date.now().toString(36).toUpperCase().slice(-6),
            item: cart.map(i => { const p = cariProduk(i.id); return { id: i.id, nama: p.nama + (p.warna ? ' (' + p.warna + ')' : ''), qty: i.qty, harga: p.harga }; }),
            h, data,
            kirim: ongkirDipilih().nama,
            bayar: (BAYAR.find(m => m.id === co.bayar) || {}).nama,
            bayarId: co.bayar,
            tgl: Date.now(),
            kode: co.kode
        };
        catatRiwayat(pesanan);
        cart = []; saveCart(); updateHeader();
        co.kode = ''; co.persen = 0;
        /* buka WhatsApp penjual dengan pesan pesanan (tinggal tekan kirim) */
        if (WA) { try { window.open(urlWA(pesanan), '_blank', 'noopener'); } catch (e) {} }
        tampilSelesai(pesanan);
    }

    const urlWA = o => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(teksWA(o));

    function teksWA(o) {
        const d = o.data;
        const baris = o.item.map(i => '- ' + i.nama + ' x' + i.qty + ' = ' + rupiah(i.harga * i.qty));
        return ['Halo, saya mau pesan (No. ' + o.no + '):', ...baris, '',
            'Subtotal: ' + rupiah(o.h.sub),
            o.h.diskon ? 'Diskon (' + o.kode + '): -' + rupiah(o.h.diskon) : null,
            'Ongkir (' + o.kirim + '): ' + (o.h.ongkir ? rupiah(o.h.ongkir) : 'Gratis'),
            'Total: ' + rupiah(o.h.total), '',
            'Nama: ' + d.depan + ' ' + d.belakang,
            'Alamat: ' + d.alamat + (d.detail ? ', ' + d.detail : '') + ', ' + d.kota + ', ' + d.provinsi + ' ' + d.pos,
            'HP: ' + d.telp, 'Kontak: ' + d.kontak,
            'Pembayaran: ' + o.bayar].filter(x => x !== null).join('\n');
    }

    function qrisBlok(total) {
        const box = el('div', 'kt-qris');
        box.appendChild(el('h3', null, 'Scan untuk membayar'));
        const nominal = rupiah(total);
        const payload = QRIS_TEKS ? qrisDinamis(QRIS_TEKS, total) : null;
        if (QRIS_TEKS && !payload) console.warn('QRIS_TEKS tidak valid: salin ulang teks QRIS lengkap (diawali 000201).');
        const svg = payload ? QR.svg(payload, 240) : '';
        if (svg) {
            const h = el('div', 'kt-qr'); h.innerHTML = svg; box.appendChild(h);
            box.appendChild(el('p', 'kt-qris-amt', nominal));
            box.appendChild(el('p', 'kt-done-note', 'Nominal sudah terisi otomatis. Buka aplikasi bank atau e-wallet, pilih scan QR, lalu bayar. Setelah itu kirim bukti pembayaran lewat WhatsApp.'));
        } else if (QRIS_GAMBAR) {
            const h = el('div', 'kt-qr'); const im = new Image(); im.alt = 'QRIS'; im.referrerPolicy = 'no-referrer'; im.src = src(QRIS_GAMBAR);
            h.appendChild(im); box.appendChild(h);
            box.appendChild(el('p', 'kt-qris-amt', nominal));
            box.appendChild(el('p', 'kt-done-note', 'Scan lalu masukkan nominal ' + nominal + ' secara manual. Setelah bayar, kirim bukti pembayaran lewat WhatsApp.'));
        } else {
            box.appendChild(el('p', 'kt-done-note', 'Kode QRIS dikirim penjual lewat WhatsApp.'));
        }
        return box;
    }

    function tampilSelesai(o) {
        checkoutView.textContent = '';
        const box = el('div', 'kt-done');
        box.appendChild(el('div', 'kt-done-ic', '✓'));
        box.appendChild(el('h2', null, 'Pesanan dibuat'));
        box.appendChild(el('p', 'kt-done-no', 'Nomor pesanan ' + o.no));
        const rin = el('div', 'kt-done-list');
        o.item.forEach(i => { const r = el('p'); r.append(el('span', null, i.nama + ' × ' + i.qty), el('b', null, rupiah(i.harga * i.qty))); rin.appendChild(r); });
        const tt = el('p', 'grand'); tt.append(el('span', null, 'Total (' + o.bayar + ')'), el('b', null, rupiah(o.h.total)));
        rin.appendChild(tt);
        box.appendChild(rin);
        if (o.bayarId === 'qris') box.appendChild(qrisBlok(o.h.total));
        if (WA) {
            box.appendChild(el('p', 'kt-done-note', 'WhatsApp penjual sudah dibuka dengan pesan pesananmu. Tekan kirim di sana. Kalau belum terbuka, tekan tombol di bawah.'));
            const wa = el('a', 'kt-pay-now', 'Kirim pesanan lewat WhatsApp');
            wa.href = urlWA(o);
            wa.target = '_blank'; wa.rel = 'noopener';
            box.appendChild(wa);
        } else {
            box.appendChild(el('p', 'kt-done-note', 'Nomor WhatsApp penjual belum diisi di katalog.js (bagian WA), jadi pesanan belum bisa dikirim otomatis.'));
        }
        const lagi = el('button', 'kt-btn-line', 'Kembali belanja'); lagi.type = 'button';
        lagi.addEventListener('click', showShop);
        const rw = el('button', 'kt-btn-line', 'Lihat riwayat pembelian'); rw.type = 'button';
        rw.addEventListener('click', showHist);
        const dua = el('div', 'kt-done-btns'); dua.append(lagi, rw);
        box.appendChild(dua);
        checkoutView.appendChild(box);
        sheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* =====================================================================
       RIWAYAT PEMBELIAN (disimpan di browser pembeli)
       ===================================================================== */
    const RIWAYAT_KEY = 'katalog-riwayat';
    function muatRiwayat() {
        let l = [];
        try { l = JSON.parse(localStorage.getItem(RIWAYAT_KEY) || '[]'); } catch (e) { l = []; }
        return Array.isArray(l) ? l.filter(o => o && o.no && Array.isArray(o.item) && o.h) : [];
    }
    function simpanRiwayat(l) { try { localStorage.setItem(RIWAYAT_KEY, JSON.stringify(l.slice(0, 30))); } catch (e) {} }
    function catatRiwayat(o) { const l = muatRiwayat(); l.unshift(o); simpanRiwayat(l); }

    function showHist() {
        renderHist();
        shopView.hidden = true;
        cartView.hidden = true;
        checkoutView.hidden = true;
        sheet.classList.remove('co');
        histView.hidden = false;
        sheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function beliLagi(o) {
        let ada = 0, hilang = 0;
        o.item.forEach(i => {
            if (!cariProduk(i.id)) { hilang++; return; }
            const f = cart.find(c => c.id === i.id);
            if (f) f.qty += i.qty; else cart.push({ id: i.id, qty: i.qty });
            ada++;
        });
        saveCart(); updateHeader();
        if (!ada) { toast('Produk pada pesanan ini sudah tidak tersedia'); return; }
        showCart();
        if (hilang) toast('Sebagian produk sudah tidak tersedia');
    }

    function lihatQR(o) {
        shopView.hidden = true; cartView.hidden = true; histView.hidden = true;
        checkoutView.hidden = false;
        sheet.classList.add('co');
        tampilSelesai(o);
    }

    function renderHist() {
        histList.textContent = '';
        const l = muatRiwayat();
        histClear.hidden = !l.length;
        if (!l.length) {
            const kosong = el('div', 'kt-cart-empty');
            kosong.append(el('p', null, 'Belum ada pembelian.'));
            const b = el('button', 'kt-btn-line', 'Mulai belanja'); b.type = 'button';
            b.addEventListener('click', showShop);
            kosong.appendChild(b);
            histList.appendChild(kosong);
            return;
        }
        l.forEach(o => {
            const card = el('article', 'kt-order');
            const head = el('div', 'kt-order-head');
            const tgl = new Date(o.tgl || Date.now()).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            head.append(el('b', null, o.no), el('span', null, tgl));
            card.appendChild(head);

            const items = el('div', 'kt-order-items');
            o.item.forEach(i => {
                const r = el('p');
                r.append(el('span', null, i.nama + ' × ' + i.qty), el('b', null, rupiah(i.harga * i.qty)));
                items.appendChild(r);
            });
            card.appendChild(items);

            const meta = [];
            if (o.kirim) meta.push('Kirim: ' + o.kirim + (o.h.ongkir ? ' (' + rupiah(o.h.ongkir) + ')' : ' (gratis)'));
            if (o.h.diskon) meta.push('Diskon: -' + rupiah(o.h.diskon));
            if (o.bayar) meta.push('Bayar: ' + o.bayar);
            if (o.data && o.data.kota) meta.push('Tujuan: ' + o.data.kota);
            card.appendChild(el('p', 'kt-order-meta', meta.join(' · ')));

            const foot = el('div', 'kt-order-foot');
            const tot = el('p', 'kt-order-total'); tot.append(el('small', null, 'Total'), el('b', null, rupiah(o.h.total)));
            foot.appendChild(tot);
            const acts = el('div', 'kt-order-acts');
            const mk = (t, fn, cls) => { const b = el('button', cls || 'kt-btn-line', t); b.type = 'button'; b.addEventListener('click', fn); acts.appendChild(b); return b; };
            if (o.bayarId === 'qris') mk('Lihat QR bayar', () => lihatQR(o));
            if (WA) mk('Kirim ulang ke WhatsApp', () => window.open(urlWA(o), '_blank', 'noopener'));
            mk('Beli lagi', () => beliLagi(o));
            mk('Hapus', () => {
                if (!confirm('Hapus pesanan ' + o.no + ' dari riwayat?')) return;
                simpanRiwayat(muatRiwayat().filter(x => x.no !== o.no));
                renderHist();
            }, 'kt-cancel');
            foot.appendChild(acts);
            card.appendChild(foot);
            histList.appendChild(card);
        });
    }

    /* ---------- bangun halaman ---------- */
    function bangun() {
        page.textContent = '';
        sheet = el('div', 'kt-sheet');

        /* header: nama toko | kolom cari + keranjang di kanan */
        const bar = el('header', 'kt-bar');
        bar.appendChild(el('span', 'kt-brand', TOKO));

        const right = el('div', 'kt-bar-right');
        const pill = el('div', 'kt-search');
        catSel = el('select');
        catSel.setAttribute('aria-label', 'Kategori');
        TABS.forEach(t => { const o = el('option', null, t.id === 'semua' ? 'Kategori' : t.label); o.value = t.id; catSel.appendChild(o); });
        catSel.addEventListener('change', () => { showShop(); setKategori(catSel.value); });
        const inp = el('input');
        inp.type = 'search';
        inp.placeholder = 'Cari nama baju';
        inp.setAttribute('aria-label', 'Cari nama baju');
        inp.addEventListener('input', () => { q = inp.value.trim().toLowerCase(); showShop(); render(); });
        const go = el('button');
        go.type = 'button';
        go.setAttribute('aria-label', 'Cari');
        go.innerHTML = ICON_SEARCH;
        go.addEventListener('click', () => { showShop(); inp.focus(); });
        pill.append(catSel, inp, go);

        cartBtn = el('button', 'kt-cart');
        cartBtn.type = 'button';
        cartBtn.innerHTML = ICON_CART;
        badge = el('b', 'kt-badge', '0');
        totalTxt = el('span', 'kt-cart-total', '');
        cartBtn.append(badge, totalTxt);
        cartBtn.addEventListener('click', () => (cartView.hidden ? showCart() : showShop()));
        histBtn = el('button', 'kt-histbtn');
        histBtn.type = 'button';
        histBtn.setAttribute('aria-label', 'Riwayat pembelian');
        histBtn.innerHTML = ICON_HIST;
        histBtn.appendChild(el('span', null, 'Riwayat'));
        histBtn.addEventListener('click', () => (histView.hidden ? showHist() : showShop()));
        right.append(pill, histBtn, cartBtn);
        bar.appendChild(right);

        /* tampilan belanja */
        shopView = el('div', 'kt-shop');
        const hero = el('section', 'kt-hero');
        hero.style.backgroundColor = HERO.warna;
        const bg = new Image();
        bg.className = 'kt-hero-img';
        bg.alt = '';
        bg.referrerPolicy = 'no-referrer';
        bg.onerror = () => bg.remove();
        bg.src = src(HERO.gambar);
        hero.appendChild(bg);
        const cap = el('div', 'kt-hero-cap');
        cap.appendChild(el('h2', null, HERO.judul));
        const more = el('a', null, HERO.link);
        more.href = '#katalog-grid';
        more.addEventListener('click', e => { e.preventDefault(); grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        cap.appendChild(more);
        hero.appendChild(cap);

        tabsBox = el('div', 'kt-tabs');
        TABS.forEach(t => {
            const b = el('button', 'kt-tab' + (t.id === aktif ? ' on' : ''), t.label);
            b.type = 'button';
            b.dataset.id = t.id;
            b.addEventListener('click', () => setKategori(t.id));
            tabsBox.appendChild(b);
        });
        grid = el('div', 'kt-grid');
        grid.id = 'katalog-grid';
        shopView.append(hero, tabsBox, grid);

        /* tampilan keranjang */
        cartView = el('section', 'kt-cartview');
        cartView.hidden = true;
        const ban = el('div', 'kt-cart-banner');
        ban.appendChild(el('h2', null, 'Keranjang Saya'));
        const crumb = el('p');
        const home = el('a', null, 'Katalog'); home.href = '#';
        home.addEventListener('click', e => { e.preventDefault(); showShop(); });
        crumb.append(home, ' / Keranjang');
        ban.appendChild(crumb);
        cartBody = el('div', 'kt-cart-body');
        const left = el('div', 'kt-cart-left');
        cartList = el('div', 'kt-cart-list');
        const back = el('a', 'kt-back', '« Kembali Belanja'); back.href = '#';
        back.addEventListener('click', e => { e.preventDefault(); showShop(); });
        left.append(cartList, back);
        sumBox = el('aside', 'kt-sum');
        cartBody.append(left, sumBox);
        cartView.append(ban, cartBody);

        checkoutView = el('section', 'kt-coview');
        checkoutView.hidden = true;

        histView = el('section', 'kt-histview');
        histView.hidden = true;
        const hb = el('div', 'kt-cart-banner');
        hb.appendChild(el('h2', null, 'Riwayat Pembelian'));
        const hc = el('p');
        const hhome = el('a', null, 'Katalog'); hhome.href = '#';
        hhome.addEventListener('click', e => { e.preventDefault(); showShop(); });
        hc.append(hhome, ' / Riwayat');
        hb.appendChild(hc);
        const hbody = el('div', 'kt-hist-body');
        histClear = el('button', 'kt-hist-clear', 'Hapus semua riwayat'); histClear.type = 'button';
        histClear.addEventListener('click', () => { if (confirm('Hapus semua riwayat pembelian di perangkat ini?')) { simpanRiwayat([]); renderHist(); } });
        histList = el('div', 'kt-hist-list');
        const hback = el('a', 'kt-back', '« Kembali Belanja'); hback.href = '#';
        hback.addEventListener('click', e => { e.preventDefault(); showShop(); });
        hbody.append(histClear, histList, hback);
        histView.append(hb, hbody);

        toastEl = el('div', 'kt-toast');
        toastEl.setAttribute('role', 'status');
        sheet.append(bar, shopView, cartView, histView, checkoutView);
        page.append(sheet, toastEl);
        updateHeader();
        render();
    }
    bangun();

    /* ---------- daftarkan ke menu (navcards.js membacanya otomatis) ---------- */
    const menu = document.getElementById('nav-menu');
    if (menu && !menu.querySelector('[data-katalog]')) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#'; a.textContent = 'Katalog'; a.dataset.katalog = '1';
        a.addEventListener('click', e => { e.preventDefault(); showPage('katalog-page'); });
        li.appendChild(a);
        menu.appendChild(li);
    }
    if (typeof PAGE_TITLES !== 'undefined') PAGE_TITLES['katalog-page'] = 'Katalog';
})();