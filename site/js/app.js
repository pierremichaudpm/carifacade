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

  // --- Modal data (artists + components) ---
  const modalData = {
    // Portes du Québec
    ville: {
      name: 'La ville',
      origin: 'Montréal et ses quartiers',
      desc: 'Montréal est une ville vibrante et cosmopolite, où se côtoient plus de 120 communautés culturelles. Ses quartiers — du Plateau au Vieux-Port, de Saint-Laurent à Côte-des-Neiges — sont autant de portes d\'entrée vers une vie riche en découvertes, en culture et en opportunités.',
      images: []
    },
    erable: {
      name: 'L\'érable',
      origin: 'Symbole du Québec',
      desc: 'L\'érable est l\'emblème du Canada et du Québec. Son sirop, ses couleurs d\'automne flamboyantes et sa résilience face aux hivers rigoureux en font un symbole puissant d\'accueil et d\'enracinement pour ceux qui choisissent cette terre.',
      images: []
    },
    foret: {
      name: 'La forêt',
      origin: 'Les grands espaces',
      desc: 'Les forêts québécoises — boréales, mixtes, laurentiennes — couvrent plus de la moitié du territoire. Elles offrent un espace de ressourcement, de plein air et de connexion avec la nature, accessibles à quelques minutes de la ville.',
      images: []
    },
    hiver: {
      name: 'L\'hiver',
      origin: 'Saison fondatrice',
      desc: 'L\'hiver québécois est une expérience unique : neige abondante, sports de glisse, marchés de Noël, cabanes à sucre. Loin d\'être un obstacle, c\'est une saison célébrée qui forge le caractère et crée des traditions partagées.',
      images: []
    },
    saveurs: {
      name: 'Les saveurs',
      origin: 'Gastronomie métissée',
      desc: 'La cuisine québécoise est un métissage de traditions françaises, autochtones et de toutes les vagues d\'immigration. Des bagels de Saint-Viateur à la poutine, des marchés Jean-Talon et Atwater aux restaurants du monde entier — chaque saveur raconte une histoire d\'accueil.',
      images: []
    },
    // Artists
    pilar: {
      name: 'Pilar Marcias',
      origin: 'Mexique — La Pocatière',
      desc: 'Artiste multidisciplinaire mexicaine installée au Québec. Son univers coloré et narratif, proche des textiles et des motifs traditionnels, se prête naturellement au thème du tissage interculturel. Ses installations intègrent souvent des éléments photographiques et sculpturaux dans l\'espace public.',
      images: [
        'assets/images/artistes/pilar/Pilar_Marcias_Pic1.jpg',
        'assets/images/artistes/pilar/Pilar_Marcias_Pic2.jpg',
        'assets/images/artistes/pilar/Pilar_Marcias_Pic3.jpg',
        'assets/images/artistes/pilar/Pilar_Marcias_Pic4.jpg',
      ]
    },
    eunki: {
      name: 'Eunki Kim',
      origin: 'Corée du Sud',
      desc: 'Artiste coréenne au travail graphique minimaliste et poétique. Ses peintures expressives de paysages montréalais offrent un regard neuf sur la ville d\'accueil — idéal pour des animations LED épurées qui capturent l\'essence du quartier.',
      images: [
        'assets/images/artistes/eunki/Eunki_Kim_pic1.jpg',
        'assets/images/artistes/eunki/Eunki_Kim_pic2.jpg',
        'assets/images/artistes/eunki/Eunki_Kim_pic3.jpg',
        'assets/images/artistes/eunki/Eunki_Kim_pic4.jpg',
      ]
    },
    marwan: {
      name: 'Marwan Sekkat',
      origin: 'Maroc',
      desc: 'Artiste marocain aux influences géométriques et architecturales. Son travail mêle abstraction pixelisée et figuration décomposée, proposant des motifs et arabesques contemporains parfaitement adaptables aux fenêtres animées de la façade.',
      images: [
        'assets/images/artistes/marwan/marwan_sekkat_pic1.png',
        'assets/images/artistes/marwan/marwan_sekkat_pic2.png',
        'assets/images/artistes/marwan/marwan_sekkat_pic3.png',
        'assets/images/artistes/marwan/marwan_sekkat_pic4.png',
      ]
    },
    khosro: {
      name: 'Khosro Berahmandi',
      origin: 'Iran',
      desc: 'Artiste iranien reconnu pour son univers symbolique et onirique. Ses compositions mêlant silhouettes, motifs ornementaux et couleurs riches (rouges, bleus, ors) sont particulièrement inspirantes pour des narratives visuelles sur le thème du voyage et des trajectoires migratoires.',
      images: [
        'assets/images/artistes/khosro/Khosro_Berah_Pic1.jpg',
        'assets/images/artistes/khosro/Khosro_Berah_Pic2.jpg',
        'assets/images/artistes/khosro/Khosro_Berah_Pic3.jpg',
        'assets/images/artistes/khosro/Khosro_Berah_Pic4.jpg',
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

    const galleryHTML = data.images.length
      ? `<div class="modal__gallery">
          ${data.images.map(src => `<img src="${src}" alt="Oeuvre de ${data.name}" loading="lazy">`).join('')}
        </div>`
      : '';

    modalContent.innerHTML = `
      <div class="modal__artist-header">
        <h2>${data.name}</h2>
        <span>${data.origin}</span>
        <p>${data.desc}</p>
      </div>
      ${galleryHTML}
    `;

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
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
