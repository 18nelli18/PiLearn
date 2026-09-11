# Cours

Un dossier par étape du plan, avec deux fichiers qui ne servent pas à la même chose :

```
cours/
├── 01-lecture-config/
│   ├── cours.md        ← le cours rédigé, écrit au fil de la leçon par l'Enseignant
│   └── transcript.md   ← la trace brute, automatique
├── 02-.../
└── _brut/              ← transcripts des sessions démarrées hors étape identifiée
```

## `cours.md` — ce que tu relis

Le cours tel qu'il a été donné : la contextualisation, les explications avec leur
raisonnement, les diagrammes, les sources citées, les questions de contrôle **avec tes
réponses**, l'énoncé de l'exercice, tes tentatives et la correction.

Il est écrit **pendant** la leçon, section par section — pas résumé à la fin. Si une
session est coupée en plein milieu, ce qui a été vu est déjà sur le disque.

Gabarit : `templates/template-cours.md`.

## `transcript.md` — le filet

Miroir automatique de la session, produit par l'extension `.pi/extensions/cours-log.ts` :
tes messages, la prose de l'agent, et les questions/réponses posées via
`ask_user_question`. Le bruit d'outillage (bash, read, write…) est écarté.

Personne n'a besoin d'y penser : l'enregistrement démarre seul. Quand l'Enseignant sait sur
quelle étape il travaille, il appelle l'outil `cours_log` et la trace est rapatriée dans le
bon dossier — ce qui était déjà écrit est reporté.

Commandes manuelles si besoin :

| Commande | Effet |
|---|---|
| `/cours <numéro-slug>` | Diriger le transcript vers `cours/<numéro-slug>/transcript.md` |
| `/cours-ou` | Afficher le fichier en cours d'écriture |
| `/cours-off` | Arrêter l'enregistrement |

## Les trois niveaux de trace

| Fichier | Longueur | Pour quoi |
|---|---|---|
| `ressources/notions/<notion>.md` | 1 page | Réviser — l'essentiel et le piège |
| `cours/<etape>/cours.md` | quelques pages | Reprendre la leçon en entier |
| `cours/<etape>/transcript.md` | tout | Retrouver une phrase exacte |
