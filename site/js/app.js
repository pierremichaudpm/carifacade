/* ============================================================
   CARI FAÇADE INTERACTIVE — Horizontal Sidewalk Engine
   ============================================================ */

(function () {
  'use strict';

  // --- DOM refs ---
  const track = document.getElementById('track');
  const panels = Array.from(track.querySelectorAll('.panel'));
  const progressFill = document.getElementById('progressFill');
  const progressLabels = document.getElementById('progressLabels');
  const scrollHint = document.getElementById('scrollHint');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const weaveCanvas = document.getElementById('weaveCanvas');
  const ctx = weaveCanvas.getContext('2d');

  // --- State ---
  let currentX = 0;
  let targetX = 0;
  let maxScroll = 0;
  let isScrolling = false;
  let rafId = null;
  let hintHidden = false;

  // --- Modal data (artists + components + concept) ---
  const modalData = {
    // Composantes Concept
    fenetres: {
      name: 'Fenêtres animées',
      origin: '',
      desc: '<h3>Objectifs</h3><ul><li>Contribuer à l\'animation et à la mise en valeur du trottoir et de la façade du CARI St‑Laurent, en créant un point d\'intérêt visuel dynamique qui améliore la lisibilité du lieu dans l\'espace public.</li><li>Améliorer l\'expérience des usagers et des passants en offrant une interface accueillante, lisible et interactive, qui favorise le sentiment de bienvenue et l\'appropriation positive du site.</li><li>Disposer d\'un outil de communication flexible permettant de diffuser des informations sur les services, ainsi que des contenus liés aux événements et campagnes du CARI, de manière visible et actualisable en continu.</li><li>Assurer une exploitation pérenne et maîtrisée.</li></ul><h3>Avantages</h3><ul><li>Contenus visibles de jour et de nuit — Visibilité 24/7 même lorsque le centre est fermé</li><li>Équipement technique à l\'intérieur à l\'abri des intempéries</li><li>Laisse la lumière naturelle passer à 85\u00A0% durant le jour</li><li>Découpe sur mesure selon les dimensions exactes des fenêtres</li><li>Déclenchement interactif au passage des passants et des clients sur le trottoir</li><li>Adaptabilité du temps de diffusion et du contenu selon les besoins du CARI St-Laurent (événement, saison, etc.)</li><li>Faible consommation énergétique et respectueux de l\'environnement</li></ul>',
      images: []
    },
    carillon: {
      name: 'Carillon de trottoir',
      origin: '',
      desc: '<h3>Objectifs</h3><ul><li>Contribuer à l\'animation et à la mise en valeur du trottoir devant le CARI en créant un point d\'intérêt visuel et sonore qui incite les passants à s\'arrêter et à fréquenter le site.</li><li>Favoriser les échanges informels, le sentiment de convivialité et l\'appropriation positive de l\'espace public par les usagers du CARI et les résidents du quartier, grâce à une expérience partagée simple et accessible.</li><li>Renforcer la présence de l\'art dans l\'espace public comme vecteur de qualité de vie, de cohésion communautaire et de fierté locale.</li></ul><h3>Avantages</h3><ul><li>Complète les fenêtres animées et transforme le trottoir en véritable lieu culturel : on commence à « vivre » le CARI dès l\'extérieur.</li><li>Conçu avec un artiste, le carillon devient une signature esthétique forte, immédiatement associée au CARI.</li><li>Son animation douce donne l\'impression d\'un espace public plus habité, convivial et rassurant, notamment pour les familles et les personnes nouvellement arrivées.</li><li>Dispositif léger et peu intrusif, il améliore l\'ambiance sans nuire à la circulation ni au voisinage.</li></ul>',
      images: []
    },
    // Fenêtres du Québec
    lieux: {
      name: 'Fenêtre — Lieux de vie',
      origin: '',
      desc: 'Cette fenêtre présente des paysages urbains et ruraux du Québec, pour montrer la diversité des milieux où l\'on peut vivre, travailler et s\'ancrer. Elle invite chacun à se projeter dans ces lieux et à imaginer son propre quotidien ici.<br><br><em>Image de Eunki Kim : la façade enneigée</em>',
      images: ['assets/images/Fenetres/Eunki%20Kim_pic2.jpg']
    },
    nature: {
      name: 'Fenêtre — La nature et les saisons',
      origin: '',
      desc: 'Cette fenêtre ouvre sur la nature québécoise : fleuve, lacs, forêts, faune et flore. Elle rappelle le lien fort entre la population et le territoire, et propose d\'entrer dans la société québécoise par l\'émerveillement et le respect de l\'environnement.<br><br><em>Image dans le style de Khosro Berahmandi (générée par l\'IA)</em>',
      images: ['assets/images/Fenetres/Pilar_Marcias_Pic1.jpg']
    },
    habitants: {
      name: 'Fenêtre — Les habitants et les langues',
      origin: '',
      desc: 'Cette fenêtre met en scène la diversité des cultures qui composent le Québec, avec des images de personnes et le mot « Bienvenue » en plusieurs langues. Elle montre que la société québécoise se construit avec toutes et tous, d\'ici et d\'ailleurs.',
      images: ['assets/images/Fenetres/marwan%20sekkat_pic1.png']
    },
    services: {
      name: 'Fenêtre — Le CARI St‑Laurent',
      origin: 'Services et événements',
      desc: 'Cette fenêtre présente les services, ressources et informations du CARI St‑Laurent. Elle fait le lien entre les images du Québec et un lieu concret d\'accueil et d\'accompagnement, une porte d\'entrée directe pour participer à la vie de la société.',
      images: ['assets/images/Fenetres/img_info2.png']
    },
    // Artists
    pilar: {
      name: 'Pilar Macias',
      origin: 'Mexique',
      desc: 'Pilar Macias est une artiste en arts visuels originaire du Mexique, immigrée au Québec, qui travaille principalement à partir de la photographie comme matière. Elle découpe, coud et assemble des images pour les décontextualiser, créer de nouvelles formes et explorer les liens entre lieux, corps et souvenirs. Dans ses projets récents, elle dépasse le simple support photographique pour utiliser aussi l\'aluminium (durable) et les feuilles d\'arbres (fragiles), jouant sur la tension entre ancrage et vulnérabilité.<br><br>Dans ses œuvres, les images sont fragmentées puis recomposées en nouvelles formes – cartographies sensibles, silhouettes, trames – qui évoquent les déplacements, les passages et les points d\'ancrage d\'une vie entre plusieurs lieux. Elle utilise parfois des matériaux durables (comme le métal ou l\'aluminium) en dialogue avec des éléments fragiles ou organiques, créant une tension entre solidité et vulnérabilité, permanence et effacement.<br><br>Son univers visuel est habité par des notions de mémoire, de traces et de couches : chaque pièce ressemble à un palimpseste où s\'inscrivent à la fois le souvenir du pays d\'origine, la découverte d\'un nouveau territoire et le vécu du quotidien. En choisissant de vivre hors des grandes villes, Pilar Macias accorde une place centrale au paysage, à la lumière et aux rythmes de la nature, qui deviennent des partenaires de création autant que des sujets.<br><br>Sa démarche peut se lire comme une exploration poétique de la manière dont on habite un lieu : comment les expériences, les voyages et les déplacements laissent des marques, comment elles se déposent en nous et dans le paysage. En reconfigurant les images, elle propose au regardeur de revisiter ses propres souvenirs et de reconnaître, dans ces assemblages, la complexité et la beauté des identités en mouvement.',
      video: 'https://player.vimeo.com/video/304261038',
      images: [
        'assets/images/artistes/pilar/Pilar_Marcias_Pic1.jpg',
        'assets/images/artistes/pilar/Pilar_Marcias_Pic3.jpg',
        'assets/images/artistes/pilar/Pilar_Marcias_Pic4.jpg',
      ]
    },
    eunki: {
      name: 'Eunki Kim',
      origin: 'Corée du Sud',
      desc: 'Eunki Kim est une artiste visuelle et illustratrice originaire de Corée du Sud, installée à Montréal, dont le travail est profondément marqué par les thèmes du déplacement, de l\'identité et du quotidien rêvé. Elle développe un univers graphique narratif où l\'on rencontre souvent des personnages en transition, en marche, en observation, en flottement, pris entre intériorité et monde extérieur.<br><br>Son art se caractérise par une ligne sensible et une palette qui donne à ses images une atmosphère à la fois délicate et accessible. Les compositions mêlent éléments urbains, fragments de nature et détails de la vie de tous les jours (objets, gestes, postures), comme pour montrer comment les personnes habitent les lieux et comment les lieux, en retour, façonnent les personnes.<br><br>Sur le plan thématique, Eunki Kim s\'intéresse aux émotions fines : la solitude, la curiosité, la nostalgie, mais aussi la tendresse et le réconfort que l\'on trouve dans de petites scènes ordinaires. Ses images fonctionnent souvent comme de petites histoires silencieuses, ouvertes à l\'interprétation, où chacun peut projeter sa propre expérience de déplacement, d\'adaptation ou de recherche de repères.<br><br>Sa mission artistique peut se lire comme la volonté de créer des espaces visuels d\'empathie : des images qui donnent à voir la vulnérabilité sans la dramatiser, qui rendent visibles des états intérieurs souvent invisibles et qui invitent le public à reconnaître sa propre sensibilité dans celle des autres. En combinant douceur formelle et profondeur émotionnelle, Eunki Kim cherche à offrir un langage visuel simple en apparence, mais chargé de nuances, où les frontières entre ici et ailleurs, entre rêve et réalité, deviennent des zones de rencontre plutôt que de séparation.',
      images: [
        'assets/images/artistes/eunki/Eunki_Kim_pic1.jpg',
        'assets/images/artistes/eunki/Eunki_Kim_pic2.jpg',
        'assets/images/artistes/eunki/Eunki_Kim_pic3.jpg',
        'assets/images/artistes/eunki/euniki%20KIm%205.jpg',
      ]
    },
    marwan: {
      name: 'Marwan Sekkat',
      origin: 'Maroc',
      desc: 'Marwan Sekkat est un artiste interdisciplinaire franco-marocain résidant au Québec. La simulation, le vivant, le détournement, l\'erreur et l\'absurde sont au cœur de ses préoccupations.<br><br>Ses œuvres prennent souvent la forme d\'installations spatiales où se mêlent projections, dispositifs automatisés, glitch, VJing, réalité virtuelle et éléments matériels, afin de créer des environnements immersifs qui rejouent ou « simulent » des fragments de réel. En parallèle, il intègre des techniques issues de l\'artisanat – ébénisterie, travail textile, botanique, broderie marocaine – pour dissimuler ou hybrider le numérique, comme si les circuits, les algorithmes et les pixels se matérialisaient dans des objets sensibles et faits main.<br><br>Une part importante de sa recherche porte sur la transmission et la mémoire : il met en scène et fige dans le temps des souvenirs, des gestes et des motifs liés à son histoire familiale et à ses identités culturelles multiples. Son travail interroge ainsi les relations entre mémoire individuelle et mémoire collective, entre héritage colonial (France-Maroc) et nouvelles expériences vécues au Québec, dans une perspective clairement décoloniale.<br><br>En développant une grammaire visuelle et matérielle qui combine expérimentation technologique et sensibilité artisanale, Marwan Sekkat cherche à offrir au public des moments de pause et de déplacement du regard, où l\'on peut ressentir autrement le temps, la nature, les objets et les récits qui nous entourent. Son œuvre invite à habiter l\'entre-deux : entre réel et simulacre, tradition et innovation, intime et politique.',
      video: 'https://www.youtube.com/embed/La8zsz3Zi8U',
      images: [
        'assets/images/artistes/marwan/marwan_sekkat_pic1.png',
        'assets/images/artistes/marwan/marwan_sekkat_pic2.png',
        'assets/images/artistes/marwan/marwan_sekkat_pic3.png',
      ]
    },
    khosro: {
      name: 'Khosro Berahmandi',
      origin: 'Iran',
      desc: 'Khosro Berahmandi est un artiste multidisciplinaire d\'origine iranienne, installé à Montréal depuis les années 1980, dont l\'œuvre déploie un univers foisonnant, proche d\'une mythologie personnelle.<br><br>Son travail s\'inspire de l\'iconographie des miniatures iraniennes et indo-iraniennes, qu\'il transpose dans une écriture résolument contemporaine. Ses tableaux et dessins sont peuplés de figures hybrides, anthropomorphes et organiques, rassemblées en un véritable « bestiary » semi-figuratif où humains, animaux et formes végétales semblent cohabiter dans un même cosmos. Les compositions sont denses, labyrinthiques, construites par couches de motifs, de lignes et de couleurs qui invitent le regard à se perdre dans le détail.<br><br>Son art explore une cosmologie intime : un monde intérieur où se mêlent mémoire, exil, spiritualité et quête de l\'invisible. L\'artiste travaille beaucoup sur la tension entre ombre et lumière, notamment par une recherche autour du noir et des strates cachées de la couleur pour faire émerger des formes de vie « invisibles » qui germent dans l\'obscurité. Chaque œuvre fonctionne comme une carte secrète, une cartographie cachée où se tissent des « fils éternels » entre différents temps, lieux et êtres.<br><br>Au fil de plus de cinquante expositions au Canada, en Europe et aux États-Unis, Khosro Berahmandi a développé une pratique où le geste minutieux, la répétition du motif et la richesse symbolique créent une expérience quasi méditative pour le regardeur. Son parcours en exil, son engagement de longue date au sein du Festival Accès Asie et sa reconnaissance (notamment le Prix Charles-Biddle en 2022) situent son travail au croisement de la création visuelle, du dialogue interculturel et de la transmission.',
      video: 'https://www.facebook.com/plugins/video.php?height=560&href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D770795905605889&show_text=false&width=314',
      videoReel: true,
      images: [
        'assets/images/artistes/khosro/Khosro_Berah_Pic1.jpg',
        'assets/images/artistes/khosro/Khosro_Berah_Pic2.jpg',
        'assets/images/artistes/khosro/Khosro_Berah_Pic3.jpg',
      ]
    }
  };

  // Keep backward compat reference
  const artistData = modalData;

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    calcMaxScroll();
    buildProgressLabels();
    resizeCanvas();
    bindEvents();
    animate();
  }

  function calcMaxScroll() {
    maxScroll = track.scrollWidth - window.innerWidth;
  }

  // ============================================================
  // PROGRESS LABELS
  // ============================================================
  function buildProgressLabels() {
    progressLabels.innerHTML = '';
    panels.forEach((p, i) => {
      const label = document.createElement('span');
      label.className = 'sidewalk-progress__label';
      label.textContent = p.dataset.label || '';
      label.addEventListener('click', () => scrollToPanel(i));
      progressLabels.appendChild(label);
    });
  }

  function scrollToPanel(index) {
    let x = 0;
    for (let i = 0; i < index; i++) {
      x += panels[i].offsetWidth;
    }
    targetX = Math.min(x, maxScroll);
  }

  // ============================================================
  // SCROLL HANDLING
  // ============================================================
  function onWheel(e) {
    if (modalOverlay.classList.contains('is-open')) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    targetX = Math.max(0, Math.min(targetX + delta * 1.2, maxScroll));

    if (!hintHidden && targetX > 50) {
      hintHidden = true;
      scrollHint.classList.add('is-hidden');
    }
  }

  // Touch support
  let touchStartX = 0;
  let touchStartY = 0;
  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    const dx = touchStartX - e.touches[0].clientX;
    const dy = touchStartY - e.touches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      targetX = Math.max(0, Math.min(targetX + dx * 2, maxScroll));
      touchStartX = e.touches[0].clientX;
    }
  }

  // Keyboard
  function onKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      targetX = Math.min(targetX + window.innerWidth * 0.3, maxScroll);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      targetX = Math.max(targetX - window.innerWidth * 0.3, 0);
    }
  }

  // ============================================================
  // ANIMATION LOOP
  // ============================================================
  function animate() {
    // Buttery smooth lerp — ease harder, overshoot slightly
    const diff = targetX - currentX;
    currentX += diff * 0.08;

    // Snap if very close
    if (Math.abs(diff) < 0.3) currentX = targetX;

    track.style.transform = `translate3d(${-currentX}px, 0, 0)`;

    // Update progress bar
    const progress = maxScroll > 0 ? (currentX / maxScroll) * 100 : 0;
    progressFill.style.width = progress + '%';

    // Update active label
    updateActiveLabel();

    // Toggle logo color based on current section background
    updateLogoMode();

    // Reveal elements
    revealElements();

    // Draw weave threads
    drawWeave();

    rafId = requestAnimationFrame(animate);
  }

  function updateActiveLabel() {
    const labels = progressLabels.querySelectorAll('.sidewalk-progress__label');
    let cumX = 0;
    panels.forEach((p, i) => {
      const panelCenter = cumX + p.offsetWidth / 2;
      const viewCenter = currentX + window.innerWidth / 2;
      const isActive = Math.abs(panelCenter - viewCenter) < p.offsetWidth / 2;
      if (labels[i]) labels[i].classList.toggle('is-active', isActive);
      cumX += p.offsetWidth;
    });
  }

  // ============================================================
  // LOGO MODE — white on dark, color on light
  // ============================================================
  const lightPanels = new Set(['panel--vision', 'panel--video', 'panel--budget', 'panel--artistes', 'panel--next']);

  function updateLogoMode() {
    // Find which panel is under the logo (top-left area)
    let cumX = 0;
    const logoX = currentX + 100; // roughly where logo sits
    for (const p of panels) {
      cumX += p.offsetWidth;
      if (cumX > logoX) {
        const isLight = Array.from(p.classList).some(c => lightPanels.has(c));
        document.body.classList.toggle('on-light', isLight);
        break;
      }
    }
  }

  // ============================================================
  // REVEAL ON SCROLL
  // ============================================================
  function revealElements() {
    const viewLeft = currentX;
    const viewRight = currentX + window.innerWidth;

    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      // getBoundingClientRect is relative to viewport, which works since we translate the track
      if (rect.left < window.innerWidth * 0.85 && rect.right > 0) {
        el.classList.add('is-visible');
      }
    });

    // Component cards
    document.querySelectorAll('.component-card:not(.is-visible)').forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      if (rect.left < window.innerWidth * 0.85) {
        setTimeout(() => card.classList.add('is-visible'), i * 150);
      }
    });

    // Next steps
    document.querySelectorAll('.next-steps li:not(.is-visible)').forEach((li, i) => {
      const rect = li.getBoundingClientRect();
      if (rect.left < window.innerWidth * 0.85) {
        setTimeout(() => li.classList.add('is-visible'), i * 120);
      }
    });
  }

  // ============================================================
  // WEAVE CANVAS — animated threads that follow scroll
  // ============================================================
  function resizeCanvas() {
    weaveCanvas.width = window.innerWidth;
    weaveCanvas.height = window.innerHeight;
  }

  function drawWeave() {
    ctx.clearRect(0, 0, weaveCanvas.width, weaveCanvas.height);

    const w = weaveCanvas.width;
    const h = weaveCanvas.height;
    const progress = maxScroll > 0 ? currentX / maxScroll : 0;
    const time = Date.now() * 0.0005;

    // Thread 1 — turquoise, flows across top
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(108, 186, 199, 0.12)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x <= w; x += 4) {
      const y = h * 0.12 + Math.sin((x / w) * Math.PI * 3 + time + progress * 6) * 30;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Thread 2 — doré, flows across bottom
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 191, 63, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 4) {
      const y = h * 0.88 + Math.sin((x / w) * Math.PI * 2.5 - time + progress * 4) * 25;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Thread 3 — vermillon accent
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 92, 57, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 5) {
      const y = h * 0.5 + Math.sin((x / w) * Math.PI * 4 + time * 1.3 + progress * 8) * 40;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ============================================================
  // MODAL
  // ============================================================
  function openModal(key) {
    const data = modalData[key];
    if (!data) return;

    const singleClass = data.images.length === 1 ? ' modal__gallery--single' : '';
    const reelClass = data.videoReel ? ' modal__gallery-video--reel' : '';
    const videoThumb = data.video
      ? `<div class="modal__gallery-video${reelClass}" data-video-src="${data.video}" data-reel="${data.videoReel ? '1' : ''}">
          <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="rgba(0,0,0,0.5)"/><polygon points="26,20 26,44 46,32" fill="#fff"/></svg>
        </div>`
      : '';

    const items = data.images.map(src => `<img src="${src}" alt="Oeuvre de ${data.name}" loading="lazy">`).join('');
    const galleryHTML = (data.images.length || data.video)
      ? `<div class="modal__gallery${singleClass}">
          ${items}${videoThumb}
        </div>`
      : '';

    modalContent.innerHTML = `
      <div class="modal__artist-header">
        <h2>${data.name}</h2>
        ${data.origin ? `<span>${data.origin}</span>` : ''}
        <div class="modal__desc">${data.desc}</div>
      </div>
      ${galleryHTML}
    `;

    // Video thumbnail click → open player inline (replace thumb)
    const vThumb = modalContent.querySelector('.modal__gallery-video');
    if (vThumb) {
      vThumb.addEventListener('click', function (e) {
        e.stopPropagation();
        const src = this.dataset.videoSrc;
        // Replace thumbnail with inline iframe
        this.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen style="width:100%;height:100%;border:none;border-radius:12px;"></iframe>`;
        this.style.cursor = 'default';
        this.style.background = '#000';
      });
    }

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    // Stop any playing video
    modalContent.querySelectorAll('iframe').forEach(f => f.src = '');
  }

  // ============================================================
  // EVENTS
  // ============================================================
  function bindEvents() {
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', () => {
      calcMaxScroll();
      resizeCanvas();
    });

    // Logo → back to start
    const logoHome = document.getElementById('logoHome');
    if (logoHome) {
      logoHome.addEventListener('click', (e) => {
        e.preventDefault();
        targetX = 0;
      });
    }

    // Modal triggers — event delegation for reliability
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-modal]');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        openModal(trigger.dataset.openModal);
      }
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Expose openModal globally so inline onclick works as fallback
  window.openModal = openModal;

  // ============================================================
  // GO
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
