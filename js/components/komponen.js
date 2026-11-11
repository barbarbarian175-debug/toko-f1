/* =========================================================
   HALAMAN DETAIL KOMPONEN F1
   Ubah isi array PARTS untuk mengedit detail komponen.
    Simpan foto sesuai field img di assets/images/komponen/.
   ========================================================= */
(function () {
    const root = document.getElementById('part-detail-page');
    if (!root) return;

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- DATA ---------- */
    const PARTS = [
        {
            id: 1, number: '01', name: 'Monocoque', img: '01-monocoque.jpg', url: 'assets/images/komponen/01-monocoque.jpg',
            description: 'Monocoque adalah struktur utama berbahan komposit karbon yang membentuk kokpit dan sel keselamatan pembalap. Struktur ini dirancang sangat kaku agar bentuknya tetap terjaga saat menerima beban besar, sekaligus menyerap energi benturan melalui bagian-bagian yang dapat hancur secara terkontrol.',
            material: 'Komposit serat karbon', weight: 'Sangat ringan', purpose: 'Melindungi pembalap dan menjadi rangka utama mobil'
        },
        {
            id: 2, number: '02', name: 'Power Unit', img: '02-power-unit.jpg', url: 'assets/images/komponen/02-power-unit.jpg',
            description: 'Power unit modern menggabungkan mesin pembakaran V6 turbo 1,6 liter dengan sistem pemulihan energi listrik. Komponen-komponennya bekerja bersama untuk menghasilkan tenaga, mengatur pemakaian energi, dan menjaga performa sepanjang satu putaran maupun satu balapan.',
            material: 'Paduan logam, turbo, dan komponen elektrik', weight: 'Unit kompleks dengan batas bobot regulasi', purpose: 'Menghasilkan dan mengelola tenaga mobil'
        },
        {
            id: 3, number: '03', name: 'Sayap depan & belakang', img: '03-sayap.jpg', url: 'assets/images/komponen/03-sayap.jpg',
            description: 'Kedua sayap membentuk aliran udara di sekitar mobil. Sayap depan membantu mengarahkan udara ke lantai dan roda, sedangkan sayap belakang menghasilkan beban aerodinamis untuk membantu ban tetap menempel di lintasan. Sudut dan bentuknya disetel sesuai karakter sirkuit.',
            material: 'Komposit serat karbon', weight: 'Ringan dan dapat disetel', purpose: 'Mengatur aliran udara dan menghasilkan downforce'
        },
        {
            id: 4, number: '04', name: 'Lantai & diffuser', img: '04-lantai-diffuser.jpg', url: 'assets/images/ext/FI-Difuser-small.jpg',
            description: 'Lantai mobil membentuk terowongan aliran udara di bawah sasis. Perbedaan tekanan antara bagian bawah dan atas mobil membantu menghasilkan downforce. Di bagian belakang, diffuser memperlambat dan melebarkan aliran udara agar aliran dari bawah mobil dapat keluar dengan lebih stabil.',
            material: 'Komposit karbon dengan permukaan pelindung', weight: 'Lebar dan tipis, mengikuti batas regulasi', purpose: 'Menghasilkan downforce dari bagian bawah mobil'
        },
        {
            id: 5, number: '05', name: 'Halo', img: '05-halo.jpg', url: 'assets/images/ext/maxresdefault.jpg',
            description: 'Halo adalah struktur keselamatan berbentuk lengkung yang mengelilingi bagian atas kokpit. Terbuat dari titanium, perangkat ini dirancang untuk menahan beban besar dan membantu mengalihkan benda dari area kepala pembalap. Bentuknya terbuka agar pandangan dan akses keluar kokpit tetap terjaga.',
            material: 'Paduan titanium', weight: 'Sekitar 7 kg', purpose: 'Memberi perlindungan tambahan di sekitar kepala'
        },
        {
            id: 6, number: '06', name: 'Rem karbon', img: '06-rem-karbon.jpg', url: 'assets/images/ext/cf5zvurl4om4kt9.jpeg',
            description: 'Sistem rem menggunakan cakram dan kampas berbahan karbon yang bekerja pada suhu sangat tinggi. Ketika pembalap mengerem, energi gerak berubah menjadi panas. Pendinginan melalui saluran udara penting agar rem tetap bekerja konsisten saat deselerasi keras berulang kali.',
            material: 'Karbon-karbon', weight: 'Ringan dengan respons tinggi', purpose: 'Memperlambat mobil secara konsisten dari kecepatan tinggi'
        },
        {
            id: 7, number: '07', name: 'Setir', img: '07-setir.jpg', url: 'assets/images/pin/e4851983d8a1be559310552ad0019597.jpg',
            description: 'Setir F1 merupakan antarmuka kendali yang dapat dilepas dari kolom kemudi. Di bagian depannya terdapat layar dan tombol untuk memilih pengaturan mobil, mengatur rem, mengelola energi, serta berkomunikasi dengan tim. Susunannya dibuat khusus agar pembalap dapat mengoperasikannya sambil tetap fokus di lintasan.',
            material: 'Komposit karbon dan komponen elektronik', weight: 'Ringan dan dibuat sesuai kebutuhan pembalap', purpose: 'Mengemudikan mobil dan mengatur sistem kendaraan'
        },
        {
            id: 8, number: '08', name: 'Girboks', img: '08-girboks.jpg', url: 'assets/images/ext/DSC00244-scaled.jpg',
            description: 'Girboks sekuensial memiliki delapan rasio maju dan satu gigi mundur. Perpindahan gigi dilakukan melalui paddle di belakang setir dengan bantuan sistem elektronik dan hidraulis. Rasio dipilih untuk memanfaatkan rentang tenaga mesin pada sirkuit yang berbeda.',
            material: 'Paduan logam berkekuatan tinggi', weight: 'Ringkas dan mengikuti batas regulasi', purpose: 'Menyalurkan tenaga ke roda belakang melalui rasio yang tepat'
        }
    ];

    /* ---------- PENJELASAN 4 PARAGRAF per komponen (ubah teks di sini) ---------- */
    const BODY = {
        1: ['Monocoque adalah struktur utama mobil F1 yang membentuk kokpit sekaligus sel keselamatan tempat pembalap duduk. Semua bagian lain, mulai dari mesin, suspensi, sampai sayap, dipasang pada atau di sekitar struktur ini, sehingga ia bisa disebut tulang punggung mobil.','Bahan utamanya adalah komposit serat karbon, yaitu lapisan-lapisan serat karbon yang direkatkan dan dipanggang dengan tekanan tinggi. Hasilnya sangat kuat tetapi sangat ringan, dua hal yang sama pentingnya di mobil balap yang selalu berusaha menekan bobot.','Struktur ini dirancang sangat kaku agar bentuknya tetap terjaga saat menerima beban besar, misalnya ketika mobil menikung dengan gaya tinggi atau terkena benturan. Di sisi lain, bagian-bagian di sekitarnya dibuat dapat hancur secara terkontrol untuk menyerap energi benturan sebelum sampai ke pembalap.','Karena itu, fungsi utama monocoque adalah melindungi pembalap sekaligus menjadi rangka utama mobil. Sebelum dipakai balapan, setiap rancangan harus lolos uji tabrak yang ketat, dan itulah salah satu alasan pembalap sering selamat dari kecelakaan yang tampak sangat parah.'],
        2: ['Power unit adalah sebutan untuk seluruh sistem tenaga mobil F1 modern, bukan hanya mesinnya. Intinya adalah mesin pembakaran V6 turbo berkapasitas 1,6 liter yang dipadukan dengan sistem pemulihan energi listrik, sehingga mobil punya dua sumber tenaga yang bekerja bersama.','Komponen-komponennya, mulai dari mesin, turbo, motor listrik, sampai baterai, terbuat dari paduan logam dan perangkat elektrik yang dirancang tahan panas dan putaran tinggi. Sistem ini sangat kompleks, dan bobotnya dibatasi oleh regulasi supaya tidak ada tim yang mengakali aturan dengan unit yang lebih ringan.','Saat mobil mengerem atau menikung, sebagian energi yang biasanya terbuang diubah menjadi listrik dan disimpan di baterai. Energi itu lalu dipakai lagi untuk menambah tenaga saat mobil berakselerasi. Mulai 2026, porsi tenaga listrik ini jauh lebih besar dibanding sebelumnya.','Fungsi utamanya adalah menghasilkan dan mengelola tenaga mobil. Pembalap dan tim harus mengatur kapan energi dipakai dan kapan dihemat, supaya performa tetap terjaga sepanjang satu putaran maupun sepanjang balapan penuh.'],
        3: ['Mobil F1 punya dua sayap utama, yaitu sayap depan dan sayap belakang. Bentuknya mirip sayap pesawat tetapi dipasang terbalik, sehingga alih-alih mengangkat, udara yang mengalir justru menekan mobil ke bawah.','Sayap depan adalah bagian pertama yang menyentuh udara. Ia membantu mengarahkan aliran ke lantai dan roda. Sayap belakang menghasilkan beban aerodinamis yang disebut downforce, yang membantu ban tetap menempel di lintasan sehingga mobil bisa menikung jauh lebih cepat.','Kedua sayap dibuat dari komposit serat karbon yang ringan tetapi tidak mudah patah, dan dapat disetel. Sudut dan bentuknya diubah sesuai karakter sirkuit: sirkuit lurus dan cepat memakai sayap yang lebih datar, sedangkan sirkuit penuh tikungan memakai sayap yang lebih curam.','Fungsinya adalah mengatur aliran udara dan menghasilkan downforce. Di era regulasi baru, sayap juga dapat berubah posisi untuk mengurangi hambatan di jalan lurus, sehingga mobil bisa melaju lebih cepat sebelum kembali ke pengaturan untuk menikung.'],
        4: ['Lantai mobil F1 adalah bagian di bawah sasis yang sering luput dari perhatian, padahal ia penghasil downforce yang besar. Bentuknya lebar dan tipis, dengan saluran khusus yang membentuk terowongan bagi aliran udara di bawah mobil.','Saat udara dipaksa melewati terowongan sempit itu, kecepatannya naik dan tekanannya turun. Perbedaan tekanan antara bagian bawah dan atas mobil inilah yang menekan mobil ke lintasan, dan efeknya dikenal sebagai ground effect.','Di bagian belakang ada diffuser, yaitu lengkungan yang memperlambat dan melebarkan aliran udara sebelum keluar. Dengan begitu aliran dari bawah mobil bisa keluar lebih stabil dan tidak mengganggu aliran di belakangnya.','Lantai dibuat dari komposit karbon dengan permukaan pelindung dan ukurannya mengikuti batas regulasi. Fungsinya adalah menghasilkan downforce dari bagian bawah mobil, yang membuat mobil tetap stabil walau melaju sangat cepat.'],
        5: ['Halo adalah struktur keselamatan berbentuk lengkung yang mengelilingi bagian atas kokpit. Perangkat ini mulai wajib dipasang di mobil F1 sejak 2018, dan bentuknya yang terbuka membuat pembalap tetap bisa melihat jalan dengan jelas.','Halo terbuat dari paduan titanium, bahan yang sangat kuat tetapi ringan. Bobotnya sekitar 7 kg, tetapi ia diuji untuk menahan beban yang sangat besar, bahkan jauh melebihi bobot mobil itu sendiri.','Tugasnya adalah melindungi kepala pembalap dengan menahan dan mengalihkan benda yang melayang ke arah kokpit, misalnya puing atau bagian mobil lain yang terlepas dalam kecelakaan. Karena bentuknya terbuka, akses keluar dari kokpit tetap terjaga.','Pada awalnya sebagian orang menganggap halo kurang sedap dipandang. Namun dalam beberapa kecelakaan besar, perangkat ini terbukti menyelamatkan pembalap, dan kini ia dianggap salah satu inovasi keselamatan terpenting dalam sejarah F1.'],
        6: ['Sistem rem mobil F1 memakai cakram dan kampas berbahan karbon-karbon. Bahan ini jauh lebih ringan daripada baja, dan yang terpenting, ia bekerja dengan baik pada suhu yang sangat tinggi, saat rem biasa sudah gagal.','Ketika pembalap mengerem, energi gerak mobil berubah menjadi panas. Cakram rem bisa menjadi sangat membara, bahkan suhunya dapat melewati seribu derajat Celsius. Pada kondisi seperti itu, rem karbon justru berada pada kondisi terbaiknya.','Karena panasnya ekstrem, pendinginan sangat penting. Udara dialirkan melalui saluran dan lubang kecil pada cakram agar rem tetap bekerja konsisten walau dipakai keras berulang kali di akhir jalan lurus.','Fungsinya adalah memperlambat mobil secara konsisten dari kecepatan tinggi. Mobil F1 bisa berhenti dari kecepatan sangat tinggi dalam jarak yang sangat pendek, sehingga pembalap bisa menunda pengereman sedalam mungkin dan menyalip lawan di tikungan.'],
        7: ['Setir F1 jauh berbeda dari setir mobil biasa. Ia lebih mirip pusat kendali, karena di bagian depannya terdapat layar dan banyak tombol serta putaran pemilih. Setir ini dapat dilepas dari kolom kemudi, antara lain agar pembalap mudah keluar dari kokpit.','Setir dibuat dari komposit karbon dan dilengkapi komponen elektronik. Bobotnya ringan dan bentuknya dibuat sesuai kebutuhan masing-masing pembalap, termasuk ukuran genggaman dan posisi tombol yang paling nyaman.','Dengan tombol-tombol itu, pembalap dapat memilih pengaturan mobil, mengatur keseimbangan rem, mengelola energi, serta berkomunikasi dengan tim lewat radio. Layar di tengahnya menampilkan informasi seperti gigi, waktu lap, dan status baterai.','Susunannya dirancang agar semua fungsi bisa dioperasikan sambil tetap fokus ke lintasan. Fungsi utamanya adalah mengemudikan mobil sekaligus mengatur berbagai sistem kendaraan. Letak tombol berbeda di tiap tim, jadi pembalap biasanya hafal setirnya di luar kepala.'],
        8: ['Girboks atau transmisi bertugas menyalurkan tenaga mesin ke roda belakang melalui rasio gigi yang tepat. Girboks mobil F1 bertipe sekuensial, artinya gigi hanya bisa dinaikkan atau diturunkan satu per satu, bukan melompat ke gigi sembarang.','Girboks ini memiliki delapan rasio maju dan satu gigi mundur. Bahannya paduan logam berkekuatan tinggi karena harus menahan tenaga dan putaran yang sangat besar, tetapi bentuknya ringkas dan mengikuti batas regulasi agar tidak terlalu berat.','Perpindahan gigi dilakukan lewat paddle di belakang setir, dengan bantuan sistem elektronik dan hidraulis. Satu kali pindah gigi hanya memakan waktu puluhan milidetik, dan nyaris tidak terasa karena tenaga tidak terputus.','Rasio gigi dipilih tim sebelum balapan agar sesuai dengan karakter sirkuit. Sirkuit berkecepatan tinggi memerlukan rasio yang berbeda dibanding sirkuit penuh tikungan lambat, sehingga rentang tenaga mesin bisa dimanfaatkan sepenuhnya.']
    };

    /* ---------- RENDER ---------- */
    function renderPartDetail(id) {
        const index = PARTS.findIndex(part => part.id === Number(id));
        if (index < 0) return false;

        const part = PARTS[index];
        const previous = PARTS[(index - 1 + PARTS.length) % PARTS.length];
        const next = PARTS[(index + 1) % PARTS.length];

        const lf = s => (s && s[1] && s[1] === s[1].toLowerCase() ? s[0].toLowerCase() + s.slice(1) : s || '');
        const end = s => s.replace(/[.\s]+$/, '');
        const extra = [
            part.material ? `Bahan utamanya adalah ${end(lf(part.material))}.` : '',
            part.weight ? `Dari sisi bobot, ${end(lf(part.weight))}.` : '',
            part.purpose ? `Fungsi utamanya adalah ${end(lf(part.purpose))}.` : ''
        ].filter(Boolean).join(' ');
        const paras = BODY[part.id] || [part.description, extra].filter(Boolean);

        root.innerHTML = `
            <article class="pd-poster" style="--pd-accent: var(--pd-red)">
                <header class="pd-topline">
                    <button class="pd-back" type="button" onclick="backToParts()">Kembali</button>
                    <span>${part.number} — 08</span>
                </header>
                <figure class="pd-visual is-placeholder">
                    <img src="assets/images/komponen/${part.img}" alt="${part.name}" loading="lazy"
                        onerror="if(!this.dataset.f){this.dataset.f='1';this.src='${part.url}';}else{this.hidden=true;this.parentElement.classList.add('is-placeholder');}">
                    <span class="pd-placeholder" aria-hidden="true">${part.number}</span>
                    <figcaption>${part.name} / Komponen mobil F1</figcaption>
                    <span class="pd-checker" aria-hidden="true"></span>
                </figure>
                <section class="pd-copy" aria-labelledby="pd-title">
                    <span class="pd-kicker">Sistem mobil / ${part.number}</span>
                    <span class="pd-ghost" aria-hidden="true">(${part.number})</span>
                    <h1 id="pd-title">${part.name}</h1>
                    ${paras.map(t => `<p class="pd-description">${t}</p>`).join('')}
                </section>
                <nav class="pd-nav" aria-label="Navigasi komponen">
                    <button class="pd-nav-arrow is-prev" type="button" onclick="openPartDetail(${previous.id})" aria-label="Komponen sebelumnya"><img src="assets/images/pin/1a91ee0890f33c7c50c33d1a55462783.jpg" alt="" aria-hidden="true"></button>
                    <button class="pd-nav-arrow is-next" type="button" onclick="openPartDetail(${next.id})" aria-label="Komponen berikutnya"><img src="assets/images/pin/1a91ee0890f33c7c50c33d1a55462783.jpg" alt="" aria-hidden="true"></button>
                </nav>
            </article>`;
        return true;
    }

    window.openPartDetail = function (id) {
        if (!renderPartDetail(id)) return;
        window.showPage('part-detail-page');
    };

    window.backToParts = function () {
        window.showPage('home-page');
        const scrollToGuide = () => {
            const home = document.getElementById('home-page');
            if (home && home.classList.contains('active')) {
                const target = document.getElementById('nb-guide') || document.querySelector('.nb-tech');
                if (target) target.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
                return;
            }
            requestAnimationFrame(scrollToGuide);
        };
        requestAnimationFrame(scrollToGuide);
    };

    PAGE_THEMES['part-detail-page'] = 'theme-part-detail';
})();/* =========================================================
   KOMPONEN MOBIL F1 - 8 halaman detail (01 - 08)
   Memakai showPage() & PAGE_THEMES dari script.js.
   Id halaman: part-1-page ... part-8-page
   ========================================================= */
(function () {
    const host = document.getElementById('history-page') || document.getElementById('main-wrapper');
    if (!host) return;

    const NAMES = ['Monocoque', 'Power Unit', 'Sayap Depan & Belakang', 'Lantai & Diffuser', 'Halo', 'Rem Karbon', 'Setir', 'Girboks'];
    const pad = n => String(n).padStart(2, '0');

    /* ---------- potongan kecil yang dipakai ulang ---------- */
    // Mobil tampak atas; key = bagian yang menyala
    const car = k => { const o = x => (x === k ? ' on' : '');
        return `<svg class="car" viewBox="0 0 400 200" aria-hidden="true">
        <rect class="cp${o('floor')}" x="118" y="58" width="170" height="84" rx="14"/>
        <rect class="cp${o('wing')}" x="18" y="52" width="14" height="96" rx="3"/><rect class="cp${o('wing')}" x="352" y="58" width="14" height="84" rx="3"/>
        <g class="${k === 'brake' ? 'on' : ''}"><rect class="cp" x="66" y="26" width="38" height="24" rx="6"/><rect class="cp" x="66" y="150" width="38" height="24" rx="6"/><rect class="cp" x="290" y="22" width="44" height="30" rx="6"/><rect class="cp" x="290" y="148" width="44" height="30" rx="6"/></g>
        <polygon class="cb" points="32,94 140,86 200,80 260,84 352,92 352,108 260,116 200,120 140,114 32,106"/>
        <ellipse class="cp${o('tub')}" cx="178" cy="100" rx="46" ry="15"/>
        <rect class="cp${o('pu')}" x="236" y="88" width="50" height="24" rx="6"/>
        <rect class="cp${o('gear')}" x="288" y="92" width="40" height="16" rx="4"/>
        <rect class="cp${o('steer')}" x="150" y="94" width="12" height="12" rx="2"/>
        <path class="ch${o('halo')}" d="M150 100 Q178 66 208 100" fill="none"/></svg>`; };
    const stat = (v, u, l) => `<div class="pt-card pt-stat"><b>${typeof v === 'number' ? `<span data-count="${v}">0</span>` : v}<i>${u}</i></b><span>${l}</span></div>`;
    const note = t => `<p class="pt-note">${t || 'Angka bersifat perkiraan umum dan bisa berbeda antar musim, regulasi, dan tim.'}</p>`;
    const gauge = (l, v, max, u) => `<div class="gauge" style="--v:${Math.min(100, v / max * 100)}"><div><b>${v}</b><small>${u}</small></div><span>${l}</span></div>`;
    const sel = (tabs, cls) => `<div class="pt-tabs ${cls || ''}">${tabs.map(([k, t], i) => `<button type="button" data-sel="${k}"${i ? '' : ' class="act"'}>${t}</button>`).join('')}</div>`;

    /* ---------- ISI TIAP HALAMAN ---------- */
    const R = {};

    // 01 - HERO FOCUS / CENTERED VISUAL
    R[1] = () => `
        <div class="m1-hero"><div class="m1-glow"></div>${car('tub')}</div>
        <h1 class="pt-h1"><small>01 / Kerangka utama</small>Monocoque</h1>
        <p class="pt-lead">Cangkang serat karbon tempat pembalap duduk. Semua bagian lain, dari mesin sampai suspensi, dipasang pada struktur ini.</p>
        <div class="pt-grid3">${stat(5, '×', 'Lebih kuat dari baja jika dihitung per bobot')}${stat('Puluhan', 'kg', 'Bobotnya ringan tapi sangat kaku')}${stat(3, '+', 'Tes tabrak wajib FIA, termasuk depan dan samping')}</div>
        <div class="m1-story">
            <h2>Sel keselamatan</h2><p>Monocoque dibuat dari puluhan lapis serat karbon yang direkatkan dan dipanggang dalam autoclave bertekanan. Hasilnya cangkang tunggal yang menahan benturan tanpa berubah bentuk di sekitar pembalap.</p>
            <h2>Menyerap, bukan melawan</h2><p>Bagian depan dan samping dirancang hancur secara terkendali untuk menyerap energi, sementara sel pembalap tetap utuh. Sebelum musim, setiap desain harus lulus uji tabrak FIA.</p>
            <h2>Kaku untuk performa</h2><p>Kekakuan membuat suspensi bekerja presisi, sehingga setelan mobil bisa diprediksi tim di tikungan cepat.</p>
        </div>${note()}`;

    // 02 - SPLIT 2 KOLOM
    const PU = [['ice', 'ICE', 'Mesin pembakaran V6 1,6 liter bertenaga turbo. Menjadi sumber tenaga utama dan berputar hingga sekitar 15.000 rpm.'],
        ['turbo', 'Turbocharger', 'Turbin yang diputar gas buang untuk memadatkan udara masuk, sehingga mesin kecil menghasilkan tenaga besar.'],
        ['mguk', 'MGU-K', 'Motor-generator di poros engkol. Memulihkan energi saat mengerem, lalu melepasnya sebagai tenaga listrik tambahan. Porsinya jauh lebih besar di 2026.'],
        ['mguh', 'MGU-H', 'Motor-generator di turbo yang memanen energi panas gas buang. Dipakai 2014-2025 dan dihapus mulai 2026.'],
        ['es', 'Baterai (ES)', 'Menyimpan energi hasil panen untuk dipakai di lap berikutnya.'],
        ['ce', 'Control Electronics', 'Otak yang mengatur aliran energi antar komponen dan menjaga semuanya tetap dalam batas aturan.']];
    R[2] = () => `
        <div class="m2-split">
            <div class="m2-left pt-card">${car('pu')}<div class="m2-chips"><span>V6 · 1,6 L</span><span>Turbo + hybrid</span><span>~15.000 rpm</span><span>Bahan bakar berkelanjutan (2026)</span></div></div>
            <div class="m2-right pt-sel">
                <h1 class="pt-h1"><small>02 / Jantung mobil</small>Power Unit</h1>
                <p class="pt-lead">Bukan sekadar mesin. Power unit adalah gabungan mesin bakar dan sistem listrik yang saling bertukar energi. Pada 2026 tenaga listriknya kira-kira setara dengan mesin bakarnya.</p>
                <div class="m2-list">${PU.map(([k, t], i) => `<button type="button" data-sel="${k}"${i ? '' : ' class="act"'}><em>${pad(i + 1)}</em>${t}</button>`).join('')}</div>
                ${PU.map(([k, t, d], i) => `<div class="pt-card m2-detail" data-show="${k}"${i ? ' hidden' : ''}><b>${t}</b><p>${d}</p></div>`).join('')}
            </div>
        </div>${note()}`;

    // 03 - ASIMETRIS / STORYTELLING
    R[3] = () => `
        <div class="m3-grid pt-sel">
            <div class="m3-text">
                <h1 class="pt-h1"><small>03 / Aerodinamika</small>Sayap Depan &amp; Belakang</h1>
                <p class="pt-lead">Sayap bekerja seperti sayap pesawat yang dibalik: menekan mobil ke aspal. Semakin besar tekanannya, semakin kuat grip di tikungan.</p>
                <p>Sayap depan adalah bagian pertama yang menyentuh udara dan mengatur aliran ke seluruh mobil. Sayap belakang menambah downforce sekaligus menstabilkan buritan. Sayap yang menekan lebih kuat juga menambah hambatan (drag), jadi tim selalu mencari kompromi.</p>
                <p>Sampai 2025 kompromi itu dibantu DRS. Mulai 2026, aerodinamika aktif mengubah sudut sayap: tikungan memakai mode downforce, lintasan lurus memakai mode hambatan rendah.</p>
            </div>
            <div class="m3-diagram pt-card">
                ${sel([['dn', 'Mode tikungan'], ['lo', 'Mode lurus']])}
                <svg viewBox="0 0 520 220" aria-hidden="true">
                    <path class="flow" d="M0 60 C150 60 190 40 330 70 S470 60 520 60"/><path class="flow" d="M0 95 C150 95 200 80 330 105 S470 100 520 100"/><path class="flow" d="M0 130 C150 130 220 120 330 140 S470 140 520 140"/>
                    <rect x="0" y="196" width="520" height="4" fill="var(--a2)" opacity=".5"/>
                    <rect class="body" x="120" y="150" width="270" height="34" rx="12"/>
                    <g class="wing"><rect x="300" y="92" width="110" height="9" rx="4"/></g><rect x="305" y="100" width="6" height="52"/>
                    <circle cx="170" cy="188" r="16"/><circle cx="350" cy="188" r="16"/>
                </svg>
                <div class="m3-bars"><span>Downforce</span><div><i class="b-dn"></i></div><span>Hambatan</span><div><i class="b-dr"></i></div></div>
            </div>
        </div>${note('Diagram bersifat ilustrasi sederhana, bukan hasil simulasi aliran udara.')}`;

    // 04 - BOTTOM FOCUS & DATA CARDS
    R[4] = () => `
        <h1 class="pt-h1"><small>04 / Ground effect</small>Lantai &amp; Diffuser</h1>
        <p class="pt-lead">Sumber downforce terbesar justru tidak terlihat. Terowongan di bawah mobil menghisapnya ke lintasan.</p>
        <div class="pt-grid3">${stat('~50', '%', 'Perkiraan porsi downforce dari lantai dan diffuser')}${stat(10, ' mm', 'Tebal papan (plank) di bawah mobil yang membatasi ketinggian')}${stat('Porpoising', '', 'Mobil memantul di kecepatan tinggi saat aliran bawah kolaps')}</div>
        <div class="m4-flow pt-card pt-sel">
            ${sel([['in', 'Inlet'], ['th', 'Throat'], ['df', 'Diffuser']])}
            <svg viewBox="0 0 600 190" aria-hidden="true">
                <rect x="0" y="170" width="600" height="6" fill="var(--a2)" opacity=".6"/>
                <path class="floor" d="M0 70 L190 70 Q260 70 300 118 L380 128 Q450 128 520 80 L600 60 L600 20 L0 20 Z"/>
                <rect class="z z-in" x="10" y="72" width="170" height="96"/><rect class="z z-th" x="262" y="124" width="130" height="46"/><rect class="z z-df" x="400" y="84" width="190" height="86"/>
                <path class="flow" d="M0 110 L180 110 Q260 112 300 150 L390 152 Q470 150 520 120 L600 100"/><path class="flow" d="M0 140 L200 140 Q280 142 320 158 L410 160 Q480 158 540 140 L600 130"/>
            </svg>
            <div data-show="in">Udara masuk dari bagian depan lantai dan diarahkan ke terowongan di kiri-kanan mobil.</div>
            <div data-show="th" hidden>Terowongan menyempit. Udara dipercepat dan tekanannya turun, sehingga mobil terhisap ke bawah.</div>
            <div data-show="df" hidden>Diffuser melebar ke belakang agar udara kembali melambat dan keluar mulus, menjaga hisapan tetap kuat.</div>
        </div>${note('Diagram adalah ilustrasi konsep venturi, bukan bentuk lantai sebenarnya.')}`;

    // 05 - MINIMALIST SAFETY
    R[5] = () => `
        <div class="m5-wrap">
            <svg class="m5-halo" viewBox="0 0 240 160" aria-hidden="true"><circle class="ring" cx="120" cy="104" r="40"/><circle class="ring r2" cx="120" cy="104" r="40"/>
                <ellipse cx="120" cy="112" rx="34" ry="22" fill="none" stroke="#6b7580" stroke-width="2"/><circle cx="120" cy="100" r="14" fill="#6b7580"/>
                <path d="M62 112 Q60 40 120 36 Q180 40 178 112" fill="none" stroke="var(--a)" stroke-width="7" stroke-linecap="round"/><path d="M120 36 L120 82" stroke="var(--a)" stroke-width="7" stroke-linecap="round"/></svg>
            <h1 class="pt-h1"><small>05 / Keselamatan</small>Halo</h1>
            <p class="pt-lead">Lengkung titanium di atas kokpit. Wajib sejak 2018, dan sejak itu terbukti menyelamatkan pembalap.</p>
        </div>
        <div class="pt-grid3 m5-stats">${stat(2018, '', 'Mulai diwajibkan di semua mobil F1')}${stat('~7', ' kg', 'Bobotnya ringan, terbuat dari titanium')}${stat('~12', ' ton', 'Beban yang harus ditahan dalam uji FIA (perkiraan)')}</div>
        <blockquote class="m5-quote">Struktur sekecil ini bisa menjadi pembeda antara insiden menegangkan dan tragedi.</blockquote>
        <div class="pt-grid3 m5-cases">
            <div class="pt-card"><small>Spa 2018</small><b>Leclerc</b><p>Mobil Alonso terlempar ke atas mobil Leclerc saat start. Halo menahan benturan di dekat kepala.</p></div>
            <div class="pt-card"><small>Bahrain 2020</small><b>Grosjean</b><p>Menembus pagar pembatas lalu terbakar. Halo menjaga ruang selamat sampai ia keluar.</p></div>
            <div class="pt-card"><small>Silverstone 2022</small><b>Zhou</b><p>Mobil terbalik dan meluncur di lintasan. Halo menahan beban saat mobil menghantam pembatas.</p></div>
        </div>${note('Kutipan pembalap sungguhan belum ditambahkan agar tidak salah atribusi. Silakan ganti kalimat di atas dengan kutipan asli beserta sumbernya.')}`;

    // 06 - HEAT DASHBOARD
    const bar = (l, a, b, ua, ub, pa, pb) => `<div class="m6-row"><b>${l}</b><div class="m6-bar"><i style="--w:${pa}%"></i><span>Rem biasa ${a}</span></div><div class="m6-bar hot"><i style="--w:${pb}%"></i><span>Rem karbon F1 ${b}</span></div></div>`;
    R[6] = () => `
        <h1 class="pt-h1"><small>06 / Telemetri rem</small>Rem Karbon</h1>
        <p class="pt-lead">Cakram dan kampas karbon justru bekerja paling baik saat sangat panas, dan sanggup menghentikan mobil dari kecepatan tinggi dalam jarak singkat.</p>
        <div class="m6-dash pt-card pt-sel">
            ${sel([['f1', 'Rem karbon F1'], ['std', 'Rem mobil biasa']])}
            <div class="m6-gauges" data-show="f1">${gauge('Suhu cakram', 1000, 1100, '°C')}${gauge('Perlambatan', 5, 6, 'g')}${gauge('Jarak 100 → 0 km/jam', 15, 45, 'm')}</div>
            <div class="m6-gauges" data-show="std" hidden>${gauge('Suhu cakram', 300, 1100, '°C')}${gauge('Perlambatan', 1, 6, 'g')}${gauge('Jarak 100 → 0 km/jam', 40, 45, 'm')}</div>
        </div>
        <div class="pt-card m6-compare">${bar('Suhu kerja', '~300 °C', 'hingga ~1000 °C', 0, 0, 30, 91)}${bar('Perlambatan', '~1 g', '5 g lebih', 0, 0, 17, 85)}${bar('Jarak berhenti', '~40 m', '~15 m', 0, 0, 90, 34)}
            <p class="m6-mat"><b>Bahan:</b> besi cor pada mobil biasa, komposit karbon-karbon pada F1. Rem karbon kurang bertenaga saat dingin, sehingga pembalap menjaga suhunya lewat saluran udara.</p></div>${note('Angka bersifat perkiraan untuk perbandingan, bukan data resmi tim.')}`;

    // 07 - INTERACTIVE COCKPIT
    const SW = [['Brake bias', 105, 95, 20, 95, 'Mengatur pembagian gaya rem depan dan belakang. Pembalap mengubahnya sepanjang balapan saat bahan bakar dan ban berubah.'],
        ['Radio', 105, 135, 20, 135, 'Tombol bicara ke insinyur balap di pit wall.'],
        ['Drink', 105, 170, 20, 170, 'Mengalirkan minuman ke pembalap lewat selang di helm.'],
        ['Layar', 210, 106, 210, 22, 'Menampilkan gigi, waktu lap, selisih waktu, status baterai, dan peringatan.'],
        ['DRS / Override', 315, 95, 400, 95, 'DRS membuka sayap belakang untuk menyalip (sampai 2025). Mulai 2026 fungsinya digantikan mode aero aktif dan mode dorongan listrik tambahan.'],
        ['Engine mode', 315, 135, 400, 135, 'Memutar pilihan peta mesin dan energi: hemat, standar, atau serang.'],
        ['Pit limiter', 315, 170, 400, 170, 'Membatasi kecepatan mobil di jalur pit agar tidak melanggar batas.']];
    R[7] = () => `
        <h1 class="pt-h1"><small>07 / Pusat kendali</small>Setir</h1>
        <p class="pt-lead">Lebih mirip pusat komputer daripada kemudi. Ketuk nomor atau tombol di setir untuk melihat fungsinya.</p>
        <div class="m7-wrap pt-sel">
            <svg class="m7-svg" viewBox="0 0 420 220" aria-label="Diagram setir F1">
                <rect x="38" y="52" width="56" height="130" rx="28" class="grip"/><rect x="326" y="52" width="56" height="130" rx="28" class="grip"/><rect x="70" y="62" width="280" height="110" rx="18" class="body"/>
                <rect x="160" y="86" width="100" height="38" rx="4" class="disp"/><text x="210" y="110" text-anchor="middle" class="dtxt">N  1  2  3</text>
                ${SW.map(([t, x, y, bx, by], i) => `<g class="pin${i ? '' : ' act'}" data-sel="${i}" tabindex="0" role="button" aria-label="${t}"><line x1="${x}" y1="${y}" x2="${bx}" y2="${by}"/><circle class="btn" cx="${x}" cy="${y}" r="${i === 5 ? 12 : 9}"/><circle class="badge" cx="${bx}" cy="${by}" r="13"/><text x="${bx}" y="${by + 4}" text-anchor="middle">${i + 1}</text></g>`).join('')}
            </svg>
            <div class="m7-side"><div class="m7-legend">${SW.map(([t], i) => `<button type="button" data-sel="${i}"${i ? '' : ' class="act"'}><em>${i + 1}</em>${t}</button>`).join('')}</div>
                ${SW.map(([t, , , , , d], i) => `<div class="pt-card m7-detail" data-show="${i}"${i ? ' hidden' : ''}><b>${t}</b><p>${d}</p></div>`).join('')}</div>
        </div>${note('Tata letak tombol berbeda di setiap tim. Diagram ini adalah contoh umum.')}`;

    // 08 - FAST TIMELINE
    const ST = [['Tarik paddle', 'Pembalap menarik paddle di balik setir. Tidak ada kopling manual saat berpindah gigi.'], ['ECU membaca perintah', 'Komputer memeriksa putaran mesin dan kecepatan, lalu menyesuaikan tenaga agar perpindahan mulus.'], ['Aktuator hidrolik bergerak', 'Piston hidrolik menggerakkan selector yang memilih gigi berikutnya.'], ['Gigi baru terkunci', 'Girboks seamless menyambung gigi baru hampir bersamaan dengan melepas gigi lama, sehingga tenaga tidak putus.'], ['Tenaga kembali penuh', 'Mobil melaju lagi tanpa jeda yang terasa. Seluruh proses hanya puluhan milidetik.']];
    R[8] = () => `
        <h1 class="pt-h1"><small>08 / Transmisi</small>Girboks</h1>
        <p class="pt-lead">8 percepatan dengan perpindahan seamless. Satu kali pindah gigi hanya makan waktu puluhan milidetik (sekitar 0,02 - 0,05 detik).</p>
        <div class="m8-top"><button type="button" class="pt-next m8-play">▶ Mainkan simulasi</button><div class="m8-gear" aria-live="polite">Gigi <b>4</b></div></div>
        <div class="m8-track"><i class="m8-prog"></i></div>
        <ol class="m8-steps">${ST.map(([t, d], i) => `<li><span class="n">${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
        ${note('Angka waktu adalah kisaran umum. Urutan langkah disederhanakan untuk penjelasan.')}`;

    /* ---------- RAKIT HALAMAN ---------- */
    const chrome = n => `
        <div class="pt-top"><button type="button" class="pt-back" onclick="partBack()">Kembali ke Ringkasan</button><span class="pt-count">${pad(n)} / 08</span></div>${R[n]()}
        <div class="pt-foot">
            ${n > 1 ? `<button type="button" class="pt-prev" onclick="showPage('part-${n - 1}-page')">← ${pad(n - 1)} ${NAMES[n - 2]}</button>` : '<span></span>'}
            ${n < 8 ? `<button type="button" class="pt-next" onclick="showPage('part-${n + 1}-page')">Selanjutnya → ${pad(n + 1)} ${NAMES[n]}</button>`
                    : `<button type="button" class="pt-next" onclick="partBack()">Selesai · Kembali ke Ringkasan</button>`}
        </div>`;

    host.insertAdjacentHTML('afterend', NAMES.map((_, i) =>
        `<div id="part-${i + 1}-page" class="page pt pt-${i + 1}">${chrome(i + 1)}</div>`).join(''));
    NAMES.forEach((_, i) => { PAGE_THEMES['part-' + (i + 1) + '-page'] = 'theme-part-' + (i + 1); });

    window.partBack = () => {
        showPage('home-page');
        setTimeout(() => { const a = document.getElementById('nb-parts'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
    };

    /* ---------- INTERAKSI UMUM: tab / pin / daftar (data-sel & data-show) ---------- */
    function pick(el) {
        const c = el.closest('.pt-sel'); if (!c) return;
        const k = el.dataset.sel;
        c.querySelectorAll('[data-sel]').forEach(b => b.classList.toggle('act', b.dataset.sel === k));
        c.querySelectorAll('[data-show]').forEach(p => { p.hidden = p.dataset.show !== k; });
        c.dataset.cur = k;
    }
    document.querySelectorAll('.pt .pt-sel').forEach(c => { const f = c.querySelector('[data-sel]'); if (f) c.dataset.cur = f.dataset.sel; });
    document.addEventListener('click', e => { const b = e.target.closest('.pt [data-sel]'); if (b) pick(b); });
    document.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.pt g[data-sel]')) { e.preventDefault(); pick(e.target); }
    });

    /* ---------- hitung naik saat halaman dibuka ---------- */
    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function count(page) {
        page.querySelectorAll('[data-count]').forEach(s => {
            const to = +s.dataset.count, t0 = performance.now();
            if (REDUCE) { s.textContent = to; return; }
            (function f(t) { const p = Math.min(1, (t - t0) / 900); s.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(f); })(t0);
        });
    }
    /* ---------- simulasi girboks ---------- */
    let timer;
    function play(page) {
        const lis = [...page.querySelectorAll('.m8-steps li')], prog = page.querySelector('.m8-prog'), g = page.querySelector('.m8-gear b');
        clearInterval(timer); let i = 0;
        const step = () => { lis.forEach((l, j) => l.classList.toggle('now', j === i)); prog.style.width = ((i + 1) / lis.length * 100) + '%';
            g.textContent = i < 3 ? 4 : 5; if (++i >= lis.length) clearInterval(timer); };
        step(); timer = setInterval(step, REDUCE ? 400 : 900);
    }
    document.addEventListener('click', e => { if (e.target.closest('.m8-play')) play(document.getElementById('part-8-page')); });

    document.querySelectorAll('.pt').forEach(p => new MutationObserver(() => {
        if (p.classList.contains('active')) count(p); else if (p.id === 'part-8-page') clearInterval(timer);
    }).observe(p, { attributes: true, attributeFilter: ['class'] }));
})();