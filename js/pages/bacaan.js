/* =========================================================
   HALAMAN BACA ISTILAH & BENDERA
   Klik kartu di Beranda (Pole Position, Pit Stop, Safety Car, 4 bendera)
   -> buka halaman baca yang lebih detail.
   Edit isi di array TOPICS. Memakai showPage() & PAGE_THEMES dari script.js.
   ========================================================= */
(function () {
    const host = document.getElementById('history-page') || document.getElementById('main-wrapper');
    if (!host) return;

    const IMG = {
        pole: 'https://d16-a.sdn.cz/d_16/c_img_qG_A/kcKfrMAkFMsuhDq9H8jcQR/1109.jpeg',
        pit: 'https://media.formula1.com/image/upload/t_16by9Centre/f_auto/q_auto/v1719487306/fom-website/manual/Misc/DHLAwards2024/GettyImages-2158303675.jpg',
        sc: 'https://www.actualidadmotor.com/wp-content/uploads/2023/04/safety-cars.jpg',
        hijau: 'https://f1mavericks.com/wp-content/uploads/2025/03/Green-Flag-F1.jpg',
        kuning: 'https://assets.khelnow.com/news/uploads/2023/03/Formula-1-Yellow-flag.jpg',
        merah: 'https://static0.givemesportimages.com/wordpress/wp-content/uploads/2023/06/collage-maker-26-jun-2023-02-04-pm-7713.jpg',
        kotak: 'https://img.redbull.com/assets/images/c_crop,w_3000,h_1500,x_0,y_0,f_auto,q_auto/c_scale,w_1200/redbullcom/2022/11/10/b9d4xyfxfwwm3mdzqxnd/chequered-flag-f1'
    };

    /* ---------- ISI: sesuaikan teks di sini ---------- */
    const TOPICS = [
        { id: 'pole', key: 'pole position', title: 'Pole Position', img: IMG.pole, mark: 'P1',
          lead: 'Posisi start paling depan, hadiah untuk pembalap tercepat di kualifikasi.',
          p: [
            'Pole position adalah posisi pertama di grid, yaitu tempat start paling depan saat balapan dimulai. Posisi ini diberikan kepada pembalap yang mencatat waktu satu lap tercepat di sesi kualifikasi, yang digelar sehari sebelum balapan utama. Nama "pole" sendiri sudah lama dipakai dalam dunia balap untuk menyebut posisi terdepan.',
            'Kualifikasi terdiri dari tiga tahap, yaitu Q1, Q2, dan Q3. Di setiap tahap, pembalap dengan waktu paling lambat tersingkir dan harus start dari barisan belakang. Sepuluh pembalap yang bertahan sampai Q3 berebut pole dalam satu lap penuh tenaga, dengan mesin dan ban yang disiapkan untuk kecepatan maksimal, bukan untuk jarak jauh.',
            'Start dari depan memberi banyak keuntungan. Mobil di posisi pertama punya lintasan kosong di depannya dan udara yang bersih, sehingga lebih mudah memimpin saat lampu start padam. Pembalap di tengah grid harus berebut ruang di tikungan pertama, dan di situlah risiko tabrakan serta kehilangan posisi paling besar.',
            'Meski begitu, pole tidak menjamin kemenangan. Strategi ban, waktu masuk pit, kemunculan safety car, dan hujan bisa mengubah urutan dengan cepat. Karena itu, banyak balapan dimenangkan pembalap yang start dari posisi lebih belakang, dan pole position lebih tepat dilihat sebagai modal awal yang bagus, bukan kepastian juara.']},
        { id: 'pitstop', key: 'pit stop', title: 'Pit Stop', img: IMG.pit,
          lead: 'Berhenti singkat di garasi, biasanya untuk mengganti ban.',
          p: [
            'Pit stop adalah saat pembalap keluar dari lintasan dan masuk ke jalur pit untuk berhenti di depan garasi timnya. Alasan utamanya adalah mengganti ban, karena ban F1 aus seiring lap berjalan dan membuat mobil makin lambat. Di jalur pit, kecepatan mobil juga dibatasi demi keselamatan para kru.',
            'Di balapan kering, aturan mewajibkan pembalap memakai minimal dua jenis ban yang berbeda. Artinya hampir semua pembalap harus melakukan pit stop setidaknya sekali. Tim memilih jenis ban dan jumlah pit stop berdasarkan kondisi lintasan, suhu, dan seberapa cepat ban diperkirakan aus.',
            'Satu pit stop melibatkan sekitar dua puluh kru yang bekerja serempak. Tiap roda ditangani beberapa orang, ada yang melepas mur, memasang ban baru, dan mengangkat mobil. Bagian saat mobil benar-benar diam biasanya hanya sekitar dua sampai tiga detik, dan tim tercepat bisa menyelesaikannya di bawah dua detik. Kesalahan sekecil apa pun bisa membuat pembalap kehilangan banyak posisi.',
            'Karena waktunya sangat berharga, kapan masuk pit menjadi bagian terpenting dari strategi. Masuk lebih awal dari lawan memungkinkan pembalap melaju dengan ban baru dan menyalip saat lawannya masih di lintasan, yang disebut undercut. Menunda masuk bisa menguntungkan kalau safety car muncul, karena waktu yang hilang jadi lebih sedikit.']},
        { id: 'safetycar', key: 'safety car', title: 'Safety Car', img: IMG.sc,
          lead: 'Mobil pengaman yang memimpin barisan saat lintasan berbahaya.',
          p: [
            'Safety car adalah mobil pengaman bercat khusus dengan lampu di atapnya yang masuk ke lintasan ketika ada bahaya serius. Pengemudinya adalah petugas resmi yang sangat terlatih, dan di dalam mobil ada seorang rekan yang terus berkomunikasi dengan pengelola balapan. Mobil yang dipakai biasanya berupa mobil sport berperforma tinggi.',
            'Safety car dikeluarkan saat terjadi kecelakaan atau ada puing di lintasan yang tidak cukup aman bila hanya ditangani dengan bendera kuning. Begitu keluar, semua pembalap harus berbaris di belakangnya, mengurangi kecepatan, dan dilarang menyalip. Dengan begitu petugas lintasan bisa bekerja dengan aman di tepi aspal.',
            'Dampaknya pada balapan sangat besar. Selisih waktu antar mobil yang tadinya lebar menyusut karena semuanya melaju pelan dan berdekatan. Pembalap yang unggul jauh bisa kehilangan semua keunggulannya dalam satu putaran. Tim juga sering memanfaatkannya untuk masuk pit, karena waktu yang hilang saat berhenti menjadi jauh lebih sedikit.',
            'Untuk bahaya yang lebih ringan, ada versi yang disebut Virtual Safety Car. Mobil pengaman tidak keluar ke lintasan, tetapi semua pembalap wajib menurunkan kecepatan sesuai batas yang ditentukan dan menjaga jaraknya. Setelah situasi aman, pembalap diberi tahu bahwa balapan kembali normal dan boleh memacu mobil dengan kecepatan penuh.']},
        { id: 'hijau', key: 'hijau', title: 'Bendera Hijau', img: IMG.hijau,
          lead: 'Lintasan aman, balapan boleh berjalan normal.',
          p: [
            'Bendera hijau adalah tanda bahwa lintasan dalam kondisi aman dan pembalap boleh memacu mobil seperti biasa. Bendera ini dikibarkan oleh petugas lintasan di tepi sirkuit, sehingga pembalap bisa melihatnya sambil melaju dengan kecepatan tinggi.',
            'Bendera hijau muncul pada beberapa situasi. Salah satunya saat sesi latihan atau kualifikasi dibuka, sebagai tanda lintasan siap dipakai. Selain itu, bendera ini dikibarkan setelah bahaya yang tadinya ditandai bendera kuning sudah selesai ditangani, misalnya puing sudah dibersihkan atau mobil yang berhenti sudah dipindahkan.',
            'Bagi pembalap, bendera hijau berarti semua pembatasan sebelumnya berakhir. Larangan menyalip dan batas kecepatan di area bahaya tidak berlaku lagi. Pembalap boleh langsung menyerang lawan di depannya dan memacu mobil dengan kemampuan penuh.',
            'Karena itu, bendera hijau sering menandai saat balapan kembali seru. Setelah masa berhati-hati, pembalap biasanya langsung berebut posisi, apalagi setelah safety car masuk. Bendera ini sederhana, tetapi menjadi kunci agar semua pihak tahu kapan boleh kembali berpacu.']},
        { id: 'kuning', key: 'kuning', title: 'Bendera Kuning', img: IMG.kuning,
          lead: 'Ada bahaya di depan, pembalap harus melambat dan dilarang menyalip.',
          p: [
            'Bendera kuning adalah peringatan bahwa ada bahaya di depan, dan pembalap harus berhati-hati. Bendera ini dikibarkan oleh petugas lintasan di tepi sirkuit, tepat sebelum titik bahaya, supaya pembalap punya cukup waktu untuk bereaksi.',
            'Penyebabnya bermacam-macam, misalnya ada mobil yang berhenti di tepi lintasan, tumpahan cairan di aspal, puing, atau petugas yang sedang bekerja di dekat jalur balap. Bahaya semacam ini tidak selalu cukup besar untuk memanggil safety car, tetapi tetap berisiko kalau mobil melaju dengan kecepatan penuh.',
            'Ada dua tingkat peringatan. Satu bendera kuning berarti pembalap harus mengurangi kecepatan dan bersiap. Dua bendera kuning berarti bahaya lebih serius, dan pembalap harus siap berhenti kalau perlu. Dalam kedua kasus, menyalip di area itu dilarang, dan pembalap yang melanggar bisa terkena hukuman.',
            'Aturan ini penting terutama demi keselamatan petugas yang bekerja sangat dekat dengan lintasan. Sesudah bahaya selesai ditangani, bendera hijau dikibarkan sebagai tanda bahwa pembalap boleh kembali memacu mobil dan menyalip seperti biasa.']},
        { id: 'merah', key: 'merah', title: 'Bendera Merah', img: IMG.merah,
          lead: 'Sesi dihentikan karena kondisi tidak aman.',
          p: [
            'Bendera merah adalah tanda bahwa sesi dihentikan sepenuhnya. Bendera ini menandakan situasi paling serius di antara bendera lainnya, dan dikibarkan di semua pos petugas sekeliling sirkuit sekaligus supaya semua pembalap tahu bahwa balapan berhenti.',
            'Penyebabnya biasanya kecelakaan parah yang membuat lintasan tidak aman, kerusakan pada lintasan atau pagar pembatas yang harus diperbaiki, atau cuaca ekstrem seperti hujan deras yang membuat mobil tidak bisa dikendalikan. Pada saat itu, safety car saja dianggap tidak cukup.',
            'Begitu bendera merah muncul, semua mobil harus pelan-pelan masuk ke jalur pit dan berhenti dalam antrean. Selama jeda, tim boleh memperbaiki mobil dan mengganti ban, sementara petugas membersihkan atau memperbaiki lintasan. Jeda ini bisa berlangsung singkat, tetapi kadang berlangsung cukup lama.',
            'Balapan dilanjutkan melalui start ulang setelah lintasan dinyatakan aman dan semua pihak siap. Posisi pembalap disusun kembali berdasarkan urutan sebelum bendera merah. Karena ban boleh diganti selama jeda, bendera merah sering mengubah strategi dan membuat sisa balapan jadi sulit ditebak.']},
        { id: 'kotak', key: 'kotak-kotak', title: 'Bendera Kotak-kotak', img: IMG.kotak,
          lead: 'Tanda garis akhir balapan.',
          p: [
            'Bendera kotak-kotak hitam putih adalah tanda paling dikenal dalam balap, karena menandai berakhirnya sesi. Bendera ini dikibarkan di garis finis, biasanya oleh orang yang dihormati atau tamu istimewa yang diundang oleh penyelenggara di setiap seri balapan.',
            'Bendera dikibarkan saat pembalap terdepan menyelesaikan lap terakhir. Pembalap yang pertama melihatnya di garis finis dinyatakan sebagai pemenang. Jumlah lap balapan ditentukan sebelumnya, atau berakhir ketika batas waktu yang ditetapkan tercapai, mana pun yang lebih dulu.',
            'Pembalap lain tidak berhenti seketika, tetapi menerima bendera kotak-kotak saat melintasi garis finis di akhir lap masing-masing. Pembalap yang tertinggal satu lap atau lebih tetap dihitung selesai saat melewati garis finis, tetapi hasilnya dicatat sesuai jumlah lap yang berhasil diselesaikan.',
            'Setelah bendera kotak-kotak, semua mobil melaju pelan di lap pendinginan kembali ke pit. Podium dan wawancara menyusul, dan hasil resmi baru dinyatakan final setelah pemeriksaan teknis dan keputusan hukuman, kalau ada. Bagi pembalap, bendera ini adalah momen yang ditunggu sepanjang akhir pekan balapan.']}
    ];

    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const root = document.createElement('div');
    root.id = 'istilah-page';
    root.className = 'page';
    host.insertAdjacentElement('afterend', root);

    function render(i) {
        const t = TOPICS[i];
        const hero = t.img
            ? `<img src="${t.img}" alt="${esc(t.title)}" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:'F1'}))">`
            : `<b>${t.mark || 'F1'}</b>`;
        root.innerHTML = `
            <article class="bc">
                <div class="bc-bar"><button class="bc-back" type="button" onclick="closeIstilah()">Kembali</button><button class="bc-mode" type="button" onclick="toggleIstilahMode()"></button></div>
                <div class="bc-hero">${hero}</div>
                <div class="bc-text">
                    <h1>${esc(t.title)}</h1>
                    <p class="bc-lead">${esc(t.lead)}</p>
                    ${t.p.map(x => `<p class="bc-p">${esc(x)}</p>`).join('')}
                </div>
            </article>`;
    }

    /* ---------- mode terang / gelap (diingat di browser) ---------- */
    let dark;
    try { const m = localStorage.getItem('bc-dark'); dark = m === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : m === '1'; } catch (e) { dark = false; }
    function applyMode() {
        root.classList.toggle('bc-dark', dark);
        document.body.classList.toggle('bc-dark', dark);
        const b = root.querySelector('.bc-mode');
        if (b) b.textContent = dark ? 'Mode terang' : 'Mode gelap';
    }
    window.toggleIstilahMode = function () {
        dark = !dark;
        try { localStorage.setItem('bc-dark', dark ? '1' : '0'); } catch (e) {}
        applyMode();
    };

    window.openIstilah = function (id) {
        const i = TOPICS.findIndex(t => t.id === id);
        if (i < 0) return;
        render(i);
        window.showPage('istilah-page');
        applyMode();
    };
    window.closeIstilah = function () {
        window.showPage('home-page');
        const go = () => {
            const home = document.getElementById('home-page');
            if (home && home.classList.contains('active')) {
                const el = document.querySelector('.nb-terms');
                if (el) el.scrollIntoView({ block: 'start' });
                return;
            }
            requestAnimationFrame(go);
        };
        requestAnimationFrame(go);
    };

    PAGE_THEMES['istilah-page'] = 'theme-istilah';
    if (typeof PAGE_TITLES !== 'undefined') PAGE_TITLES['istilah-page'] = 'Belajar';

    /* ---------- sambungkan kartu di Beranda ---------- */
    document.querySelectorAll('.nb-ticket, .nb-flag').forEach(card => {
        const label = (card.querySelector('h3, b') || {}).textContent;
        const t = TOPICS.find(x => label && label.trim().toLowerCase() === x.key);
        if (!t) return;
        card.dataset.bc = t.id;
        card.tabIndex = 0;
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', 'Baca penjelasan ' + t.title);
        const content = card.querySelector('.nb-ticket-content');
        if (content) content.insertAdjacentHTML('beforeend', '<span class="bc-more">Baca selengkapnya</span>');
        card.addEventListener('click', () => openIstilah(t.id));
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIstilah(t.id); } });
    });
})();