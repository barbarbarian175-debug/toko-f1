-- F1 website | database f1_website
-- Cara pakai: import file ini lewat phpMyAdmin (tab Import), atau:
--   C:\xampp82\mysql\bin\mysql.exe -u root < backend\database\schema.sql
-- Dibuat otomatis dari data di js/pages/teams.js, js/utils/script.js dan
-- js/pages/pembalap.js — jangan edit manual, ubah file JS-nya lalu jalankan:
--   node gen-f1-db.js
-- Data: 11 tim, 22 pembalap, 24 sirkuit (musim 2026).

CREATE DATABASE IF NOT EXISTS f1_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE f1_website;

CREATE TABLE IF NOT EXISTS teams (
  id INT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  color VARCHAR(10) NOT NULL,
  base VARCHAR(80) NOT NULL,
  power_unit VARCHAR(40) NOT NULL,
  car_img VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drivers (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  number INT NOT NULL,
  nationality VARCHAR(40) NOT NULL,
  team_id INT NOT NULL,
  photo VARCHAR(255) NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS circuits (
  id INT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  gp_name VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  country VARCHAR(60) NOT NULL,
  length_km DECIMAL(5,3) NOT NULL,
  turns INT NOT NULL,
  first_year INT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL
);

INSERT INTO teams (id, name, full_name, color, base, power_unit, car_img) VALUES
(1, 'Mercedes', 'Mercedes-AMG Petronas F1 Team', '#27f4d2', 'Brackley, Inggris', 'Mercedes', 'assets/images/cars/mercedes.jpg'),
(2, 'Ferrari', 'Scuderia Ferrari HP', '#ff1f3d', 'Maranello, Italia', 'Ferrari', 'assets/images/cars/ferrari.jpg'),
(3, 'McLaren', 'McLaren Formula 1 Team', '#ff8000', 'Woking, Inggris', 'Mercedes', 'assets/images/cars/mclaren.jpg'),
(4, 'Red Bull', 'Oracle Red Bull Racing', '#4a7bd6', 'Milton Keynes, Inggris', 'Red Bull Ford', 'assets/images/cars/red-bull.jpg'),
(5, 'Racing Bulls', 'Visa Cash App Racing Bulls', '#6c8cff', 'Faenza, Italia', 'Red Bull Ford', 'assets/images/cars/racing-bulls.jpg'),
(6, 'Alpine', 'BWT Alpine F1 Team', '#2aa8e8', 'Enstone, Inggris', 'Mercedes', 'assets/images/cars/alpine.jpg'),
(7, 'Aston Martin', 'Aston Martin Aramco F1 Team', '#1fa67a', 'Silverstone, Inggris', 'Honda', 'assets/images/cars/aston-martin.jpg'),
(8, 'Williams', 'Atlassian Williams Racing', '#5bb8ff', 'Grove, Inggris', 'Mercedes', 'assets/images/cars/williams.jpg'),
(9, 'Haas', 'TGR Haas F1 Team', '#d5d9e0', 'Kannapolis, AS', 'Ferrari', 'assets/images/cars/haas.jpg'),
(10, 'Audi', 'Audi Revolut F1 Team', '#a9b2c0', 'Hinwil, Swiss', 'Audi', 'assets/images/cars/audi.jpg'),
(11, 'Cadillac', 'Cadillac Formula 1 Team', '#d4ad4f', 'Fishers, AS', 'Ferrari', 'assets/images/cars/cadillac.jpg')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), color = VALUES(color), base = VALUES(base), power_unit = VALUES(power_unit), car_img = VALUES(car_img);

INSERT INTO drivers (id, name, number, nationality, team_id, photo) VALUES
(1, 'George Russell', 63, 'Inggris', 1, 'assets/images/pin/335a439401a80a106c69ac66837744d5.jpg'),
(2, 'Andrea Kimi Antonelli', 12, 'Italia', 1, 'assets/images/pin/4e1e1df5d82ebb1988aba491d6beb1d4.jpg'),
(3, 'Charles Leclerc', 16, 'Monako', 2, 'assets/images/pin/8e761e6520e7ed1a624945a23478d3dc.jpg'),
(4, 'Lewis Hamilton', 44, 'Inggris', 2, 'assets/images/pin/b0b73931f614fabd2705534742a82dfc.jpg'),
(5, 'Lando Norris', 4, 'Inggris', 3, 'assets/images/pin/151bc722353f65da3a81b8a3d2db449c.jpg'),
(6, 'Oscar Piastri', 81, 'Australia', 3, 'assets/images/pin/9a3e3637ba9df9668efdf110f6d7b7f1.jpg'),
(7, 'Max Verstappen', 1, 'Belanda', 4, 'assets/images/pin/0c3038a5d8b460f0a4cc209d494b4b03.jpg'),
(8, 'Isack Hadjar', 6, 'Prancis', 4, 'assets/images/pin/5ae6e9ab756fd19632932264482fb84f.jpg'),
(9, 'Liam Lawson', 30, 'Selandia Baru', 5, 'assets/images/pin/1bfa8a10f93d95010037a850b473ef1b.jpg'),
(10, 'Arvid Lindblad', 41, 'Inggris', 5, 'assets/images/pin/97ebe5e3b1eb0e319704d16c4c30b79a.jpg'),
(11, 'Pierre Gasly', 10, 'Prancis', 6, 'assets/images/pin/65d3fc19af57e89719a355dd54772b4c.jpg'),
(12, 'Franco Colapinto', 43, 'Argentina', 6, 'assets/images/pin/db2cfaff50027d168794aaecae07643e.jpg'),
(13, 'Fernando Alonso', 14, 'Spanyol', 7, 'assets/images/pin/ea3eb673a5f7c92eb556b3de131f1211.jpg'),
(14, 'Lance Stroll', 18, 'Kanada', 7, 'assets/images/pin/cba76ca425678e5bf44f8c6b1f3ed25f.jpg'),
(15, 'Alex Albon', 23, 'Thailand', 8, 'assets/images/pin/afcd5ceb8327048b73f2431cbe8f1267.jpg'),
(16, 'Carlos Sainz', 55, 'Spanyol', 8, 'assets/images/pin/75bb25b5c589f05dcaa3833571bf45ba.jpg'),
(17, 'Esteban Ocon', 31, 'Prancis', 9, 'assets/images/pin/cc812a48ef657cd4bd0289cd53baf43a.jpg'),
(18, 'Oliver Bearman', 87, 'Inggris', 9, 'assets/images/pin/bc5d2e467dc84b5994ce7e00755abf9c.jpg'),
(19, 'Nico Hulkenberg', 27, 'Jerman', 10, 'assets/images/pin/1db88ee5ef56b9e8b8caf98198da1243.jpg'),
(20, 'Gabriel Bortoleto', 5, 'Brasil', 10, 'assets/images/pin/b644f93c373790bf186f054bdb33134f.jpg'),
(21, 'Sergio Pérez', 11, 'Meksiko', 11, 'assets/images/pin/e42ef88f0fdc561ef1bca0999dbaf170.jpg'),
(22, 'Valtteri Bottas', 77, 'Finlandia', 11, 'assets/images/pin/4fea40f0ed8d100d1b294f2b08594b89.jpg')
ON DUPLICATE KEY UPDATE number = VALUES(number), nationality = VALUES(nationality), team_id = VALUES(team_id), photo = VALUES(photo);

INSERT INTO circuits (id, name, gp_name, city, country, length_km, turns, first_year, description, image) VALUES
(1, 'Albert Park Circuit', 'GP Australia', 'Melbourne', 'Australia', 5.278, 14, 1996, 'Sirkuit semi-permanen yang mengitari danau di taman kota Melbourne. Lintasannya cepat dan mengalir, dan sering menjadi pembuka musim.', 'assets/images/circuits/albert-park.png'),
(2, 'Autódromo Hermanos Rodríguez', 'GP Kota Meksiko', 'Mexico City', 'Meksiko', 4.304, 17, 1963, 'Berada di ketinggian sekitar 2.200 meter, udaranya tipis sehingga mobil kehilangan downforce dan pendinginan. Bagian stadion Foro Sol jadi tikungan paling khasnya.', 'assets/images/circuits/mexico.png'),
(3, 'Baku City Circuit', 'GP Azerbaijan', 'Baku', 'Azerbaijan', 6.003, 20, 2016, 'Sirkuit jalan raya dengan lurusan lebih dari dua kilometer, tapi juga lorong sempit di kota tua yang nyaris tidak menyisakan ruang untuk salah.', 'assets/images/circuits/baku.png'),
(4, 'Circuit de Barcelona-Catalunya', 'GP Spanyol', 'Montmeló', 'Spanyol', 4.657, 14, 1991, 'Sirkuit yang lama jadi tempat tes pramusim, jadi semua tim hafal karakternya. Kombinasi tikungan cepat dan lurusan panjang menguji keseimbangan mobil.', 'assets/images/circuits/barcelona.png'),
(5, 'Circuit de Monaco', 'GP Monako', 'Monte Carlo', 'Monako', 3.337, 19, 1950, 'Sirkuit terpendek dan paling lambat, dengan tembok pembatas nyaris menempel di lintasan. Posisi start sangat menentukan karena menyalip hampir mustahil.', 'assets/images/circuits/monaco.png'),
(6, 'Circuit de Spa-Francorchamps', 'GP Belgia', 'Stavelot', 'Belgia', 7.004, 19, 1950, 'Sirkuit terpanjang di kalender, terkenal lewat tikungan Eau Rouge dan Raidillon. Cuaca di hutan Ardennes bisa berubah drastis dalam satu lap.', 'assets/images/circuits/spa.png'),
(7, 'Circuit Gilles Villeneuve', 'GP Kanada', 'Montreal', 'Kanada', 4.361, 14, 1978, 'Dibangun di pulau buatan Île Notre-Dame. Lintasannya penuh pengereman keras, dan tembok Wall of Champions di tikungan terakhir sudah menjebak banyak juara.', 'assets/images/circuits/montreal.png'),
(8, 'Circuit of the Americas', 'GP Amerika Serikat', 'Austin', 'Amerika Serikat', 5.513, 20, 2012, 'Tikungan pertamanya menanjak curam sebelum turun ke rangkaian tikungan cepat yang terinspirasi dari bagian Silverstone dan sirkuit Eropa lain.', 'assets/images/circuits/cota.png'),
(9, 'Circuit Zandvoort', 'GP Belanda', 'Zandvoort', 'Belanda', 4.259, 14, 1952, 'Sirkuit di antara bukit pasir dengan dua tikungan berbanking, Hugenholtz dan Arie Luyendyk. Lintasannya sempit dan sulit untuk menyalip.', 'assets/images/circuits/zandvoort.png'),
(10, 'Hungaroring', 'GP Hungaria', 'Mogyoród', 'Hungaria', 4.381, 14, 1986, 'Sering dijuluki Monako tanpa tembok karena rapat, berliku, dan sulit disalip. Di sinilah balapan F1 pertama di balik Tirai Besi diadakan.', 'assets/images/circuits/hungaroring.png'),
(11, 'Autódromo José Carlos Pace (Interlagos)', 'GP São Paulo', 'São Paulo', 'Brasil', 4.309, 15, 1973, 'Lintasan berlawanan arah jarum jam dengan kontur naik-turun yang khas. Hujan mendadak sering membuat balapan di sini penuh kejutan.', 'assets/images/circuits/interlagos.png'),
(12, 'Las Vegas Strip Circuit', 'GP Las Vegas', 'Las Vegas', 'Amerika Serikat', 6.201, 17, 2023, 'Balapan malam hari melewati jalan-jalan kasino di The Strip. Lurusan panjang dan udara malam yang dingin membuat suhu ban sulit dijaga.', 'assets/images/circuits/las-vegas.png'),
(13, 'Lusail International Circuit', 'GP Qatar', 'Lusail', 'Qatar', 5.419, 16, 2021, 'Awalnya dibangun untuk MotoGP dan dipakai F1 sejak 2021. Tikungan cepat yang panjang membuat fisik pembalap terkuras.', 'assets/images/circuits/lusail.png'),
(14, 'Madring', 'GP Spanyol (Madrid)', 'Madrid', 'Spanyol', 5.474, 22, 2026, 'Sirkuit hibrida setengah jalan kota, setengah permanen, di sekitar area IFEMA Madrid. Debut di kalender F1 pada musim 2026.', 'assets/images/circuits/madring.png'),
(15, 'Marina Bay Street Circuit', 'GP Singapura', 'Singapura', 'Singapura', 4.94, 19, 2008, 'Lokasi balapan malam pertama dalam sejarah F1. Udara lembap dan banyak tikungan lambat menjadikannya salah satu balapan paling melelahkan.', 'assets/images/circuits/marina-bay.png'),
(16, 'Miami International Autodrome', 'GP Miami', 'Miami Gardens', 'Amerika Serikat', 5.412, 19, 2022, 'Dibangun di sekitar Hard Rock Stadium. Lintasan sementara ini punya bagian cepat dan rangkaian tikungan sempit yang rapat.', 'assets/images/circuits/miami.png'),
(17, 'Autodromo Nazionale Monza', 'GP Italia', 'Monza', 'Italia', 5.793, 11, 1950, 'Dijuluki Kuil Kecepatan karena hampir sepanjang lap dilalui dengan gas penuh. Kandang para tifosi Ferrari dengan suasana tribun yang legendaris.', 'assets/images/circuits/monza.png'),
(18, 'Red Bull Ring', 'GP Austria', 'Spielberg', 'Austria', 4.318, 10, 1970, 'Satu lap hanya sekitar satu menit, salah satu yang tersingkat di kalender. Lintasannya naik-turun di perbukitan Styria dengan tiga lurusan utama.', 'assets/images/circuits/red-bull-ring.png'),
(19, 'Shanghai International Circuit', 'GP Tiongkok', 'Shanghai', 'Tiongkok', 5.451, 16, 2004, 'Tikungan pembukanya berbentuk spiral panjang yang terus mengecil, disusul lurusan belakang lebih dari satu kilometer.', 'assets/images/circuits/shanghai.png'),
(20, 'Silverstone Circuit', 'GP Britania Raya', 'Silverstone', 'Inggris', 5.891, 18, 1950, 'Bekas pangkalan udara yang menjadi lokasi balapan F1 pertama dalam sejarah pada 1950. Tikungan cepat Maggotts dan Becketts jadi favorit para pembalap.', 'assets/images/circuits/silverstone.png'),
(21, 'Suzuka Circuit', 'GP Jepang', 'Suzuka', 'Jepang', 5.807, 18, 1987, 'Satu-satunya sirkuit F1 berbentuk angka delapan, dengan jembatan tempat lintasan saling bersilangan. Rangkaian S-curve cepat di awal lap menguji keberanian pembalap.', 'assets/images/circuits/suzuka.png'),
(22, 'Yas Marina Circuit', 'GP Abu Dhabi', 'Abu Dhabi', 'Uni Emirat Arab', 5.281, 16, 2009, 'Balapan dimulai saat senja dan berakhir di bawah lampu. Biasanya menjadi penutup musim.', 'assets/images/circuits/yas-marina.png'),
(23, 'Bahrain International Circuit', 'GP Bahrain', 'Sakhir', 'Bahrain', 5.412, 15, 2004, 'Sirkuit di tengah gurun yang menggelar balapan F1 pertama di Timur Tengah. Pasir yang terbawa angin sering mengurangi grip di lintasan.', 'assets/images/circuits/bahrain.png'),
(24, 'Jeddah Corniche Circuit', 'GP Arab Saudi', 'Jeddah', 'Arab Saudi', 6.174, 27, 2021, 'Sirkuit jalan raya tercepat di kalender, dengan 27 tikungan di sepanjang pesisir Laut Merah. Dinding pembatas yang rapat membuat kesalahan kecil berujung fatal.', 'assets/images/circuits/jeddah.png')
ON DUPLICATE KEY UPDATE gp_name = VALUES(gp_name), city = VALUES(city), country = VALUES(country), length_km = VALUES(length_km), turns = VALUES(turns), first_year = VALUES(first_year), description = VALUES(description), image = VALUES(image);
