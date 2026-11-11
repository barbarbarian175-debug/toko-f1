```

---

## Penjelasan Tiap Folder

### `index.html`
Halaman utama (Beranda) dan pintu masuk website. File HTML halaman lain mengikuti struktur folder yang sama.

### `assets/`
Tempat semua file pendukung non-kode.

| Folder | Fungsi |
|---|---|
| `assets/images/` | Semua gambar: logo F1, foto pembalap, logo tim, gambar sirkuit, ilustrasi (`logo-f1.png`, `coding.png`, `la.jpeg`, dll). |
| `assets/fonts/` | Font custom yang dipakai website. |

### `css/`
Semua file tampilan (styling).

| Folder | Fungsi | Contoh file |
|---|---|---|
| `css/base/` | Style dasar yang berlaku di seluruh halaman: reset, variabel warna, font, layout global. | `reset.css`, `variables.css` |
| `css/components/` | Style komponen UI yang dipakai berulang di banyak halaman. | `depth-carousel.css`, `helm-footer.css`, `logoloop.css`, `navcards.css`, `komponen.css` |
| `css/pages/` | Style khusus satu halaman saja. | `bacaan.css`, `beranda-pemula.css`, `faq.css`, `katalog.css`, `kuis.css`, `pembalap-grid.css`, `profil.css`, `profil-folder.css` |

### `js/`
Semua file logika dan interaksi (JavaScript).

| Folder | Fungsi | Contoh file |
|---|---|---|
| `js/components/` | Script komponen UI yang dipakai ulang: popup, carousel, efek hero, animasi logo, kartu navigasi, feed berita. | `ban-popup.js`, `depth-carousel.js`, `liquid-hero.js`, `logoloop.js`, `navcards.js`, `komponen.js`, `news-feed.js` |
| `js/pages/` | Script khusus satu halaman. | `bacaan.js`, `balapan.js`, `hasil.js`, `klasemen.js`, `kuis.js`, `pembalap.js`, `pembalap-grid.js` |
| `js/utils/` | Fungsi bantu (helper) yang dipakai banyak file, misalnya format tanggal, fetch data, validasi. | `helpers.js`, `api.js` |

### `backend/`
Sisi server (PHP + MySQL) untuk mengambil dan menyimpan data.

| Folder / File | Fungsi |
|---|---|
| `backend/config/` | Konfigurasi koneksi database dan konstanta aplikasi (`database.php`). |
| `backend/api/` | Endpoint JSON: `drivers.php`, `teams.php`, `circuits.php` (baca dari database `f1_website`), `standings.php` & `results.php` (meneruskan data live Jolpica), `status.php` (health-check + hitung isi tabel). |
| `backend/models/` | Query dan logika pengolahan data, dipisah dari endpoint supaya rapi (`Driver.php`, `Team.php`, `Circuit.php`). |
| `backend/database/` | File `.sql` berisi skema tabel dan data awal (seed). Import ke MySQL saat pertama setup. Dibuat otomatis dari data JS lewat `gen-f1-db.js` — jangan edit manual. |
| `backend/.env.example` | Contoh pengaturan environment (host, user, password database). Salin menjadi `.env` dan isi sesuai komputer masing-masing. **Jangan upload `.env` asli ke GitHub.** |

### Menjalankan back end (XAMPP)

1. Jalankan Apache & MySQL dari XAMPP Control Panel.
2. Import skema + data awal (11 tim, 22 pembalap, 24 sirkuit musim 2026):
   `C:\xampp82\mysql\bin\mysql.exe -u root < backend\database\schema.sql`
3. Cek: buka `http://localhost/toko/backend/api/status.php` — harus `{"status":"ok","db":"ok","counts":{"teams":11,"drivers":22,"circuits":24}}`.
4. Endpoint lain: `drivers.php` (`?id=5`, `?team=3`), `teams.php` (`?id=3`), `circuits.php` (`?id=5`), `standings.php` (`?type=constructor`), `results.php` (`?season=2026&round=5`).

Catatan: frontend saat ini masih mengambil data live langsung dari API publik
(Jolpica/OpenF1/rss2json), jadi situs tetap jalan walau database belum di-import.
Endpoint di atas sudah siap dipakai kalau nanti frontend mau dipindah ke API lokal.

### `archive/`
Tempat file lama atau cadangan yang belum dipakai tapi belum mau dihapus.
Sejak 2026-11-11 berisi juga `shop-admin/` (login + admin toko baju yang dulu
nyangkut di situs F1: `login.php`, `logout.php`, `me.php`, `config.php`,
`admin/`) dan `database-toko.sql` (skema toko, bukan F1). File-file itu tidak
dihapus, cuma dipindah supaya tidak tercampur dengan situs F1. Kalau masih
dibutuhkan, buka langsung `http://localhost/toko/archive/shop-admin/login.php`.

### Gambar
Semua gambar yang dulu numpang di situs lain sekarang disimpan lokal:
`assets/images/pin/` (64 gambar dari Pinterest, 5,0 MB),
`assets/images/ext/` (15 gambar dari berbagai situs berita, 5,7 MB),
foto hero di `assets/images/bg/hero-f1.jpg`, dan foto sejarah/komponen di
`assets/images/sejarah/` + `assets/images/komponen/` (5 foto dari Wikimedia
Commons, menggantikan 5 link yang sudah mati/404: Senna-Prost, Renault R25,
monocoque, power unit Honda, sayap depan). Tidak ada lagi referensi gambar
eksternal di kode — kecuali bendera kecil di klasemen/hasil yang memakai
flagcdn.com. Situs tidak bergantung pada link luar untuk gambarnya.

---

## Halaman Website

| Halaman | Fungsi | File terkait |
|---|---|---|
| Beranda | Halaman awal dan pengenalan F1 untuk pemula | `index.html`, `beranda-pemula.css`, `liquid-hero.js`, `navcards.js` |
| Pembalap | Daftar dan profil pembalap | `pembalap.js`, `pembalap-grid.css/js`, `profil.css` |
| Tim | Daftar tim F1 | `teams.js`, `tim-detail.js` |
| Sirkuit | Informasi sirkuit balapan | `script.js` (data `circuitsData`) |
| Klasemen | Klasemen pembalap dan konstruktor | `klasemen.js` |
| Hasil | Hasil tiap balapan | `hasil.js` |
| Schedule | Jadwal balapan | `balapan.js` |
| Sejarah | Sejarah Formula 1 | `bacaan.css/js` |
| Game | Mini game bertema F1 | halaman Game |
| Kuis | Kuis pengetahuan F1 | `kuis.css`, `kuis.js` |

> Sesuaikan kolom "File terkait" dengan file yang sebenarnya kamu pakai di tiap halaman.

---

## Aturan Penamaan

- Nama file dan folder memakai **huruf kecil** dan **kebab-case** (pisah dengan tanda `-`), tanpa spasi. Contoh: `logo-f1.png`, `depth-carousel.js`.
- CSS dan JS untuk satu halaman sebaiknya punya nama yang sama. Contoh: `kuis.css` dan `kuis.js`.
- Komponen yang dipakai di banyak halaman ditaruh di `components/`. Yang hanya dipakai satu halaman ditaruh di `pages/`.
- Gunakan **path relatif** saat memanggil file, misalnya `css/pages/kuis.css`.

---

## Cara Menjalankan

1. Frontend: buka `index.html` dengan **Live Server** di VS Code.
2. Backend:
   - Jalankan XAMPP (Apache dan MySQL).
   - Taruh project di folder `htdocs`.
   - Import `backend/database/schema.sql` lewat phpMyAdmin.
   - Salin `backend/.env.example` menjadi `.env` dan isi konfigurasi database.
3. Buka browser dan cek Console (F12) untuk memastikan tidak ada error 404.