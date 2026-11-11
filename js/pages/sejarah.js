(function () {
    const root = document.getElementById('history-page');
    if (!root) return;

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- DATA (foto: taruh di assets/images/sejarah/NAMA.jpg, kalau tidak ada otomatis pakai link) ---------- */
    const HISTORY = [
        {
            year: '1950', date: '13 MEI', img: '1950.jpg', url: 'https://i.pinimg.com/736x/64/2b/4b/642b4bb0b70fa1b2b7e75f776ef42016.jpg', cap: 'Silverstone, 1950',
            title: 'Grand Prix F1 Pertama di Silverstone',
            text: [
                'Kejuaraan Dunia Formula 1 resmi dimulai di Sirkuit Silverstone, Inggris, pada GP Inggris 13 Mei 1950. Sirkuit ini dibangun di atas bekas pangkalan udara militer RAF, dan balapan perdana tersebut disaksikan langsung oleh Raja George VI.',
                'Giuseppe Farina dari Alfa Romeo memenangi balapan itu. Tim Alfa Romeo dengan mobil 158 "Alfetta" menyapu tiga posisi teratas pada hari itu, sehingga dominasi mereka terasa jelas sejak awal.',
                'Musim 1950 hanya berisi tujuh balapan, salah satunya Indianapolis 500 yang saat itu dihitung sebagai bagian dari kejuaraan. Jumlah ini jauh berbeda dengan kalender modern yang berisi lebih dari dua puluh seri.',
                'Di akhir musim, Farina mengungguli rekan setimnya Juan Manuel Fangio dan Luigi Fagioli untuk menjadi juara dunia F1 pertama dalam sejarah. Dari sinilah olahraga yang kini ditonton jutaan orang di seluruh dunia berawal.'
            ]
        },
        {
            year: '1958', date: 'GELAR KONSTRUKTOR', img: '1958.jpg', url: 'https://i.pinimg.com/1200x/bd/95/56/bd95567c822fb5e34eb1ac5189bdebab.jpg', cap: 'Vanwall, 1958',
            title: 'Juara Konstruktor Pertama',
            text: [
                'Piala konstruktor mulai diperebutkan pada 1958, dan tim Inggris Vanwall menjadi yang pertama merebutnya. Keberhasilan ini menandai bangkitnya industri balap Inggris yang sebelumnya kerap berada di bawah bayang-bayang tim Italia.',
                'Di musim yang sama Mike Hawthorn bersama Ferrari menjadi juara dunia asal Inggris pertama, hanya unggul satu poin dari Stirling Moss. Selisih tipis itu ikut dipengaruhi sikap sportif Moss, yang membela Hawthorn saat pembalap Ferrari itu terancam diskualifikasi di GP Portugal.',
                'Musim 1958 juga memperlihatkan awal perubahan besar dalam desain mobil. Cooper membawa mesin di belakang pengemudi dan membuktikan bahwa konsep tersebut bisa menang, lalu hampir semua tim mengikutinya dalam beberapa tahun berikutnya.',
                'Hawthorn memutuskan pensiun di akhir musim dan meninggal dalam kecelakaan lalu lintas pada Januari 1959. Gelar pertamanya pun menjadi satu-satunya dalam kariernya.'
            ]
        },
        {
            year: '1960–87', date: 'ERA KLASIK', img: 'era-klasik.jpg', url: 'https://i.pinimg.com/736x/9d/45/fd/9d45fd31374996f322e643c1932604cc.jpg', cap: 'F1 era klasik, 1960-an sampai 1980-an',
            title: 'Dari Mesin Belakang ke Era Turbo',
            text: [
                'Dari 1960-an sampai pertengahan 1980-an, F1 berubah lebih cepat daripada periode mana pun sebelumnya. Mobil berganti rupa dari kendaraan bermesin depan yang masih mirip mobil balap 1950-an menjadi mesin aerodinamis lengkap dengan sayap dan turbo. Dua hal berjalan bersamaan: kecepatan melonjak tajam, sementara bahaya di lintasan masih sangat besar sehingga para pembalap mulai menuntut keselamatan.',
                'Awalnya adalah revolusi mesin belakang. Cooper dari Inggris memasang mesin di belakang pengemudi, dan dengan konsep itu Jack Brabham menjadi juara dunia pada 1959 dan 1960. Ferrari, yang lama bertahan dengan mesin depan, akhirnya ikut pindah mulai 1961. Sejak saat itu tim-tim kecil asal Inggris menjadi pusat kekuatan F1.',
                'Colin Chapman dari Lotus membawa lompatan berikutnya lewat Lotus 25 pada 1962, mobil F1 pertama yang memakai sasis monokok sehingga jauh lebih kaku dan ringan. Bersama mobil itu, pembalap Skotlandia Jim Clark menjadi juara dunia 1963 dengan memenangi tujuh dari sepuluh balapan, lalu juara lagi pada 1965. Di tahun 1965 ia juga memenangi Indianapolis 500, sehingga melewatkan GP Monako. Clark meninggal pada April 1968 dalam balapan Formula 2 di Hockenheim, dan kepergiannya mengguncang dunia balap.',
                'Tahun 1967 menjadi titik balik berikutnya ketika mesin Cosworth DFV, V8 3,0 liter yang murah dan kuat, debut di Lotus 49 dan langsung menang di GP Belanda. Mesin itu dijual ke banyak tim dan memenangi lebih dari 150 balapan sampai awal 1980-an. Pada 1968 sayap aerodinamis mulai dipasang di mobil F1, dan di tahun yang sama sponsor komersial pertama muncul lewat warna merah, putih, dan emas Gold Leaf di Lotus. Sejak itu uang sponsor menjadi bagian penting olahraga ini.',
                'Di sisi lain, kematian pembalap terjadi nyaris setiap musim. Jackie Stewart, yang selamat dari kecelakaan di Spa pada 1966 dan sempat terjebak di mobil yang bocor bensin tanpa penanganan medis yang layak, menjadi juru bicara keselamatan. Ia memperjuangkan sabuk pengaman, helm tertutup penuh, pakaian tahan api, pagar pengaman, dan dokter di pinggir lintasan, meski sering dicibir karena dianggap terlalu penakut. Stewart sendiri juara dunia tiga kali, pada 1969, 1971, dan 1973.',
                'Harga yang dibayar tetap mahal. Jochen Rindt tewas saat latihan di Monza pada September 1970, tetapi tidak ada pembalap yang sanggup melewati poinnya, sehingga ia dinobatkan sebagai juara dunia secara anumerta, satu-satunya dalam sejarah F1.',
                'Dasawarsa 1970-an penuh eksperimen. Tyrrell mencoba mobil enam roda, Ferrari bangkit lewat Niki Lauda yang juara pada 1975, dan Lotus 79 pada 1978 membawa efek dasar atau ground effect yang menempelkan mobil ke aspal memakai aliran udara di bawah lantai. Mario Andretti juara dengan mobil itu. Brabham sempat memasang kipas pada BT46B dan menang di GP Swedia 1978, tetapi mobil tersebut langsung dilarang.',
                'Pada 1977 Renault memperkenalkan mesin turbo 1,5 liter di mobil RS01 yang dijuluki yellow teapot karena sering mengepul dan rusak. Kemenangan turbo pertama baru datang di GP Prancis 1979 lewat Jean-Pierre Jabouille. Setelah itu hampir semua tim beralih ke turbo, dan pada pertengahan 1980-an tenaga mesinnya jauh melampaui seribu tenaga kuda. Nelson Piquet bersama Brabham-BMW menjadi juara turbo pertama pada 1983, disusul Niki Lauda yang menang atas Alain Prost hanya dengan selisih setengah poin pada 1984, lalu Prost sendiri juara pada 1985 dan 1986.',
                'Awal 1980-an juga kelam. Gilles Villeneuve tewas di kualifikasi GP Belgia 1982 di Zolder, dan beberapa bulan kemudian Didier Pironi mengalami kecelakaan parah di Hockenheim yang mengakhiri kariernya. Rangkaian peristiwa itu mempercepat pelarangan ground effect, sehingga mulai 1983 mobil wajib memakai lantai datar.',
                'Turbo sendiri dilarang mulai 1989 dan F1 kembali ke mesin 3,5 liter tanpa turbo. Di ujung era itu muncul dua pembalap yang akan mendefinisikan generasi berikutnya, Ayrton Senna dan Alain Prost, yang rivalitasnya dibahas pada kartu 1988 sampai 1990.'
            ]
        },
        {
            year: '1976', date: '24 OKTOBER', img: '1976.jpg', url: 'https://i.pinimg.com/1200x/43/b7/80/43b780093a65e99b1c64e62282b9907e.jpg', cap: 'Lauda dan Hunt, 1976',
            title: 'Rivalitas Lauda dan Hunt',
            text: [
                'Musim 1976 mempertemukan dua pembalap dengan karakter yang bertolak belakang: Niki Lauda yang disiplin dan penuh perhitungan bersama Ferrari, melawan James Hunt yang flamboyan bersama McLaren.',
                'Pada GP Jerman 1 Agustus, mobil Lauda menabrak dan terbakar di Nürburgring. Ia mengalami luka bakar parah dan paru-parunya rusak akibat menghirup asap, sampai-sampai sempat menerima sakramen terakhir.',
                'Meski begitu, Lauda kembali balapan hanya enam minggu kemudian di GP Italia dan finis keempat. Kembalinya ia ke lintasan dianggap sebagai salah satu momen keteguhan paling terkenal dalam olahraga.',
                'Penentuan gelar jatuh di GP Jepang yang diguyur hujan deras di Fuji. Lauda mundur setelah dua lap karena menilai kondisinya terlalu berbahaya, sedangkan Hunt finis ketiga dan merebut gelar dengan selisih satu poin. Kisah ini kemudian diangkat ke layar lebar lewat film Rush.'
            ]
        },
        {
            year: '1988–90', date: 'MCLAREN HONDA', img: 'senna-prost.jpg', url: 'https://s1.cdn.autoevolution.com/assets/images/news/gallery/senna-vs-prost-one-of-the-most-heated-rivalries-in-the-history-of-motorsport_3.jpg', cap: 'Senna dan Prost, McLaren',
            title: 'Rivalitas Senna dan Prost',
            text: [
                'Tidak ada rivalitas di F1 yang lebih sering diceritakan ulang daripada Ayrton Senna melawan Alain Prost. Keduanya satu tim di McLaren pada 1988 dan 1989, dengan mobil dan mesin Honda yang sama, sehingga tidak ada alasan teknis untuk menjelaskan siapa yang kalah. Yang tersisa hanya soal siapa yang lebih cepat, lebih berani, dan lebih lihai, baik di lintasan maupun di balik meja.',
                'Prost, pembalap Prancis yang dijuluki Sang Profesor, dikenal halus, penuh perhitungan, dan hemat risiko. Senna, pembalap Brasil, mengandalkan kecepatan murni di kualifikasi, keyakinan religius yang kuat, dan keberanian yang kadang tampak berlebihan. Prost sudah dua kali juara dunia ketika Senna bergabung pada 1988, sehingga kedatangan Senna terasa seperti penantang yang menggerogoti takhtanya dari dalam rumah sendiri.',
                'Musim 1988 sangat dominan. McLaren MP4/4 memenangi 15 dari 16 balapan, dan satu-satunya kekalahan terjadi di Monza ketika Senna bertabrakan dengan pembalap tertinggal beberapa lap sebelum finis, hanya sebulan setelah wafatnya Enzo Ferrari. Senna memenangi delapan balapan dan Prost tujuh. Prost mengumpulkan lebih banyak poin secara total, tetapi aturan saat itu hanya menghitung 11 hasil terbaik, sehingga Senna keluar sebagai juara dengan 90 poin melawan 87.',
                'Gelar itu ditentukan di Suzuka. Mesin Senna mati saat start dan ia nyaris terakhir, tetapi ia menyalip satu per satu di tengah hujan, melewati Prost pada lap 28, lalu menang dan menjadi juara dunia untuk pertama kalinya. Sebelumnya, di GP Portugal 1988, Senna menekan Prost ke arah dinding pit pada kecepatan sekitar 280 km/jam. Prost tersinggung dan merasa keselamatannya dipertaruhkan, dan sejak itu hubungan mereka retak.',
                'Pada 1989 hubungan makin buruk. Di GP San Marino di Imola, keduanya konon sepakat bahwa siapa pun yang lebih dulu masuk tikungan pertama tidak akan diserang. Balapan dihentikan akibat kecelakaan Gerhard Berger yang mobilnya terbakar di Tamburello, lalu pada start ulang Senna melewati Prost di tikungan Tosa dan menang. Prost menilai kesepakatan dilanggar, sementara Senna membantah menyepakatinya seperti itu. Sejak itu keduanya nyaris tak bertegur sapa di dalam tim.',
                'Penentuan gelar terjadi lagi di Suzuka. Senna harus menang untuk menjaga peluang, lalu mencoba menyalip Prost di chicane pada lap 47. Keduanya bertabrakan dan saling terkunci. Prost keluar dari mobil, sementara Senna meminta marshal mendorongnya, kembali lewat jalan pintas chicane, mengganti sayap depan di pit, dan memenangi balapan. Tak lama kemudian ia didiskualifikasi karena dinilai memotong chicane, sehingga Prost menjadi juara dunia. Senna menuding presiden FISA Jean-Marie Balestre, yang sama-sama orang Prancis dengan Prost, bersikap memihak, dan ia sendiri sempat terkena denda besar serta ancaman skors.',
                'Prost pindah ke Ferrari pada 1990, dan musim itu kembali ditentukan di Suzuka. Senna merebut pole, tetapi posisi pole berada di sisi lintasan yang lebih kotor dan permintaannya agar dipindah ke sisi yang lebih bersih ditolak. Saat start, Prost lebih dulu, dan di tikungan pertama Senna menabrakkan mobilnya ke Ferrari Prost. Keduanya keluar, dan Senna dinyatakan juara dunia untuk kedua kalinya. Setahun kemudian, setelah merebut gelar ketiganya, Senna mengakui tabrakan itu disengaja.',
                'Prost mengakhiri rivalitas itu dengan juara keempat bersama Williams pada 1993, lalu pensiun. Di GP Australia 1993, balapan terakhir mereka sebagai pesaing, Senna yang menang mengajak Prost naik ke puncak podium dan menggandeng tangannya. Setelah Senna meninggal pada 1994, Prost ikut memikul peti jenazahnya, tanda bahwa di balik permusuhan itu ada rasa hormat yang dalam.',
                'Secara angka, Prost meraih empat gelar dunia (1985, 1986, 1989, 1993) dengan 51 kemenangan, sedangkan Senna meraih tiga gelar (1988, 1990, 1991) dengan 41 kemenangan dan 65 pole position. Banyak penggemar menilai tidak ada rivalitas sesudahnya yang sekeras dan seberdampak ini.'
            ]
        },
        {
            year: '1994', date: '1 MEI', img: '1994.jpg', url: 'https://i.pinimg.com/1200x/69/59/8f/69598f18bc83c101638ee6944be95ea6.jpg', cap: 'Imola, 1994',
            title: 'Imola dan Era Keselamatan',
            text: [
                'Akhir pekan GP San Marino 1994 menjadi salah satu yang paling kelam dalam sejarah F1. Pada Jumat, Rubens Barrichello selamat dari kecelakaan hebat, lalu pada Sabtu Roland Ratzenberger meninggal dunia saat kualifikasi.',
                'Pada Minggu 1 Mei, Ayrton Senna, tiga kali juara dunia yang dipuja banyak orang, mengalami kecelakaan fatal di tikungan Tamburello saat memimpin balapan bersama Williams.',
                'Peristiwa ini mengguncang dunia balap dan memicu pembenahan keselamatan secara besar-besaran. Sirkuit diubah, struktur mobil diperkuat, serta dinding pelindung dan area pembuangan diperbaiki.',
                'Perangkat pelindung pembalap terus dikembangkan sesudahnya, termasuk HANS dan belakangan halo. Berkat perubahan itu, F1 modern jauh lebih aman, dan pembalap kini bisa selamat dari kecelakaan yang dulu hampir pasti berakibat fatal.'
            ]
        },
        {
            year: '2000', date: '2000 - 2004', img: '2000.jpg', url: 'https://i.pinimg.com/1200x/54/a2/3a/54a23a51520ef2723cf392622678c4dc.jpg', cap: 'Ferrari, awal 2000-an',
            title: 'Dominasi Schumacher dan Ferrari',
            text: [
                'Michael Schumacher meraih lima gelar dunia beruntun bersama Ferrari pada 2000 sampai 2004. Gelar 2000 sangat berarti karena menjadi gelar pembalap pertama Ferrari setelah penantian sekitar 21 tahun.',
                'Kesuksesan itu lahir dari kerja sama solid antara Schumacher, bos tim Jean Todt, direktur teknis Ross Brawn, dan desainer Rory Byrne. Kekompakan mereka membuat Ferrari sangat konsisten dari balapan ke balapan.',
                'Ferrari juga merebut gelar konstruktor enam tahun berturut-turut dari 1999 sampai 2004. Puncaknya terjadi pada 2002 dan 2004, ketika Schumacher memenangi sebagian besar balapan dalam satu musim.',
                'Totalnya tujuh gelar dunia, rekor yang bertahan lama sebelum akhirnya disamai Lewis Hamilton pada 2020.'
            ]
        },
        {
            year: '2005–13', date: 'DARI V10 KE V8', img: '2005.jpg', url: 'https://wallpapers.com/assets/images/hd/f1-renault-r25-2005-udjwjrumtocelfss.jpg', cap: 'Renault R25, 2005',
            title: 'Alonso, Hamilton, dan Empat Gelar Vettel',
            text: [
                'Setelah lima gelar beruntun Schumacher, F1 memasuki sembilan musim yang penuh pergantian juara. Dari 2005 sampai 2013 gelar dimenangi lima pembalap berbeda, mesin berubah dari V10 ke V8, dan generasi muda yang haus kemenangan menggeser pembalap lama.',
                'Fernando Alonso bersama Renault R25 mengakhiri dominasi Ferrari pada 2005 dan, pada usia 24 tahun, menjadi juara dunia termuda saat itu. Ia mempertahankan gelarnya pada 2006 setelah duel ketat dengan Schumacher. Musim 2005 juga diwarnai peristiwa memalukan di GP Amerika Serikat di Indianapolis, ketika tim-tim berban Michelin menarik mobil mereka setelah formation lap karena ban dianggap tidak aman di tikungan miring, sehingga hanya enam mobil yang balapan.',
                'Mulai 2006 mesin V10 3,0 liter digantikan V8 2,4 liter. Di akhir musim itu Michael Schumacher mengumumkan pensiun, dan di balapan terakhirnya di Brasil ia bangkit dari urutan belakang setelah bannya bocor hingga finis keempat.',
                'Musim 2007 memperkenalkan Lewis Hamilton sebagai pendatang baru yang langsung menantang gelar bersama McLaren, bahkan bersaing dengan rekan setimnya sendiri, Alonso. Di Brasil, Kimi Räikkönen dari Ferrari mencuri gelar dengan selisih satu poin dari keduanya. Musim itu juga tercoreng kasus spionase Ferrari dan McLaren, yang berujung denda 100 juta dolar serta dikeluarkannya McLaren dari klasemen konstruktor.',
                'Pada 2008 Hamilton menjadi juara dunia termuda saat itu pada usia 23 tahun. Ia merebut gelar di tikungan terakhir lap terakhir GP Brasil dengan menyalip Timo Glock, hanya unggul satu poin dari Felipe Massa yang sempat mengira dirinya juara setelah memenangi balapan. Musim yang sama diwarnai skandal Crashgate di Singapura, ketika Renault terbukti sengaja menabrakkan salah satu mobilnya demi keuntungan strategi, yang baru terungkap setahun kemudian.',
                'Kisah paling dongeng terjadi pada 2009. Honda menarik diri akhir 2008 karena krisis ekonomi, lalu Ross Brawn membeli tim itu dengan harga simbolis dan menamainya Brawn GP. Dengan diffuser ganda yang cerdik, Jenson Button memenangi enam dari tujuh balapan awal dan menjadi juara dunia, sementara tim itu juga merebut gelar konstruktor di musim pertamanya. Di akhir tahun Mercedes membeli tim tersebut, yang kelak menjadi dasar dominasi era hybrid.',
                'Red Bull dan desainer Adrian Newey kemudian mengambil alih. Pada 2010 Sebastian Vettel menjadi juara dunia termuda dalam sejarah pada usia 23 tahun, lewat final empat pembalap di Abu Dhabi yang mempertemukannya dengan Alonso, Mark Webber, dan Hamilton. Setelah itu Vettel juara lagi pada 2011, 2012, dan 2013, empat gelar beruntun.',
                'Periode ini juga membawa banyak perubahan aturan. KERS, sistem pemulihan energi, hadir pada 2009 sebagai pembuka jalan era hybrid, pengisian bahan bakar saat balapan dilarang mulai 2010, dan DRS serta ban Pirelli diperkenalkan pada 2011. Musim 2012 menghadirkan tujuh pemenang berbeda di tujuh balapan awal, sebelum Vettel menutupnya dengan selisih tiga poin atas Alonso di Brasil. Pada 2013 Vettel menutup musim dengan sembilan kemenangan beruntun dan total 13 kemenangan dari 19 balapan.',
                'Musim 2013 menjadi musim terakhir mesin V8. Setahun kemudian F1 beralih ke mesin hybrid V6 turbo, babak yang dibahas pada kartu 2014.'
            ]
        },
        {
            year: '2014', date: '16 MARET', img: '2014.jpg', url: 'https://i.pinimg.com/1200x/6a/36/73/6a36732032bd445c2dff06ea18a4ff35.jpg', cap: 'Era hybrid, 2014',
            title: 'Dimulainya Era Hybrid',
            text: [
                'Mesin V6 turbo hybrid 1,6 liter menggantikan V8 beraspirasi alami di musim 2014, dimulai dari GP Australia di Melbourne. Unit tenaga baru ini menggabungkan mesin pembakaran dengan sistem pemulihan energi (ERS).',
                'ERS mengubah energi pengereman dan panas gas buang menjadi tenaga listrik. Aturan tersebut juga membatasi aliran bahan bakar, sehingga efisiensi menjadi kunci performa.',
                'Mercedes paling cepat beradaptasi dan memenangi gelar konstruktor delapan kali berturut-turut, dari 2014 sampai 2021.',
                'Dari 2014 sampai 2020, gelar pembalap juga selalu jatuh ke pembalap Mercedes, yaitu Lewis Hamilton enam kali dan Nico Rosberg satu kali. Era ini sering disebut era hybrid dan sekaligus era dominasi Mercedes.'
            ]
        },
        {
            year: '2021', date: '12 DESEMBER', img: '2021.jpg', url: 'https://i.pinimg.com/736x/bd/5a/36/bd5a36e82055c30f22326f31e547c529.jpg', cap: 'Abu Dhabi, 2021',
            title: 'Penentuan Gelar di Abu Dhabi',
            text: [
                'Max Verstappen dan Lewis Hamilton datang ke balapan terakhir di Abu Dhabi dengan poin yang sama, sesuatu yang sangat jarang terjadi dalam sejarah F1.',
                'Hamilton memimpin sebagian besar balapan, tetapi kecelakaan Nicholas Latifi di lap-lap akhir memunculkan safety car.',
                'Keputusan direktur balapan soal mobil-mobil yang tertinggal satu lap membuat Verstappen, yang sudah memakai ban baru, berada tepat di belakang Hamilton saat balapan dilanjutkan. Verstappen lalu menyalip Hamilton di lap terakhir dan menjadi juara dunia pertama dari Belanda.',
                'Hasil ini memicu perdebatan panjang, dan FIA kemudian meninjau prosedur safety car serta pengelolaan kendali balapan.'
            ]
        },
        {
            year: '2022–25', date: 'ERA VERSTAPPEN', img: '2022.jpg', url: 'https://i.pinimg.com/736x/72/61/ae/7261ae040fb51029ec63723f39c950ac.jpg', cap: 'Max Verstappen, Red Bull',
            title: 'Puncak Max Verstappen dan Era Ground Effect',
            text: [
                'Musim 2022 membuka babak baru dengan dua perubahan besar: aturan mobil yang menghidupkan lagi ground effect agar mobil lebih mudah saling membuntuti, dan roda berukuran 18 inci menggantikan 13 inci. Dari situ muncul era yang didominasi satu nama, Max Verstappen.',
                'Verstappen bukan wajah baru. Ia debut pada 2015 bersama Toro Rosso di usia 17 tahun, pembalap termuda dalam sejarah F1. Setahun kemudian, pada GP Spanyol 2016, ia dipromosikan ke Red Bull dan langsung menang di balapan pertamanya bersama tim itu pada usia 18 tahun, pemenang termuda sepanjang masa. Putra mantan pembalap Jos Verstappen itu dikenal agresif dan berani beradu roda, gaya yang kemudian ia matangkan menjadi lebih konsisten.',
                'Gelar dunia pertamanya datang di Abu Dhabi 2021 yang kontroversial, seperti dibahas pada kartu sebelumnya. Dari titik itu, Verstappen dan Red Bull memasuki masa puncak mereka.',
                'Pada 2022 Ferrari memulai lebih cepat lewat F1-75 dan Charles Leclerc sempat memimpin klasemen, sementara Verstappen gagal finis di dua dari tiga balapan pertama. Namun Red Bull RB18 berkembang pesat dan Verstappen memenangi 15 dari 22 balapan, rekor pada saat itu. Gelar keduanya dipastikan di Suzuka dalam balapan basah, dan ia menutup musim dengan 454 poin. Red Bull belakangan dikenai denda dan pembatasan pengembangan karena melanggar batas anggaran (cost cap) 2021.',
                'Puncaknya terjadi pada 2023. RB19 memenangi 21 dari 22 balapan, dengan satu-satunya kekalahan terjadi di Singapura oleh Carlos Sainz dari Ferrari. Verstappen sendiri memenangi 19 balapan, rekor yang belum pernah tercapai sebelumnya, termasuk sepuluh kemenangan beruntun dari Miami sampai Italia, dan menutup tahun dengan rekor 575 poin. Gelar ketiganya diamankan lewat balapan sprint di Qatar.',
                'Pada 2024 keunggulan Red Bull menipis karena McLaren dan Ferrari berkembang, tetapi Verstappen menjaga jarak lewat konsistensi dan menjadi juara untuk keempat kalinya, dipastikan di Las Vegas. Dengan itu ia menyamai Alain Prost dan Sebastian Vettel dalam jumlah gelar. McLaren bersama Lando Norris dan Oscar Piastri meraih gelar konstruktor 2024, yang pertama bagi tim itu sejak 1998.',
                'Musim 2025 mengakhiri masa kejayaan itu, tetapi dengan cara yang nyaris mustahil. Verstappen sempat tertinggal jauh dari dua pembalap McLaren, lalu mengejar sepanjang paruh akhir musim dan memenangi Abu Dhabi untuk menutup tahun. Lando Norris finis ketiga di balapan itu dan menjadi juara dunia dengan 423 poin, hanya dua poin di atas Verstappen yang mengumpulkan 421 poin dan delapan kemenangan, sementara Oscar Piastri mengumpulkan 410 poin. Masa kejayaan Verstappen sebagai juara bertahan pun berakhir setelah sekitar empat tahun.',
                'Musim 2025 juga ditandai kepindahan Lewis Hamilton ke Ferrari setelah 12 tahun bersama Mercedes, dan McLaren menutup tahun dengan gelar konstruktor.',
                'Dengan empat gelar dunia dan deretan rekor di usia yang masih muda, banyak yang menempatkan Verstappen di antara pembalap terbaik sepanjang masa. Pada 2026 aturan berganti lagi, sehingga pertanyaan besarnya adalah apakah ia bisa kembali ke puncak dengan mobil baru. Kelanjutannya ada di kartu 2026.'
            ]
        },
        {
            year: '2026', date: 'ERA BARU', img: '2026.jpg', url: 'https://i.pinimg.com/736x/6d/a7/a7/6da7a72d2baa5052915d6cfd982c99d3.jpg', cap: 'Grid 2026',
            title: 'Regulasi Baru dan Dua Pendatang',
            text: [
                'Aturan mobil dan mesin berubah besar di 2026. Mobil dibuat lebih kecil dan ringan, dengan aerodinamika aktif yang sayapnya bisa menyesuaikan posisi.',
                'Unit tenaga memiliki porsi listrik yang jauh lebih besar, hampir setara dengan tenaga mesin pembakaran, sementara komponen MGU-H dihapus dan bahan bakar berkelanjutan mulai digunakan.',
                'Perubahan ini membuka peluang pabrikan baru. Audi hadir sebagai tim pabrikan dengan mengambil alih tim Sauber, dan Cadillac bergabung sebagai tim ke-11 di grid.',
                'Pergantian regulasi sebesar ini biasanya mengacak peta persaingan, sehingga tim yang paling cepat memahami aturan baru bisa unggul jauh dari yang lain.'
            ]
        }
    ];

    const N = HISTORY.length;
    let cur = 0, busy = false, ghost = null, ghostT = 0, lastFocus = null;
    let sx = 0, sy = 0, down = false, dragged = false;

    /* ---------- RENDER ---------- */
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

    const item = (h, i) => `
        <article class="hs-item" data-i="${i}">
            <img src="assets/images/sejarah/${h.img}" alt="${esc(h.title)}" decoding="async" draggable="false">
            <span class="hs-ph"><b>${h.year}</b><small>Taruh foto di assets/images/sejarah/${h.img}</small></span>
            <div class="hs-tag"><b>${h.year}</b><small>${esc(h.cap)}</small></div>
            <div class="hs-content">
                <div class="hs-year">${h.year}</div>
                <h3 class="hs-title">${esc(h.title)}</h3>
                <p class="hs-desc">${h.text[0]}</p>
            </div>
        </article>`;

    root.innerHTML = `
        <section class="hs-stage" aria-roledescription="carousel" aria-label="Linimasa sejarah Formula 1">
            ${HISTORY.map(item).join('')}
        </section>
        <div class="hs-modal" role="dialog" aria-modal="true" aria-labelledby="hs-m-title">
            <div class="hs-sheet">
                <button type="button" class="hs-close" aria-label="Tutup">&#10005;</button>
                <figure class="hs-sheet-pic" style="margin:0"><img alt=""><figcaption class="hs-sheet-cap"></figcaption></figure>
                <div class="hs-sheet-body">
                    <div class="hs-sheet-year"></div>
                    <h3 class="hs-sheet-title" id="hs-m-title"></h3>
                    <div class="hs-sheet-text"></div>
                </div>
            </div>
        </div>`;

    const stage = root.querySelector('.hs-stage');
    const items = [...root.querySelectorAll('.hs-item')];

    /* foto: coba file lokal dulu, kalau gagal pakai link, kalau gagal juga tampil placeholder */
    items.forEach((el, i) => {
        const img = el.querySelector('img'), url = HISTORY[i].url;
        img.addEventListener('error', () => {
            if (!img.dataset.f && url) { img.dataset.f = 1; img.src = url; }
            else el.classList.add('noimg');
        });
    });

    /* ---------- POSISI: 0 = layar penuh, 1.. = kartu, N-1 = slide sebelumnya (tersembunyi) ---------- */
    function update() {
        items.forEach((el, i) => {
            const p = (i - cur + N) % N;
            const role = p === 0 ? 'active' : (p === N - 1 && N > 2 ? 'prev' : 'card');
            const h = HISTORY[i];
            el.style.setProperty('--p', p);
            el.dataset.role = role;
            if (role === 'prev') {
                el.removeAttribute('role'); el.tabIndex = -1; el.setAttribute('aria-hidden', 'true');
            } else {
                el.setAttribute('role', 'button'); el.tabIndex = 0; el.removeAttribute('aria-hidden');
                el.setAttribute('aria-label', (role === 'active' ? 'Baca selengkapnya: ' : 'Buka ') + h.year + ', ' + h.title);
            }
        });
    }

    function go(to, dir) {
        to = (to + N) % N;
        if (to === cur || busy) return;
        const before = items[cur];
        items.forEach(el => el.classList.remove('is-ghost'));
        if (dir !== 'back') { ghost = before; before.classList.add('is-ghost'); } else ghost = null;
        cur = to;
        update();
        busy = !REDUCE;
        clearTimeout(ghostT);
        ghostT = setTimeout(() => {
            busy = false;
            if (ghost) {   /* slide lama dilepas tanpa animasi, supaya tidak terlihat menciut */
                const g = ghost; ghost = null;
                g.classList.add('no-trans'); g.classList.remove('is-ghost');
                void g.offsetWidth;
                g.classList.remove('no-trans');
            }
        }, REDUCE ? 0 : 830);
    }
    const next = () => go(cur + 1, 'next');
    const prev = () => go(cur - 1, 'back');

    /* ---------- INTERAKSI ---------- */
    /* klik kartu kecil = pindah ke tahun itu, klik foto besar = baca selengkapnya */
    function activate(el) {
        if (!el || dragged) return;
        if (el.dataset.role === 'card') go(+el.dataset.i, 'next');
        else if (el.dataset.role === 'active') openModal(+el.dataset.i, el);
    }
    stage.addEventListener('click', e => activate(e.target.closest('.hs-item')));
    stage.addEventListener('keydown', e => {
        const el = e.target.closest('.hs-item');
        if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); activate(el); }
    });

    /* geser jari / mouse di panggung */
    stage.addEventListener('pointerdown', e => { down = true; dragged = false; sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', e => {
        if (!down) return; down = false;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            dragged = true; dx < 0 ? next() : prev();
            setTimeout(() => { dragged = false; }, 60);
        }
    });
    stage.addEventListener('pointercancel', () => { down = false; });

    /* panah keyboard (hanya saat halaman Sejarah tampil dan jendela tertutup) */
    document.addEventListener('keydown', e => {
        if (!root.classList.contains('active') || modal.classList.contains('open')) return;
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
        if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    });

    /* ---------- JENDELA SELENGKAPNYA ---------- */
    const modal = root.querySelector('.hs-modal');
    /* FIX: pindahkan modal ke <body> supaya position:fixed selalu mengacu ke layar,
       bukan ke induk yang punya transform/filter (penyebab modal bergeser di tablet) */
    document.body.appendChild(modal);
    const sheet = modal.querySelector('.hs-sheet');
    const closeBtn = modal.querySelector('.hs-close');
    function openModal(i, trigger) {
        const h = HISTORY[i], src = items[i].querySelector('img');
        lastFocus = trigger || document.activeElement;
        const pic = modal.querySelector('.hs-sheet-pic img');
        pic.src = src.currentSrc || src.src; pic.alt = h.title;
        modal.querySelector('.hs-sheet-pic').style.display = items[i].classList.contains('noimg') ? 'none' : '';
        modal.querySelector('.hs-sheet-cap').textContent = h.cap;
        modal.querySelector('.hs-sheet-year').textContent = h.year;
        modal.querySelector('.hs-sheet-title').textContent = h.title;
        modal.querySelector('.hs-sheet-text').innerHTML = h.text.map(t => `<p class="hs-p">${t}</p>`).join('');
        modal.querySelector('.hs-sheet-body').scrollTop = 0;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }
    function closeModal() {
        if (!modal.classList.contains('open')) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (!sheet.contains(e.target)) closeModal(); });
    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'Tab') e.preventDefault();   /* fokus tetap di tombol tutup */
    });
    /* kalau pindah halaman saat jendela terbuka, tutup & kembalikan scroll */
    new MutationObserver(() => { if (!root.classList.contains('active')) closeModal(); })
        .observe(root, { attributes: true, attributeFilter: ['class'] });

    PAGE_THEMES['history-page'] = 'theme-history';
    update();
})();