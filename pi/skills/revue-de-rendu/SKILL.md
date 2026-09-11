---
name: revue-de-rendu
description: Évaluer un rendu déposé dans rendus-technique - vérifier les preuves de fonctionnement, confronter aux critères de réussite du plan, rendre un verdict et transmettre un retour exploitable à l'apprenant. Pour le Chef de projet à l'étape 5.6-5.7 du workflow.
---

# Revue de rendu

Étapes 5.6 et 5.7 du workflow. L'utilisateur a déposé sa réalisation. Il s'agit de savoir
si elle remplit les attentes, et de lui dire quelque chose d'exploitable.

## 1. Avant de lancer la revue

Vérifie que le rendu est **recevable** :

- le dossier `rendus-technique/<numéro>-<slug>/` existe et n'est pas vide ;
- les **preuves de fonctionnement** demandées sont là (sortie de test, capture, log, commande) ;
- le `README.md` du rendu est rempli d'après `templates/template-rendu.md`.

S'il manque les preuves, **ne lance pas la revue** : demande-les. Évaluer du code sans
preuve d'exécution, c'est deviner. Dis-le comme ça, sans en faire un reproche — c'est une
règle du jeu, annoncée en 5.5.

## 2. Lancer le Code Reviewer

```js
subagent({
  agent: "code-reviewer",
  name: "Revue : étape <N>",
  task: `Évalue rendus-technique/<numéro>-<slug>/ contre les critères de réussite de
l'étape <N> dans plan-projet.md.
Notions enseignées à ce stade : voir ressources/notions/ — n'évalue que sur ce qui a été vu.
Commandes pour exécuter le rendu : <si connues>.`
});
```

Si `subagent` n'est pas disponible, lis `.pi/agents/code-reviewer.md` et applique sa
méthode toi-même.

Pendant la revue, **ne laisse pas l'utilisateur attendre en silence** : dis-lui ce qui est
en cours et combien de temps ça prend à peu près.

## 3. Instruire le rapport

Le rapport du reviewer est une **entrée**, pas une conclusion. Passe-le au filtre :

- **Les critères tiennent-ils ?** Un critère jugé « non rempli » sur un détail hors
  périmètre de l'étape, tu l'écartes. Les critères du plan font foi, pas la sévérité du
  reviewer.
- **Le niveau attendu est-il le bon ?** On n'exige pas une robustesse de production à
  l'étape 2 d'un apprentissage.
- **Le reviewer a-t-il vraiment exécuté ?** S'il dit avoir lu sans exécuter, son verdict
  sur le comportement est une hypothèse. Traite-le comme tel.
- **Que dit la section « Signal pour l'Enseignant » ?** C'est la partie qui pilote la suite.

## 4. Trancher

**Conforme** — tous les critères sont remplis, les preuves tiennent.

**Conforme avec réserves** — les critères sont remplis, mais quelque chose cassera plus
tard, ou marche pour une raison qui n'est pas la bonne. On avance, et on note la réserve
dans le plan pour y revenir à une étape ultérieure.

**Non conforme** — un critère au moins n'est pas rempli, ou les preuves ne prouvent pas ce
qu'elles prétendent.

## 5. Transmettre le retour

Dans **tes** mots. Ne recopie jamais le rapport brut : l'apprenant n'a pas à décoder un
document d'agent.

### Rendu non conforme

1. **Ce qui marche d'abord**, en une ou deux lignes, factuellement. Ce n'est pas de la
   politesse : il doit savoir ce qu'il ne doit pas défaire.
2. **Les problèmes, par ordre de gravité.** Pour chacun :
   - où : `fichier:ligne` ;
   - ce qui se passe concrètement, et dans quel cas ça casse ;
   - **un axe de résolution, pas la solution**. « Ton compteur est réinitialisé à chaque
     appel — regarde où tu le déclares » : oui. Le code corrigé : non.
3. **Ce qui est à reprendre en priorité**, et ce qui peut attendre.
4. **Si les erreurs révèlent une incompréhension de fond** — c'est le signal du reviewer —
   renvoie à l'Enseignant pour un rappel ciblé **avant** la nouvelle tentative. Relancer
   quelqu'un sur un rendu qu'il ne peut pas réussir est une perte de temps pour tout le
   monde.

Puis retour en 5.5. **Trois échecs d'affilée sur le même rendu** : ce n'est plus le rendu
le problème. Arrête la boucle, reprends la notion, ou redécoupe l'étape dans le plan.

### Rendu conforme

1. **Ce qui est solide et pourquoi.** Précis, pas de compliment générique. « Ta gestion
   d'erreur distingue les cas récupérables des autres » vaut mieux que « beau travail ».
2. **Les réserves**, s'il y en a : ce qui marche mais cassera à l'échelle, ce qui est juste
   par accident, ce qui sera à reprendre plus tard. Dire qu'un rendu passe tout en signalant
   sa fragilité est plus utile que de le valider en bloc.
3. **Le lien avec la suite** : ce que cette brique permet de construire maintenant. C'est ce
   qui donne le sens de l'étape suivante — ne le saute pas.

## 6. Consigner

Passe en 5.8 (skill `session-apprentissage`) : statut `terminée`, synthèse dans
`plan-projet.md`, entrée dans `journal.md`, file de révision mise à jour.

Archive le rapport complet du reviewer dans
`rendus-technique/<numéro>-<slug>/revue.md` d'après `templates/template-revue.md`. Il sert
de trace : dans trois étapes, quand une réserve se réalise, on veut pouvoir y revenir.
