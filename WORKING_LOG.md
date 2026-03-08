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

- **Serveur local** : `python3 -m http.server 8765` dans `site/` (peut être encore en cours, PID 316556)
- **Puppeteer** : installé dans `site/node_modules/` — utiliser `cd site && node -e '...'` pour les tests
- **Structure panels** : 10 sections horizontales, widths variables (hero 100vw, concept 85vw, video 90vw, portes 115vw, artistes 115vw, tech/budget/funding 100vw, next 70vw)
- **Scroll engine** : wheel → targetX, lerp 0.08 dans requestAnimationFrame, snap < 0.3px
- **Stacking** : track z-auto, panel__inner z-2, canvas z-50 pointer-events:none, modal z-1000
- **Fichiers node_modules/puppeteer** dans le repo git — devrait être gitignore'd si on veut garder le repo clean
