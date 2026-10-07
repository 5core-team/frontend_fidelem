# FIDELEM · Front-end

Site public et espaces connectés de FIDELEM, plateforme d'accès au financement
(immobilier, transport, affaires) et réseau de conseillers financiers au Bénin.

- **Site public** : présentation des financements, simulateur, EasyLife, devenir
  conseiller, recherche d'un conseiller par commune, contact.
- **Mon espace** (usager) : suivi des demandes de financement et du conseiller attribué.
- **Espace Conseiller** : demandes de la zone, prise en charge, rendez-vous, clients.
- **Back-office** (responsable) : conseillers et candidatures, usagers, demandes,
  zones, demandes EasyLife.

L'API est servie par le dépôt [`backend_fidelem`](https://github.com/5core-team/backend_fidelem).
Le contrat entre les deux (routes, formats, statuts) est décrit dans
`backend_fidelem/docs/CONTRAT-API.md`.

## Stack

| Rôle | Outil |
| --- | --- |
| Build et serveur de développement | Vite 6 |
| Interface | React 18, TypeScript |
| Routage | React Router 7 |
| Appels HTTP | Axios |
| Formulaires | React Hook Form, Zod |
| Composants de base | Radix UI (via shadcn/ui), Tailwind CSS |
| Styles du site | `src/styles/fidelem.css` |

## Démarrage

Prérequis : Node.js 20 ou plus, et npm.

```sh
npm ci
cp .env.example .env.local   # puis renseigner VITE_API_URL
npm run dev                  # http://localhost:8080
```

Pour travailler avec de vraies données, lancer l'API en local (voir le README de
`backend_fidelem`) avec `php artisan migrate:fresh --seed` : elle crée les comptes
`responsable@fidelem.test`, `conseillere@fidelem.test` et `usager@fidelem.test`,
mot de passe `password`.

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement sur le port 8080 |
| `npm run build` | Build de production dans `dist/` |
| `npm run build:dev` | Build en mode développement |
| `npm run preview` | Sert le build localement |
| `npm run lint` | ESLint |

## Variables d'environnement

| Variable | Rôle | Exemple |
| --- | --- | --- |
| `VITE_API_URL` | URL de base de l'API, préfixe `/api` compris | `http://127.0.0.1:8000/api` |
| `VITE_DEMO` | `1` pour inclure le mode démonstration dans un build | `0` |

Les variables `VITE_*` sont lues au moment du build : changer l'URL de l'API
impose de reconstruire le site.

## Mode démonstration

En local, la page `/demo` ouvre les trois espaces connectés avec des données
d'exemple, sans serveur. Toutes les requêtes Axios sont alors servies par
`src/config/demo.ts` et les actions sont simulées en mémoire. La page n'existe
pas dans le build de production, sauf si `VITE_DEMO=1`.

## Organisation du code

```
src/
├── App.tsx                   Routes ; les espaces connectés sont chargés à la demande
├── config/
│   ├── http.ts               Client HTTP unique : jeton, session expirée, lecture des erreurs
│   ├── api.ts                Authentification, profil, comptes du back-office
│   ├── apiEspace.ts          Demandes, clients, conseillers, candidatures, messages
│   ├── apiPublic.ts          Formulaires du site public
│   ├── demo.ts               Activation du mode démonstration
│   └── demoDonnees.ts        Données d'exemple, chargées seulement en démonstration
├── context/AuthContext.tsx   Session : connexion, déconnexion, rafraîchissement du profil
├── donnees/fidelem.ts        Contenus du site : financements, formations, zones, FAQ
├── pages/
│   ├── site/                 Pages publiques, connexion, mot de passe oublié et réinitialisation
│   └── espace/               Espaces usager, conseiller et responsable
├── components/
│   ├── site/                 Gabarit, formulaires, simulateur, animations
│   ├── espace/               Cadre des espaces, liste et fiche d'une demande
│   └── ui/                   Composants de base (shadcn/ui)
└── styles/fidelem.css        Feuille de style du site
```

Quand l'API répond 401, la session est fermée et l'utilisateur renvoyé vers la
connexion avec le message « Votre session a expiré ». Les erreurs de validation
(422) s'affichent sur les champs concernés.

Les contenus marqués « À CONFIRMER » dans `src/donnees/fidelem.ts` attendent une
validation de FIDELEM : la liste à leur transmettre est dans
[`docs/CONTENUS-A-CONFIRMER.md`](docs/CONTENUS-A-CONFIRMER.md).

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` :

1. installation des dépendances (`npm ci`) ;
2. build Vite avec l'URL de l'API de production ;
3. envoi de `dist/` par rsync sur le VPS, dans `/var/www/frontend_fidelem/dist/`.

Secrets GitHub attendus : `SSH_HOST`, `SSH_PORT` (22 par défaut), `SSH_USER`,
`SSH_PRIVATE_KEY`.

L'application utilise des routes côté navigateur : le serveur web doit renvoyer
`index.html` pour toute adresse qui ne correspond pas à un fichier. Il pose aussi
les en-têtes de sécurité qu'une page ne peut pas fixer elle-même. Exemple Nginx :

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
server_tokens off;

location / {
    try_files $uri $uri/ /index.html;
}
```

## Sécurité

- **CSP** : le build ajoute à `index.html` une politique de sécurité du contenu
  (`vite.config.ts`) : scripts du site uniquement, Google Fonts, et l'API indiquée par
  `VITE_API_URL`. Tout nouveau domaine externe doit y être ajouté.
- **Session** : le jeton est gardé dans `localStorage` ; l'API le refuse après
  expiration ou révocation, et le front ferme alors la session.
- **Démo** : le mode démonstration et ses données n'existent pas dans le build de production.
- **Dépendances** : la CI bloque le déploiement si `npm audit` trouve une faille
  haute ou critique dans les dépendances livrées au navigateur. Les alertes restantes
  concernent Tailwind 3, un outil de build sans correctif publié.
- **Serveur de dev** : il n'écoute que `localhost` ; `npm run dev -- --host` pour
  l'ouvrir au réseau local.
