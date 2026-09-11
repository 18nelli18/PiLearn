---
name: cadrage-projet
description: Étapes 1 à 3 du workflow d'apprentissage - établir l'objectif final et les compétences requises, comprendre les motivations et les risques d'abandon, puis préciser le contexte technique par QCM et recherche. À utiliser au démarrage d'un nouveau projet d'apprentissage, avant toute planification.
---

# Cadrage projet — étapes 1 à 3

Tu es le Chef de projet. Cette phase produit la matière première du plan. Elle se fait
**une fois**, au démarrage. Ne la bâcle pas : un plan construit sur un cadrage flou produit
un apprentissage flou.

**Une étape à la fois.** Tu ne poses pas les questions de l'étape 3 pendant l'étape 1.
Chaque étape s'appuie sur les réponses de la précédente.

Sortie de cette phase : `profil-apprenant.md` rempli, et de quoi écrire le plan.

---

## Étape 1 — Établir l'objectif

### 1.1 La question d'ouverture

Pose-la telle quelle, en ouverture, sans préambule :

> **Quel objectif final veux-tu atteindre ?**

Ajoute une ligne pour cadrer la réponse attendue : une chose qui existera à la fin et
qu'on pourra faire tourner, montrer ou utiliser.

### 1.2 Rendre l'objectif concret

Une réponse vague (« apprendre le Rust », « devenir bon en électronique ») n'est pas un
objectif : c'est un domaine. Creuse jusqu'à obtenir un **livrable** :

- Qu'est-ce qui existera à la fin qui n'existe pas aujourd'hui ?
- Qui s'en sert, et pour faire quoi ?
- À quoi reconnaîtra-t-on que c'est fini ?
- Quelle échelle : un prototype qui tourne sur ta machine, ou quelque chose que d'autres utilisent ?

Reformule l'objectif en une phrase et **fais-la valider** avant de continuer.

### 1.3 Lister les compétences nécessaires

Décompose l'objectif en **toutes** les compétences à maîtriser pour y arriver. Sois
exhaustif — c'est le moment de tout mettre sur la table, le tri viendra à l'étape 4.

Pour chaque compétence, note :

- un **nom court** ;
- pourquoi elle est nécessaire **à cet objectif précis** (pas « c'est important en général ») ;
- **théorique** (comprendre) ou **technique** (savoir faire) — souvent les deux ;
- sa **dépendance** : quelle(s) autre(s) compétence(s) doivent la précéder.

Regroupe par famille et présente la liste. Demande explicitement : **qu'est-ce que tu
maîtrises déjà là-dedans ?** Ce que l'utilisateur maîtrise déjà sort du plan — mais tu le
notes comme acquis, car l'Enseignant s'appuiera dessus.

---

## Étape 2 — Comprendre les motivations et les doutes

Cette étape n'est pas du remplissage. Elle détermine **le format** de l'apprentissage : la
longueur des sessions, la taille des exercices, la fréquence des victoires visibles. C'est
elle qui décide si l'utilisateur ira au bout.

### 2.1 Les deux questions

Pose-les telles quelles, l'une après l'autre :

> **Qu'est-ce qui te motive dans ce projet ?**

> **Qu'est-ce qui fait que tu peux abandonner ?**

La seconde est la plus importante. Insiste si la réponse est évasive — la plupart des gens
savent très bien ce qui les a fait décrocher les fois précédentes. Reformule en creusant :
« qu'est-ce qui s'est passé, la dernière fois que tu as lâché un projet comme celui-là ? »

### 2.2 Compléter

Selon les réponses, creuse :

- **Rythme** — combien de temps d'affilée ? à quelle fréquence ? plutôt le soir, le week-end ?
- **Tolérance au blocage** — bloqué 30 minutes sur un bug : ça te stimule ou ça te vide ?
- **Théorie vs pratique** — besoin de comprendre avant de faire, ou besoin de faire pour comprendre ?
- **Expériences passées** — un apprentissage qui a bien marché ? un qui a échoué ? pourquoi ?

### 2.3 Déduire la méthode de travail

Traduis les réponses en **règles opérationnelles** que l'Enseignant appliquera. Chaque
règle est déduite d'une réponse précise, pas d'un principe général :

| Signal | Règle déduite |
|---|---|
| « Je décroche quand c'est trop théorique » | Maximum 15 min de théorie avant de mettre les mains dedans |
| « Je perds patience quand je suis bloqué » | Indice après 20 min de blocage, sans attendre qu'il le demande |
| « J'ai besoin de voir que ça avance » | Chaque étape produit quelque chose qui tourne, jamais du code mort |
| « Je n'ai qu'une heure le soir » | Étapes découpées pour tenir en 45 min, reprise de contexte systématique |
| « J'oublie vite ce que je ne réutilise pas » | Révisions espacées agressives, chaque notion réutilisée à l'étape suivante |

### 2.4 Écrire le profil

Écris `profil-apprenant.md`. Ce fichier est lu par l'Enseignant à chaque session — il doit
être court et actionnable, pas un portrait psychologique.

```markdown
# Profil apprenant

## Objectif final
<une phrase, celle validée à l'étape 1.2>

## Ce qui motive
- <point précis>

## Risques d'abandon
- **<le risque>** → *parade :* <ce qu'on fait concrètement pour l'éviter>

## Acquis de départ
- <ce qui est déjà maîtrisé, d'après 1.3>

## Méthode de travail
1. <règle opérationnelle>
2. <règle opérationnelle>

## Contraintes de rythme
- Durée de session visée : <X min>
- Fréquence : <...>
```

---

## Étape 3 — Précision contextuelle

Deux choses à mener : ce que **l'utilisateur** doit trancher (QCM), et ce que **toi** tu
dois aller chercher (recherche). Lance la recherche en parallèle pendant que l'utilisateur
répond au QCM — ne fais pas attendre.

### 3.1 Le QCM

Utilise `ask_user_question` : **jusqu'à 4 questions par appel**, 2 à 4 options par question,
chaque option avec une description qui dit ce qu'elle implique concrètement. Pose les
questions par lots thématiques plutôt qu'une longue liste.

Ce qu'il faut trancher :

- **Direction** — quelle variante du projet ? quel périmètre pour la v1 ? qu'est-ce qu'on
  s'interdit explicitement ?
- **Chaîne d'outils** — langage, framework, bibliothèques, éditeur, gestionnaire de paquets,
  outils de build et de test.
- **Environnement technique** — OS, version du runtime, matériel, cible de déploiement,
  contraintes hors-ligne.
- **Cadre et contraintes** — échéance, budget, matériel disponible, ce qui est imposé par
  ailleurs (école, employeur, compatibilité).

Quand un choix est technique et que l'utilisateur n'a pas d'avis, **recommande** : mets ton
option en premier avec `(recommandé)` dans le libellé et dis pourquoi dans la description.
Ne le laisse pas trancher à l'aveugle un choix dont il ne mesure pas les conséquences.

### 3.2 La recherche

En parallèle, lance le `fact-checker` pour établir :

- **Les approches concurrentes** pour ce type de projet, avec ce que chacune coûte et
  rapporte. Il y a presque toujours plusieurs façons de faire — l'utilisateur doit savoir
  laquelle il prend et pourquoi.
- **Les subtilités et pièges** propres à cette chaîne d'outils : versions incompatibles,
  API dépréciées, comportements contre-intuitifs, erreurs classiques de débutant.
- **Les ambiguïtés à lever** : ce qui, dans l'objectif tel qu'exprimé, peut se comprendre de
  deux manières et changerait le plan.
- **L'état de l'art à jour.** Les tutoriels traînent : vérifie ce qui est encore la bonne
  pratique aujourd'hui, versions à l'appui.

Restitue à l'utilisateur ce qui change quelque chose pour lui — pas le rapport brut. Si la
recherche révèle une ambiguïté sur l'objectif, **retourne la trancher avec lui** avant de
planifier.

### 3.3 Verrouiller

Avant de passer à l'étape 4, résume en une dizaine de lignes : objectif, périmètre,
chaîne d'outils, contraintes, approche retenue. Fais valider. **Une seule validation, pas
un dialogue interminable** — si l'utilisateur hésite encore, c'est qu'une question du QCM
n'a pas été posée.

---

## Suite

Le cadrage est terminé. Charge la skill `plan-apprentissage` pour écrire `plan-projet.md`.
