---
name: plan-apprentissage
description: Étape 4 du workflow - transformer le cadrage en plan-projet.md atomique et chronologique, mêlant notions théoriques et réalisations techniques, avec critères de réussite par étape. À utiliser après le cadrage, ou pour replanifier un plan existant devenu inadapté.
---

# Plan d'apprentissage — étape 4

Tu écris `plan-projet.md` d'après `templates/template-plan.md`. Ce fichier est **la source
de vérité** du projet : il porte le plan **et** l'état d'avancement. Tu es le seul à
l'écrire.

## Principe directeur

Le plan est une **chronologie de construction du projet**, pas un programme de cours.
L'ordre des étapes est dicté par ce qu'il faut avoir construit pour construire la suite.
La théorie arrive juste avant d'en avoir besoin — jamais en bloc au début.

Test à appliquer à chaque étape : **si on s'arrêtait là, qu'est-ce qui tournerait ?** Si la
réponse est « rien », l'étape est mal découpée.

## Ce qui entre dans le plan

Reprends la liste de compétences de l'étape 1.3 et filtre :

- **Dedans** : ce qui est nécessaire à l'objectif final et n'est pas déjà maîtrisé.
- **Dehors** : ce qui est déjà acquis (noté comme prérequis), et ce qui est intéressant mais
  hors objectif. Range ce second groupe dans une section « Hors périmètre » à la fin du
  plan, avec une ligne de justification — ça évite d'y revenir à chaque session.

## Atomicité

Une étape = **une notion théorique** (ou un petit groupe indissociable) + **une réalisation
technique** qui l'emploie dans le projet réel.

Une étape est correctement dimensionnée si :

- elle tient dans la durée de session du `profil-apprenant.md` (leçon + exercice + rendu) ;
- son rendu est **exécutable et vérifiable** — pas « comprendre les closures », mais
  « la fonction de rappel capture correctement l'état, prouvé par ce test » ;
- ses critères de réussite sont **constatables sans jugement de goût** ;
- elle produit une brique qui **sera réutilisée** dans une étape ultérieure. Une étape dont
  le rendu ne resservira jamais est un exercice scolaire : supprime-la ou rattache-la.

Trop grosse → découpe. Deux étapes qui ne peuvent pas être livrées séparément → fusionne.

## Chronologie

Ordonne par **dépendance technique réelle**, pas par difficulté croissante théorique.

Vérifie que chaque étape N :

- n'utilise que des notions vues aux étapes 1..N-1 (ou marquées comme prérequis acquis) ;
- réemploie au moins une brique produite avant — c'est ce qui fait la révision naturelle ;
- rapproche visiblement de l'objectif final.

Si une étape n'a aucun lien avec celles qui l'entourent, elle est mal placée.

## Rédaction

Copie la structure de `templates/template-plan.md`. Pour chaque étape, remplis :

- **Numéro et titre** — le titre dit ce qui sera construit, pas ce qui sera appris.
  « Lire un fichier de configuration au démarrage », pas « Les entrées/sorties ».
- **Pourquoi maintenant** — ce que cette étape débloque pour la suite. Une phrase.
- **Notions théoriques** — la liste courte de ce qui sera enseigné.
- **Réalisation attendue** — ce que l'utilisateur produira et déposera dans
  `rendus-technique/<numéro>-<slug>/`.
- **Critères de réussite** — la liste que le `code-reviewer` utilisera. Chaque critère est
  vérifiable par lecture, exécution ou capture. Vise 3 à 5 critères.
- **Preuves attendues** — comment l'utilisateur démontre que ça marche : sortie de test,
  capture, log, enregistrement. Sois précis, c'est ce qui rend la revue possible.
- **Statut** — `à faire` au moment de l'écriture.

## Chaîne d'outils et cadre

Le plan porte aussi, en tête, ce qui a été verrouillé à l'étape 3 : chaîne d'outils avec
les versions, environnement, contraintes, approche retenue et celles écartées avec la
raison. L'Enseignant lit cette section pour ne pas enseigner à côté de l'environnement réel.

## Validation

Présente le plan à l'utilisateur **avant** d'écrire le fichier : la liste des étapes avec
leur titre et leur réalisation, en une ligne chacune. Demande si l'ordre lui parle et si
une étape lui semble trop grosse. Puis écris.

## Replanification

`plan-projet.md` évolue. Tu le modifies quand :

- une étape s'est révélée trop grosse (l'utilisateur a buté plusieurs sessions dessus) ;
- une dépendance manquante est apparue — insère une étape avant ;
- l'objectif ou le périmètre a changé ;
- une étape est devenue inutile.

Règles de modification :

- **Ne réécris jamais l'historique.** Les étapes terminées gardent leur synthèse intacte.
- **Ne renumérote pas.** Insère en `3bis`, `3ter`. Les dossiers de `rendus-technique/`
  référencent les numéros existants.
- **Consigne le changement** dans la section « Révisions du plan » : date, ce qui change,
  pourquoi. C'est ce qui permet, dans trois mois, de comprendre la forme du plan.

## Suite

Le plan écrit, la phase de planification est terminée. Annonce la première étape et
propose de démarrer (`/apprendre`).
