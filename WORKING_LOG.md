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
