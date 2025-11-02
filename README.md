![Node.js](https://img.shields.io/badge/node-%3E%3D25.0.0-brightgreen)
![Yarn](https://img.shields.io/badge/yarn-1.22.22-blue)
[![GitHub Project](https://img.shields.io/badge/GitHub-Project-gray?logo=github)](https://github.com/erwanevn/elda_test)

# TEST Technique ELDA

---

## \* Prérequis

- [Node.js](https://nodejs.org/) ≥ **25.0.0**
- [Yarn (Classic)](https://classic.yarnpkg.com/) **1.22.22**
- (Optionnel) [Podman Desktop](https://podman-desktop.io/downloads)

> 💡 **Note :**  
> Le projet utilise **Yarn Classic (v1)**.
> Si vous avez Yarn Berry (v2+), exécutez vos commandes avec :
>
> ```bash
> yarn -v
> yarn set version classic
> ```

---

## \* Installation

### Backend:

```bash
cd backend
yarn install
# Si besoin, modifier le .env afin de correler avec votre base de données.
yarn dev
```

### Frontend:

```bash
cd frontend
yarn install
- Créer le fichier .env à la racine et y mettre: REACT_APP_MAPBOX_TOKEN=<token>
yarn start
```

> 💡 **Note :**  
> Le projet utilise **TailwindCSS (v4)**.
> Il est nécessaire de lancer le watcher Tailwind afin qu’il régénère le fichier CSS en temps réel :
>
> ```bash
> yarn tailwind
> ```

### (Optionnel) Base de données PostgreSQL via Podman Compose

Si vous n’avez pas encore de base PostgreSQL locale, vous pouvez la démarrer via Podman Compose.

> ```bash
> podman compose up -d
> ```

---

## \* Technologies utilisées

### Backend

- **Express** — API REST,
- **PostgreSQL** — base de données relationnelle,
- **Zod** — validation de schémas pour sécuriser les entrées

### Frontend

- **React** — interface réactive et modulaire,
- **TailwindCSS** — stylisation rapide et maintenable,
- **Zustand** — gestion d’état global,
- **GSAP** — librairie d'animations fluides et performantes

---

## \* Pistes d’amélioration

Si le projet devait évoluer, voici quelques idées d’améliorations potentielles, à la fois techniques et fonctionnelles.
L’objectif est simplement d’apporter quelques pistes pour renforcer la robustesse et la maintenabilité à moyen terme.

## Technique

### • Architecture modulaire (Clean Architecture / microservices)

↳ Faciliterait les tests, la maintenance et les évolutions sans impacter l’ensemble du code. \
↳ Préparerait une éventuelle migration vers une architecture microservices, utile si le projet gagne en ampleur ou nécessite davantage de scalabilité.

---

### • ORM : Prisma (ou Mongoose avec MongoDB)

↳ Simplifie la gestion des migrations et centralise les schémas de données. \
↳ Génère automatiquement les types TypeScript. \
↳ Évite les requêtes SQL complexes et rend le code plus lisible et maintenable.

---

### • Framework HTTP : Fastify + découplage microservices

↳ Fastify pourrait servir de façade web (validation, schémas, performance), tandis que les traitements lourds seraient externalisés. \
↳ Découpage par domaine et communication via HTTP/gRPC ou pub/sub. \
↳ Cette approche garderait la porte ouverte à des services écrits en Rust (ou autre langage bas niveau) en cas de besoin de performance.

---

### • Données temps réel : MQTT et/ou WebSocket

↳ MQTT conviendrait bien pour des échanges réguliers ou avec des clients intermittents. \
↳ WebSocket permettrait du push temps réel côté frontend. \
↳ Une combinaison des deux offrirait un système réactif et scalable.

---

### • Qualité & Outillage

↳ Ajouter des tests unitaires et E2E pour fiabiliser les déploiements. \
↳ Mettre en place une CI/CD légère (tests, build, migrations automatiques). \
↳ Envisager une conteneurisation (Docker ou Podman) pour un environnement homogène entre les développeurs.

---

## - Fonctionnel

- Afficher les secteurs sous forme de polygones sur la carte.

- Au clic sur un secteur, afficher les canons associés (nom, état, débit, etc.).

- Ajouter un mode édition pour modifier ou créer des secteurs / enneigeurs plus simplement.

- Implémenter un historique ou une timeline afin de visualiser l’évolution de l’activité (débit moyen, activation des canons, etc.).

- Traduire l’interface en plusieurs langues pour préparer une internationalisation.

- Rendre l’application progressive (PWA) afin d’offrir un accès hors ligne et une meilleure expérience sur mobile/tablette.
