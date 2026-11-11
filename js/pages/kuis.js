/* =========================================================
   KUIS EDUKASI F1 - VERSI BERSIH
   - Kategori di kanan
   - Tanpa tema F1 & tanpa warna merah
   - Label opsi pakai kategori (bukan ABCD)
   - Tanpa nomor heading (01, 02) & tanpa panah
   - 200+ soal
   - Full paste
   ========================================================= */
(function () {
    'use strict';

    const KEY = 'f1-kuis-v2';
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================================
       BANK SOAL STATIS - 200+ SOAL
       Format: [kategori, pertanyaan, [pilihan, jawaban benar di index 0], penjelasan]
       ========================================================= */
    const BANK = [
        /* ===== BENDERA (15 soal) ===== */
        ['bendera', 'Apa arti bendera kuning yang dikibarkan petugas lintasan?', ['Ada bahaya di depan, dilarang menyalip', 'Balapan selesai', 'Lintasan aman', 'Pembalap penalti'], 'Bendera kuning = bahaya di depan, wajib melambat & dilarang menyalip.'],
        ['bendera', 'Bendera apa yang menandakan sesi dihentikan sepenuhnya?', ['Merah', 'Kuning', 'Hijau', 'Biru'], 'Bendera merah menghentikan sesi. Semua mobil masuk pit.'],
        ['bendera', 'Bendera kotak-kotak hitam putih menandakan?', ['Balapan berakhir', 'Hujan turun', 'Safety car keluar', 'Masuk pit'], 'Bendera kotak-kotak = balapan selesai.'],
        ['bendera', 'Setelah bahaya ditangani, bendera apa yang menandakan lintasan aman?', ['Hijau', 'Merah', 'Putih', 'Hitam'], 'Bendera hijau = lintasan aman, boleh balapan normal.'],
        ['bendera', 'Bendera biru ditunjukkan kepada pembalap untuk?', ['Memberi jalan kepada mobil lebih cepat', 'Bahaya di depan', 'Masuk pit', 'Balapan dihentikan'], 'Bendera biru = pembalap lambat harus memberi jalan.'],
        ['bendera', 'Bendera putih di F1 menandakan?', ['Ada kendaraan lambat di lintasan', 'Pembalap menyerah', 'Hujan akan turun', 'Sesi baru'], 'Bendera putih = ada kendaraan lambat (misal mobil medis).'],
        ['bendera', 'Pembalap yang mendapat bendera hitam harus?', ['Masuk pit karena didiskualifikasi', 'Melambat', 'Memberi jalan', 'Ganti ban'], 'Bendera hitam = diskualifikasi.'],
        ['bendera', 'Bendera hitam dengan lingkaran oranye menandakan?', ['Masalah mekanis, harus masuk pit', 'Diskualifikasi', 'Peringatan', 'Sesi dihentikan'], 'Lingkaran oranye = masalah mekanis (bodi lepas, cairan bocor).'],
        ['bendera', 'Bendera diagonal hitam-putih adalah?', ['Peringatan perilaku tidak sportif', 'Garis finis', 'Start balapan', 'Masalah mekanis'], 'Bendera hitam-putih = peringatan resmi.'],
        ['bendera', 'Dua bendera kuning berarti?', ['Bahaya serius', 'Balapan selesai', 'Bahaya ringan', 'Masuk pit'], 'Dua bendera kuning = bahaya lebih serius.'],
        ['bendera', 'Petugas pengibar bendera disebut?', ['Marshal', 'Steward', 'Scrutineer', 'Mekanik'], 'Marshal bertugas di pos sepanjang sirkuit.'],
        ['bendera', 'Bendera kuning dikibarkan di berapa pos?', ['Semua pos sebelum titik bahaya', 'Hanya pos bahaya', 'Hanya garis start', 'Hanya pit'], 'Bendera kuning dikibarkan di pos sebelum bahaya.'],
        ['bendera', 'Bendera merah dikibarkan di?', ['Semua pos sekeliling sirkuit', 'Hanya garis finis', 'Hanya pit', 'Hanya tikungan 1'], 'Bendera merah = semua pos.'],
        ['bendera', 'Bendera biru biasanya ditunjukkan kepada?', ['Pembalap yang akan dilap', 'Pembalap terdepan', 'Pemenang', 'Pembalap pit'], 'Bendera biru untuk pembalap yang akan dilap.'],
        ['bendera', 'Bendera hijau juga dikibarkan saat?', ['Sesi latihan/kualifikasi dibuka', 'Balapan selesai', 'Hujan', 'Safety car'], 'Bendera hijau = lintasan siap dipakai.'],

        /* ===== BAN (20 soal) ===== */
        ['ban', 'Ban kering paling lunak dengan grip terbesar adalah?', ['Soft', 'Hard', 'Medium', 'Intermediate'], 'Soft (garis merah) = grip terbesar, cepat aus.'],
        ['ban', 'Ban dengan garis putih yang paling awet adalah?', ['Hard', 'Soft', 'Medium', 'Full Wet'], 'Hard (garis putih) = paling awet.'],
        ['ban', 'Ban apa yang dipakai saat lintasan basah ringan?', ['Intermediate', 'Full Wet', 'Soft', 'Hard'], 'Intermediate (garis hijau) = lintasan lembap.'],
        ['ban', 'Alur dalam ban Full Wet berfungsi untuk?', ['Membuang air agar tidak aquaplaning', 'Mendinginkan rem', 'Menambah kecepatan', 'Mengurangi bobot'], 'Alur Full Wet membuang air.'],
        ['ban', 'Ban Medium ditandai garis warna?', ['Kuning', 'Merah', 'Putih', 'Biru'], 'Soft merah, Medium kuning, Hard putih.'],
        ['ban', 'Ban Intermediate ditandai garis warna?', ['Hijau', 'Biru', 'Kuning', 'Oranye'], 'Intermediate = hijau.'],
        ['ban', 'Ban Full Wet ditandai garis warna?', ['Biru', 'Hijau', 'Merah', 'Putih'], 'Full Wet = biru.'],
        ['ban', 'Siapa pemasok ban tunggal F1?', ['Pirelli', 'Michelin', 'Bridgestone', 'Goodyear'], 'Pirelli sejak 2011.'],
        ['ban', 'Ukuran pelek roda F1 sejak 2022?', ['18 inci', '13 inci', '16 inci', '20 inci'], 'Sejak 2022 = 18 inci.'],
        ['ban', 'Ban kering F1 disebut slick karena?', ['Permukaannya halus tanpa alur', 'Licin', 'Beralur dalam', 'Berminyak'], 'Slick = halus tanpa alur.'],
        ['ban', 'Penurunan performa ban karena aus disebut?', ['Degradasi', 'Aquaplaning', 'Slipstream', 'Parc fermé'], 'Degradasi = penurunan performa.'],
        ['ban', 'Ban F1 harus dipanaskan sampai suhu kerja karena?', ['Karet optimal di suhu tertentu', 'Lebih ringan', 'Warna terlihat', 'Tidak bocor'], 'Ban butuh suhu kerja optimal.'],
        ['ban', 'Pada balapan kering, wajib pakai berapa jenis ban?', ['Minimal dua', 'Satu', 'Tiga', 'Empat'], 'Wajib dua jenis ban kering berbeda.'],
        ['ban', 'Berapa senyawa ban kering Pirelli tiap balapan?', ['3', '2', '5', '6'], 'Hard, Medium, Soft = 3 senyawa.'],
        ['ban', 'Ban apa yang paling cepat mencapai suhu kerja?', ['Soft', 'Hard', 'Medium', 'Full Wet'], 'Soft paling cepat panas.'],
        ['ban', 'Berapa jumlah kru yang terlibat dalam pit stop?', ['Sekitar 20 orang', '5 orang', '50 orang', '100 orang'], 'Sekitar 20 kru terlibat.'],
        ['ban', 'Pit stop tercepat di F1 sekitar?', ['Di bawah 2 detik', '10 detik', '5 detik', '1 menit'], 'Di bawah 2 detik untuk 4 ban.'],
        ['ban', 'Jenis ban untuk hujan deras dengan genangan?', ['Full Wet', 'Intermediate', 'Soft', 'Hard'], 'Full Wet untuk hujan deras.'],
        ['ban', 'Warna ban Intermediate di sisi?', ['Hijau', 'Biru', 'Merah', 'Kuning'], 'Intermediate = hijau.'],
        ['ban', 'Berapa lama ban Soft biasanya bertahan?', ['Beberapa lap saja', 'Sepanjang balapan', '50 lap', '100 lap'], 'Soft cepat aus, hanya beberapa lap.'],

        /* ===== KOMPONEN (25 soal) ===== */
        ['komponen', 'Struktur serat karbon tempat pembalap duduk disebut?', ['Monocoque', 'Diffuser', 'Girboks', 'Halo'], 'Monocoque = rangka utama & sel keselamatan.'],
        ['komponen', 'Perangkat titanium di atas kokpit bernama?', ['Halo', 'Monocoque', 'Sayap', 'Power unit'], 'Halo wajib sejak 2018.'],
        ['komponen', 'Downforce terbesar F1 modern dihasilkan oleh?', ['Lantai & diffuser', 'Setir', 'Rem', 'Girboks'], 'Ground effect dari lantai = downforce terbesar.'],
        ['komponen', 'Berapa rasio gigi maju girboks F1?', ['8', '6', '10', '5'], '8 rasio maju, 1 mundur.'],
        ['komponen', 'Mesin F1 modern berkapasitas?', ['1,6 liter V6 turbo', '3,0 liter V10', '2,4 liter V8', '1,0 liter V4'], 'V6 turbo 1,6 liter + hybrid.'],
        ['komponen', 'Mulai 2026, apa pengganti DRS?', ['Aerodinamika aktif', 'Mesin diesel', 'Sayap kaku', 'Roda besar'], 'Regulasi 2026 = aero aktif.'],
        ['komponen', 'Komponen yang mengubah energi pengereman jadi listrik?', ['MGU-K', 'Diffuser', 'Halo', 'Plank'], 'MGU-K = pemulih energi kinetik.'],
        ['komponen', 'MGU-H dihapus mulai musim?', ['2026', '2022', '2018', '2030'], 'Regulasi 2026 hapus MGU-H.'],
        ['komponen', 'Cakram rem F1 terbuat dari?', ['Karbon', 'Besi', 'Aluminium', 'Kayu'], 'Karbon tahan suhu lebih dari 1000 derajat Celsius.'],
        ['komponen', 'Mulai 2026, bahan bakar F1 berupa?', ['Bahan bakar berkelanjutan', 'Solar', 'Hidrogen', 'Listrik'], 'Sustainable fuel 2026.'],
        ['komponen', 'Berat minimum mobil F1 2026 sekitar?', ['768 kg', '850 kg', '600 kg', '1000 kg'], 'Sekitar 768 kg.'],
        ['komponen', 'Papan bawah lantai yang diperiksa keausannya?', ['Plank', 'Halo', 'Wishbone', 'Diffuser'], 'Plank = papan keausan.'],
        ['komponen', 'Bahan utama bodi F1 adalah?', ['Serat karbon', 'Baja', 'Kayu', 'Plastik'], 'Serat karbon = kuat & ringan.'],
        ['komponen', 'Batas putaran mesin F1?', ['15.000 rpm', '5.000 rpm', '25.000 rpm', '10.000 rpm'], 'Batas 15.000 rpm.'],
        ['komponen', 'Fungsi utama sayap depan?', ['Downforce & arahkan udara', 'Pendingin mesin', 'Tempat bahan bakar', 'Salur tenaga'], 'Sayap depan arahkan aliran udara.'],
        ['komponen', 'Data real-time dari sensor mobil disebut?', ['Telemetri', 'Parc fermé', 'Stint', 'Formation lap'], 'Telemetri = data sensor.'],
        ['komponen', 'Pembalap ganti gigi pakai?', ['Paddle di setir', 'Tuas lantai', 'Pedal kopling', 'Tombol dasbor'], 'Paddle shift di setir.'],
        ['komponen', 'Roda mana yang digerakkan mesin F1?', ['Belakang', 'Depan', 'Keempat', 'Kanan'], 'F1 = penggerak roda belakang.'],
        ['komponen', 'Berapa total tenaga power unit F1 modern?', ['Sekitar 1000 hp', '500 hp', '2000 hp', '300 hp'], 'Sekitar 1000 hp gabungan.'],
        ['komponen', 'Apa fungsi diffuser?', ['Memperlambat & lebarkan aliran udara', 'Mendinginkan mesin', 'Tempat bahan bakar', 'Salur tenaga'], 'Diffuser = kelola aliran bawah.'],
        ['komponen', 'Bahan halo F1 adalah?', ['Titanium', 'Aluminium', 'Baja', 'Karbon'], 'Halo = titanium.'],
        ['komponen', 'Berat halo sekitar?', ['7 kg', '20 kg', '1 kg', '50 kg'], 'Halo sekitar 7 kg.'],
        ['komponen', 'Berapa jumlah tim F1 2026?', ['11 tim', '10 tim', '12 tim', '8 tim'], '11 tim, 22 pembalap.'],
        ['komponen', 'Sistem pemulihan energi di F1 disebut?', ['ERS', 'DRS', 'ABS', 'TC'], 'ERS = Energy Recovery System.'],
        ['komponen', 'Apa itu DRS?', ['Drag Reduction System', 'Direct Race System', 'Driver Radio System', 'Data Recording System'], 'DRS = Drag Reduction System.'],

        /* ===== ISTILAH (25 soal) ===== */
        ['istilah', 'Posisi start paling depan hasil kualifikasi disebut?', ['Pole position', 'Pit stop', 'Undercut', 'Grid'], 'Pole = start paling depan.'],
        ['istilah', 'Strategi masuk pit lebih awal disebut?', ['Undercut', 'Overcut', 'Slipstream', 'Box'], 'Undercut = pit lebih awal.'],
        ['istilah', 'Berapa tahap kualifikasi F1?', ['3 (Q1-Q3)', '2', '4', '1'], 'Q1, Q2, Q3.'],
        ['istilah', 'Saat safety car keluar, pembalap wajib?', ['Berbaris di belakang & dilarang menyalip', 'Masuk pit', 'Berhenti', 'Ngebut'], 'Safety car = dilarang menyalip.'],
        ['istilah', 'Pit stop normal berlangsung sekitar?', ['2-3 detik', '30 detik', '1 menit', '10-15 detik'], '2-3 detik.'],
        ['istilah', 'Memanfaatkan udara bertekanan rendah di balik mobil depan disebut?', ['Slipstream', 'Undercut', 'Pit stop', 'Stint'], 'Slipstream = manfaatkan udara.'],
        ['istilah', 'Perintah radio "box, box" berarti?', ['Masuk pit', 'Menyalip', 'Safety car', 'Lap terakhir'], 'Box = masuk pit.'],
        ['istilah', 'Aturan yang batasi setelan mobil setelah kualifikasi?', ['Parc fermé', 'Cost cap', 'Formation', 'Stint'], 'Parc fermé = batasi setelan.'],
        ['istilah', 'Lap pemanasan sebelum start disebut?', ['Formation lap', 'Fastest lap', 'Out lap', 'In lap'], 'Formation lap = pemanasan.'],
        ['istilah', 'Pembalap yang tertinggal satu lap disebut?', ['Lapped', 'Pole sitter', 'Rookie', 'Marshal'], 'Lapped = kena lap.'],
        ['istilah', 'DNF berarti?', ['Did Not Finish', 'Did Not Fight', 'Driver Needs Fuel', 'Downforce Not Found'], 'DNF = tidak finis.'],
        ['istilah', 'Balapan pendek sekitar 100 km disebut?', ['Sprint', 'Qualifying', 'FP', 'Formation'], 'Sprint = balapan pendek.'],
        ['istilah', 'Gelar untuk tim berdasarkan poin kedua pembalap?', ['Juara Konstruktor', 'Pole sitter', 'Juara bertahan', 'Pembalap terbaik'], 'Konstruktor = gelar tim.'],
        ['istilah', 'Turbulensi di belakang mobil yang kurangi downforce?', ['Dirty air', 'Slipstream', 'Aquaplaning', 'Bottoming'], 'Dirty air = turbulensi.'],
        ['istilah', 'Periode balapan di antara dua pit stop disebut?', ['Stint', 'Sprint', 'Formasi', 'Grid'], 'Stint = periode antara pit.'],
        ['istilah', 'Bagian belakang mobil tergelincir keluar tikungan?', ['Oversteer', 'Understeer', 'Slipstream', 'Graining'], 'Oversteer = belakang slip.'],
        ['istilah', 'Mobil melebar keluar tikungan karena roda depan hilang grip?', ['Understeer', 'Oversteer', 'Undercut', 'Overcut'], 'Understeer = depan slip.'],
        ['istilah', 'Balapan F1 dimulai ketika?', ['Lima lampu merah padam', 'Bendera hijau', 'Kotak-kotak', 'Sirene'], 'Lampu merah padam = start.'],
        ['istilah', 'Berapa poin pemenang balapan utama?', ['25', '18', '15', '20'], 'Pemenang = 25 poin.'],
        ['istilah', 'Berapa poin pemenang sprint?', ['8', '10', '25', '5'], 'Sprint = 8 poin.'],
        ['istilah', 'Pembalap dengan kemenangan GP terbanyak?', ['Lewis Hamilton', 'Michael Schumacher', 'Max Verstappen', 'Sebastian Vettel'], 'Hamilton lebih dari 100 kemenangan.'],
        ['istilah', 'Pembalap dengan 7 gelar dunia?', ['Schumacher & Hamilton', 'Senna', 'Prost', 'Verstappen'], 'Schumacher & Hamilton = 7 gelar.'],
        ['istilah', 'Apa itu "purple sector"?', ['Sektor tercepat', 'Sektor lambat', 'Sektor kuning', 'Sektor pit'], 'Purple = sektor tercepat.'],
        ['istilah', 'Apa itu "green sector"?', ['Sektor lebih cepat dari sebelumnya', 'Sektor lambat', 'Sektor bahaya', 'Sektor pit'], 'Green = lebih cepat dari sebelumnya.'],
        ['istilah', 'Apa itu "yellow sector"?', ['Sektor lebih lambat', 'Sektor cepat', 'Sektor bahaya', 'Sektor pit'], 'Yellow = lebih lambat dari sebelumnya.'],

        /* ===== SIRKUIT (20 soal) ===== */
        ['sirkuit', 'Sirkuit terpendek F1, jalan kota Monte Carlo, di?', ['Monako', 'Italia', 'Belgia', 'Jepang'], 'Monako = terpendek & sempit.'],
        ['sirkuit', 'Spa-Francorchamps dengan Eau Rouge di?', ['Belgia', 'Prancis', 'Belanda', 'Jerman'], 'Spa = Belgia.'],
        ['sirkuit', 'Monza, Kuil Kecepatan, di?', ['Italia', 'Spanyol', 'Austria', 'Hungaria'], 'Monza = Italia.'],
        ['sirkuit', 'Suzuka terkenal karena bentuk?', ['Angka 8', 'Persegi', 'Lurus', 'Oval'], 'Suzuka = angka 8.'],
        ['sirkuit', 'GP malam pertama F1 2008 di?', ['Singapura', 'Bahrain', 'Abu Dhabi', 'Qatar'], 'Singapura = GP malam pertama.'],
        ['sirkuit', 'Silverstone, GP pertama 1950, dibangun di bekas?', ['Pangkalan udara', 'Pabrik', 'Stasiun', 'Pelabuhan'], 'Silverstone = bekas pangkalan RAF.'],
        ['sirkuit', 'Interlagos di kota?', ['Sao Paulo', 'Rio', 'Buenos Aires', 'Mexico City'], 'Interlagos = Sao Paulo.'],
        ['sirkuit', 'Sirkuit Meksiko menantang karena?', ['Letak tinggi, udara tipis', 'Berpasir', 'Hujan', 'Tepi laut'], 'Meksiko = 2.200 m di atas laut.'],
        ['sirkuit', 'Yas Marina Circuit di?', ['Abu Dhabi', 'Doha', 'Sakhir', 'Jeddah'], 'Yas Marina = Abu Dhabi.'],
        ['sirkuit', 'Albert Park di kota?', ['Melbourne', 'Sydney', 'Perth', 'Brisbane'], 'Albert Park = Melbourne.'],
        ['sirkuit', 'COTA di kota?', ['Austin', 'Dallas', 'Miami', 'Las Vegas'], 'COTA = Austin, Texas.'],
        ['sirkuit', 'GP Las Vegas melewati kawasan?', ['The Strip', 'Hollywood', 'Times Square', 'Sunset'], 'Las Vegas = The Strip.'],
        ['sirkuit', 'Sirkuit Baku di negara?', ['Azerbaijan', 'Georgia', 'Turki', 'Kazakhstan'], 'Baku = Azerbaijan.'],
        ['sirkuit', 'Lusail dekat kota?', ['Doha', 'Dubai', 'Riyadh', 'Manama'], 'Lusail = dekat Doha.'],
        ['sirkuit', 'Sirkuit terpanjang di kalender F1?', ['Spa-Francorchamps', 'Monza', 'Silverstone', 'Suzuka'], 'Spa = 7 km.'],
        ['sirkuit', 'Tikungan paling lambat di F1 ada di?', ['Monako (Fairmont Hairpin)', 'Monza', 'Spa', 'Suzuka'], 'Fairmont Hairpin = paling lambat.'],
        ['sirkuit', 'Sirkuit baru 2026 di Spanyol?', ['Madring', 'Barcelona', 'Valencia', 'Jerez'], 'Madring = Madrid, debut 2026.'],
        ['sirkuit', 'Sirkuit dengan banking 24% di 2026?', ['Madring', 'Monza', 'Spa', 'Zandvoort'], 'Madring = banking 24%.'],
        ['sirkuit', 'Zandvoort di negara?', ['Belanda', 'Belgia', 'Jerman', 'Prancis'], 'Zandvoort = Belanda.'],
        ['sirkuit', 'Hungaroring dijuluki?', ['Monako tanpa tembok', 'Kuil Kecepatan', 'Rumah F1', 'Sirkuit Hujan'], 'Hungaroring = Monako tanpa tembok.'],

        /* ===== SEJARAH (20 soal) ===== */
        ['sejarah', 'GP pertama F1 1950 di?', ['Silverstone, Inggris', 'Monza', 'Monako', 'Spa'], 'Silverstone 13 Mei 1950.'],
        ['sejarah', 'Juara dunia F1 pertama 1950?', ['Giuseppe Farina', 'Fangio', 'Ascari', 'Moss'], 'Farina = juara pertama.'],
        ['sejarah', 'Dua pembalap dengan 7 gelar dunia?', ['Schumacher & Hamilton', 'Senna & Prost', 'Verstappen & Vettel', 'Lauda & Hunt'], 'Schumacher & Hamilton = 7 gelar.'],
        ['sejarah', 'Pembalap pertama dengan lebih dari 100 kemenangan?', ['Hamilton', 'Schumacher', 'Senna', 'Vettel'], 'Hamilton lebih dari 100 menang.'],
        ['sejarah', 'Pembalap termuda juara dunia (saat itu)?', ['Vettel', 'Verstappen', 'Hamilton', 'Alonso'], 'Vettel juara 2010 di usia 23.'],
        ['sejarah', 'Ayrton Senna dari negara?', ['Brasil', 'Argentina', 'Italia', 'Prancis'], 'Senna = Brasil.'],
        ['sejarah', 'Fangio dengan 5 gelar dari?', ['Argentina', 'Brasil', 'Spanyol', 'Inggris'], 'Fangio = Argentina.'],
        ['sejarah', 'Tim yang ikut setiap musim sejak 1950?', ['Ferrari', 'McLaren', 'Williams', 'Mercedes'], 'Ferrari = selalu ikut.'],
        ['sejarah', 'Kejuaraan Konstruktor pertama diberikan tahun?', ['1958', '1950', '1970', '1990'], '1958 = konstruktor pertama.'],
        ['sejarah', 'Tim juara konstruktor 8x beruntun 2014-2021?', ['Mercedes', 'Red Bull', 'Ferrari', 'McLaren'], 'Mercedes = 8x beruntun.'],
        ['sejarah', 'Schumacher 5 gelar beruntun 2000-2004 bersama?', ['Ferrari', 'Benetton', 'Mercedes', 'Williams'], 'Schumacher = Ferrari.'],
        ['sejarah', 'Juara dunia 2021 yang menang di lap terakhir?', ['Verstappen', 'Hamilton', 'Leclerc', 'Bottas'], 'Verstappen juara 2021.'],
        ['sejarah', 'Tim baru ke-11 di grid 2026?', ['Cadillac', 'Hyundai', 'Toyota', 'Lamborghini'], 'Cadillac = tim ke-11.'],
        ['sejarah', 'Juara dunia 2025?', ['Lando Norris', 'Verstappen', 'Piastri', 'Leclerc'], 'Norris juara 2025.'],
        ['sejarah', 'GP Jerman 1976 kecelakaan fatal menimpa?', ['Niki Lauda', 'James Hunt', 'Senna', 'Prost'], 'Lauda = kecelakaan Nurburgring.'],
        ['sejarah', 'Tragedi Imola 1994 menimpa?', ['Ayrton Senna', 'Lauda', 'Schumacher', 'Prost'], 'Senna wafat di Imola 1994.'],
        ['sejarah', 'Era hybrid dimulai tahun?', ['2014', '2010', '2018', '2020'], 'Era hybrid 2014.'],
        ['sejarah', 'Pembalap dengan kemenangan terbanyak dalam 1 musim?', ['Verstappen (19)', 'Schumacher (13)', 'Vettel (13)', 'Hamilton (11)'], 'Verstappen 19 menang 2023.'],
        ['sejarah', 'F1 pertama kali digelar tahun?', ['1950', '1945', '1960', '1930'], 'F1 mulai 1950.'],
        ['sejarah', 'Ayrton Senna juara dunia berapa kali?', ['3', '2', '4', '5'], 'Senna juara 3x (1988, 1990, 1991).'],

        /* ===== ATURAN (15 soal) ===== */
        ['aturan', 'Pemenang balapan F1 dapat berapa poin?', ['25', '20', '30', '15'], 'Pemenang = 25 poin.'],
        ['aturan', 'Peringkat 2 balapan utama dapat poin?', ['18', '20', '15', '22'], 'Peringkat 2 = 18 poin.'],
        ['aturan', 'Berapa pembalap teratas yang dapat poin?', ['10', '5', '8', '20'], 'Top 10 dapat poin.'],
        ['aturan', 'Pemenang sprint dapat poin?', ['8', '10', '25', '5'], 'Sprint = 8 poin.'],
        ['aturan', 'Batas pengeluaran tim per musim disebut?', ['Cost cap', 'Parc ferme', 'Grid penalty', 'Pit window'], 'Cost cap = batas biaya.'],
        ['aturan', 'Berapa mobil di grid F1 2026?', ['22', '20', '24', '18'], '11 tim x 2 = 22 mobil.'],
        ['aturan', 'Berapa pembalap di Q3?', ['10', '5', '8', '15'], 'Q3 = 10 pembalap.'],
        ['aturan', 'Jarak balapan F1 reguler?', ['Sekitar 305 km', '100 km', '500 km', '200 km'], 'Sekitar 305 km.'],
        ['aturan', 'Batas waktu maksimal balapan F1?', ['2 jam', '1 jam', '90 menit', '3 jam'], 'Maks 2 jam.'],
        ['aturan', 'Hukuman mundur posisi di grid disebut?', ['Grid penalty', 'Drive-through', 'Stop-go', 'Parc ferme'], 'Grid penalty = mundur posisi.'],
        ['aturan', 'Batas kecepatan jalur pit umumnya?', ['80 km/jam', '200 km/jam', '30 km/jam', '120 km/jam'], 'Pit lane = 80 km/jam.'],
        ['aturan', 'Berapa lama waktu penguncian jadwal di sistem reservasi?', ['30 menit', '1 jam', '5 menit', 'Tidak ada'], 'Lock 30 menit.'],
        ['aturan', 'Hukuman drive-through berarti?', ['Melintasi pit lane', 'Berhenti di pit', 'Diskualifikasi', 'Denda'], 'Drive-through = lewat pit tanpa berhenti.'],
        ['aturan', 'Hukuman stop-go berarti?', ['Berhenti di pit', 'Lewat pit', 'Diskualifikasi', 'Denda'], 'Stop-go = berhenti di pit 10 detik.'],
        ['aturan', 'Pembalap yang menabrak lawan sengaja bisa dapat?', ['Diskualifikasi', 'Poin bonus', 'Pole', 'Podium'], 'Sengaja tabrak = diskualifikasi.']
    ];

    /* =========================================================
       SOAL DINAMIS dari data website (teamsData & driversData)
       ========================================================= */
    function dynamicQuestions() {
        const out = [];
        const pick = (pool, n) => shuffle(pool).slice(0, n);
        if (typeof teamsData !== 'undefined' && Array.isArray(teamsData)) {
            const bases = [...new Set(teamsData.map(t => t.base))];
            const pus = [...new Set(teamsData.map(t => t.pu))];
            const fulls = [...new Set(teamsData.map(t => t.full).filter(Boolean))];
            const names = teamsData.map(t => t.name);
            teamsData.forEach(t => {
                const wrongB = pick(bases.filter(b => b !== t.base), 3);
                if (wrongB.length === 3) out.push(['tim', 'Di mana markas tim ' + t.name + '?', [t.base, ...wrongB], 'Markas ' + t.name + ' (' + t.full + ') di ' + t.base + '.']);
                const sameBase = teamsData.filter(x => x.base === t.base).length;
                if (sameBase === 1 && names.length > 3) out.push(['tim', 'Tim mana yang bermarkas di ' + t.base + '?', [t.name, ...pick(names.filter(n => n !== t.name), 3)], t.name + ' bermarkas di ' + t.base + '.']);
                const others = pick(teamsData.filter(x => x !== t).flatMap(x => x.drivers || []), 3);
                if (t.drivers && t.drivers[0] && others.length === 3) out.push(['tim', 'Siapa salah satu pembalap tim ' + t.name + '?', [t.drivers[0], ...others], t.name + ' dibela ' + t.drivers.join(' dan ') + '.']);
                const wrongP = pick(pus.filter(p => p !== t.pu), 3);
                if (wrongP.length === 3) out.push(['tim', 'Power unit apa yang dipakai tim ' + t.name + '?', [t.pu, ...wrongP], t.name + ' pakai power unit ' + t.pu + '.']);
                const wrongF = pick(fulls.filter(f => f !== t.full), 3);
                if (t.full && wrongF.length === 3) out.push(['tim', 'Apa nama resmi tim ' + t.name + '?', [t.full, ...wrongF], 'Nama lengkapnya ' + t.full + '.']);
                const sameP = teamsData.filter(x => x.pu === t.pu).length;
                if (sameP === 1 && names.length > 3) out.push(['tim', 'Tim mana yang pakai power unit ' + t.pu + '?', [t.name, ...pick(names.filter(n => n !== t.name), 3)], t.name + ' satu-satunya tim pakai power unit ' + t.pu + '.']);
                if (t.drivers && t.drivers.length === 2) {
                    const o2 = pick(teamsData.filter(x => x !== t).flatMap(x => x.drivers || []), 3);
                    if (o2.length === 3) out.push(['pembalap', 'Siapa rekan setim ' + t.drivers[0] + ' di ' + t.name + '?', [t.drivers[1], ...o2], t.drivers[0] + ' satu tim dengan ' + t.drivers[1] + ' di ' + t.name + '.']);
                }
            });
        }
        if (typeof driversData !== 'undefined') {
            const list = Object.values(driversData).filter(d => d.stats);
            const nums = [...new Set(list.map(d => d.stats['Nomor']).filter(n => n != null))];
            const yearOf = d => { const m = /\d{4}/.exec(String(d.stats['Debut F1'] || '')); return m ? m[0] : null; };
            const years = [...new Set(list.map(yearOf).filter(Boolean))];
            const teamList = (typeof teamsData !== 'undefined' && Array.isArray(teamsData)) ? teamsData.map(t => t.name) : [];
            list.forEach(d => {
                const no = d.stats['Nomor'];
                if (no != null) {
                    const wrong = pick(nums.filter(n => n !== no), 3);
                    if (wrong.length === 3) out.push(['pembalap', 'Berapa nomor balap ' + d.name + '?', [String(no), ...wrong.map(String)], d.name + ' (' + d.team + ') pakai nomor ' + no + ', debut F1 ' + (d.stats['Debut F1'] || '-') + '.']);
                }
                const y = yearOf(d);
                if (y) {
                    const wrongY = pick(years.filter(v => v !== y), 3);
                    if (wrongY.length === 3) out.push(['pembalap', 'Pada tahun berapa ' + d.name + ' debut di F1?', [y, ...wrongY], d.name + ' debut F1 pada ' + y + '.']);
                }
                const tm = (typeof teamsData !== 'undefined' && Array.isArray(teamsData)) ? teamsData.find(t => (t.drivers || []).includes(d.name)) : null;
                if (tm && teamList.length > 3) out.push(['pembalap', d.name + ' membela tim apa musim ini?', [tm.name, ...pick(teamList.filter(n => n !== tm.name), 3)], d.name + ' membalap untuk ' + tm.name + ' musim ini.']);
            });
        }
        return out;
    }

    /* =========================================================
       KATEGORI
       Format: [id, label, warna, tag]
       ========================================================= */
    const CATS = [
        ['semua',    'Semua Kategori',  '#c8ff2e', 'ALL'],
        ['bendera',  'Bendera',         '#ffb02e', 'FLAG'],
        ['ban',      'Ban',             '#50c878', 'TIRE'],
        ['komponen', 'Komponen Mobil',  '#9b59b6', 'PART'],
        ['istilah',  'Istilah',         '#4a90e2', 'TERM'],
        ['sirkuit',  'Sirkuit',         '#14b8a6', 'TRACK'],
        ['sejarah',  'Sejarah',         '#f59e0b', 'HIST'],
        ['aturan',   'Aturan',          '#ec4899', 'RULE'],
        ['tim',      'Tim',             '#6366f1', 'TEAM'],
        ['pembalap', 'Pembalap',        '#64748b', 'DRV']
    ];
    const CAT_LABEL = Object.fromEntries(CATS.map(c => [c[0], c[1]]));
    const catStyle = k => { const c = CATS.find(x => x[0] === k) || CATS[0]; return '--c:' + c[2]; };
    const catTag = k => { const c = CATS.find(x => x[0] === k) || CATS[0]; return c[3]; };
    const COUNTS = [5, 10, 20, 30];

    /* ---------- penyimpanan riwayat ---------- */
    function load() {
        try { const d = JSON.parse(localStorage.getItem(KEY) || '{}'); return { hist: Array.isArray(d.hist) ? d.hist.slice(-8) : [] }; }
        catch (e) { return { hist: [] }; }
    }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
    let data = load();

    /* ---------- halaman ---------- */
    const page = document.createElement('div');
    page.id = 'kuis-page';
    page.className = 'page';
    const host = document.getElementById('reflek-page') || document.getElementById('main-wrapper');
    if (host.id === 'main-wrapper') host.appendChild(page); else host.after(page);
    PAGE_THEMES['kuis-page'] = 'theme-kuis';
    if (typeof PAGE_TITLES !== 'undefined') PAGE_TITLES['kuis-page'] = 'Kuis';

    /* state */
    let st = { cat: 'semua', count: 10, qs: [], i: 0, score: 0, answers: [], streak: 0, bestStreak: 0 };

    const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
    const toTop = () => { try { window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' }); } catch (e) {} };

    /* peringkat ala klasemen F1 */
    function grade(n) {
        if (n === 100) return ['P1', 'Sempurna, selevel race engineer.'];
        if (n >= 80) return ['Podium', 'Hebat, kamu paham F1.'];
        if (n >= 60) return ['Zona poin', 'Lumayan, terus belajar.'];
        if (n >= 40) return ['Papan tengah', 'Masih bisa lebih baik.'];
        return ['Grid belakang', 'Baca lagi materinya, lalu coba lagi.'];
    }

    /* konfeti */
    function confetti() {
        if (REDUCE) return;
        const colors = ['#c8ff2e', '#50c878', '#ffb02e', '#9b59b6', '#14b8a6', '#4a90e2', '#ec4899'];
        const c = document.createElement('div');
        c.className = 'kz-confetti';
        document.body.appendChild(c);
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('i');
            p.style.left = Math.random() * 100 + 'vw';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDelay = Math.random() * 0.5 + 's';
            p.style.animationDuration = (1.8 + Math.random() * 1.2) + 's';
            p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            c.appendChild(p);
        }
        setTimeout(() => c.remove(), 3500);
    }

    /* ---------- pintasan keyboard ---------- */
    let keyFn = null;
    function stopKeys() { if (keyFn) { document.removeEventListener('keydown', keyFn); keyFn = null; } }
    function startKeys() {
        stopKeys();
        keyFn = e => {
            if (page.offsetParent === null || e.ctrlKey || e.metaKey || e.altKey) return;
            const opts = page.querySelectorAll('.kz-opt');
            if (!opts.length) return;
            const answered = opts[0].disabled;
            const k = e.key.toLowerCase();
            if (!answered) {
                const idx = ['a', 'b', 'c', 'd', '1', '2', '3', '4'].indexOf(k);
                if (idx > -1 && opts[idx % 4]) { e.preventDefault(); opts[idx % 4].click(); }
            } else if (k === 'enter' || k === ' ') {
                if (document.activeElement && document.activeElement.closest('.kz-foot')) return;
                const n = page.querySelector('.kz-btn');
                if (n) { e.preventDefault(); n.click(); }
            }
        };
        document.addEventListener('keydown', keyFn);
    }

    /* ---------- layar 1: mulai ---------- */
    function renderStart() {
        stopKeys();
        const all = BANK.concat(dynamicQuestions());
        const cnt = { semua: all.length };
        all.forEach(q => { cnt[q[0]] = (cnt[q[0]] || 0) + 1; });
        if (!cnt[st.cat]) st.cat = 'semua';
        const avail = cnt[st.cat] || 0;
        const h = data.hist, best = h.length ? Math.max(...h.map(x => x.n)) : null;

        page.innerHTML = `
        <section class="kz">
            <h1>Kuis <em>F1</em></h1>
            <p class="kz-sub">Pilih kategori dan jumlah soal, lalu jawab pilihan ganda. Setiap jawaban langsung diberi pembahasan.</p>

            <div class="kz-grid">
                <div class="kz-left">
                    <section>
                        <h2 class="kz-h">Jumlah Soal</h2>
                        <div class="kz-seg">${COUNTS.map(n => `<button type="button" class="${n === st.count ? 'on' : ''}" data-count="${n}" aria-pressed="${n === st.count}">${n} soal</button>`).join('')}</div>
                        <div class="kz-cta">
                            <button type="button" class="kz-btn kz-start">Mulai Kuis</button>
                            <p class="kz-note">${st.count > avail ? `Hanya ${avail} soal tersedia di kategori ini.` : 'Soal diacak setiap kali main.'}</p>
                        </div>
                    </section>

                    <section>
                        <h2 class="kz-h">Rekor Kamu</h2>
                        ${h.length ? `
                        <div class="kz-stats">
                            <div><b>${best}</b><span>Terbaik</span></div>
                            <div><b>${h[h.length - 1].n}</b><span>Terakhir</span></div>
                            <div><b>${avg(h.map(x => x.n))}</b><span>Rata-rata</span></div>
                            <div><b>${h.length}</b><span>Percobaan</span></div>
                        </div>
                        <ul class="kz-hist" aria-label="Riwayat nilai">${h.slice().reverse().map(x => `
                            <li style="${catStyle(x.c)}"><span>${esc(CAT_LABEL[x.c] || x.c)}</span><div class="kz-track"><i style="width:${Math.max(x.n, 3)}%"></i></div><b>${x.n}</b></li>`).join('')}</ul>
                        <button type="button" class="kz-link kz-reset">Hapus riwayat</button>`
                        : '<p class="kz-empty">Belum ada riwayat. Mainkan kuis pertamamu dan nilainya akan tercatat di sini.</p>'}
                    </section>
                </div>

                <div class="kz-right">
                    <h2 class="kz-h">Pilih Kategori</h2>
                    <div class="kz-tower">${CATS.map(c => `
                        <button type="button" class="kz-row ${c[0] === st.cat ? 'on' : ''}" data-cat="${c[0]}" style="--c:${c[2]}" aria-pressed="${c[0] === st.cat}" ${cnt[c[0]] ? '' : 'disabled'}>
                            <span class="kz-emoji">${c[3]}</span>
                            <b>${c[1]}</b>
                            <span class="kz-n">${cnt[c[0]] || 0} soal</span>
                        </button>`).join('')}</div>
                </div>
            </div>
        </section>`;

        page.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { st.cat = b.dataset.cat; renderStart(); }));
        page.querySelectorAll('[data-count]').forEach(b => b.addEventListener('click', () => { st.count = +b.dataset.count; renderStart(); }));
        page.querySelector('.kz-start').addEventListener('click', begin);
        const rs = page.querySelector('.kz-reset');
        if (rs) rs.addEventListener('click', () => { data = { hist: [] }; save(); renderStart(); });
    }

    function begin() {
        let pool = BANK.concat(dynamicQuestions());
        if (st.cat !== 'semua') pool = pool.filter(q => q[0] === st.cat);
        st.qs = shuffle(pool).slice(0, Math.min(st.count, pool.length))
            .map(([c, q, opts, exp]) => {
                const mixed = shuffle(opts.map((t, k) => ({ t, ok: k === 0 })));
                return { c, q, opts: mixed, k: mixed.findIndex(o => o.ok), exp };
            });
        if (!st.qs.length) return;
        st.i = 0; st.score = 0; st.answers = []; st.streak = 0; st.bestStreak = 0;
        renderQ();
        toTop();
    }

    /* ---------- layar 2: soal ---------- */
    function renderQ() {
        const q = st.qs[st.i], total = st.qs.length;
        const catLabel = (CAT_LABEL[q.c] || q.c).toUpperCase();
        const catTagText = catTag(q.c);

        page.innerHTML = `
        <section class="kz">
            <div class="kz-quiz">
                <div class="kz-quiz-top">
                    <span class="kz-round">Soal <span>${String(st.i + 1).padStart(2, '0')}</span> / ${String(total).padStart(2, '0')}</span>
                    <div class="kz-meta">
                        <span class="kz-chip streak" ${st.streak > 1 ? '' : 'hidden'}>Beruntun ${st.streak}</span>
                        <span class="kz-chip score">Benar ${st.score}</span>
                        <span class="kz-chip cat" style="${catStyle(q.c)}">${esc(catLabel)}</span>
                    </div>
                </div>
                <div class="kz-prog" aria-hidden="true">${st.qs.map((_, k) =>
                    `<i class="${k < st.answers.length ? (st.answers[k].ok ? 'ok' : 'no') : (k === st.i ? 'cur' : '')}"></i>`).join('')}</div>

                <div class="kz-bubble">
                    <p class="kz-q">${esc(q.q)}</p>
                </div>

                <div class="kz-opts">${q.opts.map((o, k) =>
                    `<button type="button" class="kz-opt" data-k="${k}"><em>${esc(catTagText)}</em><span>${esc(o.t)}</span></button>`).join('')}</div>

                <div class="kz-foot"></div>
            </div>
        </section>`;
        page.querySelectorAll('.kz-opt').forEach(btn => btn.addEventListener('click', () => answer(+btn.dataset.k)));
        startKeys();
    }

    function answer(k) {
        const q = st.qs[st.i], ok = k === q.k;
        if (ok) { st.score++; st.streak++; st.bestStreak = Math.max(st.bestStreak, st.streak); } else st.streak = 0;
        st.answers.push({ q: q.q, pick: q.opts[k].t, ans: q.opts[q.k].t, ok, exp: q.exp });

        page.querySelectorAll('.kz-opt').forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === q.k) btn.classList.add('right');
            else if (idx === k) btn.classList.add('wrong');
            else btn.classList.add('dim');
        });
        if (ok) confetti();
        const seg = page.querySelectorAll('.kz-prog i')[st.i];
        if (seg) seg.className = ok ? 'ok' : 'no';
        page.querySelector('.kz-chip.score').textContent = 'Benar ' + st.score;
        const sk = page.querySelector('.kz-chip.streak');
        sk.textContent = 'Beruntun ' + st.streak;
        sk.hidden = st.streak < 2;

        const last = st.i + 1 >= st.qs.length;
        page.querySelector('.kz-foot').innerHTML = `
            <div class="kz-exp ${ok ? 'ok' : 'no'}"><b>${ok ? 'Benar' : 'Kurang tepat'}</b>${esc(q.exp)}</div>
            <div class="kz-quiz-foot">
                <button type="button" class="kz-btn">${last ? 'Lihat hasil' : 'Soal berikutnya'}</button>
                <button type="button" class="kz-link kz-quit">Akhiri kuis</button>
                <span class="kz-hint"><kbd>Enter</kbd> untuk lanjut</span>
            </div>`;
        const next = page.querySelector('.kz-btn');
        next.focus({ preventScroll: true });
        next.addEventListener('click', () => { last ? renderResult() : (st.i++, renderQ()); });
        page.querySelector('.kz-quit').addEventListener('click', renderResult);
    }

    /* ---------- layar 3: hasil ---------- */
    function renderResult() {
        stopKeys();
        if (!st.answers.length) { renderStart(); return; }
        const total = st.answers.length;
        const nilai = Math.round(st.score / total * 100);
        const prevBest = data.hist.length ? Math.max(...data.hist.map(x => x.n)) : null;
        const newRecord = prevBest !== null && nilai > prevBest;
        data.hist.push({ n: nilai, c: st.cat, t: Date.now() });
        data.hist = data.hist.slice(-8);
        save();

        const [tag, text] = grade(nilai);
        const wrong = total - st.score;
        const cls = nilai >= 80 ? 'hi' : nilai < 40 ? 'lo' : '';

        page.innerHTML = `
        <section class="kz">
            <div class="kz-res">
                <p class="kz-score"><span id="kz-num">${REDUCE ? nilai : 0}</span><small>dari 100, kategori ${esc(CAT_LABEL[st.cat])}</small></p>
                <div>
                    <p class="kz-grade">${tag}${newRecord ? '<span class="kz-flag">Rekor baru</span>' : ''}</p>
                    <h2 class="kz-verdict">${text}</h2>
                    <p class="kz-detail">${st.score} benar dari ${total} soal.</p>
                    <div class="kz-meter ${cls}"><i style="width:${REDUCE ? nilai : 0}%"></i></div>
                    <ul class="kz-mini">
                        <li><b>${st.score}</b>benar</li>
                        <li><b>${wrong}</b>salah</li>
                        <li><b>${st.bestStreak}</b>beruntun terbaik</li>
                    </ul>
                </div>
            </div>

            <div class="kz-rvhead">
                <h2 class="kz-h">Pembahasan</h2>
                ${wrong ? '<div class="kz-tabs"><button type="button" class="on" data-f="all">Semua</button><button type="button" data-f="no">Salah saja</button></div>' : ''}
            </div>
            <div class="kz-review" data-show="all">${st.answers.map((a, n) => `
                <div class="kz-rv ${a.ok ? 'ok' : 'no'}"><span class="kz-rn">${n + 1}</span>
                    <div><b>${esc(a.q)}</b>
                    ${a.ok ? `<p>Jawabanmu benar: <span class="kz-ans">${esc(a.ans)}</span></p>`
                           : `<p>Jawabanmu: <span class="kz-bad">${esc(a.pick)}</span>. Yang benar: <span class="kz-ans">${esc(a.ans)}</span></p><p class="kz-why">${esc(a.exp)}</p>`}
                    </div>
                </div>`).join('')}</div>

            <div class="kz-actions">
                <button type="button" class="kz-btn alt" id="kz-again">Main lagi</button>
                <button type="button" class="kz-link" id="kz-home">Kembali ke menu kuis</button>
            </div>
        </section>`;

        if (!REDUCE) {
            const num = page.querySelector('#kz-num'), fill = page.querySelector('.kz-meter i');
            requestAnimationFrame(() => { fill.style.width = nilai + '%'; });
            const t0 = performance.now(), DUR = 900;
            (function tick(now) {
                const t = Math.min((now - t0) / DUR, 1);
                num.textContent = Math.round(nilai * (1 - Math.pow(1 - t, 3)));
                if (t < 1) requestAnimationFrame(tick);
            })(t0);
        }
        if (nilai >= 60) confetti();
        const rv = page.querySelector('.kz-review');
        page.querySelectorAll('.kz-tabs button').forEach(b => b.addEventListener('click', () => {
            page.querySelectorAll('.kz-tabs button').forEach(x => x.classList.toggle('on', x === b));
            rv.dataset.show = b.dataset.f;
        }));
        page.querySelector('#kz-again').addEventListener('click', begin);
        page.querySelector('#kz-home').addEventListener('click', () => { renderStart(); toTop(); });
        toTop();
    }

    /* ---------- menu navbar (ditaruh setelah "Game") ---------- */
    function mount() {
        const menu = document.getElementById('nav-menu');
        if (menu && !menu.querySelector('[data-kuis]')) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="#" data-kuis>Kuis</a>';
            li.firstChild.addEventListener('click', e => {
                e.preventDefault();
                renderStart();
                window.showPage('kuis-page');
            });
            const items = [...menu.querySelectorAll('li')];
            const anchor = items.find(l => /game/i.test(l.textContent));
            if (anchor) anchor.after(li); else menu.appendChild(li);
        }
        renderStart();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();