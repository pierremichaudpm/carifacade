# WORKING LOG — CARI Façade Interactive

## Session 2026-03-08 (samedi, ~journée complète)

### Accompli

#### Structure & contenu
- Ajout des données modales pour `fenetres` et `carillon` (section Concept) — puis retirées car jugées non nécessaires par le client
- Ajout des données modales pour les 5 portes du Québec (`ville`, `erable`, `foret`, `hiver`, `saveurs`)
- Enrichissement des cartes Concept (section 02) : textes plus longs + listes à puces avec détails (3 points par carte)
- Restructuration des cartes Portes (section 05) : passage du format overlay simple au format carte avec image 16/9 + info en dessous (même format que les cartes artistes)
- Logo rendu cliquable (retour au début), réduit de 20%, monté de 15px
- Label menu "Vidéo" → "Vidéos"

#### Typographie & lisibilité
- Hero : fonts augmentées (titre clamp 4-8vw-7rem, sous-titre 1.5rem)
- Vision (section 01) : lead text 1.75rem, body points 1.35rem
- Concept (section 02) : titre cartes 1.8rem, texte 1.2rem, "En savoir plus" 1rem
- Budget (section 06) : phase labels 1.4rem, body 1.15rem, table h3 1.3rem, rows 1.05rem
- Menu bottom : 0.7rem → 0.85rem, opacité augmentée (0.5→0.7 foncé, 0.4→0.5 clair), font-weight 700

#### Modales — le gros chantier
- Unifié `artistData` en `modalData` (artistes + portes)
- `openModal(key)` générique — affiche galerie seulement si `images.length > 0`
- Event delegation : `document.addEventListener('click', ...)` avec `e.target.closest('[data-open-modal]')` — plus robuste que `querySelectorAll().forEach(addEventListener)`
- `window.openModal = openModal` exposé globalement + `onclick="openModal('...')"` inline sur chaque élément cliquable (double sécurité)
- **Bug critique trouvé** : les cartes artistes avaient `data-open-modal` uniquement sur le `<button>` "Voir le portfolio" (133×31px), PAS sur la carte entière (486×432px). L'utilisateur cliquait sur l'image/le nom → rien. Fix : `data-open-modal` + `onclick` déplacés sur le `<div class="artist-card">`, bouton converti en `<span>` visuel
- Cache-buster ajouté : `?v=20260308b` sur CSS et JS

#### Visibilité menu bottom
- Labels blancs invisibles sur fonds clairs → ajout `body.on-light .sidewalk-progress__label` avec couleurs sombres
- Labels actifs : doré (var(--dore)) sur foncé, vermillon (var(--vermillon)) sur clair

#### Déploiement
- Git init + push SSH vers `pierremichaudpm/carifacade` (branche main)
- `netlify.toml` créé (`publish = "site"`)

### Décisions techniques

| Décision | Raison |
|----------|--------|
| Event delegation sur `document` au lieu de `querySelectorAll` | Plus robuste — fonctionne quel que soit le timing DOM ou la structure de nesting |
| `window.openModal` + inline onclick | Triple sécurité après échecs répétés de debug (delegation + inline + global) |
| `data-open-modal` sur le div carte entier (pas le bouton) | UX — l'utilisateur s'attend à cliquer n'importe où sur la carte |
| Retrait modales section Concept (fenetres/carillon) | Client a décidé que l'info directement sur les cartes suffit |
| Cache-buster `?v=` sur CSS/JS | Le navigateur chargeait des versions cachées des fichiers |
| `max-width: 100%` sur `.components-grid` | `max-width: 70%` créait un espace vide à droite dans le panel Concept |

### Problèmes rencontrés

1. **Modales non cliquables (le plus gros blocage)** : Debug long et frustrant. Le code JS était correct (vérifié par Puppeteer — `.click()` programmatique ouvrait la modale). Le vrai problème : `data-open-modal` était sur un petit bouton 133×31px au lieu de la carte entière 486×432px. L'utilisateur cliquait à côté du bouton.

2. **Cache navigateur** : Les modifications JS/CSS n'étaient pas reflétées dans le navigateur. Résolu avec cache-busters `?v=`.

3. **Puppeteer indispensable pour le debug** : Installé localement (`site/node_modules/puppeteer`) pour faire des tests headless Chrome. Indispensable pour vérifier `elementFromPoint`, computed styles, et simuler des clics réels.

### Prochaines étapes (par priorité)

1. **Vérifier le déploiement Netlify** — connecter le repo GitHub sur Netlify, confirmer que le site est live
2. **Section Vidéos (04)** — actuellement un panel vide avec juste le titre. Ajouter le contenu vidéo (embed YouTube/Vimeo ou lecteur natif)
3. **Responsive mobile** — le site est desktop-only. Les media queries existent mais sont minimales. Tester sur mobile/tablette
4. **Images portes du Québec** — vérifier que les images `vieux-quebec.jpg`, `mont-royal.jpg`, etc. sont correctes et bien dimensionnées
5. **Nettoyage CSS** — il reste des règles dupliquées (`.porte-card { cursor: pointer }` apparaît deux fois)
6. **Performance** — les images artistes/portes ne sont pas optimisées (pas de srcset, pas de WebP). 4398 fichiers dans le repo dont beaucoup d'assets lourds
7. **Contenu modales portes** — actuellement texte seulement (images: []), ajouter des visuels
8. **Accessibilité** — pas de focus management dans les modales, pas de trap focus, pas de rôles ARIA complets

### Contexte technique pour reprise

- **Serveur local** : `python3 -m http.server 8765` dans `site/`
- **Puppeteer** : installé dans `site/node_modules/` — utiliser `cd site && node -e '...'` pour les tests
- **Structure panels** : 10 sections horizontales, widths variables (hero 100vw, concept 85vw, video 90vw, portes 115vw, artistes 115vw, tech/budget/funding 100vw, next 70vw)
- **Scroll engine** : wheel → targetX, lerp 0.08 dans requestAnimationFrame, snap < 0.3px
- **Stacking** : track z-auto, panel__inner z-2, canvas z-50 pointer-events:none, modal z-1000
- **Fichiers node_modules/puppeteer** dans le repo git — devrait être gitignore'd si on veut garder le repo clean

---

## Session 2026-03-09 (dimanche)

### Accompli

#### Panel 0 — Accueil
- Image remplacée par `cari_facade_photo.jpg`
- Tagline : "CARI St-Laurent × JAXA Production" → "Présenté par Jaxa production"
- Sous-titre : "Un phare d'accueil vivant" → "Un lieu d'accueil vivant"

#### Panel 1 — Vision
- "Un phare de fierté" → "Un espace culturel et artistique"

#### Panel 2 — Concept
- Cartes Fenêtres animées et Carillon de trottoir : nouveaux textes descriptifs
- Modales réactivées pour `fenetres` et `carillon` avec contenu structuré (Objectifs + Avantages en HTML h3/ul/li)
- CTA "Plus de détails" ajouté (bouton vermillon)
- Texte carte Carillon raccourci à la demande du client

#### Panel 3 — Vidéos
- Vidéos locales remplacées par embeds Google Drive (iframe `/file/d/ID/preview`)
- CSS : `.video-block iframe` stylé comme les `<video>` (16/9, border-radius)

#### Panel 4 — Fenêtres du Québec (ex-Portes du Québec)
- Renommé "Portes du Québec" → "Fenêtres du Québec" partout (titre, data-label, commentaires)
- 5 cartes → 4 cartes : Lieux de vie, La nature et les saisons, Les habitants et les langues, Services et événements
- Nouveau texte d'introduction sur la mission du CARI
- Format cartes : 16/9 → 9/16 (format fenêtre vertical), grille réduite à 50% max-width
- Layout horizontal : header (texte) à gauche 30%, grille fenêtres à droite
- Cartes simplifiées : titre seulement, contenu complet dans les modales
- Images depuis le nouveau dossier `assets/images/Fenetres/`
- modalData : 5 anciennes entrées (ville, erable, foret, hiver, saveurs) → 4 nouvelles (lieux, nature, habitants, services)

#### Panel 5 — Artistes
- Texte intro mis à jour : artistes vivant au Québec, parlant français
- 4 fiches artistes mises à jour avec nouveaux textes biographiques complets :
  - **Pilar Macias** (Mexique) — 3 oeuvres (Pic1, Pic3, Pic4) + vidéo Vimeo
  - **Eunki Kim** (Corée du Sud) — 4 oeuvres (pic1-3, euniki KIm 5.jpg), pas de vidéo
  - **Marwan Sekkat** (Maroc) — 3 oeuvres (pic1-3) + vidéo YouTube
  - **Khosro Berahmandi** (Iran) — 3 oeuvres (Pic1-3) + vidéo Facebook reel (9:16)
- Cartes : textes descriptifs retirés, reste nom + pays + CTA "Voir le portfolio"
- `artist-card__origin` : `display: inline-block` → `display: block` (pays sur sa propre ligne)
- `artist-card__btn` : box-shadow orange retiré (bavure visuelle)

#### Modales — améliorations majeures
- Vidéo intégrée comme 4e élément de la galerie (vignette play → clic → iframe inline)
- `videoReel: true` pour Khosro → vignette 9:16 + `grid-row: span 2`
- `onWheel` désactivé quand modale ouverte → scroll natif de la modale fonctionne
- `desc` rendu dans `<div>` au lieu de `<p>` pour supporter le HTML structuré
- `origin` vide → `<span>` omis
- Images : `object-fit: cover` → `object-fit: contain` (pas de crop)
- `closeModal()` stoppe toutes les iframes vidéo (`frame.src = ''`)

#### Panel 6 — Technologie
- Titre : "Évolutif" → "Économe"
- 3 items → 5 items : Film LED, Raspberry Pi, Détecteur de mouvements, Carillon extérieur, Infrastructure pérenne
- Tous les textes réécrits

#### Panel 7 — Budget
- Phases mises à jour : Phase 1 (fenêtres + artistes), Phase 2 (+ Carillon + contenus visuels), Années suivantes (CARI St-Laurent)
- Budget indicatif inchangé

#### Panel 9 — Prochaines étapes
- Point 5 : retiré "et lancer les appels d'offres"

#### Corrections transversales
- Numérotation sections corrigée : double 06 → 06 Tech, 07 Budget, 08 Financement, 09 Prochaines étapes
- Cache-buster : `?v=20260308b` → `?v=20260309a`

#### Déploiement
- Commit + push vers `origin/main`

### Décisions techniques

| Décision | Raison |
|----------|--------|
| Vidéo en vignette inline (pas overlay séparé) | Évite le problème de scroll-up après fermeture du player overlay |
| `videoReel: true` pour les vidéos verticales | Facebook reel en 9:16 était croppé en 4:3 — `grid-row: span 2` donne le bon ratio |
| `onWheel` return quand modale ouverte | Le wheel event capturait le scroll → impossible de défiler dans la modale |
| `object-fit: contain` sur images galerie | Les images étaient croppées en 4:3 — certaines oeuvres perdaient des détails |
| Layout horizontal Fenêtres (texte gauche / cartes droite) | Demande client — plus lisible avec les cartes 9:16 qui sont hautes |
| `max-width: 50%` sur `.portes-grid` | Cartes 9:16 trop grandes sinon |
| Retrait box-shadow sur CTA artistes | Créait un halo orange autour du bouton (bavure) |
| `display: block` sur `.artist-card__origin` | Le pays et le CTA se chevauchaient sur la même ligne |
| HTML dans `desc` (h3/ul/li) | Les modales Concept nécessitent des listes structurées (Objectifs, Avantages) |
| Images depuis `Fenetres/` (pas artistes/) | Dossier dédié avec images spécifiques aux fenêtres, noms différents |

### Problèmes rencontrés

1. **Scroll bloqué dans les modales artistes** : le `onWheel` avec `e.preventDefault()` interceptait tout le scroll, y compris celui de la modale. Fix : `if (modalOverlay.classList.contains('is-open')) return;` en début de handler.

2. **Vidéo Facebook croppée (Khosro)** : le reel vertical était affiché dans un conteneur 4:3 → crop sévère. Fix : `videoReel: true` + CSS `.modal__gallery-video--reel { aspect-ratio: 9/16; grid-row: span 2; }` + params Facebook `height > width`.

3. **CTA artiste avec bavure orange** : `box-shadow: 0 4px 20px rgba(255, 92, 57, 0.3)` créait un halo. Fix : supprimé.

4. **Pays et CTA sur la même ligne** : `artist-card__origin` en `inline-block` → les deux éléments inline se mettaient côte à côte. Fix : `display: block`.

5. **Image img_info2.png manquante** : pointait vers `quebec/` alors que le fichier est dans `Fenetres/`. Fix : corrigé le path.

6. **Noms de fichiers avec espaces** : `Eunki Kim_pic2.jpg` et `marwan sekkat_pic1.png` → nécessitent `%20` dans les src.

### Prochaines étapes (par priorité)

1. ~~**Vérifier le déploiement Netlify**~~ ✅ — site live et fonctionnel
2. ~~**Responsive mobile**~~ ✅ — breakpoints tablette (1024px), phone (768px), small phone (480px) ajoutés
3. **Nettoyage CSS** — règles legacy des anciennes Portes (`.porte-card__desc`, anciennes `.modal__video-player*`), CSS orphelin
4. **Performance** — images non optimisées (pas de srcset, pas de WebP), assets lourds
5. **Accessibilité modales** — pas de focus trap, pas de rôles ARIA complets
6. **Contenu manquant** — image `img_info2.png` pour la 4e fenêtre (existe mais à valider visuellement)
7. **Vidéo Facebook** — tester que l'embed reel fonctionne correctement en production (restrictions CORS possibles)
8. **node_modules/puppeteer** — toujours dans le repo git, devrait être gitignore'd

---

## Session 2026-03-10 (lundi)

### Accompli

#### Budget (Panel 7)
- Retiré "Phase 1" de l'en-tête et de la ligne total du tableau Budget indicatif
- Montant "Création de contenu" changé à 25 000$ – 45 000$
- Total changé à 45 000$ – 70 000$ CAD

#### Responsive desktop — gros chantier
- **Correction bleeding panels** : tous les panels passés à 100vw (étaient 85vw, 90vw, 115vw, 70vw) — le contenu des panels adjacents était visible
- **Correction overflow vertical** : le contenu dépassait 100vh et était coupé par `overflow: hidden`
- **Tentative `clamp()` avec `vh`** → échec total sur les écrans Retina/HiDPI. Le viewport CSS d'un Mac 4K est ~800px → les `clamp(0.8rem, 1.3vh, 1.2rem)` produisaient des valeurs minuscules. 67 règles `clamp` bulk-remplacées par un script Python
- **Tentative `max-width: 1600px`** sur `.panel__inner` → trop d'espace vide sur 4K. Retiré.
- **Solution finale** : valeurs `rem` fixes généreuses pour desktop standard + `@media (max-height: 950px) and (min-width: 1025px)` pour les laptops courts. Le breakpoint était d'abord à 800px, augmenté à 950px car beaucoup de laptops ont un viewport de 850-950px.

#### Vidéo (Panel 3)
- Légende "Façade — gros plan" changée en "Animation du Carillon"

#### Modales Fenêtres du Québec
- Retiré l'identification des images (`<em>`) des descriptions des modales `lieux` et `nature` :
  - `lieux` : supprimé "Image de Eunki Kim : la façade enneigée"
  - `nature` : supprimé "Image dans le style de Khosro Berahmandi (générée par l'IA)"

#### Logo flottant
- Logo masqué (opacity: 0 + pointer-events: none) quand on est sur le panel Prochaines étapes (panel--next) — ce panel a déjà son propre logo CARI
- Transition CSS `opacity 0.5s ease` sur `.floating-logo` pour un fondu propre

#### Progress labels (menu du bas)
- Taille augmentée de 0.6rem → 0.72rem
- Opacité inactive rehaussée : 0.35 → 0.45 (blanc), 0.3 → 0.4 (bleu)
- Espacement et padding ajustés
- Position remontée de bottom: 12px → 14px

#### Déploiement
- Multiples commits + push vers `origin/main`
- Cache-buster : `?v=20260310j`

### Décisions techniques

| Décision | Raison |
|----------|--------|
| Tous les panels à 100vw | Les largeurs variables causaient du "bleeding" — le contenu des panels voisins était visible |
| `rem` fixes + `@media (max-height)` au lieu de `clamp(vh)` | Les unités `vh` échouent sur Retina/HiDPI — le viewport CSS est bien plus petit que la résolution physique |
| Breakpoint à 950px (pas 800px) | Beaucoup de laptops ont un viewport de 850-950px CSS. 800px ne couvrait pas assez de cas |
| Retrait de `max-width: 1600px` | Créait trop d'espace vide sur les écrans 4K |
| Logo masqué sur panel--next via JS | Le panel a son propre logo CARI en bas — doublon visuel inutile |
| Transition opacity sur `.floating-logo` | Fondu propre quand le logo apparaît/disparaît entre panels |

### Problèmes rencontrés

1. **Bleeding entre panels (adjacent content visible)** : Les panels à largeur variable (85vw, 115vw, etc.) laissaient voir le contenu des sections voisines. Les utilisateurs voyaient des bribes de texte/images d'autres panels. Fix : tous les panels à 100vw.

2. **Overflow vertical sur petits écrans** : Le contenu dépassait 100vh et était coupé. Multiple tentatives de fix qui cassaient l'affichage sur d'autres tailles d'écran.

3. **Échec complet des unités `vh` pour la typographie** : Sur un Mac Retina, le viewport CSS est ~800px même avec un écran 4K physique. `clamp(min, Xvh, max)` se résolvait systématiquement au minimum, produisant du texte minuscule. Erreur fondamentale de conception — les `vh` ne sont PAS fiables pour le sizing typographique cross-device.

4. **Cercle vicieux responsive** : Chaque correction pour un type d'écran cassait un autre. Fix pour petits écrans → trop petit sur 4K. Fix pour 4K → déborde sur laptop. La solution (rem fixes + media query hauteur) a pris plusieurs itérations frustrantes.

5. **Utilisateur très frustré** : Le cycle correction→cassure→correction a duré longtemps. Leçon : ne pas toucher aux valeurs de base (qui marchent sur grands écrans), appliquer les réductions UNIQUEMENT via des media queries ciblées.

### Prochaines étapes (par priorité)

1. **Valider le responsive** — l'utilisateur n'a pas encore confirmé que le breakpoint 950px fonctionne correctement sur son écran
2. **Vidéos Google Drive** — les vidéos nécessitent le partage "Toute personne disposant du lien" (action côté client, pas code)
3. **Nettoyage CSS** — règles legacy, CSS orphelin des anciennes Portes
4. **Performance** — images non optimisées (pas de srcset, pas de WebP)
5. **Accessibilité modales** — focus trap, rôles ARIA
6. **node_modules/puppeteer** — devrait être dans .gitignore

### Contexte technique pour reprise

- **Breakpoints CSS actuels** :
  - Desktop standard : valeurs rem fixes (base)
  - Desktop court : `@media (max-height: 950px) and (min-width: 1025px)` — réduit padding, fonts, logo
  - Tablette : `@media (max-width: 1024px)` — passe en scroll vertical
  - Phone : `@media (max-width: 768px)`
  - Small phone : `@media (max-width: 480px)`
- **Cache-buster** : `?v=20260310j` sur CSS et JS
- **Logo** : masqué automatiquement sur panel--next via `updateLogoMode()` dans app.js

---

## Session 2026-05-11 (lundi)

### Accompli

#### Validation responsive desktop (action ouverte depuis 2026-03-10)
- 70 screenshots Puppeteer générés à 7 viewports (1025×900 → 1920×1080) × 10 panels
- Cas critiques vérifiés : 1366×768 (laptop court), 1025×900 (limite min-width), transition 1440×951 vs 1440×950 (breakpoint exact)
- Tous panels lisibles sans crop ni bleeding sur toute la plage testée
- Le breakpoint `@media (max-height: 950px) and (min-width: 1025px)` fait son travail proprement
- Faux positif noté : sur les screenshots de panel 09, le floating logo apparaît semi-transparent → c'est Puppeteer qui capture mi-transition (`opacity 0.5s`), pas un bug

#### Nettoyage CSS legacy
- Supprimé `.modal__video-player`, `.modal__video-player-inner` + iframe, `.modal__video-close` (~32 lignes) — ancien overlay vidéo remplacé par vignette inline en session du 2026-03-09
- Supprimé `.porte-card__desc` et `.porte-card__more` + hover (~22 lignes) — les cartes Fenêtres n'ont plus que titre (`__info h3`)
- Fusionné le doublon `.porte-card { cursor: pointer; }` dans le bloc `.porte-card` principal
- `style.css` : 1521 → 1467 lignes (-54)

#### Hygiène repo
- Index git réparé en début de session : `git restore --staged .` a annulé ~50 suppressions stagées accidentellement (probable `git rm --cached -r .` antérieur)
- Confirmé que `.gitignore` contient déjà `node_modules/` et qu'aucun fichier de node_modules n'est tracké — le warning du WORKING_LOG sur ce point était périmé
- Cache-buster CSS : `?v=20260310h` → `?v=20260511a` (le JS reste à `?v=20260310j`, non modifié)

### Problèmes rencontrés

1. **Index git en état corrompu** au début : `git status` montrait tous les fichiers tracked comme `D` (deleted) ET en `??` (untracked) simultanément. Les fichiers existaient bien sur disque et les commits récents étaient intacts — c'était purement l'index. Fix : `git restore --staged .` depuis la racine du projet.

2. **`node_modules/puppeteer` absent malgré WORKING_LOG le mentionnant** : nettoyage antérieur probable. `npm install` depuis `site/` a réinstallé puppeteer 24.x avec téléchargement chromium auto.

3. **Puppeteer wheel events overshoot** : première run avec `delta = target / 1.2 + 200` (buffer "de sécurité") faisait atterrir entre deux panels → bleeding visible dans les screenshots. Fix : delta = exactement `target / 1.2`, le snap-to-targetX fait le reste.

4. **Navigation Puppeteer trop lente avec `networkidle0`** : iframes Google Drive de panel 03 traînent → timeout 30s dépassé. Fix : `waitUntil: 'domcontentloaded'` + 1.5s d'attente fixe.

### Prochaines étapes (par priorité)

1. **Performance** — images non optimisées (pas de srcset, pas de WebP), assets lourds
2. **Accessibilité modales** — focus trap, rôles ARIA
3. **Validation manuelle sur écran client** — les screenshots Puppeteer couvrent les viewports standards, mais une validation IRL reste utile avant la prochaine présentation
4. **Vidéos Google Drive** — confirmer que le partage est bien "Toute personne disposant du lien" pour les 2 vidéos du panel 03

---

## Session 2026-05-11 (suite — après-midi)

### Accompli

#### Panel 03 (Vidéos) — passage de 2 vidéos Drive iframe à 4 vidéos self-hosted
Évolution en 3 phases au cours de la session :

**Phase 1 — Passage de 2 à 4 vidéos Drive iframe** :
- Remplacé 2 anciens IDs Drive par 4 nouveaux (façades CARI St-Laurent : plan large + plan rapproché × jour/nuit)
- Mapping IDs ↔ noms de fichiers déduit de l'ordre alphabétique du dossier Drive du client
- Grille passée de 1×2 à 2×2 → CSS `.video-layout__grid { max-width: 82vh; margin: 0 auto }` pour que ça tienne sans overflow à 1366×768
- Légendes finales : « Façade — Plan large, jour/nuit » + « Façade — Plan rapproché, jour/nuit »

**Phase 2 — Ajout d'une modale plein écran au clic** :
- Variante `modal--video` ajoutée à la modale existante : fond transparent, taille fit-to-iframe (`width: min(85vw, calc(85vh * 16/9))`), X repositionné au-dessus de la vidéo
- 4 entrées `modalData` initialement avec `videoOnly: 'drive-url'` → short-circuit dans `openModal` qui rend juste un iframe sans header/galerie
- CSS `.video-block iframe { pointer-events: none }` + `cursor: pointer` sur `.video-block` → l'iframe Drive devient un "preview" inerte, les clics vont à la div parente
- Smoke test Puppeteer : ✅ click ouvre modale / ✅ X ferme / ✅ backdrop ferme / ✅ ESC ferme / ✅ iframe vidé à la fermeture

**Phase 3 — Migration vers self-hosted .mp4 (à cause de l'autoplay)** :
- Le client voulait l'autoplay → tentatives infructueuses avec `?autoplay=1`, `?autoplay=1&mute=1`, iframe `focus()` au load → Drive n'honore aucun paramètre d'autoplay de façon fiable
- Décision : migrer vers HTML5 `<video>` self-hosted (autoplay 100% fiable car déclenché par clic user)
- Téléchargement des 4 fichiers Drive en CLI via `curl` (déjà publics côté partage)
- Le fichier 105 Mo a déclenché l'interstitiel virus-scan de Drive → parsing du HTML pour extraire `confirm=t&uuid=…` et resoumettre sur `drive.usercontent.google.com/download`
- Ré-encodage des 4 vidéos : H.264 CRF 24, 1080p max (downscale du 4K), `-an` (aucune piste audio dans les sources), `-movflags +faststart`
- Résultat compression : 192 Mo → **3.9 Mo** (ratio 50:1 grâce au contenu majoritairement statique)
- Posters extraits à `00:00:01` via ffmpeg → 1 Mo de JPGs
- Grille passe d'iframes Drive à `<img class="video-block__poster">` + overlay SVG `<svg class="video-block__play">` (cercle + triangle play, hover scale 1.1)
- Modale passe à `<video src="..." autoplay controls playsinline preload="auto">` → autoplay garanti, contrôles natifs HTML5
- `modalData` simplifié : `{ videoFile: 'assets/videos/X.mp4' }` au lieu de `{ videoOnly: 'drive-url' }`
- `closeModal()` étendu pour pause + reset des `<video>` en plus de vider les iframes

#### Volume travail
- 3 commits : nettoyage CSS+responsive (matin), self-hosted vidéos (après-midi), docs (ce commit-ci)
- ~5 Mo ajoutés au repo (4 mp4 + 4 jpg posters), volume largement acceptable pour Netlify

### Décisions techniques

| Décision | Raison |
|----------|--------|
| Self-hosting des vidéos plutôt que Drive iframe | L'autoplay Drive est non documenté et non fiable. HTML5 `<video autoplay>` après clic user marche partout. |
| Encoding H.264 CRF 24 (pas CRF 18 ou 28) | Compromis qualité/poids visuellement testé OK sur des frames sampled. Le contenu façade-statique compresse extrêmement bien. |
| Suppression de la piste audio (`-an`) | Les sources Drive n'avaient déjà aucune piste audio (façades = visuel pur). Économie de quelques % de poids et simplification autoplay (pas de problème de browser-mute policy). |
| Poster `.jpg` (pas `.webp`) | Compatibilité universelle, taille acceptable (~250 Ko), pas de pipeline d'optim WebP nécessaire pour 4 images. |
| Grille = poster statique + icône play, modale = autoplay | Choix client (option présentée parmi : boucle muette / poster+play / contrôles visibles). Le poster + play est l'option « cinéma » la plus présentation-friendly. |
| `max-width: 82vh` sur `.video-layout__grid` | Calcul tenant compte de header + captions + menu progress sur 1366×768. À 92vh ça touchait le menu progress ; à 82vh il y a ~45 px de marge. |
| Téléchargement CLI plutôt que demander à l'utilisateur de download manuellement | Les fichiers Drive étaient déjà publics → `curl` direct possible. Workflow plus rapide pour le user. |

### Problèmes rencontrés

1. **Drive ne supporte pas l'autoplay fiable** : `?autoplay=1`, `?autoplay=1&mute=1`, `?autoplay=true`, focus iframe au load → aucun n'a marché. La doc Drive officielle n'expose pas de paramètre autoplay sur `/preview`. Les rapports communautaires sont incohérents (marche sur certains comptes/régions, pas d'autres). Conclusion : pour de l'autoplay fiable, ne pas dépendre de Drive — héberger localement.

2. **Drive virus-scan pour fichiers > 100 Mo** : `curl -L "https://drive.google.com/uc?export=download&id=ID"` retourne ~2.4 Ko de HTML (l'interstitiel de scan) au lieu du fichier. Fix : parser le HTML pour extraire les hidden form fields `confirm=t&uuid=XXX`, puis re-curl sur `https://drive.usercontent.google.com/download?id=...&export=download&confirm=t&uuid=XXX`.

3. **Mapping IDs↔fichiers Drive opaque** : Le client a envoyé 4 IDs Drive sans préciser le mapping avec les noms de fichiers (`FACADE_JOUR`, `FACADE_NIGHT`, `FACADE_CLOSE-UP_JOUR`, `FACADE_CLOSE-UP_NIGHT`). Hypothèse : IDs donnés dans l'ordre alphabétique du dossier Drive (confirmé par l'utilisateur après coup).

4. **Overflow grille 2×2 à 1366×768** : Première version sans `max-width` débordait de 137 px. Calculé `max-width: 105vh` → toujours 15 px d'overflow. Puis `92vh` → tenait juste, mais les captions chevauchaient le menu progress. Final : `82vh` → 45 px de marge.

5. **Iframe Drive capte les clics** : Solution `pointer-events: none` sur l'iframe pour que les clics aillent à la div parente `.video-block`. Pas un problème avec la solution finale `<video>` (qui n'a plus besoin de cette astuce car les clics sur l'icône play overlay sont gérés par le SVG en `pointer-events: none` aussi, et le poster image n'a pas de comportement bloquant).

6. **Auto-reset de la modale à la fermeture** : Le `closeModal()` existant ne vidait que les iframes. Pour HTML5 video, ajouter `v.pause(); v.currentTime = 0;` sinon la vidéo continue à jouer en background quand la modale se ferme.

### Prochaines étapes (par priorité)

1. **Validation client en présentation** — voir si l'autoplay HTML5 marche bien sur tous les setups où la présentation sera faite (probablement un ordi + projecteur)
2. **Optionnel : revenir au partage Drive « Restreint »** — le site ne dépend plus de Drive, donc les 4 fichiers peuvent être reverted en privé si souhaité
3. **Performance** — toujours pas d'optim sur les autres images (artistes, fenêtres). Pas de srcset, pas de WebP. Reste à faire si on veut un score Lighthouse propre.
4. **Accessibilité modales** — focus trap, ARIA roles (toujours pas fait)
5. **Hygiène repo** — `node_modules/` (re-installé pour Puppeteer en session du matin) toujours présent localement, n'est plus dans le repo (gitignore OK), mais pourrait être supprimé une fois Puppeteer plus utilisé
6. **Nettoyer les 6 entrées `??` à la racine** — `Doc_Brief.docx`, dossiers `Artistes-…`, `animation-…`, `FONTAINE SONORE-…`, `images portes du monde-…`, `cari_facade_photo copy.jpg` : matériel source du client, à ranger ou .gitignore'r définitivement

### Contexte technique pour reprise

- **Cache-buster CSS et JS** : `?v=20260511g` (CSS et JS bumpés tous les deux en phase 3)
- **Modal.data** : 2 formats coexistent — `{ name, origin, desc, images[], video?, videoReel? }` (artistes/fenêtres/concept) ET `{ videoFile: '...' }` (panel 03). `openModal` branche sur la présence de `videoFile` en premier.
- **Vidéos sources** : 4 fichiers .mp4 1080p H.264 sans audio dans `site/assets/videos/`, ~3.9 Mo total
- **Posters** : 4 fichiers .jpg dans le même dossier, ~1 Mo total
- **Re-encode template** pour ajouter d'autres vidéos plus tard :
  ```bash
  ffmpeg -i in.mp4 -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -an -movflags +faststart out.mp4
  ffmpeg -i in.mp4 -ss 00:00:01 -vframes 1 -q:v 4 poster.jpg
  ```
