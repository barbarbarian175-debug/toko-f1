/* =========================================================
   HALAMAN PROFIL PEMILIK
   Alur: tombol profil -> FOLDER (klik untuk membuka) -> 3 kertas,
   tiap kertas membuka satu halaman:
     01 Tentang saya  |  02 Hal yang saya suka  |  03 Skill & eksplorasi
   Edit nama, bio, skill, dan ketertarikan di data PROFILE.
   ========================================================= */
(function () {
    const root = document.getElementById('profile-page');
    if (!root) return;

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- DATA PROFIL ---------- */
    const PROFILE = {
        name: 'Ikbar Putra Maulana',
        role: 'Mahasiswa Sistem Informasi',
        semester: 'Semester 5',
        intro: 'Mahasiswa Sistem Informasi yang senang merangkai ide menjadi sesuatu yang bisa dibuka, dicoba, dan terus diperbaiki.',
        aboutTitle: 'Belajar lewat hal yang disukai.',
        about: [
            'Saya sedang menempuh semester lima di program studi Sistem Informasi. Ketertarikan saya ada di persimpangan teknologi, desain antarmuka, dan cara sebuah produk digital membantu orang menyelesaikan sesuatu.',
            'Di luar kuliah, saya suka belajar coding dengan membuat proyek kecil dan mengikuti dunia Formula 1. Website ini menjadi ruang latihan untuk menggabungkan keduanya: mencoba hal baru di web sambil berbagi cerita tentang olahraga yang saya ikuti.'
        ],
        instagram: 'https://www.instagram.com/ikbarrputra/',
        instagramLogo: 'assets/images/ext/logo-ig-png-instagram-logo-camel-productions-website-25.png',
        skills: [
            { name: 'HTML & CSS', note: 'Struktur dan tampilan web', value: 72 },
            { name: 'JavaScript', note: 'Interaksi halaman', value: 58 },
            { name: 'Desain UI', note: 'Layout dan visual', value: 64 },
            { name: 'Editing video', note: 'Eksplorasi kreatif', value: 46 }
        ],
        interests: [
            { image: 'assets/images/ext/Python-Emblem.png', alt: 'Logo Python', name: 'Ngoding', note: 'Membuat proyek kecil' },
            { image: 'assets/images/logo-f1.png', alt: 'Logo F1', name: 'Formula 1', note: 'Balapan dan teknologi' },
            { icon: 'assets/images/ext/Untitled-6-1920x1280.jpg', name: 'UI/UX', note: 'Visual dan antarmuka' },
            { image: 'assets/images/ext/spotify-logo-transparent-free-png.png', alt: 'Logo Spotify', name: 'Spotify', note: 'Dengar playlist saya', href: 'https://open.spotify.com/user/315g5ihbzywutde7ggv4ktlqhjee?si=602605ffafa844f1' }
        ]
    };

    /* ---------- 3 HALAMAN DI DALAM FOLDER ---------- */
    const VIEWS = {
        about:     { num: '01', title: 'Tentang saya' },
        interests: { num: '02', title: 'Hal yang saya suka' },
        skills:    { num: '03', title: 'Skill &amp; eksplorasi' }
    };
    // Urutan kertas di DOM = paper-1, paper-2, paper-3.
    // Saat folder terbuka, posisinya dari kiri ke kanan: paper-1, paper-3, paper-2.
    // Jadi kiri = 01, tengah = 02, kanan = 03.
    const PAPERS = ['about', 'skills', 'interests'];

    let previousPage = 'home-page';

    /* ---------- RENDER ---------- */
    const STATS = [
        { value: parseInt(String(PROFILE.semester).replace(/\D/g, ''), 10) || 0, label: 'Semester' },
        { value: PROFILE.skills.length, label: 'Skill dipelajari' },
        { value: PROFILE.interests.length, label: 'Hal yang disuka' }
    ];

    root.innerHTML = `
        <main class="pf-shell" data-view="hub">

            <!-- FOLDER (halaman awal profil) -->
            <section class="pf-view pf-hub" data-view="hub" aria-labelledby="pf-hub-title">
                <div class="pf-hub-card">
                    <span class="pf-hub-kicker">Profil</span>
                    <h1 id="pf-hub-title">${PROFILE.name}</h1>
                    <p class="pf-hub-sub">${PROFILE.role} &middot; ${PROFILE.semester}</p>

                    <div class="pf-folder-stage">
                        <div class="pff-folder">
                            <div class="pff-back">
                                ${PAPERS.map((key, i) => `
                                <button type="button" class="pff-paper pff-paper-${i + 1}" data-view="${key}" tabindex="-1" aria-label="Buka halaman ${VIEWS[key].title}">
                                    <span class="pff-paper-title">${VIEWS[key].title}</span>
                                </button>`).join('')}
                                <div class="pff-front"></div>
                                <div class="pff-front pff-right"></div>
                                <button type="button" class="pff-toggle" aria-expanded="false" aria-label="Buka folder profil"></button>
                            </div>
                        </div>
                    </div>

                    <p class="pf-hub-hint" id="pf-hub-hint" aria-live="polite">Klik folder untuk membuka</p>
                    <button class="pf-button pf-button-ghost" type="button" onclick="closeProfilePage()">Kembali</button>
                </div>
            </section>

            <!-- HALAMAN 01: TENTANG SAYA -->
            <div class="pf-view" data-view="about" hidden>
                <section class="pf-hero" aria-labelledby="pf-name">
                    <div class="pf-hero-copy">
                        <h1 id="pf-name">${PROFILE.name}</h1>
                        <p class="pf-role">${PROFILE.role}</p>
                        <p class="pf-intro">${PROFILE.intro}</p>
                        <div class="pf-stat-row">
                            ${STATS.map(st => `<div class="pf-stat"><b data-count="${st.value}">${st.value}</b><span>${st.label}</span></div>`).join('')}
                        </div>
                        <div class="pf-actions">
                            <a class="pf-button pf-button-icon" href="${PROFILE.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><img class="pf-instagram-icon" src="${PROFILE.instagramLogo}" alt=""></a>
                            <button class="pf-button pf-button-ghost" type="button" data-go="hub">Kembali</button>
                        </div>
                    </div>
                    <figure class="pf-portrait">
                        <div class="pf-lattice">
                            <img src="assets/images/la.jpeg" alt="Foto profil Ikbar Putra Maulana" onerror="this.hidden=true; this.closest('.pf-portrait').classList.add('is-empty')">
                        </div>
                        <span class="pf-initial" aria-hidden="true">M</span>
                    </figure>
                </section>

                <section class="pf-about" aria-labelledby="pf-about-title">
                    <div class="pf-about-copy">
                        <h2 id="pf-about-title">${PROFILE.aboutTitle}</h2>
                        ${PROFILE.about.map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                    <aside class="pf-about-art" aria-label="Catatan profil">
                        <div class="pf-lattice pf-lattice-rev">
                            <img src="assets/images/coding.png" alt="Cuplikan proyek coding" onerror="if(!this.dataset.try){this.dataset.try='jpeg';this.src='coding.jpeg';}else if(this.dataset.try==='jpeg'){this.dataset.try='png';this.src='coding.png';}else{this.hidden=true;this.closest('.pf-about-art').classList.add('no-photo');}">
                        </div>
                        <strong class="pf-art-number" aria-hidden="true">05</strong>
                        <div class="pf-art-tag"><span>CURRENT CHAPTER</span><strong>Sistem Informasi · ${PROFILE.semester}</strong></div>
                    </aside>
                </section>
            </div>

            <!-- HALAMAN 02: HAL YANG SAYA SUKA -->
            <div class="pf-view" data-view="interests" hidden>
                <div class="pf-topbar">
                    <button class="pf-button pf-button-ghost" type="button" data-go="hub">&lsaquo; Folder</button>
                    <span class="pf-topbar-label">${VIEWS.interests.title}</span>
                </div>
                <section class="pf-interests" aria-labelledby="pf-interests-title">
                    <header class="pf-section-head">
                        <div><h2 id="pf-interests-title">Hal yang <em>saya suka</em></h2></div>
                        <p>Belajar paling seru kalau ada ruang untuk penasaran dan mencoba.</p>
                    </header>
                    <div class="pf-interest-grid">
                        ${PROFILE.interests.map((item, idx) => {
                            const tag = item.href ? 'a' : 'article';
                            const linkAttributes = item.href ? ` href="${item.href}" target="_blank" rel="noopener"` : '';
                            const iconIsImage = Boolean(item.image) || /^https?:\/\//i.test(item.icon || '');
                            const iconSource = item.image || (iconIsImage ? item.icon : '');
                            const icon = iconIsImage
                                ? `<img class="${item.image ? 'pf-interest-logo' : 'pf-interest-photo'}" src="${iconSource}" alt="" aria-hidden="true">`
                                : item.icon;
                            return `
                            <${tag} class="pf-interest${item.href ? ' pf-interest-link' : ''}"${linkAttributes}>
                                <span class="pf-interest-num" aria-hidden="true">${String(idx + 1).padStart(2, '0')}</span>
                                <h3>${item.name}</h3>
                                <p>${item.note}</p>
                                <span class="pf-interest-icon" aria-hidden="true">${icon}</span>
                                <span class="pf-interest-go" aria-hidden="true">${item.href ? 'Click Sini' : ''}</span>
                            </${tag}>`;
                        }).join('')}
                    </div>
                </section>
            </div>

            <!-- HALAMAN 03: SKILL & EKSPLORASI -->
            <div class="pf-view" data-view="skills" hidden>
                <div class="pf-topbar">
                    <button class="pf-button pf-button-ghost" type="button" data-go="hub">&lsaquo; Folder</button>
                    <span class="pf-topbar-label">${VIEWS.skills.title}</span>
                </div>
                <section class="pf-skills" aria-labelledby="pf-skills-title">
                    <header class="pf-section-head">
                        <div><span class="pf-kicker">03 / Sedang dipelajari</span><h2 id="pf-skills-title">Skill & eksplorasi</h2></div>
                    </header>
                    <div class="pf-skill-list">
                        ${PROFILE.skills.map((skill, index) => `
                            <div class="pf-skill" style="--skill-level:${skill.value}%">
                                <div class="pf-skill-meta"><span class="pf-skill-number">0${index + 1}</span><div><h3>${skill.name}</h3><p>${skill.note}</p></div><span class="pf-skill-value">${skill.value}%</span></div>
                                <div class="pf-skill-track" role="meter" aria-label="${skill.name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${skill.value}"><i></i></div>
                            </div>`).join('')}
                    </div>
                </section>
            </div>

            <footer class="pf-footer"><span>IKBAR PUTRA MAULANA</span><span></span></footer>
        </main>`;

    window.openProfilePage = function () {
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id !== 'profile-page') previousPage = activePage.id;
        window.showPage('profile-page');
    };

    window.closeProfilePage = function () {
        window.showPage(previousPage || 'home-page');
    };

    PAGE_THEMES['profile-page'] = 'theme-profile';

    /* ---------- FOLDER & PINDAH HALAMAN ---------- */
    const shell = root.querySelector('.pf-shell');
    const views = [...root.querySelectorAll('.pf-view')];
    const folder = root.querySelector('.pff-folder');
    const toggle = root.querySelector('.pff-toggle');
    const hint = root.querySelector('#pf-hub-hint');
    const papers = [...root.querySelectorAll('.pff-paper')];
    const skillsSection = root.querySelector('.pf-skills');

    if (!REDUCE) root.classList.add('pf-animate');

    function setFolder(open) {
        folder.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Tutup folder profil' : 'Buka folder profil');
        papers.forEach(p => { p.tabIndex = open ? 0 : -1; });
        hint.textContent = open ? 'Pilih salah satu halaman' : 'Klik folder untuk membuka';
    }

    // Memunculkan isi halaman dengan efek pelan (diulang tiap halaman dibuka)
    function reveal(view) {
        if (REDUCE) return;
        const sections = view.querySelectorAll('.pf-hero, .pf-about, .pf-interests, .pf-skills');
        sections.forEach(s => s.classList.remove('is-visible'));
        void view.offsetWidth;
        requestAnimationFrame(() => sections.forEach(s => s.classList.add('is-visible')));
    }

    function runSkillCount() {
        skillsSection.classList.remove('is-counting');
        void skillsSection.offsetWidth;
        skillsSection.classList.add('is-counting');
        const DURATION = 1400;
        const items = [...skillsSection.querySelectorAll('.pf-skill-value')].map((el, i) => ({
            el,
            target: PROFILE.skills[i].value
        }));
        items.forEach(({ el }) => { el.textContent = '0%'; });
        const start = performance.now();
        function tick(now) {
            const t = Math.min((now - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            items.forEach(({ el, target }) => { el.textContent = Math.round(target * eased) + '%'; });
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function runStatCount() {
        const nums = [...root.querySelectorAll('.pf-stat b')];
        const DURATION = 1200;
        nums.forEach(el => { el.textContent = '0'; });
        const start = performance.now();
        function tick(now) {
            const t = Math.min((now - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            nums.forEach(el => { el.textContent = Math.round(Number(el.dataset.count) * eased); });
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function showView(name, silent) {
        const target = views.find(v => v.dataset.view === name) || views[0];
        views.forEach(v => { v.hidden = v !== target; });
        shell.dataset.view = target.dataset.view;

        if (target.dataset.view === 'hub') {
            setFolder(false);
        } else {
            reveal(target);
            if (target.dataset.view === 'about' && !REDUCE) runStatCount();
            if (target.dataset.view === 'skills') {
                if (REDUCE) skillsSection.classList.add('is-counting');
                else runSkillCount();
            }
        }
        if (!silent) window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' });
    }

    toggle.addEventListener('click', () => setFolder(!folder.classList.contains('open')));

    root.addEventListener('click', e => {
        const paper = e.target.closest('.pff-paper');
        if (paper && folder.classList.contains('open')) { showView(paper.dataset.view); return; }
        const go = e.target.closest('[data-go]');
        if (go) showView(go.dataset.go);
    });

    // Esc = kembali ke folder
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && root.classList.contains('active') && shell.dataset.view !== 'hub') showView('hub');
    });

    // Setiap profil dibuka (dari tombol mana pun) selalu mulai dari folder yang tertutup
    let wasActive = root.classList.contains('active');
    new MutationObserver(() => {
        const isActive = root.classList.contains('active');
        if (isActive && !wasActive) showView('hub', true);
        wasActive = isActive;
    }).observe(root, { attributes: true, attributeFilter: ['class'] });

    showView('hub', true);
})();