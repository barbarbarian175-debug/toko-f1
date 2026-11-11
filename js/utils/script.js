/* =====================================================================
   DATA PEMBALAP
   - Biografi ditulis di dalam tanda backtick ( ` ` ), jadi kamu bisa
     tekan ENTER biar ganti baris. Setiap baris = 1 paragraf.
   - Statistik: tambah baris baru di "stats" kalau mau (misal "Menang": 5)
   ===================================================================== */
const driversData = {
    1: {
        name: "George Russell",
        team: "Mercedes-AMG F1",
        photo: "assets/images/drivers/foto1.jpeg",
        title: "George Russell: Mentalitas Pembuktian di Barisan Depan",
        stats: { "Nomor": 63, "Kebangsaan": "Inggris", "Debut F1": 2019 },
        bio: `
George William Russell adalah pembalap mobil profesional asal Inggris yang lahir pada 15 Februari 1998 di King's Lynn, Norfolk, dan saat ini berkompetisi di ajang kasta tertinggi Formula 1 bersama tim Mercedes-AMG Petronas. Dikenal luas dengan julukan *"Mr. Saturday"* karena ketajamannya yang luar biasa dalam mencatatkan waktu terbaik saat sesi kualifikasi, perjalanan karier Russell telah membentuknya menjadi salah satu talenta papan atas di dunia balap modern.

Karier balap Russell dimulai dari gokart sejak usia muda sebelum ia naik ke mobil roda terbuka. Ia bergabung dengan program pembinaan pembalap muda Mercedes pada 2017 dan langsung menjuarai GP3 Series pada musim debutnya, lalu mengulangi prestasi itu dengan menjuarai Formula 2 pada 2018 bersama ART Grand Prix.

Russell melakoni debut di Formula 1 pada musim 2019 bersama Williams. Meski mobilnya sering berada di barisan belakang, ia tampil menonjol di antara rekan-rekannya. Pada GP Sakhir 2020 ia dipanggil menggantikan Lewis Hamilton di Mercedes dan nyaris menang sebelum masalah saat pit stop dan ban bocor merenggut peluangnya. Podium pertamanya datang di GP Belgia 2021 bersama Williams dalam balapan yang diguyur hujan.

Mulai 2022 Russell resmi menjadi pembalap Mercedes dan rekan setim Hamilton. Kemenangan pertamanya diraih di GP São Paulo 2022, dan ia menambah kemenangan di GP Austria dan GP Las Vegas pada 2024. Perpaduan kecepatan di kualifikasi dan kematangan strateginya membuat Russell dipandang sebagai salah satu pemimpin generasi baru di grid F1.
`
    },
    2: {
        name: "Fernando Alonso",
        team: "Aston Martin",
        photo: "assets/images/drivers/foto2.jpeg",
        title: "Fernando Alonso: Pengalaman yang Tak Pernah Habis di Lintasan",
        stats: { "Nomor": 14, "Kebangsaan": "Spanyol", "Debut F1": 2001 },
        bio: `
Fernando Alonso Díaz adalah pembalap mobil profesional legendaris asal Spanyol yang lahir pada 29 Juli 1981 di Oviedo, Asturias, dan saat ini berkompetisi di ajang Formula 1 bersama tim Aston Martin Aramco. Dikenal sebagai salah satu pembalap paling berbakat, gigih, dan adaptif dalam sejarah olahraga otomotif, Alonso mencatatkan namanya di buku sejarah F1 setelah berhasil memutus dominasi Michael Schumacher dan meraih dua gelar Juara Dunia F1 secara berturut-turut pada tahun 2005 dan 2006 bersama tim Renault.

Perjalanan karier balapnya dimulai sejak usia tiga tahun melalui gokart buatan ayahnya, yang kemudian mengantarkannya menjuarai ajang Junior Karting World Championship pada tahun 1996. Bakat besarnya membuat Alonso melesat cepat ke ajang mobil roda terbuka hingga resmi melakoni debut di Formula 1 pada tahun 2001 bersama tim Minardi di usia 19 tahun. Setelah menjadi pembalap penguji dan kemudian pembalap utama di Renault, ia memecahkan rekor sebagai Juara Dunia F1 termuda pada masa itu di musim 2005. Sepanjang kariernya di F1, Alonso telah membela sejumlah tim besar seperti McLaren dan Ferrari, di mana ia tiga kali menjadi *runner-up* dunia setelah bersaing sengit hingga balapan terakhir.

Selain prestasinya di Formula 1, Alonso juga dikenal karena keberaniannya mengejar status kejuaraan *Triple Crown of Motorsport*. Saat beristirahat sejenak dari F1 pada tahun 2019 dan 2020, ia berhasil menjuarai ajang ketahanan paling bergengsi di dunia, 24 Hours of Le Mans, sebanyak dua kali (2018 dan 2019) serta merengkuh gelar juara FIA World Endurance Championship bersama Toyota Gazoo Racing. Ia juga sempat menjajal kemampuannya di ajang legendaris Indianapolis 500 dan Reli Dakar.

Alonso kembali ke F1 pada musim 2021 bersama Alpine sebelum akhirnya pindah ke Aston Martin pada musim 2023. Di usianya yang sudah berkepala empat, Alonso terus membuktikan bahwa usia hanyalah angka dengan performanya yang tetap berada di level tertinggi, meraih puluhan podium baru, serta memegang rekor sebagai pembalap dengan jumlah partisipasi Grand Prix terbanyak dalam sejarah Formula 1.
`
    },
    3: {
        name: "Alex Albon",
        team: "Williams Racing",
        photo: "assets/images/drivers/foto3.jpeg",
        title: "Alex Albon: Kebangkitan Kuat Lewat Ketangguhan Mental",
        stats: { "Nomor": 23, "Kebangsaan": "Thailand", "Debut F1": 2019 },
        bio: `
Alexander Albon Ansusinha adalah pembalap mobil profesional berdarah Inggris-Thailand yang lahir pada 23 Maret 1996 di London, Inggris, dan saat ini berkompetisi di ajang Formula 1 membela tim Williams Racing di bawah bendera Thailand. Dikenal dengan gaya balapnya yang halus namun agresif saat menyalip, serta kemampuan teknis yang kuat dalam mengoptimalkan performa mobil, Albon telah menjadi salah satu pembalap kunci yang berhasil membangkitkan kembali daya saing tim Williams di era F1 modern.

Karier balap Albon dimulai dari ajang gokart sejak usia delapan tahun, di mana ia meraih berbagai gelar juara nasional dan internasional, termasuk CIK-FIA European Championship pada tahun 2010. Perjalanannya menuju F1 sempat diwarnai dinamika naik-turun, namun bakat besarnya kembali bersinar saat ia berkompetisi di ajang FIA Formula 2 musim 2018. Berduel sengit bersama George Russell dan Lando Norris, Albon berhasil mengakhiri musim F1-junior tersebut di peringkat ke-3 klasemen akhir dengan raihan empat kemenangan balapan.

Performa luar biasa tersebut mengantarkan Albon melakoni debutnya di Formula 1 pada musim 2019 bersama tim Toro Rosso. Hanya dalam waktu setengah musim, performa impresifnya membuat manajemen Red Bull mempromosikannya ke tim utama Red Bull Racing pertengahan 2019 untuk mendampingi Max Verstappen. Selama membela Red Bull hingga musim 2020, Albon berhasil mencatatkan dua kali podium di GP Tuscani dan GP Bahrain, menjadikannya pembalap berpaspor Thailand pertama yang berdiri di podium F1. Meski sempat terlempar dari kursi utama pada musim 2021 dan bertugas sebagai pembalap penguji serta cadangan Red Bull, ia tetap berkontribusi besar dalam pengembangan mobil tim.

Albon melakukan *comeback* penuh ke F1 pada musim 2022 bersama Williams Racing. Di tim yang berbasis di Grove tersebut, Albon menjelmakan dirinya sebagai pemimpin tim yang sangat diandalkan, secara konsisten mencetak poin-poin krusial dan membawa Williams keluar dari papan bawah. Perannya yang makin vital di Williams ditegaskan lewat komitmen jangka panjangnya bersama tim untuk memimpin era regulasi baru F1, di mana ia bekerja sama dengan rekan setim barunya, Carlos Sainz Jr.
`
    },
    4: {
        name: "Pierre Gasly",
        team: "Alpine F1 Team",
        photo: "assets/images/drivers/foto4.jpeg",
        title: "Pierre Gasly: Menemukan Momentum Terbaik di Lintasan",
        stats: { "Nomor": 10, "Kebangsaan": "Prancis", "Debut F1": 2017 },
        bio: `
Pierre Jean-Jacques Gasly adalah pembalap mobil profesional asal Prancis yang lahir pada 7 Februari 1996 di Rouen, Prancis, dan saat ini berkompetisi di ajang Formula 1 membela tim asal negaranya, Alpine F1 Team. Dikenal dengan semangat juang yang tinggi, ketangguhan mental, serta kemampuan mengeksekusi peluang di situasi yang sulit, Gasly merupakan salah satu pembalap papan tengah paling konsisten dan teruji di grid F1 modern.

Karier balapnya dimulai dari ajang gokart pada usia sepuluh tahun sebelum akhirnya menembus balapan mobil roda terbuka. Karier juniornya berkembang sangat pesat di bawah naungan Red Bull Junior Team hingga puncaknya ia menjuarai kejuaraan bergengsi GP2 Series pada tahun 2016. Sebelum mendapat kesempatan penuh di F1, Gasly sempat mengasah kemampuannya di Jepang dan meraih posisi *runner-up* di ajang Super Formula 2017.

Gasly resmi melakoni debutnya di Formula 1 pada akhir musim 2017 bersama tim Toro Rosso. Performa impresifnya, termasuk raihan posisi ke-4 di GP Bahrain 2018, mengantarkannya dipromosikan ke tim utama Red Bull Racing pada musim 2019. Meski periode singkatnya di Red Bull berjalan penuh tekanan hingga membuat ia diturunkan kembali ke Toro Rosso di pertengahan musim, Gasly merespons momen sulit tersebut dengan luar biasa. Ia langsung meraih podium F1 pertamanya setelah finis di posisi ke-2 pada GP Brasil 2019.

Puncak kariernya terjadi pada musim 2020 bersama tim AlphaTauri, di mana ia mencatatkan kemenangan manis dan emosional di Grand Prix Italia (Monza), menjadikannya pembalap Prancis pertama yang memenangkan balapan F1 sejak Olivier Panis pada tahun 1996. Setelah bertahun-tahun menjadi pilar utama di kubu AlphaTauri dan menambah raihan podium di GP Azerbaijan 2021, Gasly memutuskan untuk membuka lembaran baru dalam kariernya dengan bergabung bersama Alpine mulai musim 2023, membentuk duet pembalap penuh asal Prancis dan menjadi salah satu tumpuan utama tim tersebut hingga saat ini.
`
    },
    5: {
        name: "Max Verstappen",
        team: "Red Bull Racing",
        photo: "assets/images/drivers/foto5.jpeg",
        title: "Max Verstappen: Menembus Batas Kesempurnaan Sirkuit",
        stats: { "Nomor": 3, "Kebangsaan": "Belanda", "Debut F1": 2015 },
        bio: `
Max Emilian Verstappen adalah pembalap mobil profesional asal Belanda yang lahir pada 30 September 1997 di Hasselt, Belgia, dan saat ini berkompetisi di ajang Formula 1 membela tim Red Bull Racing. Dikenal dengan gaya balapnya yang sangat agresif, kontrol mobil yang presisi, serta konsistensi tingkat tinggi, Verstappen diakui sebagai salah satu pembalap paling dominan dan berbakat dalam sejarah olahraga otomotif.

Lahir dari keluarga balap—ayahnya Jos Verstappen adalah mantan pembalap F1 dan ibunya Sophie Kumpen adalah mantan pembalap gokart berprestasi—Verstappen mengasah kemampuannya sejak usia empat tahun. Setelah mendominasi berbagai kejuaraan karting internasional hingga menjuarai CIK-FIA World KZ Championship 2013, ia melompati jenjang balap junior biasa dan langsung merambah ajang FIA Formula 3 European Championship pada tahun 2014. Bakat fenomena ini membuat Red Bull merekrutnya ke program pembalap muda dan memberinya debut F1 pada musim 2015 bersama Toro Rosso di usia yang baru 17 tahun 166 hari, mencatatkan rekor sebagai pembalap F1 termuda dalam sejarah.

Pada awal musim 2016, Verstappen dipromosikan ke tim utama Red Bull Racing dan langsung mencetak sejarah dengan memenangkan balapan pertamanya di GP Spanyol, menjadikannya pemenang Grand Prix termuda sepanjang masa di usia 18 tahun 228 hari. Setelah beberapa tahun berjuang mematahkan dominasi Mercedes, puncaknya terjadi pada musim 2021 ketika ia meraih gelar Juara Dunia F1 pertamanya setelah pertarungan sengit hingga lap terakhir balapan penutup musim melawan Lewis Hamilton.

Karier Verstappen kemudian memasuki era dominasi mutlak. Pada musim 2022 dan 2023, ia memecahkan berbagai rekor bersejarah, termasuk rekor kemenangan terbanyak dalam satu musim (19 kemenangan pada 2023) dan kemenangan beruntun terbanyak (10 balapan). Verstappen mengukuhkan statusnya di jajaran legenda dengan mengunci gelar Juara Dunia F1 secara berturut-turut pada 2021, 2022, 2023, dan 2024, menjadikannya juara dunia empat kali dan pilar utama kesuksesan Red Bull Racing di era regulasi modern..
`
    },
    6: {
        name: "Nico Hulkenberg",
        team: "Audi",
        photo: "assets/images/drivers/foto6.jpeg",
        title: "Nico Hulkenberg: Konsistensi Membangun Pondasi Kesuksesan",
        stats: { "Nomor": 27, "Kebangsaan": "Jerman", "Debut F1": 2010 },
        bio: `
Nicolas "Nico" Hülkenberg adalah pembalap mobil profesional asal Jerman yang lahir pada 19 Agustus 1987 di Emmerich am Rhein, dan saat ini berkompetisi di ajang Formula 1 membela tim Kick Sauber (yang bertransisi menjadi tim pabrikan Audi). Dikenal sebagai salah satu pembalap dengan talenta murni dan pemahaman teknis paling solid di *grid*, Hülkenberg mendapat julukan *"Hulk"* serta reputasi sebagai pembalap andal yang kerap diandalkan tim untuk mengamankan poin-poin krusial di situasi sulit.

Karier junior Hülkenberg merupakan salah satu yang paling impresif dalam sejarah balap mobil roda terbuka. Setelah mendominasi kejuaraan gokart Jerman, ia berhasil menjuarai Formula BMW Jerman (2005), A1 Grand Prix (2006–2007), Formula 3 Euro Series (2008), dan langsung merengkuh gelar juara GP2 Series pada musim pertamanya (*rookie*) di tahun 2009. Performa dominan ini mengantarkannya melakoni debut di Formula 1 pada musim 2010 bersama tim Williams, di mana ia mencuri perhatian dunia dengan merebut *pole position* pertamanya di GP Brasil pada kondisi lintasan basah.

Sepanjang kariernya di F1, Hülkenberg telah membela sejumlah tim papan tengah seperti Force India, Sauber, dan Renault. Di luar ajang F1, ia mencatatkan prestasi monumental pada tahun 2015 ketika berpartisipasi dalam ajang ketahanan paling bergengsi di dunia, 24 Hours of Le Mans. Mengendarai Porsche 919 Hybrid di kategori utama LMP1 pada percobaan pertamanya, Hülkenberg berhasil keluar sebagai juara umum. Kendati memiliki reputasi unik di F1 sebagai pembalap dengan jumlah partisipasi Grand Prix terbanyak tanpa pernah berdiri di atas podium, bakat dan kualitasnya tidak pernah diragukan oleh padok F1.

Setelah sempat kehilangan kursi utama dan menjadi pembalap cadangan "super-sub" yang impresif untuk Racing Point dan Aston Martin saat pandemi, Hülkenberg melakukan *comeback* penuh ke F1 bersama Haas F1 Team pada musim 2023. Performa kualifikasi dan konsistensinya yang sangat tajam bersama Haas membawanya direkrut oleh proyek besar Sauber/Audi, menjadikannya pembalap utama Jerman yang memimpin transisi tim menuju era regulasi baru Formula 1..
`
    },
    7: {
        name: "Carlos Sainz",
        team: "Williams Racing",
        photo: "assets/images/drivers/foto7.jpeg",
        title: "Carlos Sainz: Adaptasi Cepat di Tengah Badai Tantangan",
        stats: { "Nomor": 55, "Kebangsaan": "Spanyol", "Debut F1": 2015 },
        bio: `
Carlos Sainz Vázquez de Castro adalah pembalap mobil profesional asal Spanyol yang lahir pada 1 September 1994 di Madrid, dan saat ini berkompetisi di ajang Formula 1 membela tim Williams Racing. Dikenal dengan julukan *"Smooth Operator"*, Sainz dipandang sebagai salah satu pembalap paling cerdas, analitis, dan konsisten di *grid*, dengan pemahaman taktis yang sangat tinggi di atas lintasan.

Sebagai putra dari legenda reli dunia dan juara bertahan Dakar Carlos Sainz Sr., darah balap mengalir kuat dalam dirinya. Kariernya dimulai dari ajang gokart hingga berhasil menjuarai kejuaraan bergengsi Formula Renault 3.5 Series pada tahun 2014 di bawah naungan Red Bull Junior Team. Keberhasilan tersebut membawanya melakoni debut di Formula 1 pada musim 2015 bersama tim Toro Rosso, di mana ia bersanding dengan Max Verstappen sebagai sesama pembalap *rookie*.

Sainz kemudian dikenal sebagai salah satu pembalap paling adaptif setelah membela sejumlah tim besar sepanjang kariernya. Ia pindah ke Renault pada akhir musim 2017, sebelum akhirnya bergabung dengan McLaren pada tahun 2019. Di McLaren, ia membuktikan kapasitasnya sebagai pemimpin tim dan meraih podium pertamanya di GP Brasil 2019. Performa apiknya membuat Ferrari merekrutnya pada musim 2021. Bersama tim kuda jingkrak tersebut, Sainz mengukir sejarah dengan merebut kemenangan F1 pertamanya di GP Britania Raya 2022, serta meraih kemenangan spektakuler di GP Singapura 2023—menjadi satu-satunya pembalap non-Red Bull yang berhasil menang di musim tersebut—dan kemenangan di GP Australia serta GP Meksiko 2024.

Setelah masa baktinya di Ferrari berakhir seiring bergabungnya Lewis Hamilton, Sainz mengambil langkah strategis dengan bergabung ke Williams Racing mulai musim 2025. Di tim yang berbasis di Grove tersebut, Sainz menjadi sosok krusial yang bahu-membahu bersama Alex Albon untuk membangun kembali kejayaan Williams di F1, dan ia telah berkomitmen menandatangani kontrak jangka panjang bersama tim..
`
    },
    8: {
        name: "Andrea Kimi Antonelli",
        team: "Mercedes Junior",
        photo: "assets/images/drivers/foto8.jpeg",
        title: "Andrea Kimi Antonelli: Mengguncang Ekspektasi di Usia Muda",
        stats: { "Nomor": 12, "Kebangsaan": "Italia", "Debut F1": 2025 },
        bio: `
Andrea Kimi Antonelli adalah pembalap mobil profesional asal Italia yang lahir pada 25 Agustus 2006 di Bologna, dan saat ini berkompetisi di ajang Formula 1 membela tim Mercedes-AMG Petronas. Dipandang sebagai salah satu talenta muda paling fenomenal dan paling dinantikan kemunculannya di dunia balap modern, Antonelli dijuluki sebagai "prodigy" berkat rekam jejak prestasinya yang mendominasi hampir di setiap level kejuaraan yang ia ikuti.

Darah balap mengalir dari ayahnya, Marco Antonelli, yang merupakan mantan pembalap dan pemilik tim balap. Antonelli mulai mengendarai gokart di usia sangat muda dan mendominasi ajang karting internasional dengan menjuarai CIK-FIA European Championship secara berturut-turut pada tahun 2020 dan 2021. Performa luar biasa ini membuat Mercedes Junior Team merekrutnya sejak tahun 2019 saat ia baru berusia 12 tahun.

Karier balap mobil roda terbukanya berkembang dengan kecepatan yang luar biasa. Hanya dalam kurun waktu beberapa tahun, Antonelli menyapu bersih berbagai gelar kejuaraan junior, termasuk menjuarai Italian F4 Championship (2022), ADAC F4 Championship (2022), Formula Regional Middle East Championship (2023), dan Formula Regional European Championship / FRECA (2023). Melihat bakatnya yang sangat masif, Mercedes mengambil keputusan berani dengan melompati jenjang Formula 3 dan langsung menerjunkan Antonelli ke ajang FIA Formula 2 pada musim 2024 bersama tim Prema Racing, di mana ia sukses mencatatkan beberapa kemenangan impresif di musim perdananya.

Pada akhir musim 2024, Mercedes secara resmi mengumumkan Antonelli sebagai pembalap utama mereka mulai musim 2025 untuk mengisi posisi yang ditinggalkan oleh Lewis Hamilton. Menginjakkan kaki di F1 pada usia 18 tahun, Antonelli menjadi pembalap asal Italia pertama yang membela tim papan atas Mercedes di era modern, di mana ia bersanding dengan George Russell untuk memimpin era baru tim berlambang bintang tiga tersebut.
`
    },
    9: {
        name: "Oscar Piastri",
        team: "McLaren F1 Team",
        photo: "assets/images/drivers/foto9.jpeg",
        title: "Oscar Piastri: Ketenangan Ekstrem di Balik Kemudi Kontrol",
        stats: { "Nomor": 81, "Kebangsaan": "Australia", "Debut F1": 2023 },
        bio: `
Oscar Jack Piastri adalah pembalap mobil profesional asal Australia yang lahir pada 6 April 2001 di Melbourne, Victoria, dan saat ini berkompetisi di ajang Formula 1 membela tim McLaren F1 Team. Dikenal dengan ketenangannya yang luar biasa di bawah tekanan, konsistensi tinggi, serta adaptasi yang sangat cepat, Piastri dipandang sebagai salah satu talenta muda paling menjanjikan dan calon juara dunia di era modern F1.

Darah balapnya terasah sejak usia sembilan tahun melalui ajang gokart di Australia sebelum akhirnya pindah ke Eropa untuk mengejar karier profesional. Piastri mencatatkan salah satu rekam jejak junior paling fenomenal dalam sejarah balap mobil roda terbuka dengan menjuarai tiga kejuaraan bergengsi secara berturut-turut pada musim perdananya (*rookie*): Formula Renault Eurocup (2019), FIA Formula 3 (2020), dan FIA Formula 2 (2021) di bawah naungan Alpine Academy.

Setelah menghabiskan musim 2022 sebagai pembalap cadangan dan menjadi pusat perhatian dalam "perebutan kontrak" yang heboh antara Alpine dan McLaren, Piastri resmi melakoni debutnya di Formula 1 pada musim 2023 bersama McLaren. Di musim perdananya, ia langsung mencuri perhatian dunia dengan meraih kemenangan di balapan Sprint GP Qatar serta mengamankan dua podium balapan utama, yang mengantarkannya meraih penghargaan *Rookie of the Year*.

Performa Piastri terus melesat tajam pada musim-musim berikutnya. Ia mengukir sejarah dengan meraih **kemenangan Grand Prix pertamanya** di GP Hungaria 2024, disusul kemenangan impresif lainnya di GP Azerbaijan (Baku). Bersama rekan setimnya Lando Norris, Piastri menjadi pilar utama dalam kebangkitan besar McLaren yang sukses merebut gelar Juara Dunia Konstruktor F1 2024 dan terus bersaing ketat di papan atas balapan Formula 1.
`
    },
    10: {
        name: "Lewis Hamilton",
        team: "Scuderia Ferrari",
        photo: "assets/images/drivers/foto10.jpeg",
        title: "Lewis Hamilton: Pengalaman Baru Bersama Kuda Jingkrak",
        stats: { "Nomor": 44, "Kebangsaan": "Inggris", "Debut F1": 2007 },
        bio: `
Sir Lewis Carl Davidson Hamilton adalah pembalap mobil profesional asal Inggris yang lahir pada 7 Januari 1985 di Stevenage, Hertfordshire, dan saat ini berkompetisi di ajang Formula 1 membela tim legendaris Scuderia Ferrari. Diakui secara luas sebagai salah satu atlet terhebat dalam sejarah olahraga, Hamilton memegang rekor sebagai pemegang **7 gelar Juara Dunia Formula 1** (setara dengan Michael Schumacher) serta pemegang rekor kemenangan balapan, *pole position*, dan podium terbanyak sepanjang sejarah F1.

Karier balapnya dimulai dari ajang gokart pada usia delapan tahun. Pada usia 10 tahun, ia secara langsung mendekati bos tim McLaren, Ron Dennis, dan menyatakan niatnya untuk membalap bersama McLaren di masa depan. Bakat besarnya membuat McLaren merekrutnya ke program pembalap muda. Hamilton menyapu bersih kejuaraan junior hingga menjuarai ajang GP2 Series pada tahun 2006 di musim pertamanya. Ia resmi melakukan debut F1 pada musim 2007 bersama McLaren, mencetak rekor *rookie* luar biasa dengan finis sebagai *runner-up* dunia, sebelum akhirnya meraih gelar Juara Dunia pertamanya pada musim 2008 dalam usia 23 tahun.

Langkah terbesarnya terjadi pada musim 2013 saat ia mengambil keputusan berani untuk pindah ke Mercedes-AMG Petronas. Keputusan tersebut menciptakan era dominasi terhebat dalam sejarah F1, di mana Hamilton meraih enam gelar juara dunia tambahan (2014, 2015, 2017, 2018, 2019, dan 2020) serta membantu Mercedes memenangkan delapan gelar konstruktor secara berturut-turut. Konsistensi, kemampuan membalap di lintasan basah, serta manajemen ban yang luar biasa menjadikannya ikon global di dalam dan luar balapan.

Setelah lebih dari satu dekade meraih kejayaan bersama Mercedes, Hamilton membuat keputusan paling bersejarah di era modern dengan pindah ke Scuderia Ferrari mulai musim 2025. Bersama rekan setimnya Charles Leclerc, Hamilton mengincar gelar juara dunia kedelapannya bersama tim Kuda Jingkrak, sekaligus menegaskan warisannya bukan hanya sebagai pembalap tersukses, tetapi juga sebagai aktivis sosial yang giat memperjuangkan keberagaman dan inklusivitas di dunia otomotif.
`
    },
    11: {
        name: "Charles Leclerc",
        team: "Scuderia Ferrari",
        photo: "assets/images/drivers/foto11.jpeg",
        title: "Charles Leclerc: Mimpi Besar Sang Pangeran Monako",
        stats: { "Nomor": 16, "Kebangsaan": "Monako", "Debut F1": 2018 },
        bio: `
Charles Marc Hervé Perceval Leclerc adalah pembalap mobil profesional asal Monako yang lahir pada 16 Oktober 1997 di Monte Carlo, dan saat ini berkompetisi di ajang Formula 1 membela tim legendaris Scuderia Ferrari. Dikenal dengan kecepatan murninya yang lu biasa saat sesi kualifikasi, kemampuan menyalip yang agresif namun bersih, serta ikatan emosionalnya yang kuat dengan tim Kuda Jingkrak, Leclerc dipandang sebagai salah satu talenta terbaik dan calon kuat juara dunia F1 di era modern.

Darah balap dan gokart terasah sejak kecil di lintasan milik almarhum Jules Bianchi—pembalap F1 yang juga merupakan mentor sekaligus sosok kakak baginya. Bakat besarnya menarik perhatian Ferrari Driver Academy yang merekrutnya pada tahun 2016. Leclerc mendominasi ajang balap junior dengan menjuarai GP3 Series pada musim 2016 dan langsung merengkuh gelar juara FIA Formula 2 pada musim perdananya (*rookie*) di tahun 2017 secara mengesankan bersama tim Prema Racing.

Ia resmi melakoni debutnya di Formula 1 pada musim 2018 bersama tim Alfa Romeo Sauber. Performa impresifnya yang konsisten mencetak poin membawa Leclerc dipromosikan ke tim utama Scuderia Ferrari pada musim 2019 dalam usia yang baru 21 tahun. Di musim pertamanya bersama Ferrari, ia mencuri perhatian dunia dengan merebut *pole position* terbanyak di grid musim itu, merebut kemenangan Grand Prix pertamanya di GP Belgia (Spa-Francorchamps), serta meraih kemenangan emosional bagi publik Italia di kandang Ferrari, GP Monza.

Sepanjang kariernya bersama Ferrari, Leclerc terus menjadi andalan utama tim, mengamankan puluhan *pole position*, podium, serta kemenangan ikonik seperti di GP Monako 2024—balapan kandangnya sendiri yang telah lama ia impikan. Setelah sempat menjadi *runner-up* Juara Dunia F1 pada musim 2022, Leclerc kini membentuk salah satu duet pembalap paling elit dan paling diantisipasi dalam sejarah olahraga otomotif bersama rekan setim barunya, Sir Lewis Hamilton.
`
    },
    12: {
        name: "Lando Norris",
        team: "McLaren",
        photo: "assets/images/drivers/foto12.jpeg",
        title: "Norris",
        stats: { "Nomor": 1, "Kebangsaan": "Inggris", "Debut F1": 2019 },
        bio: `
Lando Norris adalah pembalap mobil profesional asal Inggris yang lahir pada 13 November 1999 di Bristol, dan saat ini berkompetisi di ajang Formula 1 membela tim McLaren F1 Team. Dikenal dengan kepribadiannya yang karismatik, kontrol mobil yang tajam, serta konsistensi tingkat tinggi di atas lintasan, Norris telah berkembang dari seorang talenta muda berbakat menjadi salah satu penantang gelar Juara Dunia F1 paling utama di era modern.

Karier balapnya dimulai dari ajang gokart pada usia tujuh tahun, di mana ia mencatatkan rekor sebagai pemenang CIK-FIA Karting World Championship termuda pada tahun 2014 di usia 14 tahun. Karier juniornya di balap mobil roda terbuka diwarnai dominasi mutlak; ia menjuarai MSA Formula (2015), Toyota Racing Series, Formula Renault 2.0, dan FIA Formula 3 European Championship (2017) secara berturut-turut. Keberhasilan ini membawanya masuk ke McLaren Young Driver Programme dan mengamankan posisi *runner-up* di kejuaraan FIA Formula 2 musim 2018.

Norris resmi melakoni debutnya di Formula 1 pada musim 2019 bersama McLaren di usia 19 tahun. Ia meraih podium F1 pertamanya di GP Austria 2020 dan terus menunjukkan peningkatan performa yang signifikan dari tahun ke tahun. Setelah berkali-kali finis di posisi podium dan hampir menang, momen puncaknya terjadi pada musim 2024 saat ia meraih **kemenangan Grand Prix pertamanya** secara spektakuler di GP Miami, disusul kemenangan dominan lainnya seperti di GP Belanda (Zandvoort) dan GP Singapura.

Bersama rekan setimnya Oscar Piastri, Norris menjadi pilar utama dalam membawa McLaren kembali ke puncak kejayaan dengan merebut gelar Juara Dunia Konstruktor F1 2024. Telah berkomitmen menandatangani kontrak jangka panjang bersama tim yang berbasis di Woking tersebut, Norris terus menjadi tumpuan utama McLaren dalam memperebutkan kemenangan balapan dan gelar Juara Dunia F1.
`
    },
    13: {
        name: "Lance Stroll",
        team: "Aston Martin",
        photo: "assets/images/drivers/lance-stroll.jpg",
        title: "Lance Stroll: Bertahan dan Terus Belajar di Lintasan",
        stats: { "Nomor": 18, "Kebangsaan": "Kanada", "Debut F1": 2017 },
        bio: `
Lance Strulovitch (lebih dikenal sebagai **Lance Stroll**) adalah pembalap mobil profesional berdarah Kanada-Belgia yang lahir pada 29 Oktober 1998 di Montreal, Quebec, dan saat ini berkompetisi di ajang Formula 1 membela tim Aston Martin Aramco. Dikenal sebagai salah satu pembalap yang sangat tangguh dalam kondisi lintasan basah (*wet race*) serta memiliki reflek start balapan yang sangat baik, Stroll merupakan salah satu pembalap dengan pengalaman paling matang di *grid* F1 era modern.

Darah balap dan minat otomotifnya didukung kuat oleh ayahnya, Lawrence Stroll, seorang pengusaha miliarder asal Kanada yang kini pemilik tim Aston Martin F1. Stroll mengawali kariernya di ajang gokart sejak usia delapan tahun dan berhasil menjuarai berbagai kompetisi regional hingga internasional. Kariernya melesat tajam setelah ia menjuarai Italian F4 Championship pada tahun 2014, Toyota Racing Series pada tahun 2015, dan mendominasi penuh ajang FIA Formula 3 European Championship pada tahun 2016 bersama tim Prema Powerteam.

Atas pencapaiannya tersebut, Stroll melompati jenjang Formula 2 dan langsung melakoni debutnya di Formula 1 pada musim 2017 bersama tim Williams dalam usia yang baru 18 tahun. Di musim perdananya, ia mencuri perhatian dunia dengan merebut podium pertamanya setelah finis ke-3 di GP Azerbaijan, menjadikannya pembalap *rookie* termuda kedua yang berhasil berdiri di podium F1. Ia juga mencatatkan rekor sebagai pembalap F1 termuda yang mengamankan barisan terdepan (*front row*) saat kualifikasi di GP Italia 2017 dalam kondisi hujan deras.

Pada musim 2019, Stroll pindah ke tim Racing Point (yang kemudian berganti nama menjadi Aston Martin). Di tim ini, ia mengukir salah satu momen terbaik dalam kariernya dengan merebut **pole position pertamanya** di GP Turki 2020 di tengah lintasan basah dan licin, serta menambah raihan podium di GP Sakhir 2020 dan GP Italia 2020. Sejak bergantinya nama tim menjadi Aston Martin, Stroll terus menjadi pilar utama tim yang berbasis di Silverstone tersebut, bekerja sama dengan pembalap veteran Fernando Alonso untuk membawa Aston Martin bersaing di papan atas Formula 1.
`
    },
    14: {
        name: "Esteban Ocon",
        team: "Haas F1 Team",
        photo: "assets/images/drivers/esteban-ocon.jpg",
        title: "Esteban Ocon: Ketangguhan Pembalap yang Pantang Menyerah",
        stats: { "Nomor": 31, "Kebangsaan": "Prancis", "Debut F1": 2016 },
        bio: `
Esteban José Jean-Pierre Ocon-Khelfane adalah pembalap mobil profesional asal Prancis yang lahir pada 17 September 1996 di Évreux, Normandia, dan saat ini berkompetisi di ajang Formula 1 membela tim Haas F1 Team. Dikenal dengan postur tubuhnya yang tinggi, gaya balap yang pantang menyerah, serta ketangguhannya dalam mempertahankan posisi di atas lintasan, Ocon merupakan pembalap yang berhasil menembus papan atas F1 lewat kerja keras dan tekad yang kuat.

Karier balapnya berawal dari latar belakang yang penuh perjuangan. Keluarga Ocon harus menjual rumah dan hidup di dalam karavan demi membiayai karier gokartnya di masa kecil. Pengorbanan tersebut terbayar tuntas saat bakat masifnya membawanya menjuarai FIA Formula 3 European Championship pada tahun 2014—mengalahkan Max Verstappen—dan merengkuh gelar juara GP3 Series pada musim 2015 di bawah naungan Lotus F1 Junior Team dan Mercedes Junior Programme.

Ocon resmi melakoni debutnya di Formula 1 pada pertengahan musim 2016 bersama tim Manor Racing. Performa impresifnya membawa Ocon dipromosikan ke tim Force India (kemudian Racing Point) untuk musim 2017 dan 2018, di mana ia mencatatkan rekor luar biasa sebagai pembalap yang selalu finis dalam 27 balapan pertamanya secara berturut-turut. Setelah sempat menjadi pembalap cadangan Mercedes pada 2019, ia kembali ke *grid* F1 pada musim 2020 bersama tim Renault (yang berganti nama menjadi Alpine).

Puncak kariernya terjadi pada musim 2021 di mana Ocon meraih **kemenangan Grand Prix pertamanya** secara mengagumkan di GP Hungaria bersama Alpine. Ia juga berhasil mencatatkan podium berharga lainnya di GP Sakhir 2020 dan GP Monako 2023. Setelah lima musim membela skuad Alpine, Ocon membuka babak baru dalam kariernya dengan menandatangani kontrak jangka panjang bersama Haas F1 Team mulai musim 2025, menjadi sosok pembalap berpengalaman yang memimpin pengembangan tim asal Amerika Serikat tersebut.
`
    },
    15: {
        name: "Oliver Bearman",
        team: "Haas F1 Team",
        photo: "assets/images/drivers/oliver-bearman.jpg",
        title: "Oliver Bearman: Bintang Muda yang Cepat Beradaptasi",
        stats: { "Nomor": 87, "Kebangsaan": "Inggris", "Debut F1": 2024 },
        bio: `
Oliver Bearman (lebih dikenal sebagai **Ollie Bearman**) adalah pembalap mobil profesional asal Inggris yang lahir pada 8 Mei 2005 di Chelmsford, Essex, dan saat ini berkompetisi di ajang Formula 1 membela tim Haas F1 Team. Dikenal dengan kemampuannya yang sangat cepat dalam beradaptasi, ketenangan di balik kemudi, serta performa kualifikasi yang tajam, Bearman dipandang sebagai salah satu talenta muda paling menjanjikan dari Britania Raya di era F1 modern.

Karier balapnya meroket pesat sejak ia menjuarai kejuaraan gokart tingkat internasional di masa kecilnya. Pada musim 2021, Bearman mencatatkan rekor luar biasa dengan mengawinkan gelar juara Italian F4 Championship dan ADAC F4 Championship (Jerman) sekaligus dalam satu musim. Keberhasilan ganda yang langka ini langsung memikat Scuderia Ferrari untuk merekrutnya ke dalam program binaan Ferrari Driver Academy pada akhir tahun 2021.

Pada musim 2022, ia melakoni debutnya di ajang FIA Formula 3 dan mengakhiri musim sebagai *runner-up* kedua (peringkat ke-3) klasemen akhir. Bearman kemudian naik kelas ke FIA Formula 2 pada musim 2023 bersama tim Prema Racing, di mana ia sukses meraih empat kemenangan balapan di musim perdananya (*rookie*).

Nama Bearman mendadak menjadi sorotan utama dunia otomotif pada GP Arab Saudi 2024. Saat bertugas sebagai pembalap cadangan Ferrari, ia dipanggil secara mendadak pada hari Jumat untuk menggantikan Carlos Sainz Jr. yang harus menjalani operasi usus buntu. Di usianya yang baru 18 tahun, Bearman mencatatkan debut luar biasa bersama Ferrari dengan finis di posisi ke-7 dan mencetak poin pada balapan F1 pertamanya. Performa mengagumkan tersebut, ditambah penampilannya saat menggantikan Esteban Ocon/Nico Hülkenberg di Haas, mengamankan posisi utama baginya sebagai pembalap penuh Haas F1 Team mulai musim 2025.
`
    },
    16: {
        name: "Gabriel Bortoleto",
        team: "Audi",
        photo: "assets/images/drivers/gabriel-bortoleto.jpg",
        title: "Gabriel Bortoleto: Harapan Baru dari Brasil",
        stats: { "Nomor": 5, "Kebangsaan": "Brasil", "Debut F1": 2025 },
        bio: `
Gabriel Bortoleto Oliveira adalah pembalap mobil profesional asal Brasil yang lahir pada 14 Oktober 2004 di São Paulo, dan saat ini berkompetisi di ajang Formula 1 membela tim Kick Sauber (yang bertransisi menjadi tim pabrikan Audi). Dikenal dengan kecerdasannya dalam mengelola balapan, konsistensi yang sangat tinggi, serta ketenangannya saat bertarung di lintasan, Bortoleto dipandang sebagai pahlawan baru olahraga otomotif Brasil yang berhasil mengembalikan nama negaranya ke *grid* F1 secara penuh.

Di bawah bimbingan manajemen Fernando Alonso (A14 Management), karier balap roda terbuka Bortoleto melesat pesat setelah menembus kompetisi Eropa. Namanya menjadi perbincangan utama dunia balap setelah mendominasi dan menjuarai kejuaraan **FIA Formula 3** pada musim perdananya (*rookie*) di tahun 2023 bersama tim Trident.

Prestasi luar biasa tersebut membawanya masuk ke dalam McLaren Driver Development Programme pada akhir 2023. Naik kelas ke ajang **FIA Formula 2** pada musim 2024 bersama Invicta Racing, Bortoleto kembali menunjukkan performa spektakuler dengan meraih kemenangan ikonik dari posisi paling belakang (P22) di Monza dan secara mengagumkan langsung merengkuh gelar **Juara Dunia FIA Formula 2 2024** di musim perdananya.

Rekam jejak mengagumkan berupa gelar juara F3 dan F2 secara berturut-turut di musim *rookie*—pencapaian langka yang sebelumnya hanya diraih pembalap top seperti Oscar Piastri dan Charles Leclerc—memikat proyek besar Sauber/Audi. Bortoleto resmi direkrut sebagai pembalap utama Sauber mulai musim 2025, di mana ia bertandem dengan pembalap veteran Nico Hülkenberg untuk memimpin transisi tim menuju era baru Audi di Formula 1.
`
    },
    17: {
        name: "Liam Lawson",
        team: "Racing Bulls",
        photo: "assets/images/drivers/liam-lawson.jpg",
        title: "Liam Lawson: Bangkit dengan Mental Baja",
        stats: { "Nomor": 30, "Kebangsaan": "Selandia Baru", "Debut F1": 2023 },
        bio: `
Liam Lawson adalah pembalap mobil profesional asal Selandia Baru yang lahir pada 11 Februari 2002 di Hastings, dan saat ini berkompetisi di ajang Formula 1 membela tim Visa Cash App RB (VCARB / Racing Bulls). Dikenal dengan mentalitas bertarungnya yang sangat agresif, gaya menyalip yang berani, serta kemampuan adaptasi yang instan di atas kendaraan apa pun, Lawson dipandang sebagai salah satu talenta terbaik yang keluar dari program pembinaan Red Bull Junior Team.

Karier balapnya dimulai dari ajang gokart di Selandia Baru pada usia tujuh tahun sebelum mendominasi kompetisi roda terbuka lokal. Langkahnya melesat pesat saat ia pindah ke Eropa dan menjadi *runner-up* di ajang ADAC F4 (2018), menjuarai Toyota Racing Series (2019), serta mencatatkan performa impresif di ajang FIA Formula 3 dan Formula 2. Lawson juga menunjukkan fleksibilitas karier yang luar biasa dengan meraih posisi *runner-up* di ajang DTM (Deutsche Tourenwagen Masters) 2021 dan Super Formula Jepang 2023.

Nama Lawson mencuri perhatian dunia pada pertengahan musim F1 2023 ketika ia ditunjuk secara mendadak oleh AlphaTauri (sekarang VCARB) untuk menggantikan Daniel Ricciardo yang mengalami cedera patah tangan. Hanya dalam lima balapan perdananya, Lawson tampil sangat tenang dan sukses meraih poin pertamanya di GP Singapura 2023 setelah finis di posisi ke-9. Performa impresif sebagai "super-sub" tersebut membuktikan kualitasnya di level tertinggi.

Setelah kembali menjalankan tugas sebagai pembalap cadangan utama untuk Red Bull Racing dan VCARB, Lawson akhirnya resmi dipromosikan sebagai pembalap utama penuh untuk tim VCARB mulai akhir musim 2024 hingga musim 2025/2026. Ia kini menjadi pilar penting dalam skuad Red Bull di F1, bertarung secara konsisten di papan tengah dan menjadi kandidat utama untuk mengisi kursi di tim utama Red Bull Racing di masa depan.
`
    },
    18: {
        name: "Arvid Lindblad",
        team: "Racing Bulls",
        photo: "assets/images/drivers/arvid-lindblad.jpg",
        title: "Arvid Lindblad: Talenta Muda Siap Unjuk Gigi",
        stats: { "Nomor": 41, "Kebangsaan": "Inggris", "Debut F1": 2026 },
        bio: `
Arvid Lindblad adalah pembalap mobil profesional asal Inggris yang lahir pada 8 Agustus 2007 di Virginia Water, Surrey, dan saat ini berkompetisi di ajang FIA Formula 2 bersama tim Campos Racing di bawah naungan Red Bull Junior Team. Dikenal dengan kecepatan murninya, keberanian saat menyalip, serta kemampuan beradaptasi yang sangat cepat di setiap jenjang balap, Lindblad dipandang sebagai salah satu *prodigy* paling menjanjikan dan calon pembalap masa depan Red Bull di Formula 1.

Memiliki keturunan Swedia dan India, Lindblad mengasah bakat balapnya di ajang gokart sejak usia dini dan berhasil menjuarai WSK Euro Series serta WSK Open Cup pada tahun 2021. Performa luar biasa di ajang karting internasional membuatnya direkrut oleh Red Bull Junior Team atas rekomendasi langsung dari penasihat Red Bull, Helmut Marko, saat usianya baru 13 tahun.

Karier balap mobil roda terbukanya berkembang pesat saat ia menjuarai ajang Formula 4 UAE Championship dan meraih peringkat ke-3 di Italian F4 Championship pada tahun 2023, ditambah kemenangan mengesankan di Macau Formula 4 Race. Naik kelas ke ajang **FIA Formula 3** pada musim 2024 bersama tim Prema Racing di usianya yang baru 16 tahun, Lindblad mencetak sejarah sebagai pembalap pertama yang berhasil menyapu bersih kemenangan di *Sprint Race* dan *Feature Race* dalam satu akhir pekan balapan di GP Britania Raya (Silverstone), serta mengakhiri musim F3 di peringkat ke-4 klasemen akhir.

Atas pencapaian impresifnya tersebut, Red Bull mempromosikan Lindblad naik kelas ke ajang **FIA Formula 2** mulai musim 2025 bersama tim Campos Racing. Menjadi salah satu pembalap termuda di *grid*, Lindblad terus menunjukkan potensi masif sebagai kandidat kuat yang berada di jalur cepat menuju debut utama di ajang Formula 1 bersama skuad Red Bull Racing atau Racing Bulls (VCARB).
`
    },
    19: {
        name: "Isack Hadjar",
        team: "Red Bull Racing",
        photo: "assets/images/drivers/isack-hadjar.jpg",
        title: "Isack Hadjar: Naik Kelas ke Tim Juara",
        stats: { "Nomor": 6, "Kebangsaan": "Prancis", "Debut F1": 2025 },
        bio: `Isack Hadjar adalah pembalap mobil profesional asal Prancis (berketurunan Aljazair) yang lahir pada 28 September 2004 di Paris, dan saat ini berkompetisi di ajang Formula 1 membela tim Visa Cash App RB (VCARB / Racing Bulls). Dikenal dengan julukan *"Little Prost"* berkat gaya balapnya yang cerdas, kemampuan manuver di lintasan basah yang impresif, serta kecepatan kualifikasi yang luar biasa, Hadjar merupakan salah satu talenta muda paling menonjol dari Red Bull Junior Team.

Karier balap roda terbukanya dimulai dari ajang French F4 Championship pada tahun 2019 dan 2020, di mana ia secara konsisten mengamankan posisi podium. Bakat besarnya mulai mencuri perhatian luas saat ia menjuarai Formula Regional Asian Championship 2022 dan mengakhiri musim perdananya (*rookie*) di FIA Formula 3 2022 di peringkat ke-4 bersama tim Hitech Grand Prix, yang langsung membawanya masuk ke dalam program pembinaan Red Bull Junior Team.

Naik kelas ke ajang **FIA Formula 2** pada musim 2023 dan 2024, Hadjar menunjukkan perkembangan luar biasa bersama tim Campos Racing. Pada musim 2024, ia tampil sebagai salah satu kandidat utama juara dunia F2 dengan meraih beberapa kemenangan balapan utama (*Feature Race*) yang mengesan di sirkuit-sirkuit teknis seperti Melbourne, Imola, dan Silverstone, serta bertarung sengit memperebutkan gelar hingga akhir musim melawan Gabriel Bortoleto.

Performa konsisten dan kerja kerasnya sebagai pembalap cadangan Red Bull Racing dan VCARB—termasuk penampilan impresif di beberapa sesi Free Practice (FP1) F1—membuat penasihat Red Bull, Helmut Marko, memberinya kepercayaan penuh. Hadjar resmi dipromosikan sebagai pembalap utama VCARB untuk berkompetisi di ajang Formula 1, menjadikannya bagian dari generasi baru bintang muda yang memimpin era modern F1.
`
    },
    20: {
        name: "Franco Colapinto",
        team: "Alpine F1 Team",
        photo: "assets/images/drivers/franco-colapinto.jpg",
        title: "Franco Colapinto: Semangat Argentina di Kokpit F1",
        stats: { "Nomor": 43, "Kebangsaan": "Argentina", "Debut F1": 2024 },
        bio: `
Franco Colapinto adalah pembalap mobil profesional asal Argentina yang lahir pada 27 Mei 2003 di Pilar, Buenos Aires, dan saat ini berkompetisi di ajang Formula 1 membela tim Alpine F1 Team. Dikenal dengan kontrol mobilnya yang sangat tenang, kecepatan murni saat kualifikasi, serta gaya menyalip yang agresif namun terukur, Colapinto dipandang sebagai pahlawan olahraga otomotif Argentina yang berhasil mengembalikan bendera negaranya ke *grid* F1 setelah jeda lebih dari dua dekade.

Karier balapnya meroket setelah ia memutuskan pindah ke Eropa di usia muda. Colapinto langsung mencuri perhatian dunia saat menjuarai Spanish F4 Championship pada musim 2019 secara dominan bersama tim Drivex School. Ia kemudian melanjutkan tren positifnya di ajang Formula Regional European Championship (FRECA) dan balapan ketahanan (Asian Le Mans Series & European Le Mans Series), sebelum akhirnya masuk ke ajang **FIA Formula 3** pada musim 2022 dan 2023 di mana ia konsisten meraih kemenangan balapan dan mengakhiri musim 2023 di peringkat ke-4 klasemen akhir bersama MP Motorsport.

Keberhasilan tersebut membawanya masuk ke dalam Williams Racing Driver Academy. Naik kelas ke ajang **FIA Formula 2** pada musim 2024, Colapinto langsung tampil mengesankan dengan meraih kemenangan manis di *Sprint Race* Imola. Momen balik terbesar dalam kariernya terjadi pada pertengahan musim F1 2024 ketika Williams Racing menunjuknya secara mendadak untuk menggantikan Logan Sargeant mulai GP Italia di Monza. Di usianya yang baru 21 tahun, Colapinto mengejutkan publik F1 dengan tampil sangat cepat dan berhasil mencetak poin F1 pertamanya di balapan pertamanya hanya dalam dua pekan balapan (finis ke-8 di GP Azerbaijan).

Performa mengagumkan dan popularitas masif yang ia bawa dari kawasan Amerika Latin memikat manajemen Alpine F1 Team. Colapinto resmi direkrut oleh tim pabrikan Prancis tersebut untuk melengkapi jajaran pembalap utama mereka mulai musim 2025/2026, menjadikannya pilar penting dalam skuad Alpine di era regulasi modern Formula 1.
`
    },
    21: {
        name: "Sergio Pérez",
        team: "Cadillac F1 Team",
        photo: "assets/images/drivers/sergio-perez.jpg",
        title: "Sergio Pérez: Veteran Berpengalaman di Awal Era Baru",
        stats: { "Nomor": 11, "Kebangsaan": "Meksiko", "Debut F1": 2011 },
        bio: `
Sergio "Checo" Pérez Mendoza adalah pembalap mobil profesional asal Meksiko yang lahir pada 26 Januari 1990 di Guadalajara, Jalisco. Dikenal secara luas dengan julukan *"King of Street Tracks"* dan *"Tyre Whisperer"*, Pérez diakui sebagai salah satu pembalap paling berpengalaman di *grid* F1 modern dengan keahlian luar biasa dalam mengelola ketahanan ban, mengeksekusi strategi balapan, serta menaklukkan sirkuit-sirkuit jalan raya yang teknis.

Karier balapnya berawal dari ajang gokart di Meksiko sebelum pindah ke Eropa pada usia 15 tahun di bawah naungan skema pembinaan Escudería Telmex. Karier juniornya melonjak tajam setelah menjuarai kelas Nasional British Formula 3 (2007) dan menjadi *runner-up* di ajang GP2 Series pada musim 2010 bersama tim Barwa Addax. Performa mengesankan tersebut mengantarkannya melakoni debut di Formula 1 pada musim 2011 membela tim Sauber.

Di musim-musim perdananya di F1, Pérez mencuri perhatian dunia lewat gaya mengemudinya yang sangat hemat ban, yang membawanya meraih podium-podium kejutan bersama Sauber di GP Malaysia, Kanada, dan Italia pada tahun 2012. Setelah satu musim yang sulit bersama McLaren pada 2013, Pérez menemukan rumah barunya di tim Force India (yang kemudian menjadi Racing Point). Selama bertahun-tahun di tim papan tengah tersebut, ia mengukuhkan reputasinya sebagai "spesialis podium" dan mengukir puncak sejarahnya bersama tim dengan meraih **kemenangan Grand Prix pertamanya** di GP Sakhir 2020 setelah bangkit dari posisi terakhir di lap pertama.

Keberhasilan luar biasa tersebut memikat Red Bull Racing untuk merekrutnya pada musim 2021 sebagai pendamping Max Verstappen. Bersama Red Bull Racing, Pérez menjadi bagian penting dari era kejayaan tim, membantu mengamankan gelar Juara Dunia Konstruktor F1 (2022, 2023) serta mengunci posisi *runner-up* Juara Dunia Pembalap F1 pada musim 2023. Sepanjang kariernya bersama Red Bull, ia meraih berbagai kemenangan ikonis di sirkuit-sirkuit jalan raya tersulit dunia seperti Baku, Monako, Singapura, dan Jeddah.
`
    },
    22: {
        name: "Valtteri Bottas",
        team: "Cadillac F1 Team",
        photo: "assets/images/drivers/valtteri-bottas.jpg",
        title: "Valtteri Bottas: Pengalaman Juara di Proyek Baru",
        stats: { "Nomor": 77, "Kebangsaan": "Finlandia", "Debut F1": 2013 },
        bio: `
Valtteri Viktor Bottas adalah pembalap mobil profesional asal Finlandia yang lahir pada 28 Agustus 1989 di Nastola, dan merupakan salah satu pembalap veteran paling berpengalaman di *grid* Formula 1 modern. Dikenal dengan kecepatan murninya saat sesi kualifikasi, kemampuan *flight/race craft* yang solid, serta kepribadiannya yang santai dan ikonis di luar lintasan, Bottas dijuluki sebagai salah satu pembalap tercepat Finlandia dalam sejarah F1.

Karier juniornya di balap mobil roda terbuka diwarnai dominasi yang sangat mengesankan. Bottas berhasil menjuarai Eurocup Formula Renault 2.0 dan Formula Renault Northern European Cup pada tahun 2008, serta mencatatkan rekor sebagai pembalap pertama yang berhasil menjuarai kejuaraan bergengsi Masters of Formula 3 dua kali berturut-turut (2009 dan 2010). Pada tahun 2011, ia mengunci gelar juara GP3 Series bersama tim ART Grand Prix, yang mengukuhkan jalurnya masuk ke ajang F1.

Bottas resmi melakoni debutnya di Formula 1 pada musim 2013 bersama tim Williams, setelah sebelumnya menjabat sebagai pembalap penguji. Di Williams, ia membuktikan kapasitasnya sebagai talenta papan atas dengan mengumpulkan sembilan podium antara tahun 2014 hingga 2016. Kesempatan emas dalam kariernya tiba pada awal musim 2017 ketika ia direkrut oleh Mercedes-AMG Petronas untuk menggantikan Nico Rosberg yang pensiun mendadak.

Selama lima musim membela Mercedes (2017–2021) bersanding dengan Lewis Hamilton, Bottas menjadi pilar krusial yang membawa Mercedes memenangkan lima gelar Juara Dunia Konstruktor secara berturut-turut. Sepanjang kariernya di F1, ia telah mengumpulkan **10 kemenangan Grand Prix**, 20 *pole position*, dan 67 podium, serta dua kali mengakhiri musim sebagai *runner-up* Juara Dunia Pembalap (2019 dan 2020).

Setelah masa baktinya di Mercedes usai, Bottas melanjutkan kariernya bersama tim Alfa Romeo / Kick Sauber (2022–2024), di mana ia bertindak sebagai pemimpin tim yang memberikan bimbingan teknis berharga. Memiliki reputasi yang sangat dihormati di padok, Bottas tetap menjadi sosok pembalap berkelas dunia yang memadukan kecepatan tinggi di lintasan dengan gaya hidup ikonis sebagai penggemar sepeda balap dan budaya kopi.
`
    }
};

// Data Sirkuit F1. Tambah sirkuit baru cukup salin satu baris di bawah.
// kalender: false = tidak ada di kalender 2026 | baru: true = sirkuit baru (kartu bergaris merah)
const circuitsData = [
    { name: "Albert Park Circuit", gp: "GP Australia", city: "Melbourne", country: "Australia", length: "5.278 km", turns: 14, first: 1996, kalender: true,
      desc: "Sirkuit semi-permanen yang mengitari danau di taman kota Melbourne. Lintasannya cepat dan mengalir, dan sering menjadi pembuka musim.",
      more: [
        "Lintasan ini memakai jalan-jalan di dalam taman kota yang dipakai warga untuk jogging dan berkendara sehari-hari, lalu ditutup dan dipasangi pembatas saat akhir pekan balapan. Karena itu aspalnya relatif licin dan berdebu di awal akhir pekan, dan grip baru membaik setelah banyak mobil melintas. Tembok yang dekat dengan lintasan membuat kesalahan kecil bisa langsung berujung pada safety car.",
        "F1 pertama kali datang ke Albert Park pada 1996, setelah sebelumnya GP Australia digelar di Adelaide. Sejak itu Melbourne menjadi salah satu seri favorit para pembalap dan penonton, dengan suasana kota yang ramai. Tata letaknya sempat diperbarui pada 2022 dengan tikungan yang dilebarkan dan satu chicane dihapus, supaya mobil bisa saling mengikuti lebih dekat dan peluang menyalip bertambah."
      ] },
    { name: "Autódromo Hermanos Rodríguez", gp: "GP Kota Meksiko", city: "Mexico City", country: "Meksiko", length: "4.304 km", turns: 17, first: 1963, kalender: true,
      desc: "Berada di ketinggian sekitar 2.200 meter, udaranya tipis sehingga mobil kehilangan downforce dan pendinginan. Bagian stadion Foro Sol jadi tikungan paling khasnya.",
      more: [
        "Nama sirkuit ini diambil dari dua bersaudara pembalap Meksiko, Ricardo dan Pedro Rodríguez. Ricardo meninggal saat latihan di lintasan ini pada 1962, tepat sebelum balapan F1 pertama di sini digelar pada 1963. F1 sempat meninggalkan Meksiko dua kali, lalu kembali pada 2015 dan sejak 2021 balapannya bernama Gran Premio de la Ciudad de México.",
        "Ketinggian membuat tantangan teknis di sini berbeda dari sirkuit lain. Dengan udara yang tipis, tim memakai sayap dengan downforce maksimum, namun mobil tetap terasa seperti memakai downforce yang jauh lebih sedikit. Sistem pendingin juga bekerja lebih keras karena udara kurang efektif membuang panas, dan rem bisa cepat terlalu panas.",
        "Lurusan utamanya panjang, lebih dari satu kilometer, dan menuju pengereman keras di tikungan pertama. Setelah itu mobil memasuki bagian stadion Foro Sol yang dikelilingi tribun penuh penonton. Suasananya terkenal meriah, dengan nuansa pesta khas Meksiko yang terasa sepanjang akhir pekan."
      ] },
    { name: "Baku City Circuit", gp: "GP Azerbaijan", city: "Baku", country: "Azerbaijan", length: "6.003 km", turns: 20, first: 2016, kalender: true,
      desc: "Sirkuit jalan raya dengan lurusan lebih dari dua kilometer, tapi juga lorong sempit di kota tua yang nyaris tidak menyisakan ruang untuk salah.",
      more: [
        "Balapan di Baku pertama kali digelar pada 2016 dengan nama GP Eropa, lalu sejak 2017 memakai nama GP Azerbaijan. Lintasannya berbentuk dua karakter yang berlawanan. Di satu sisi ada jalur lebar di dekat tepi Laut Kaspia dengan lurusan sepanjang sekitar 2,2 kilometer, di sisi lain ada bagian kota tua yang sangat sempit.",
        "Titik tersempitnya berada di dekat tembok kastel kota tua, dengan lebar lintasan sekitar 7,6 meter. Mobil F1 melaju di sela-sela bangunan bersejarah dengan jarak yang nyaris tidak menyisakan ruang untuk salah. Banyak pembalap menyebut bagian ini paling menegangkan di kalender.",
        "Kombinasi lurusan panjang dan slipstream membuat menyalip sangat mungkin dilakukan di sini, sehingga balapan sering kacau. Safety car, bendera merah, dan kejutan di posisi depan sudah menjadi hal biasa. Itu sebabnya Baku punya reputasi sebagai salah satu seri paling tidak terduga di musim ini."
      ] },
    { name: "Circuit de Barcelona-Catalunya", gp: "GP Spanyol", city: "Montmeló", country: "Spanyol", length: "4.657 km", turns: 14, first: 1991, kalender: true,
      desc: "Sirkuit yang lama jadi tempat tes pramusim, jadi semua tim hafal karakternya. Kombinasi tikungan cepat dan lurusan panjang menguji keseimbangan mobil.",
      more: [
        "Sirkuit di Montmeló ini dibuka pada 1991 dan menjadi tuan rumah GP Spanyol sejak saat itu. Selama bertahun-tahun tim F1 menggelar tes pramusim di sini, sehingga data mobil mereka sangat lengkap. Hasilnya, tim yang kuat di Barcelona biasanya akan kuat juga di banyak sirkuit lain, dan sering dipakai sebagai patokan awal musim.",
        "Tikungan 3 yang panjang dan cepat menguji keseimbangan aerodinamika, sementara lurusan utama yang panjang menawarkan satu-satunya peluang menyalip yang jelas. Di sini mobil yang kehilangan jarak ke mobil di depan akan sulit mendekat lagi, sehingga posisi start dan strategi pit stop sering lebih menentukan dibanding keberanian menyalip.",
        "Chicane di bagian akhir lap sempat menjadi sorotan karena sering mengganggu mobil yang ingin mengikuti lawan, lalu dihapus pada 2023 dan lintasan kembali ke bentuk yang lebih cepat. Perubahan ini membuat panjang lintasan menjadi 4,657 km seperti yang tercantum di halaman ini."
      ] },
    { name: "Circuit de Monaco", gp: "GP Monako", city: "Monte Carlo", country: "Monako", length: "3.337 km", turns: 19, first: 1950, kalender: true,
      desc: "Sirkuit terpendek dan paling lambat, dengan tembok pembatas nyaris menempel di lintasan. Posisi start sangat menentukan karena menyalip hampir mustahil.",
      more: [
        "Monako adalah bagian dari Triple Crown balap motor bersama Indianapolis 500 dan 24 Jam Le Mans. Memenangi balapan di sini membawa gengsi yang sulit disamai. Lintasannya melewati jalan kota seperti Casino Square, terowongan, dan chicane tepi pelabuhan, di mana mobil melaju hanya beberapa sentimeter dari rel pembatas.",
        "Tikungan paling terkenal adalah Fairmont Hairpin, yang menjadi tikungan paling lambat di seluruh kalender. Mobil F1 modern yang lebar dan panjang nyaris tidak muat di sini, dan pembalap harus menjaga ketelitian selama hampir dua jam. Satu kesalahan kecil bisa langsung mengakhiri balapan.",
        "Karena menyalip hampir mustahil, kualifikasi di Monako sering dianggap sama pentingnya dengan balapan itu sendiri. Pembalap yang merebut pole biasanya punya peluang besar untuk menang. Strategi ban dan waktu pit stop menjadi satu-satunya cara untuk naik posisi tanpa menyalip di lintasan."
      ] },
    { name: "Circuit de Spa-Francorchamps", gp: "GP Belgia", city: "Stavelot", country: "Belgia", length: "7.004 km", turns: 19, first: 1950, kalender: true,
      desc: "Sirkuit terpanjang di kalender, terkenal lewat tikungan Eau Rouge dan Raidillon. Cuaca di hutan Ardennes bisa berubah drastis dalam satu lap.",
      more: [
        "Spa adalah salah satu sirkuit paling dicintai pembalap. Versi aslinya adalah jalan umum sepanjang lebih dari 14 kilometer yang sangat berbahaya, lalu dipangkas menjadi tata letak modern pada akhir 1970-an. F1 sudah mampir sejak musim perdana 1950, dan lintasan ini tetap menjadi ujian bagi pembalap yang berani.",
        "Tikungan Eau Rouge dan Raidillon adalah kombinasi kiri-kanan yang menanjak tajam dan dilalui dengan kecepatan sangat tinggi. Setelah itu mobil memasuki Kemmel Straight, tempat menyalip yang terkenal. Bagian lain seperti Pouhon dan Blanchimont juga cepat dan mengalir, sehingga mobil dengan aerodinamika baik akan unggul.",
        "Dengan panjang lebih dari tujuh kilometer, hujan bisa turun di satu bagian lintasan sementara bagian lain tetap kering. Situasi ini membuat pilihan ban sangat sulit dan sering mengubah hasil balapan. Karena itu balapan di Spa sering menghasilkan cerita yang dikenang bertahun-tahun."
      ] },
    { name: "Circuit Gilles Villeneuve", gp: "GP Kanada", city: "Montreal", country: "Kanada", length: "4.361 km", turns: 14, first: 1978, kalender: true,
      desc: "Dibangun di pulau buatan Île Notre-Dame. Lintasannya penuh pengereman keras, dan tembok Wall of Champions di tikungan terakhir sudah menjebak banyak juara.",
      more: [
        "Sirkuit ini dinamai dari Gilles Villeneuve, pembalap Kanada yang meninggal pada 1982 dan memenangi balapan F1 pertamanya di sini pada 1978. Lintasannya berada di Île Notre-Dame, pulau buatan di Sungai Saint Lawrence yang dulu dipakai untuk Expo 67 dan Olimpiade 1976. Sebagian jalurnya adalah jalan pulau yang dipakai umum di luar hari balapan.",
        "Karakter lintasannya berupa lurusan panjang yang diakhiri chicane dan hairpin, jadi mobil terus melaju kencang lalu mengerem keras. Pola ini sangat menguras rem dan membuat traksi keluar tikungan menjadi penting. Lurusan dan zona DRS yang panjang membuat menyalip cukup mungkin, sehingga balapan di sini cenderung seru.",
        "Tembok Wall of Champions di tikungan terakhir mendapat namanya setelah beberapa juara dunia, termasuk Damon Hill, Michael Schumacher, dan Jacques Villeneuve, menabraknya pada 1999. Cuaca Montreal juga bisa berubah cepat, jadi hujan dan safety car sering ikut mewarnai balapan."
      ] },
    { name: "Circuit of the Americas", gp: "GP Amerika Serikat", city: "Austin", country: "Amerika Serikat", length: "5.513 km", turns: 20, first: 2012, kalender: true,
      desc: "Tikungan pertamanya menanjak curam sebelum turun ke rangkaian tikungan cepat yang terinspirasi dari bagian Silverstone dan sirkuit Eropa lain.",
      more: [
        "COTA di Austin, Texas, dibangun khusus untuk F1 dan dibuka pada 2012. Sirkuit ini menandai kembalinya GP Amerika Serikat setelah edisi terakhir di Indianapolis pada 2007. Tikungan 1 menanjak sekitar 40 meter hingga ke puncak sebelum berbelok tajam ke kiri, dan pemandangan dari atas bukit itu menjadi ciri khasnya.",
        "Rangkaian tikungan 3 sampai 6 meniru gaya Maggotts dan Becketts di Silverstone, dengan pergantian arah cepat yang menuntut keseimbangan mobil. Bagian lain juga diambil dari sirkuit dunia, misalnya tikungan majemuk di akhir lap yang terinspirasi dari Tikungan 8 di Istanbul Park. Hasilnya adalah campuran gaya Eropa di tengah Amerika.",
        "Lurusan belakang yang panjang berujung pada hairpin tikungan 12, tempat favorit untuk menyalip. Permukaan lintasan di Austin cukup bergelombang, sehingga setelan suspensi dan ketinggian mobil perlu dipikirkan baik-baik. Suasana tribun yang meriah dan acara musik di sekitar sirkuit ikut membuat seri ini terasa seperti festival."
      ] },
    { name: "Circuit Zandvoort", gp: "GP Belanda", city: "Zandvoort", country: "Belanda", length: "4.259 km", turns: 14, first: 1952, kalender: true,
      desc: "Sirkuit di antara bukit pasir dengan dua tikungan berbanking, Hugenholtz dan Arie Luyendyk. Lintasannya sempit dan sulit untuk menyalip.",
      more: [
        "Zandvoort dibangun di tengah bukit pasir tepi Laut Utara, dengan tata letak asli yang dirancang oleh John Hugenholtz, perancang yang juga membuat Suzuka. GP Belanda pertama digelar pada 1952, lalu F1 meninggalkan sirkuit ini setelah 1985 dan baru kembali pada 2021. Kembalinya balapan ke sini disambut sangat meriah.",
        "Dua tikungan berbanking, Hugenholtz di tikungan 3 dan Arie Luyendyk di tikungan terakhir, memberi pembalap sensasi yang tidak ada di sirkuit lain. Banking membuat mobil bisa melaju lebih cepat dan memungkinkan pembalap mencoba jalur yang berbeda. Tikungan terakhir juga membantu pembalap menyalip di lurusan utama.",
        "Lintasannya sempit, naik-turun, dan angin laut sering membawa pasir ke lintasan sehingga grip berubah-ubah. Suasana di sini juga khas karena lautan penonton berbaju oranye yang memberi dukungan untuk Max Verstappen, pembalap asal Belanda. Tribun yang penuh warna oranye menjadikan balapan ini terasa seperti pesta nasional."
      ] },
    { name: "Hungaroring", gp: "GP Hungaria", city: "Mogyoród", country: "Hungaria", length: "4.381 km", turns: 14, first: 1986, kalender: true,
      desc: "Sering dijuluki Monako tanpa tembok karena rapat, berliku, dan sulit disalip. Di sinilah balapan F1 pertama di balik Tirai Besi diadakan.",
      more: [
        "Hungaroring dibuka pada 1986 di dekat Budapest, dan balapan perdananya menjadi peristiwa besar karena F1 untuk pertama kalinya digelar di negara Blok Timur. Puluhan ribu penonton memenuhi tribun yang berbentuk lembah alami di sekeliling lintasan. Sejak itu Hungaria hampir selalu jadi bagian dari kalender F1.",
        "Lintasannya sempit dan berliku, dengan sedikit lurusan dan hampir tanpa waktu untuk bernapas. Karena menyalip sulit dan debu menumpuk di jalur yang jarang dipakai, grip bagi pembalap berubah dari putaran ke putaran. Karena itu kualifikasi dan strategi pit stop sangat berpengaruh terhadap hasil akhir.",
        "Balapan biasanya digelar pada musim panas ketika suhu udara dan aspal tinggi, sehingga pembalap dan mobil sama-sama bekerja keras. Hungaroring sering menjadi seri penutup sebelum jeda musim panas, dan hasil balapannya kerap menjadi penentu momentum untuk paruh kedua musim."
      ] },
    { name: "Autódromo José Carlos Pace (Interlagos)", gp: "GP São Paulo", city: "São Paulo", country: "Brasil", length: "4.309 km", turns: 15, first: 1973, kalender: true,
      desc: "Lintasan berlawanan arah jarum jam dengan kontur naik-turun yang khas. Hujan mendadak sering membuat balapan di sini penuh kejutan.",
      more: [
        "Nama Interlagos berarti di antara danau, merujuk lokasi aslinya antara dua waduk di São Paulo. Resminya sirkuit ini dinamai untuk Carlos Pace, pembalap Brasil yang tewas dalam kecelakaan pesawat pada 1977. F1 mulai datang pada 1973, dan sejak 2021 balapannya dikenal sebagai GP São Paulo.",
        "Putaran berlawanan arah jarum jam membuat leher pembalap bekerja ekstra, dan tikungan Senna S di awal lap menjadi titik favorit menyalip. Lurusan Reta Oposta yang naik ke start/finish juga memberi peluang menyalip. Kombinasi lintasan yang bergelombang dan tanjakan di bagian akhir membuat sirkuit ini menantang.",
        "Interlagos berulang kali menjadi saksi penentuan gelar juara dunia, termasuk final dramatis 2008 saat Lewis Hamilton merebut gelar di tikungan terakhir. Hujan yang datang tiba-tiba, ditambah dukungan penonton Brasil yang bersemangat, membuat balapan di sini hampir selalu penuh kejutan."
      ] },
    { name: "Las Vegas Strip Circuit", gp: "GP Las Vegas", city: "Las Vegas", country: "Amerika Serikat", length: "6.201 km", turns: 17, first: 2023, kalender: true,
      desc: "Balapan malam hari melewati jalan-jalan kasino di The Strip. Lurusan panjang dan udara malam yang dingin membuat suhu ban sulit dijaga.",
      more: [
        "F1 kembali ke Las Vegas pada 2023 setelah edisi singkat di tempat parkir kasino pada awal 1980-an. Kali ini balapan digelar langsung oleh F1 sendiri di jalan-jalan yang dikenal dunia, dengan hotel, kasino, dan Sphere sebagai latar. Balapan dimulai larut malam, dan jalan-jalan Strip ditutup untuk umum selama akhir pekan.",
        "Lurusan sepanjang Las Vegas Boulevard memungkinkan mobil menembus sekitar 340 km/jam, sehingga slipstream sangat efektif. Menyalip jadi lebih mudah dibanding kebanyakan sirkuit jalan raya. Sisanya berupa tikungan lambat yang menuntut traksi dan pengereman kuat.",
        "Tantangan terbesar justru suhu. Malam di gurun Nevada bisa sangat dingin, dan aspal jalan raya biasa cenderung licin. Ban sulit mencapai suhu kerja ideal, dan sedikit kesalahan membuat mobil kehilangan grip. Strategi ban dan pengaturan setelan menjadi kunci balapan di sini."
      ] },
    { name: "Lusail International Circuit", gp: "GP Qatar", city: "Lusail", country: "Qatar", length: "5.419 km", turns: 16, first: 2021, kalender: true,
      desc: "Awalnya dibangun untuk MotoGP dan dipakai F1 sejak 2021. Tikungan cepat yang panjang membuat fisik pembalap terkuras.",
      more: [
        "Sirkuit ini dibangun di dekat kota Lusail pada 2004 khusus untuk MotoGP, sebelum F1 datang untuk pertama kalinya pada 2021. Pada 2022 balapan di Qatar absen karena Piala Dunia FIFA, lalu kembali pada 2023. Balapan digelar malam hari di bawah lampu sorot, dan lintasannya lebar dengan area pelarian luas.",
        "Lintasan ini penuh tikungan cepat dan panjang yang berkelanjutan, jadi gaya mengemudi yang halus sangat dibutuhkan. Tekanan sideways pada tubuh pembalap tinggi dan hampir tidak ada jeda. Beban terus-menerus pada ban depan juga membuat ban cepat aus.",
        "Pada 2023, suhu dan kelembapan yang tinggi membuat sejumlah pembalap kelelahan hebat, dan kerb yang tajam merusak ban. Akibatnya jumlah putaran maksimal per set ban dibatasi demi keselamatan. Peristiwa itu menjadi pengingat bahwa balapan di Qatar bukan hanya soal kecepatan, tetapi juga ketahanan fisik."
      ] },
    { name: "Madring", gp: "GP Spanyol (Madrid)", city: "Madrid", country: "Spanyol", length: "5.474 km", turns: 22, first: 2026, kalender: true, baru: true,
      desc: "Sirkuit hibrida setengah jalan kota, setengah permanen, di sekitar area IFEMA Madrid. Debut di kalender F1 pada musim 2026.",
      more: [
        "Madring adalah sirkuit hibrida yang dibangun di sekitar kompleks pameran IFEMA di Madrid, memadukan jalan umum dengan bagian yang dibangun khusus dekat bandara Barajas. F1 kembali ke ibu kota Spanyol untuk pertama kalinya sejak 1981, dengan kontrak sampai 2035. Pembalap asal Madrid, Carlos Sainz, menjadi duta sirkuit ini.",
        "Ciri khasnya adalah tikungan 12, La Monumental, tikungan kanan sepanjang sekitar 550 meter dengan banking 24 persen, kemiringan maksimal yang diizinkan FIA. Namanya diambil dari tradisi arena adu banteng Las Ventas di Madrid. Pembalap merasakan gaya sekitar 4G di sini, dan tikungan ini disebut sebagai tikungan berbanking terpanjang di kalender.",
        "Lintasan sepanjang 5,4 km dengan 22 tikungan ini mencampur bagian lambat, menengah, dan cepat, ditambah dua terowongan pendek dan perubahan ketinggian. Balapan perdananya digelar pada 11 sampai 13 September 2026 dengan 57 putaran. Karena masih baru, tata letaknya bisa saja berubah dari tahun ke tahun."
      ] },
    { name: "Marina Bay Street Circuit", gp: "GP Singapura", city: "Singapura", country: "Singapura", length: "4.940 km", turns: 19, first: 2008, kalender: true,
      desc: "Lokasi balapan malam pertama dalam sejarah F1. Udara lembap dan banyak tikungan lambat menjadikannya salah satu balapan paling melelahkan.",
      more: [
        "Marina Bay menjadi sejarah pada 2008 sebagai balapan malam pertama dalam F1. Ribuan lampu dipasang di sepanjang lintasan sehingga terang seperti siang, dan latar gedung pencakar langit membuat tayangannya spektakuler. Balapan perdana itu juga terkenal karena skandal Crashgate, ketika sebuah tabrakan disengaja memengaruhi hasil lomba.",
        "Singapura dikenal sebagai balapan paling melelahkan. Suhu dan kelembapan sangat tinggi walau malam hari, dan lintasan penuh tikungan lambat yang membuat pembalap harus menyetir keras hampir tanpa jeda. Dalam satu balapan pembalap bisa kehilangan beberapa kilogram berat badan akibat dehidrasi.",
        "Dinding pembatas dekat lintasan membuat safety car hampir selalu muncul, sehingga balapan sering mendekati batas waktu dua jam. Tata letaknya direvisi pada 2023 dengan menghapus satu bagian di dekat Anderson Bridge, yang membuat panjang lintasan menjadi 4,940 km seperti tercantum di halaman ini."
      ] },
    { name: "Miami International Autodrome", gp: "GP Miami", city: "Miami Gardens", country: "Amerika Serikat", length: "5.412 km", turns: 19, first: 2022, kalender: true,
      desc: "Dibangun di sekitar Hard Rock Stadium. Lintasan sementara ini punya bagian cepat dan rangkaian tikungan sempit yang rapat.",
      more: [
        "Sirkuit ini dibuat di area parkir Hard Rock Stadium, markas tim NFL Miami Dolphins, dan debut di F1 pada 2022. Walau berada di kawasan stadion, nuansanya sangat khas Miami dengan area hospitality bergaya pantai dan marina tiruan. Balapan di sini menjadi bagian dari upaya F1 memperluas penggemarnya di Amerika Serikat.",
        "Lintasannya memadukan lurusan panjang dan rangkaian tikungan sempit yang berkelok-kelok di bagian tengah. Bagian chicane cepat di sektor tengah menuntut presisi, sedangkan tikungan lambat menjelang lurusan menjadi tempat favorit menyalip. Setelah musim pertama, beberapa tikungan diubah supaya lebih mengalir.",
        "Cuaca panas dan lembap Florida, ditambah aspal yang licin di awal akhir pekan, membuat pengelolaan ban menjadi tantangan. Hujan petir juga bisa datang tiba-tiba di sore hari. Pembalap yang cepat beradaptasi dengan perubahan grip biasanya tampil lebih baik di sini."
      ] },
    { name: "Autodromo Nazionale Monza", gp: "GP Italia", city: "Monza", country: "Italia", length: "5.793 km", turns: 11, first: 1950, kalender: true,
      desc: "Dijuluki Kuil Kecepatan karena hampir sepanjang lap dilalui dengan gas penuh. Kandang para tifosi Ferrari dengan suasana tribun yang legendaris.",
      more: [
        "Monza dibangun pada 1922 di dalam taman kerajaan di dekat Milan, dan menjadi salah satu sirkuit tertua di dunia yang masih dipakai. GP Italia digelar di sini sejak musim perdana F1 pada 1950, hampir tanpa putus. Sebagian dinding banking tua masih berdiri di sisi lintasan sebagai pengingat sejarahnya yang panjang.",
        "Lintasannya memiliki sedikit tikungan dan lurusan yang panjang, sehingga tim membawa sayap berdownforce rendah supaya kecepatan puncak tinggi. Mobil bisa melaju lebih dari 350 km/jam dan rata-rata kecepatan per lap melampaui 260 km/jam, termasuk yang tercepat dalam sejarah F1. Tikungan Parabolica dan chicane di ujung lurusan menjadi tempat pengereman paling dramatis.",
        "Para tifosi, pendukung Ferrari, memenuhi tribun dengan warna merah dan bendera Italia. Saat balapan berakhir, penonton biasanya membanjiri lintasan di bawah podium. Suasana ini membuat Monza terasa seperti rumah bagi Ferrari, dan kemenangan mereka di sini disambut dengan luapan emosi."
      ] },
    { name: "Red Bull Ring", gp: "GP Austria", city: "Spielberg", country: "Austria", length: "4.318 km", turns: 10, first: 1970, kalender: true,
      desc: "Satu lap hanya sekitar satu menit, salah satu yang tersingkat di kalender. Lintasannya naik-turun di perbukitan Styria dengan tiga lurusan utama.",
      more: [
        "Sirkuit ini berada di lembah Styria dengan pemandangan pegunungan, dan namanya sudah berganti beberapa kali: Österreichring, A1-Ring, hingga Red Bull Ring setelah dibeli Red Bull dan dibuka kembali pada 2011. F1 kembali pada 2014. Kini lintasan ini menjadi seri kandang bagi tim Red Bull Racing.",
        "Satu lap hanya sekitar satu menit dengan tikungan yang sedikit. Tikungan 1 menanjak dengan pengereman keras dan menjadi titik menyalip utama, dan tikungan lain juga mengandalkan tanjakan serta turunan. Karena ruang untuk salah kecil, batas lintasan sering menjadi sumber penalti.",
        "Waktu antarpembalap sangat tipis sehingga selisih satu per seratus detik bisa mengubah posisi start. Cuaca pegunungan juga bisa berubah cepat, dan hujan sering datang tiba-tiba di sore hari. Suasana di tribun juga khas dengan lautan penonton berbaju oranye yang mendukung Max Verstappen."
      ] },
    { name: "Shanghai International Circuit", gp: "GP Tiongkok", city: "Shanghai", country: "Tiongkok", length: "5.451 km", turns: 16, first: 2004, kalender: true,
      desc: "Tikungan pembukanya berbentuk spiral panjang yang terus mengecil, disusul lurusan belakang lebih dari satu kilometer.",
      more: [
        "Sirkuit ini dibuka pada 2004 dan dirancang oleh Hermann Tilke. Bentuk lintasannya disebut terinspirasi dari karakter Mandarin shang yang berarti naik atau atas. Kompleks ini sangat besar, dengan tribun megah dan fasilitas lengkap di dekat kota Shanghai.",
        "Tikungan 1 sampai 3 membentuk spiral panjang yang terus menyempit dan menuntut pembalap mengatur beban pada ban depan. Ban depan kiri sering menjadi yang paling terbebani sehingga pengelolaan ban sangat penting. Di ujung lurusan belakang sepanjang sekitar 1,2 kilometer ada hairpin tikungan 14, tempat menyalip yang terkenal.",
        "China sempat absen dari kalender F1 selama beberapa musim, dari 2020 sampai 2023, lalu kembali pada 2024. Kembalinya balapan ke Shanghai disambut antusias oleh penonton yang sudah lama menantikannya. Seri ini juga kerap mempertemukan strategi pit stop yang berbeda karena cuaca yang bisa berubah."
      ] },
    { name: "Silverstone Circuit", gp: "GP Britania Raya", city: "Silverstone", country: "Inggris", length: "5.891 km", turns: 18, first: 1950, kalender: true,
      desc: "Bekas pangkalan udara yang menjadi lokasi balapan F1 pertama dalam sejarah pada 1950. Tikungan cepat Maggotts dan Becketts jadi favorit para pembalap.",
      more: [
        "Silverstone berdiri di bekas pangkalan Angkatan Udara Kerajaan Inggris yang dipakai pada Perang Dunia II. Sisa landasan pacu dijadikan lintasan balap, dan pada 1950 sirkuit ini menggelar balapan pertama Kejuaraan Dunia F1, GP Britania Raya. Peristiwa itu dihadiri Raja George VI, sehingga Silverstone sering disebut sebagai rumah balap motor Inggris.",
        "Bagian paling terkenal adalah rangkaian Maggotts, Becketts, dan Chapel, yaitu pergantian arah yang dilalui dengan kecepatan sangat tinggi. Karena permukaan datar dan terbuka, angin sering memengaruhi keseimbangan mobil. Tikungan Copse, Stowe, dan Club juga menuntut keberanian ekstra, dan cocok untuk mobil dengan downforce tinggi.",
        "Banyak tim F1 bermarkas di Inggris, termasuk beberapa yang berbasis dekat Silverstone, jadi pabrik dan karyawan mereka datang langsung ke sirkuit. Lewis Hamilton, pembalap Inggris tersukses, juga selalu disambut luar biasa di sini. Ratusan ribu penonton memenuhi area perkemahan dan tribun sepanjang akhir pekan."
      ] },
    { name: "Suzuka Circuit", gp: "GP Jepang", city: "Suzuka", country: "Jepang", length: "5.807 km", turns: 18, first: 1987, kalender: true,
      desc: "Satu-satunya sirkuit F1 berbentuk angka delapan, dengan jembatan tempat lintasan saling bersilangan. Rangkaian S-curve cepat di awal lap menguji keberanian pembalap.",
      more: [
        "Suzuka dibangun pada 1962 oleh Honda sebagai lintasan uji dan dirancang oleh John Hugenholtz, perancang asal Belanda yang juga membuat Zandvoort. Bentuk angka delapan dengan jembatan di tengah adalah desain yang unik di antara sirkuit F1. Bagian lintasan menyilang di atas dan bawah sehingga arah putaran bergantian antara searah dan berlawanan arah jarum jam.",
        "Lintasannya mengutamakan keterampilan. S-curve cepat di awal lap, tikungan Degner, hairpin, dan 130R yang sangat cepat menuntut ketepatan dan keberanian pembalap. Penutupnya adalah chicane Casio Triangle, tempat yang sering dipakai untuk menyalip menjelang garis finis. Karena sulit dikuasai, Suzuka dianggap sebagai ujian sejati.",
        "Sirkuit ini beberapa kali menjadi tempat penentuan gelar juara dunia, termasuk persaingan sengit Ayrton Senna dan Alain Prost pada akhir 1980-an hingga awal 1990-an. Para penggemar Jepang juga dikenal sangat antusias dan setia, datang berbondong-bondong dengan atribut tim favorit mereka."
      ] },
    { name: "Yas Marina Circuit", gp: "GP Abu Dhabi", city: "Abu Dhabi", country: "Uni Emirat Arab", length: "5.281 km", turns: 16, first: 2009, kalender: true,
      desc: "Balapan dimulai saat senja dan berakhir di bawah lampu. Biasanya menjadi penutup musim.",
      more: [
        "Yas Marina berada di Pulau Yas dan dibuka pada 2009. Balapan perdananya sudah menarik perhatian karena digelar mulai dari sore hari dan berakhir malam di bawah lampu sorot. Sebuah hotel megah dibangun di atas sebagian lintasan, dan pembalap melewati bawahnya saat melaju.",
        "Pintu keluar pit dibuat berupa terowongan di bawah lintasan, yang unik di dunia F1. Tata letaknya pernah diubah pada 2021 dengan menghapus beberapa tikungan lambat dan membuat mobil lebih mudah saling mengikuti. Hasilnya, peluang menyalip bertambah dan balapan terasa lebih seru.",
        "Sebagai penutup musim, Abu Dhabi sudah beberapa kali menyaksikan penentuan gelar juara dunia, termasuk pada 2010 dan 2021. Balapan 2021 menjadi salah satu yang paling diperdebatkan sepanjang sejarah F1. Itulah sebabnya nama Yas Marina selalu diingat dalam kisah persaingan gelar juara."
      ] },
    { name: "Bahrain International Circuit", gp: "GP Bahrain", city: "Sakhir", country: "Bahrain", length: "5.412 km", turns: 15, first: 2004, kalender: false,
      desc: "Sirkuit di tengah gurun yang menggelar balapan F1 pertama di Timur Tengah. Pasir yang terbawa angin sering mengurangi grip di lintasan.",
      more: [
        "Sirkuit di Sakhir ini dirancang oleh Hermann Tilke dan dibuka pada 2004. Balapan perdananya menjadi yang pertama di Timur Tengah. Dalam banyak musim, Bahrain menjadi pembuka musim, sehingga orang menjadikannya acuan kekuatan tim sejak awal tahun.",
        "Pengereman kuat di tikungan 1, 4, dan 10 serta aspal yang kasar membuat ban belakang cepat aus, sehingga strategi ban sangat penting. Lurusan panjang yang diikuti pengereman keras memberi banyak peluang menyalip. Balapan sejak 2014 digelar menjelang malam, sehingga suhu aspal turun di tengah lomba.",
        "Pada 2020 Bahrain menggelar dua balapan, termasuk satu di jalur luar yang lebih pendek. Pada balapan itu Romain Grosjean mengalami kecelakaan besar dan selamat berkat halo, perangkat pelindung kepala di atas kokpit. Sirkuit ini tidak termasuk dalam kalender 2026, tetapi tetap tercatat sebagai bagian penting sejarah F1 modern."
      ] },
    { name: "Jeddah Corniche Circuit", gp: "GP Arab Saudi", city: "Jeddah", country: "Arab Saudi", length: "6.174 km", turns: 27, first: 2021, kalender: false,
      desc: "Sirkuit jalan raya tercepat di kalender, dengan 27 tikungan di sepanjang pesisir Laut Merah. Dinding pembatas yang rapat membuat kesalahan kecil berujung fatal.",
      more: [
        "Jeddah Corniche Circuit mulai dipakai F1 pada 2021 dan dibangun di sepanjang pesisir Laut Merah. Dengan kecepatan rata-rata yang sangat tinggi, ini adalah sirkuit jalan raya tercepat di kalender. Balapan digelar pada malam hari di bawah lampu, dan lintasannya berada di kawasan Corniche yang menjadi kebanggaan kota.",
        "Dengan 27 tikungan, ini juga sirkuit dengan jumlah tikungan terbanyak. Banyak di antaranya cepat dan buta, karena tembok pembatas menutup pandangan pembalap ke tikungan berikutnya. Mobil yang sedikit melenceng saja bisa langsung menabrak tembok tanpa ada ruang untuk memperbaiki diri.",
        "Karena itu safety car dan bendera merah sering muncul, dan balapan menuntut konsentrasi penuh dari awal sampai akhir. Seperti Bahrain, sirkuit ini tidak termasuk dalam kalender 2026, tetapi sejak debutnya sudah menghasilkan banyak momen dramatis."
      ] }
];

// Gambar lintasan tiap sirkuit (file PNG ada di folder yang sama dengan index.html)
const circuitImages = {
    "Albert Park Circuit": "albert-park",
    "Autódromo Hermanos Rodríguez": "mexico",
    "Baku City Circuit": "baku",
    "Circuit de Barcelona-Catalunya": "barcelona",
    "Circuit de Monaco": "monaco",
    "Circuit de Spa-Francorchamps": "spa",
    "Circuit Gilles Villeneuve": "montreal",
    "Circuit of the Americas": "cota",
    "Circuit Zandvoort": "zandvoort",
    "Hungaroring": "hungaroring",
    "Autódromo José Carlos Pace (Interlagos)": "interlagos",
    "Las Vegas Strip Circuit": "las-vegas",
    "Lusail International Circuit": "lusail",
    "Madring": "madring",
    "Marina Bay Street Circuit": "marina-bay",
    "Miami International Autodrome": "miami",
    "Autodromo Nazionale Monza": "monza",
    "Red Bull Ring": "red-bull-ring",
    "Shanghai International Circuit": "shanghai",
    "Silverstone Circuit": "silverstone",
    "Suzuka Circuit": "suzuka",
    "Yas Marina Circuit": "yas-marina",
    "Bahrain International Circuit": "bahrain",
    "Jeddah Corniche Circuit": "jeddah"
};
function circuitImg(c) {
    const f = circuitImages[c.name];
    return f ? `assets/images/circuits/${f}.png` : "";
}

/* =====================================================================
   PINDAH HALAMAN + GANTI BACKGROUND
   ===================================================================== */
const PAGE_THEMES = {
    'home-page': 'theme-home',
    'drivers-page': 'theme-drivers',
    'detail-page': 'theme-detail',
    'circuits-page': 'theme-circuits',
    'circuit-detail-page': 'theme-circuit-detail'
};

const SEARCH_PLACEHOLDERS = {
    'drivers-page': 'Cari Pembalap',
    'circuits-page': 'Cari Sirkuit',
    'teams-page': 'Cari Tim'
};

// Filter kartu tim berdasarkan teks yang tampil di kartu
function filterTeams(filterText = "") {
    const grid = document.getElementById('teams-grid');
    if (!grid) return;
    let items = [...grid.children];
    if (items.length === 1) items = [...items[0].children];
    const q = filterText.trim().toLowerCase();
    items.forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Ganti tema background sesuai halaman
    document.body.classList.remove(...Object.values(PAGE_THEMES));
    document.body.classList.add(PAGE_THEMES[id] || 'theme-home');

    // Kolom cari hanya muncul di halaman Pembalap, Sirkuit, dan Tim
    const si = document.getElementById('search-input');
    if (si) {
        const placeholder = SEARCH_PLACEHOLDERS[id];
        si.style.display = placeholder ? '' : 'none';
        if (placeholder) si.placeholder = placeholder;
        if (si.value) {
            si.value = '';
            renderGrid('');
            renderCircuits('');
            filterTeams('');
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Kolom cari muncul/hilang -> menu bergeser. Beri tahu kode lain (mis. garis putih menu)
    // supaya menghitung ulang posisinya setelah tata letak baru selesai.
    requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event('resize'))));

    updateTitle();
}

/* ---------- Judul tab browser ikut halaman, mis. "F1 Beranda", "F1 Sirkuit" ---------- */
const PAGE_TITLES = {
    'home-page': 'Beranda',
    'drivers-page': 'Pembalap',
    'teams-page': 'Tim',
    'team-detail-page': 'Tim',
    'circuits-page': 'Sirkuit',
    'klasemen-page': 'Klasemen',
    'hasil-page': 'Hasil',
    'schedule-page': 'Schedule',
    'history-page': 'Sejarah',
    'reflek-page': 'Game',
    'profile-page': 'Profil'
};
function updateTitle() {
    const page = document.querySelector('.page.active');
    const id = page ? page.id : 'home-page';
    const txt = el => (el && el.textContent || '').trim();
    let name = PAGE_TITLES[id];
    if (id === 'detail-page') name = txt(document.getElementById('photo-caption')) || 'Pembalap';       // nama pembalap
    else if (id === 'circuit-detail-page') name = txt(document.getElementById('cd-name')) || 'Sirkuit';  // nama sirkuit
    document.title = name ? 'F1 ' + name : 'F1 Driver Articles';
}
// jaga-jaga kalau ada halaman yang dibuka tanpa lewat showPage
new MutationObserver(muts => {
    if (muts.some(m => m.target.classList && m.target.classList.contains('page'))) updateTitle();
}).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
document.addEventListener('DOMContentLoaded', updateTitle);

function backToHome() {
    showPage('home-page');
}

/* =====================================================================
   HELPER
   ===================================================================== */
// Ubah teks biografi (yang diketik pakai Enter) jadi paragraf <p>
function formatBio(text) {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${line}</p>`)
        .join('');
}

/* =====================================================================
   BERANDA: STATISTIK
   ===================================================================== */
function initHomeHero() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lights = [...document.querySelectorAll('.hero-start-light')];
    const title = document.querySelector('.hero-title');

    const counts = [
        ['hero-driver-count', Object.keys(driversData).length],
        ['hero-team-count', teamsData.length],
        ['hero-circuit-count', circuitsData.length]
    ];

    function renderOdometer(counter, total, animate) {
        if (!counter) return;
        const digits = String(total);
        const visual = digits.split('').map((digit, index) => {
            const rows = Array.from({ length: 10 }, (_, number) => `<span>${number}</span>`).join('');
            return `<span class="hero-odometer-digit" style="--digit-index:${index}"><span class="hero-odometer-track">${rows}</span></span>`;
        }).join('');
        counter.setAttribute('role', 'img');
        counter.setAttribute('aria-label', digits);
        counter.innerHTML = `<span class="hero-odometer-visual" aria-hidden="true">${visual}</span>`;

        counter.querySelectorAll('.hero-odometer-track').forEach((track, index) => {
            const setDigit = () => { track.style.transform = `translateY(-${digits[index]}em)`; };
            if (animate) requestAnimationFrame(setDigit);
            else setDigit();
        });
    }

    if (reduceMotion) {
        lights.forEach(light => light.classList.add('is-green'));
        counts.forEach(([id, total]) => renderOdometer(document.getElementById(id), total, false));
        return;
    }

    const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));
    async function startLightsAndCounters() {
        if (title) title.classList.add('is-pending');
        for (const light of lights) {
            light.classList.add('is-lit');
            await wait(800);
        }
        await wait(1000);
        lights.forEach(light => {
            light.classList.remove('is-lit');
            light.classList.add('is-green');
        });
        if (title) title.classList.remove('is-pending');
        if (title) title.classList.add('is-entering');
        counts.forEach(([id, total]) => renderOdometer(document.getElementById(id), total, true));
    }
    startLightsAndCounters();
}

function renderHomeStats() {
    const box = document.getElementById('home-stats');
    if (!box) return;

    const list = Object.entries(driversData).map(([id, d]) => ({
        id: Number(id),
        name: d.name,
        photo: d.photo,
        debut: Number(d.stats && d.stats["Debut F1"])
    })).filter(d => d.debut);

    const oldest = list.reduce((a, b) => (b.debut < a.debut ? b : a));
    const newest = list.reduce((a, b) => (b.debut > a.debut ? b : a));

    const cards = [
        { value: Object.keys(driversData).length, label: "Pembalap", note: "Ada di website ini" },
        { value: circuitsData.length, label: "Sirkuit", note: "Ada di website ini" },
        { value: oldest.debut, label: "Debut terlama", note: oldest.name, driver: oldest },
        { value: newest.debut, label: "Debut terbaru", note: newest.name, driver: newest }
    ];

    box.innerHTML = cards.map(c => {
        const isDriverCard = Boolean(c.driver);
        const tag = isDriverCard ? 'button' : 'div';
        const attributes = isDriverCard
            ? `type="button" onclick="openDetail(${c.driver.id})" aria-label="Lihat profil ${c.driver.name}"`
            : '';
        const photo = isDriverCard
            ? `<img class="stat-photo" src="${c.driver.photo}" alt="" aria-hidden="true" loading="lazy" onerror="this.hidden=true">`
            : '';

        return `
            <${tag} class="stat-card${isDriverCard ? ' stat-card-driver' : ''}" ${attributes}>
                ${photo}
                <div class="stat-value">${c.value}</div>
                <div class="stat-label">${c.label}</div>
                <div class="stat-note">${c.note}</div>
            </${tag}>`;
    }).join('');
}

/* =====================================================================
   HALAMAN PEMBALAP: GRID
   ===================================================================== */
function renderGrid(filterText = "") {
    const grid = document.getElementById('drivers-grid-container');
    if (!grid) return;
    grid.innerHTML = "";

    const nationalityCodes = {
        'Inggris': 'gb', 'Spanyol': 'es', 'Thailand': 'th', 'Prancis': 'fr',
        'Belanda': 'nl', 'Jerman': 'de', 'Italia': 'it', 'Australia': 'au',
        'Monako': 'mc', 'Kanada': 'ca', 'Brasil': 'br', 'Selandia Baru': 'nz',
        'Argentina': 'ar', 'Meksiko': 'mx', 'Finlandia': 'fi'
    };

    Object.keys(driversData).forEach(id => {
        const driver = driversData[id];
        if (driver.name.toLowerCase().includes(filterText.toLowerCase())) {
            const nameParts = driver.name.trim().split(/\s+/);
            const lastName = nameParts.pop();
            const firstName = nameParts.join(' ');
            const nationality = driver.stats && driver.stats["Kebangsaan"];
            const countryCode = nationalityCodes[nationality];
            const team = typeof teamsData !== 'undefined'
                ? teamsData.find(t => t.drivers.includes(driver.name))
                : null;
            grid.innerHTML += `
                <div class="driver-card" style="--tc:${team ? team.color : '#333'}" onclick="openDetail(${id})">
                    <div class="driver-card-copy">
                        <span class="driver-first-name">${firstName}</span>
                        <h3 class="driver-last-name">${lastName}</h3>
                        <span class="driver-team-name">${driver.team}</span>
                        <strong class="driver-number">${driver.stats && driver.stats["Nomor"] || ''}</strong>
                        ${countryCode ? `<img class="driver-flag" src="https://flagcdn.com/w40/${countryCode}.png" alt="Bendera ${nationality}" loading="lazy" onerror="this.hidden=true">` : ''}
                    </div>
                    <img class="driver-photo" src="${driver.photo}" alt="${driver.name}" loading="lazy" onerror="this.hidden=true">
                </div>
            `;
        }
    });
}

// Fitur Cari / Live Search Realtime
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        if (document.getElementById('circuits-page').classList.contains('active')) {
            renderCircuits(e.target.value);
        } else if (document.getElementById('teams-page').classList.contains('active')) {
            filterTeams(e.target.value);
        } else {
            renderGrid(e.target.value);
        }
    });
}

/* =====================================================================
   HALAMAN SIRKUIT
   ===================================================================== */
function renderCircuits(filterText = "") {
    const grid = document.getElementById('circuits-grid-container');
    if (!grid) return;
    const q = filterText.trim().toLowerCase();

    const cards = circuitsData
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => [c.name, c.gp, c.city, c.country].join(' ').toLowerCase().includes(q))
        .map(({ c, i }) => `
            <div class="circuit-card${c.baru ? ' baru' : ''}" onclick="openCircuit(${i})">
                <span class="cc-badge ${c.baru ? 'red' : (c.kalender ? '' : 'off')}">${c.baru ? 'Sirkuit baru 2026' : (c.kalender ? 'Kalender 2026' : 'Tidak di kalender 2026')}</span>
                <div class="cc-img">${circuitImg(c) ? `<img src="${circuitImg(c)}" alt="Lintasan ${c.name}" loading="lazy">` : ''}</div>
                <h3>${c.name}</h3>
                <p class="cc-loc">${c.city}, ${c.country}</p>
                <div class="cc-stats">
                    <div><span>Panjang</span><b>${c.length}</b></div>
                    <div><span>Tikungan</span><b>${c.turns}</b></div>
                    <div><span>GP pertama</span><b>${c.first}</b></div>
                </div>
                <span class="cc-link">Buka panduan sirkuit</span>
            </div>
        `).join('');

    grid.innerHTML = cards || '<p class="cc-empty">Sirkuit tidak ditemukan. Coba kata kunci lain.</p>';
}

/* =====================================================================
   HALAMAN DETAIL SIRKUIT
   ===================================================================== */
function openCircuit(i) {
    const c = circuitsData[i];
    if (!c) return;
    showPage('circuit-detail-page');

    document.getElementById('cd-gp').innerText = c.gp;
    document.getElementById('cd-name').innerText = c.name;
    document.getElementById('cd-loc').innerText = `${c.city}, ${c.country}`;
    document.getElementById('cd-desc').innerText = c.desc;
    // paragraf tambahan (opsional): dari c.more, tiap item = satu paragraf
    const cdMore = document.getElementById('cd-more');
    cdMore.innerHTML = '';
    (c.more || []).forEach(t => {
        const p = document.createElement('p');
        p.textContent = t;
        cdMore.appendChild(p);
    });
    const cdImg = document.getElementById('cd-img');
    cdImg.src = circuitImg(c);
    cdImg.alt = `Lintasan ${c.name}`;
    cdImg.style.display = circuitImg(c) ? '' : 'none';
    document.getElementById('cd-stats').innerHTML = [
        ["Panjang lintasan", c.length],
        ["Jumlah tikungan", c.turns],
        ["GP pertama", c.first],
        ["Negara", c.country]
    ].map(([label, value]) => `
        <div class="cd-stat"><span>${label}</span><b>${value}</b></div>
    `).join('');

    const prev = (i - 1 + circuitsData.length) % circuitsData.length;
    const next = (i + 1) % circuitsData.length;
    document.getElementById('cd-nav').innerHTML = `
        <button onclick="openCircuit(${prev})"><small>Sebelumnya</small>${circuitsData[prev].name}</button>
        <button onclick="openCircuit(${next})"><small>Berikutnya</small>${circuitsData[next].name}</button>
    `;
}

/* =====================================================================
   HALAMAN DETAIL PEMBALAP (Biografi + Statistik)
   ===================================================================== */
function setTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === name);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === 'tab-' + name);
    });
}

function openDetail(id) {
    const driver = driversData[id];
    if (!driver) return;

    showPage('detail-page');
    setTab('bio');

    document.getElementById('main-photo').src = driver.photo;
    document.getElementById('main-photo').alt = driver.name;
    document.getElementById('photo-caption').innerText = driver.name;
    document.getElementById('article-title').innerText = driver.title;
    document.getElementById('article-text').innerHTML = formatBio(driver.bio);

    // Statistik: Tim otomatis + semua isi "stats"
    const allStats = Object.assign({ "Tim": driver.team }, driver.stats || {});
    document.getElementById('stats-grid').innerHTML = Object.entries(allStats).map(([label, value]) => `
        <div class="driver-stat">
            <div class="driver-stat-value">${value}</div>
            <div class="driver-stat-label">${label}</div>
        </div>
    `).join('');

    // Pembalap lainnya
    const sidebarList = document.getElementById('sidebar-list');
    if (sidebarList) {
        sidebarList.innerHTML = "";
        Object.keys(driversData).forEach(sideId => {
            if (sideId != id) {
                sidebarList.innerHTML += `
                    <div class="other-item" onclick="openDetail(${sideId})">
                        <img src="${driversData[sideId].photo}" alt="${driversData[sideId].name}">
                        <div>
                            <h4>${driversData[sideId].name}</h4>
                            <p>${driversData[sideId].team}</p>
                        </div>
                    </div>
                `;
            }
        });
    }
}

// Tombol tab (Statistik / Biografi)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (btn) setTab(btn.dataset.tab);
});


/* =====================================================================
   BERANDA: SHOWCASE TIM & SIRKUIT (pilih thumbnail / geser)
   ===================================================================== */
function renderHomeCarousels() {
    const stage = document.getElementById('fs-stage');
    if (!stage) return;
    const wrap = document.querySelector('.fs-wrap');
    const track = document.getElementById('fs-track');
    const title = document.getElementById('fs-title');
    const desc = document.getElementById('fs-desc');
    const rows = document.getElementById('fs-rows');
    const link = document.getElementById('fs-link');
    const count = document.getElementById('fs-count');
    const prev = document.querySelector('.fs-arrow[data-dir="-1"]');
    const next = document.querySelector('.fs-arrow[data-dir="1"]');
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    // Logo tim (diambil dari link yang kamu kirim)
    const teamLogos = {
        'mclaren': 'assets/images/pin/72644aef0c75a11905a848d485ba2fad.jpg',
        'haas': 'assets/images/pin/92fd431a41b0fadeee14fd11702680cb.jpg',
        'alpine': 'assets/images/pin/89652d94b80ad8d9bf6a59b2be5210d7.jpg',
        'ferrari': 'assets/images/pin/257ffe9204fa0004ff97fe9fdcb5c99b.jpg',
        'red bull': 'assets/images/pin/28ee6c55b8e3d6414342daf10d97fe5a.jpg',
        'racing bulls': 'assets/images/pin/42ad594511fbde88971da4812f72e293.jpg',
        'cadillac': 'assets/images/pin/923d581d5325793b207ccba147d50ed5.jpg',
        'mercedes': 'assets/images/pin/31fb0838a14408a5cd6fa946d277cbbb.jpg',
        'williams': 'assets/images/pin/ea35df160123cc7a1383d329e63c7ddb.jpg',
        'audi': 'assets/images/pin/b0f7eb6e9c6d5923a044bf4bfa9bcd68.jpg',
        'aston martin': 'assets/images/pin/b64a5745c7786e8b5c96df096eeebb69.jpg'
    };
    const logoFor = (...names) => {
        const text = names.filter(Boolean).join(' ').toLowerCase();
        const key = Object.keys(teamLogos).find(k => text.includes(k));
        return key ? teamLogos[key] : '';
    };

    const sets = {
        teams: (typeof teamsData !== 'undefined' ? teamsData : []).map(t => {
            const name = t.name || t.short || t.team || '';
            return {
                title: name,
                desc: [t.full || t.fullName, t.desc || t.about].filter(Boolean).join('. '),
                img: logoFor(name, t.short, t.team) || t.logo || t.car || t.carImg || t.image || '',
                color: t.color || t.colour || t.tc || '#e10600',
                logo: true,
                rows: (t.drivers || []).map(n => {
                    const d = Object.values(driversData).find(x => x.name === n);
                    return [n, d && d.stats && d.stats.Nomor ? d.stats.Nomor : ''];
                }),
                linkText: 'Lihat semua tim',
                go: () => showPage('teams-page')
            };
        }),
        circuits: circuitsData.map((c, i) => ({
            title: c.name,
            desc: `${c.gp}, ${c.city}. ${c.desc}`,
            img: circuitImg(c),
            color: '#e10600',
            logo: false,
            rows: [['Panjang lintasan', c.length], ['Jumlah tikungan', c.turns], ['GP pertama', c.first]],
            linkText: 'Buka panduan sirkuit',
            go: () => openCircuit(i)
        }))
    };
    const unit = { teams: 'tim', circuits: 'sirkuit' };
    let mode = 'teams';

    /* teks & thumbnail untuk item ke-i (gambarnya ditangani carousel) */
    function showInfo(i) {
        const it = sets[mode][i];
        if (!it) return;
        wrap.style.setProperty('--tc', it.color);
        stage.dataset.name = it.title;
        stage.classList.toggle('is-logo', it.logo);
        stage.classList.toggle('is-track', !it.logo);
        title.textContent = it.title;
        desc.textContent = it.desc;
        rows.innerHTML = it.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
        link.textContent = it.linkText;
        link.onclick = e => { e.preventDefault(); it.go(); };
        track.querySelectorAll('.fs-thumb').forEach((el, k) => el.classList.toggle('active', k === i));
    }

    /* dipilih dari thumbnail: ganti teks, lalu putar carousel ke kartu itu */
    function selectItem(i) {
        showInfo(i);
        carousel.goTo(i);
    }

    // Carousel kedalaman (depth-carousel.js). Kalau digeser / diklik, teks ikut berganti.
    const carousel = DepthCarousel(document.getElementById('fs-depth'), { onChange: i => showInfo(i) });
    const DC_LOOK = {
        teams:    { cardWidth: 210, cardHeight: 210, radius: '50%', tilt: 0,  spread: 84, depth: 190, visibleCards: 4 },
        circuits: { cardWidth: 270, cardHeight: 270, radius: 18,    tilt: 14, spread: 64, depth: 200, visibleCards: 3 }
    };

    function setMode(m) {
        mode = m;
        wrap.dataset.mode = m;
        document.querySelectorAll('.fs-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
        track.innerHTML = sets[m].map((it, k) => `
            <button type="button" class="fs-thumb" data-i="${k}" style="--tc:${it.color}">
                <span class="fs-thumb-pic ${it.logo ? 'is-logo' : ''}">${it.img ? `<img src="${it.img}" alt="" loading="lazy" draggable="false">` : ''}</span>
                <span class="fs-thumb-name">${esc(it.title)}</span>
            </button>`).join('');
        track.scrollLeft = 0;
        carousel.configure(DC_LOOK[m]);
        carousel.setItems(sets[m].map(it => ({ image: it.img, alt: it.title, label: it.title })), 0);
        showInfo(0);
        updateArrows();
    }

    function updateArrows() {
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }

    document.querySelectorAll('.fs-tab').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    [prev, next].forEach(b => b.addEventListener('click', () => {
        track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.8, behavior: 'smooth' });
    }));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    track.addEventListener('click', e => {
        const t = e.target.closest('.fs-thumb');
        if (t && !window.__fsDrag) selectItem(Number(t.dataset.i));
    });

    // Drag dengan mouse (di HP cukup geser dengan jari)
    let down = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse') return;
        down = true; startX = e.clientX; startLeft = track.scrollLeft; window.__fsDrag = false;
    });
    window.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) { window.__fsDrag = true; track.classList.add('is-dragging'); }
        if (window.__fsDrag) track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
        if (!down) return;
        down = false; track.classList.remove('is-dragging');
        setTimeout(() => { window.__fsDrag = false; }, 0);
    });

    setMode('teams');
}

// Jalankan otomatis pertama kali halaman di-load
document.addEventListener("DOMContentLoaded", () => {
    initHomeHero();
    renderHomeStats();
    renderGrid();
    renderCircuits();
    renderHomeCarousels();
});

// Halaman detail mengisi namanya setelah showPage(), jadi judul tab diperbarui lagi sesudahnya
['openDetail', 'openCircuit'].forEach(fn => {
    const orig = window[fn];
    if (typeof orig === 'function') window[fn] = function () { const r = orig.apply(this, arguments); updateTitle(); return r; };
});