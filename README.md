# SPA_js ARSAMERZOEV Magomed

## Installation

Prérequis : Node.js + npm.

```bash
npm install
```

## Lancer l'API (json-server)

La base JSON est dans `spa_jv/data/json/db.json`.

```bash
npm run api
```

L'API démarre sur : `http://localhost:3001`

Ressource principale :
- `GET http://localhost:3001/personnages`
- `GET http://localhost:3001/personnages/:id`
- `PATCH http://localhost:3001/personnages/:id` (utilisé pour la **note**)

## Lancer le site en dev (modules ES)

Dans un autre terminal :

```bash
npm run dev #à faire dans le répertoire spa_jv
```

Le site s'ouvre sur : `http://localhost:5173`

## Routes de la SPA

Le routeur est hash-based (pas besoin de config serveur) :

- `#/` → listing (Home)
- `#/personnages` → listing (Home)
- `#/personnages/:id` → détail d'un personnage + note + favoris
- `#/favoris` → liste des favoris (localStorage)

Routeur : `spa_jv/js/main.js`

## Fonctionnalités (où c'est codé)

- Pagination + recherche + boutons (listing) : `spa_jv/js/views/pages/Home.js`
- Détail + note (PATCH) + favoris : `spa_jv/js/views/pages/DetailPersonnage.js`
- Favoris (page) : `spa_jv/js/views/pages/Favoris.js`
- Stockage favoris (localStorage) : `spa_jv/js/storage/favoritesStorage.js`
- Lazy-loading images : `spa_jv/js/utils/lazyLoad.js`
- Accès API personnages : `spa_jv/js/class/personnage.js`
- Endpoint API : `spa_jv/js/config.js`

## Bundle production (Vite)

### Build

```bash
npm run build
```

Le build sort dans `dist/`.

## Config du bundler

Fichier : `vite.config.js`

- `root: 'spa_jv'` : le projet front est dans le dossier `spa_jv/`
- `build.outDir: '../dist'` : le build est généré à la racine dans `dist/`
- `server.port: 5173` : port du serveur de dev

