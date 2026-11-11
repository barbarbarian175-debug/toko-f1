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
| `js/pages/` | Script khusus satu halaman. | `bacaan.js`, `balapan.js`, `hasil.js`, `katalog.js`, `klasemen.js`, `kuis.js`, `pembalap.js`, `pembalap-grid.js` |
| `js/utils/` | Fungsi bantu (helper) yang dipakai banyak file, misalnya format tanggal, fetch data, validasi. | `helpers.js`, `api.js` |

### `backend/`
Sisi server (PHP + MySQL) untuk mengambil dan menyimpan data.

| Folder / File | Fungsi |
|---|---|
| `backend/config/` | Konfigurasi koneksi database dan konstanta aplikasi (`database.php`). |
| `backend/api/` | Endpoint yang dipanggil JavaScript lewat fetch, misalnya data pembalap, klasemen, hasil, kuis, dan login. |
| `backend/models/` | Query dan logika pengolahan data, dipisah dari endpoint supaya rapi. |
| `backend/database/` | File `.sql` berisi skema tabel dan data awal (seed). Import ke MySQL saat pertama setup. |
| `backend/.env.example` | Contoh pengaturan environment (host, user, password database). Salin menjadi `.env` dan isi sesuai komputer masing-masing. **Jangan upload `.env` asli ke GitHub.** |

### `archive/`
Tempat file lama atau cadangan yang belum dipakai tapi belum mau dihapus (isi folder `arsip` sebelumnya).

---

## Halaman Website

| Halaman | Fungsi | File terkait |
|---|---|---|
| Beranda | Halaman awal dan pengenalan F1 untuk pemula | `index.html`, `beranda-pemula.css`, `liquid-hero.js`, `navcards.js` |
| Pembalap | Daftar dan profil pembalap | `pembalap.js`, `pembalap-grid.css/js`, `profil.css` |
| Tim | Daftar tim F1 | `katalog.css/js`, `komponen.css/js` |
| Sirkuit | Informasi sirkuit balapan | `katalog.css/js` |
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