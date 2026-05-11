# CLAUDE.md — CARI Façade Interactive

## Projet
Site de présentation horizontal-scroll pour le projet de façade interactive du CARI St-Laurent ("Tissage de vies"). Présentation destinée à des décideurs — pas une app publique.

## Structure
```
CARI_facade/
├── site/                    # Dossier publié (Netlify publish dir)
│   ├── index.html           # Page unique, 10 panels horizontaux
│   ├── css/style.css        # Tout le CSS (pas de preprocesseur)
│   ├── js/app.js            # Tout le JS (IIFE, pas de bundler)
│   └── assets/
│       ├── brand/           # logo-blanc.png, logo-couleur.png, symbole.png
│       ├── videos/          # 4 .mp4 + 4 .jpg posters (self-hosted, panel 03)
│       │                    #   plan-large-{jour,nuit}.{mp4,jpg}
│       │                    #   plan-rapproche-{jour,nuit}.{mp4,jpg}
│       └── images/
│           ├── artistes/    # pilar/ (3), eunki/ (4), marwan/ (3), khosro/ (3)
│           ├── Fenetres/    # Images pour les 4 cartes Fenêtres du Québec
│           ├── quebec/      # Anciennes photos portes (legacy)
│           ├── portes/      # Photos portes du monde (pas utilisées)
│           └── fontaine/    # Assets fontaine sonore
├── netlify.toml             # publish = "site"
├── WORKING_LOG.md           # Journal de session
└── CLAUDE.md                # Ce fichier
```

## Stack
- **HTML/CSS/JS pur** — pas de framework, pas de bundler, pas de npm (sauf puppeteer pour debug)
- **Fonts** : Google Fonts — DM Serif Text (headings), DM Sans (body)
- **Déploiement** : Netlify via GitHub (`pierremichaudpm/carifacade`)
- **Git remote** : `git@github.com:pierremichaudpm/carifacade.git` (SSH)

## Architecture JS (app.js)

### IIFE avec modules internes
```
(function() {
  // DOM refs (lignes 9-18)
  // State: currentX, targetX, maxScroll (lignes 21-26)
  // modalData object (lignes 29-115) — concept + fenêtres + artistes (avec video/videoReel)
  // init() → calcMaxScroll, buildProgressLabels, resizeCanvas, bindEvents, animate
  // animate() → lerp scroll, progress bar, active label, logo mode, reveal, weave canvas
  // openModal(key) / closeModal()
  // bindEvents() — wheel, touch, keyboard, logo click, modal delegation
  // window.openModal = openModal (exposé pour inline onclick fallback)
})();
```

### Scroll engine
- `wheel` event (passive: false) → `targetX += delta * 1.2`
- `animate()` : `currentX += (targetX - currentX) * 0.08` (lerp)
- Snap quand `diff < 0.3`
- `track.style.transform = translate3d(-currentX, 0, 0)`

### Système de modales
- `data-open-modal="key"` sur les éléments cliquables (cartes artistes, fenêtres, concept, vidéos)
- `onclick="openModal('key')"` inline en backup
- Event delegation sur `document` avec `e.target.closest('[data-open-modal]')`
- **Deux modes de rendu** dans `openModal(key)` :
  1. **Standard** (artistes/fenêtres/concept) : `modalData[key] = { name, origin, desc, images[], video?, videoReel? }` → header + galerie d'images
  2. **Vidéo plein écran** (panel 03) : `modalData[key] = { videoFile: 'assets/videos/X.mp4' }` → short-circuit, ajoute classe `modal--video` sur `.modal`, rend `<video autoplay controls playsinline>` seul
- Galerie : affichée si `images.length > 0` ou `video` défini ; vidéo en vignette (4e item) → clic remplace par iframe inline
- `videoReel: true` → vignette en 9:16 avec `grid-row: span 2`
- `desc` peut contenir du HTML (h3, ul, li) — rendu via `innerHTML` dans un `<div class="modal__desc">`
- `origin` vide → le `<span>` est omis
- `onWheel` ignoré quand modale ouverte → scroll natif de la modale fonctionne
- `closeModal()` pause + reset `<video>` (currentTime=0) en plus de vider les `<iframe>` src

### Logo dual-mode
- `body.on-light` toggle basé sur le panel sous le logo
- `lightPanels` Set : vision, video, budget, artistes, next
- Deux images superposées (blanc + couleur), opacity toggle
- Logo masqué (opacity: 0) sur panel--next (a son propre logo CARI en bas)

## Design System CARI
```css
--bleu:      #263164    /* fond principal, texte sur clair */
--turquoise: #6cbac7    /* accents, icônes, liens */
--brume:     #cce8e5    /* fonds clairs */
--dore:      #ffbf3f    /* accents chauds, label actif sur foncé */
--vermillon: #ff5c39    /* CTA, label actif sur clair */
--blanc:     #ffffff
```

## Panels (ordre et widths)
| # | data-label | class | width |
|---|-----------|-------|-------|
| 0 | Accueil | panel--hero | 100vw |
| 1 | Vision | panel--vision | 100vw |
| 2 | Concept | panel--concept | 100vw |
| 3 | Vidéos | panel--video | 100vw |
| 4 | Fenêtres du Québec | panel--portes | 100vw |
| 5 | Artistes | panel--artistes | 100vw |
| 6 | Technologie | panel--tech | 100vw |
| 7 | Budget | panel--budget | 100vw |
| 8 | Financement | panel--funding | 100vw |
| 9 | Prochaines étapes | panel--next | 100vw |

## Contraintes connues

1. **Cache navigateur agressif** : toujours utiliser cache-busters (`?v=YYYYMMDD<lettre>`) sur les refs CSS/JS dans index.html quand on modifie ces fichiers. Actuellement `?v=20260511g`.
2. **`data-open-modal` doit être sur l'élément cliquable ENTIER** (la carte div), pas sur un petit bouton à l'intérieur. L'utilisateur s'attend à cliquer n'importe où sur la carte.
3. **Puppeteer pour debug** : quand un truc "devrait marcher" mais ne marche pas, lancer un test Puppeteer headless (`cd site && node -e '...'`) pour vérifier computed styles, `elementFromPoint`, et simuler des clics réels. Installé dans `site/node_modules/`.
4. **`[data-reveal]` = opacity:0** par défaut. Les éléments ne deviennent visibles (opacity:1) que quand `is-visible` est ajouté par `revealElements()` dans la boucle d'animation. Ne pas oublier ça lors du debug.
5. **Stacking context** : track a `will-change: transform` (crée un stacking context), mais la modale est EN DEHORS du track (sibling), donc `position: fixed; z-index: 1000` fonctionne correctement.
6. **Wayland (Fedora 43 + GNOME)** : pas de xclip, utiliser wl-copy. Pas de `Alt+F2 → r` pour refresh shell.
7. **Scroll modale** : `onWheel` doit vérifier `modalOverlay.classList.contains('is-open')` et `return` pour laisser le scroll natif de la modale fonctionner.
8. **Vidéos embed** (artistes/concept) : Google Drive → `/file/d/ID/preview`, Vimeo → `player.vimeo.com/video/ID`, YouTube → `youtube.com/embed/ID`, Facebook reel → `facebook.com/plugins/video.php` avec `height > width` pour format vertical.
8b. **Vidéos panel 03 (Façade)** : self-hosted `<video>` natifs dans `site/assets/videos/`, **PAS** d'iframe Drive. Drive ne supporte pas l'autoplay de façon fiable via paramètre URL → on a migré vers HTML5 `<video autoplay controls playsinline>` pour autoplay garanti dans la modale. Encoding : H.264 CRF 24 1080p sans audio, ~600 kbps (contenu majoritairement statique = très bonne compression). Re-encode template : `ffmpeg -i in.mp4 -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -an -movflags +faststart out.mp4`. Posters extraits à `00:00:01`.
9. **Noms de fichiers avec espaces** : utiliser `%20` dans les src HTML/JS (ex: `Eunki%20Kim_pic2.jpg`).
10. **Responsive desktop — ne PAS utiliser `vh` pour les fonts** : `clamp()` avec `vh` produit du texte minuscule sur les grands écrans Retina/HiDPI (viewport CSS ~800px même sur 4K). Approche correcte : valeurs `rem` fixes pour le desktop standard + `@media (max-height: 950px) and (min-width: 1025px)` pour les petits écrans laptop.
11. **Tous les panels doivent être 100vw** : les largeurs variables (85vw, 115vw, 70vw) causaient du « bleeding » de contenu des panels adjacents. Corrigé en mettant tous les panels à 100vw.
12. **Logo flottant masqué sur panel--next** : `updateLogoMode()` dans app.js met `opacity: 0` sur le logo quand le panel sous le logo est `panel--next`, car ce panel a déjà son propre logo CARI.
13. **Progress labels (menu du bas)** : taille 0.72rem, opacité inactive 0.45 (blanc) / 0.4 (bleu). Ne pas trop agrandir — 10 labels doivent tenir sur une ligne sans débordement.
14. **Grille panel 03 (Vidéos)** : `.video-layout__grid { max-width: 82vh }` pour que la 2×2 de 16:9 tienne sans déborder verticalement à 1366×768. Calcul : 2 rangées de vidéos demi-largeur = grid_width * 9/16 de hauteur ; pour rester sous ~60vh, grid_width ≤ ~107vh — `82vh` laisse de la marge pour le header + les captions + le menu progress.
15. **Téléchargement Drive en CLI** : `curl -L "https://drive.google.com/uc?export=download&id=ID" -o file.mp4`. Pour fichiers > 100 Mo, parser le HTML de virus-scan pour extraire `confirm=t&uuid=XXX` et resoumettre sur `drive.usercontent.google.com/download`.

## Contexte global
Voir ~/Documents/CONTEXT.md pour le profil complet,
les conventions transversales et la liste des clients actifs.
