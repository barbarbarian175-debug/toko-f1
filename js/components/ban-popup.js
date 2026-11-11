/* =========================================================
   POPUP DETAIL BAN
   Klik kartu ban (di "Kenali mobilnya") -> muncul jendela apung.
   Edit isi penjelasan di objek TYRES di bawah (satu item = satu paragraf).
   ========================================================= */
(function () {
    const TYRES = {
        soft: {
            name: 'Soft', color: 'Merah', accent: '#ec7563',
            text: [
                'Soft adalah ban kering paling lunak yang dipakai di F1, ditandai garis merah di sisi ban. Karetnya yang lunak menempel kuat pada aspal, sehingga mobil punya grip besar di tikungan dan menghasilkan waktu lap paling cepat.',
                'Harganya adalah umur pakai yang pendek. Karena lunak, karetnya cepat aus dan setelah beberapa lap performanya turun tajam, sehingga pembalap harus segera masuk pit untuk mengganti ban. Di sisi lain, Soft cepat mencapai suhu kerja, jadi sangat enak dipakai untuk satu lap cepat.',
                'Itu sebabnya Soft paling sering dipakai di kualifikasi, saat start balapan, atau ketika tim ingin menyerang dengan stint pendek. Kalau dipakai di balapan, Soft juga sering membuat tim harus berhenti di pit lebih banyak.'
            ]
        },
        medium: {
            name: 'Medium', color: 'Kuning', accent: '#f4c352',
            text: [
                'Medium berada di tengah antara Soft dan Hard, ditandai garis kuning di sisi ban. Ban ini tidak secepat Soft, tetapi jauh lebih awet, sehingga cocok untuk berbagai kondisi lintasan.',
                'Karena sifatnya yang serba bisa, Medium sering menjadi pilihan utama di banyak balapan. Ban ini memberi tim ruang untuk menyusun strategi yang fleksibel tanpa harus terlalu sering masuk pit.',
                'Medium biasanya dipakai di stint tengah balapan, atau saat tim ingin ban yang aman tetapi tetap kompetitif. Banyak strategi kemenangan dibangun dengan mengombinasikan Medium bersama Hard atau Soft.'
            ]
        },
        hard: {
            name: 'Hard', color: 'Putih', accent: '#ecdfbf',
            text: [
                'Hard adalah ban kering paling keras, ditandai garis putih di sisi ban. Karetnya tahan lama sehingga bisa dipakai untuk banyak lap tanpa penurunan performa yang drastis.',
                'Kekurangannya, grip-nya lebih rendah sehingga waktu lap lebih lambat. Ban ini juga butuh waktu lebih lama untuk mencapai suhu kerja yang pas, terutama saat lintasan dingin.',
                'Hard dipakai untuk stint panjang, di sirkuit yang membuat ban cepat aus, atau pada strategi satu kali pit stop. Di lintasan yang abrasif, Hard sering menjadi kunci untuk menghemat waktu di pit.'
            ]
        },
        inter: {
            name: 'Intermediate', color: 'Hijau', accent: '#a9c67f',
            text: [
                'Intermediate ditandai garis hijau dan punya alur (tapak) yang dangkal. Ban ini dirancang untuk lintasan yang basah tetapi belum tergenang, misalnya saat gerimis atau ketika lintasan mulai mengering setelah hujan.',
                'Alurnya mampu membuang air sambil tetap menjaga grip di aspal yang lembap. Namun kalau lintasan sudah kering, ban ini cepat rusak karena terlalu panas, dan kalau hujan terlalu deras, kemampuannya membuang air tidak cukup.',
                'Memutuskan kapan pindah ke Intermediate, atau kembali ke ban kering, sering menjadi keputusan yang menentukan hasil balapan.'
            ]
        },
        wet: {
            name: 'Full Wet', color: 'Biru', accent: '#8fbbe3',
            text: [
                'Full Wet ditandai garis biru dan memiliki alur paling dalam di antara semua ban. Alur itu membuang air dalam jumlah besar dari bawah ban supaya mobil tidak melayang di atas genangan air, yang disebut aquaplaning.',
                'Ban ini paling mampu menjaga kendali saat hujan lebat, tetapi jauh lebih lambat dibanding ban lain dan cepat rusak kalau lintasan tidak cukup basah.',
                'Full Wet dipakai saat hujan deras dan ada genangan air di lintasan. Kalau kondisinya terlalu berbahaya, balapan bisa dimulai di belakang safety car atau ditunda sampai jarak pandang cukup aman.'
            ]
        }
    };

    /* ---------- CSS (disuntik otomatis) ---------- */
    const css = `
.nb-tyre { cursor: pointer; transition: transform .2s ease; }
.nb-tyre:hover, .nb-tyre:focus-visible { transform: translateY(-4px) rotate(-.6deg); }
.nb-tyre:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

.tp-back {
    position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 22px;
    background: rgba(10, 12, 20, .72);
    opacity: 0; visibility: hidden; transition: opacity .2s ease, visibility .2s ease;
}
.tp-back.open { opacity: 1; visibility: visible; }

/* kartu = warna yang sama dengan kartu ban, border tebal + bayangan keras seperti kartu di halaman */
.tp-card {
    --ac: #ec7563;
    position: relative; width: min(540px, 100%); max-height: 90vh; overflow-y: auto;
    padding: 24px 22px 22px; background: var(--ac); color: #1a2233;
    border: 3px solid #1a2233; border-radius: 20px; box-shadow: 9px 9px 0 #1a2233;
    font-family: 'Fredoka', var(--f-body, sans-serif);
    transform: translateY(30px) rotate(1.5deg); transition: transform .35s cubic-bezier(.3, 1.4, .5, 1);
}
.tp-back.open .tp-card { transform: rotate(-.8deg); }

.tp-close {
    position: absolute; top: 12px; right: 12px; z-index: 2; width: 34px; height: 34px; border-radius: 10px; cursor: pointer;
    border: 3px solid #1a2233; background: #fff; color: #1a2233; font: 700 .95rem/1 sans-serif; box-shadow: 2px 2px 0 #1a2233;
}
.tp-close:hover { background: #1a2233; color: #fff; }
.tp-close:active { transform: translate(2px, 2px); box-shadow: none; }

.tp-top { display: flex; align-items: center; gap: 18px; padding-right: 40px; }
.tp-media { flex: 0 0 auto; width: 150px; padding: 6px; background: #fff; border: 3px solid #1a2233; border-radius: 14px; transform: rotate(-3deg); }
.tp-media img { display: block; width: 100%; height: 108px; object-fit: contain; }   /* contain = gambar utuh */
.tp-name { margin: 0; font: 800 clamp(1.9rem, 6vw, 2.5rem)/1 var(--f-head, sans-serif); text-transform: uppercase; letter-spacing: .03em; }
.tp-badge {
    display: inline-block; margin-top: 8px; padding: 3px 14px; border-radius: 999px; background: #1a2233; color: #fff;
    font: 700 .72rem var(--f-head, sans-serif); letter-spacing: .14em; text-transform: uppercase;
}

/* penjelasan di atas "kertas" terang supaya teks gelapnya nyaman dibaca */
.tp-body { margin-top: 20px; padding: 18px 20px; background: #fffaf0; border: 3px solid #1a2233; border-radius: 14px; }
.tp-body p { margin: 0; font-size: 1rem; line-height: 1.7; color: #1a2233; }
.tp-body p + p { margin-top: 12px; }

@media (max-width: 480px) {
    .tp-card { padding: 20px 16px 18px; }
    .tp-top { flex-direction: column; align-items: flex-start; padding-right: 0; }
    .tp-media { width: 130px; }
    .tp-media img { height: 94px; }
    .tp-close { top: 10px; right: 10px; }
    .tp-body { padding: 16px; }
}
@media (prefers-reduced-motion: reduce) { .tp-back, .tp-card, .nb-tyre { transition: none; } }
`;
    const st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    /* ---------- Elemen popup ---------- */
    const back = document.createElement('div');
    back.className = 'tp-back';
    back.setAttribute('role', 'dialog');
    back.setAttribute('aria-modal', 'true');
    back.setAttribute('aria-label', 'Detail ban');
    back.innerHTML = '<div class="tp-card"><button type="button" class="tp-close" aria-label="Tutup">✕</button><div class="tp-content"></div></div>';
    document.body.appendChild(back);

    const card = back.querySelector('.tp-card');
    const content = back.querySelector('.tp-content');
    const closeBtn = back.querySelector('.tp-close');
    let lastFocus = null;

    const keyOf = el => Object.keys(TYRES).find(k => el.classList.contains(k));

    function open(el) {
        const k = keyOf(el);
        if (!k) return;
        const t = TYRES[k];
        const img = el.querySelector('img');
        card.style.setProperty('--ac', t.accent);
        content.innerHTML = `
            <div class="tp-top">
                <div class="tp-media"><img src="${img ? img.src : ''}" alt="${img ? img.alt : ''}"></div>
                <div><h3 class="tp-name">${t.name}</h3><span class="tp-badge">${t.color}</span></div>
            </div>
            <div class="tp-body">${t.text.map(p => `<p>${p}</p>`).join('')}</div>`;
        lastFocus = document.activeElement;
        back.classList.add('open');
        card.scrollTop = 0;
        closeBtn.focus();
    }

    function close() {
        back.classList.remove('open');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    /* ---------- Event ---------- */
    document.addEventListener('click', e => {
        const el = e.target.closest('.nb-tyre');
        if (el && !back.contains(e.target)) open(el);
    });
    document.addEventListener('keydown', e => {
        if (back.classList.contains('open')) {
            if (e.key === 'Escape') close();
            return;
        }
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('nb-tyre')) {
            e.preventDefault();
            open(e.target);
        }
    });
    back.addEventListener('click', e => { if (e.target === back) close(); });
    closeBtn.addEventListener('click', close);

    /* biar kartu bisa difokus lewat keyboard */
    document.querySelectorAll('.nb-tyre').forEach(el => {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        const h = el.querySelector('h3');
        el.setAttribute('aria-label', 'Lihat detail ban ' + (h ? h.textContent : ''));
    });
})();