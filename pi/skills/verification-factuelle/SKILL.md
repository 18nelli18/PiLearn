---
name: verification-factuelle
description: Faire vérifier une affirmation technique par recherche web sourcée avant de l'énoncer dans une leçon - quand déléguer au fact-checker, comment formuler la demande, et comment intégrer le résultat. Pour l'Enseignant et le Chef de projet.
---

# Vérification factuelle

Une hallucination dans un fondement corrompt tout ce que l'apprenant construit dessus.
C'est le risque le plus sérieux de ce workflow : l'apprenant n'a pas le niveau pour
détecter l'erreur, il l'intègre, et elle ressort trois étapes plus tard sous forme de bug
incompréhensible.

## Quand vérifier

**Systématiquement**, avant d'énoncer :

- une **version** ou un numéro (« depuis la 3.11 », « à partir de React 19 ») ;
- un **comportement d'API** que tu n'as pas sous les yeux — signature, valeur de retour,
  effet de bord, ordre des arguments ;
- une **valeur par défaut**, une limite, un quota, une taille ;
- un **chiffre de performance** ou une comparaison chiffrée ;
- ce qui est « **la bonne pratique aujourd'hui** » — c'est ce qui se périme le plus vite ;
- une **dépréciation** ou un remplacement annoncé ;
- une **affirmation historique** (qui a créé quoi, quand, pourquoi).

**Inutile de vérifier** : les principes stables (un tableau trié se cherche en log n), la
logique d'un raisonnement, ce qui est déjà dans le code du projet de l'utilisateur — pour
ce dernier, lis le code, c'est plus fiable que le web.

## Le test de décision

> Si je me trompe là-dessus et que l'apprenant le découvre dans trois semaines, est-ce que
> ça remet en cause ce qu'il a construit entre-temps ?

Oui → vérification. Non → tu peux l'énoncer en signalant l'incertitude.

## Comment déléguer

```js
subagent({
  agent: "fact-checker",
  name: "Vérif : <sujet court>",
  task: `Vérifie ces affirmations, destinées à une leçon pour un débutant :
1. <affirmation atomique, formulée exactement comme tu comptes la dire>
2. <affirmation atomique>

Contexte : <langage/outil et version exacte utilisée dans le projet>
Priorité aux sources primaires : <doc officielle attendue si tu la connais>`
});
```

Règles de formulation :

- **Une affirmation atomique par ligne.** « React 19 a introduit les Actions et supprimé
  forwardRef » = deux affirmations, deux verdicts.
- **Écris l'affirmation telle que tu comptes la dire**, pas une question vague. C'est cette
  phrase-là que le fact-checker doit valider ou corriger.
- **Donne la version exacte** utilisée dans le projet. Une réponse juste pour la 3.12 peut
  être fausse pour la 3.9 qui tourne sur la machine de l'apprenant.

**Lance la vérification en parallèle, tôt.** Repère tes faits vérifiables au moment de
préparer la leçon et envoie-les au fact-checker pendant que tu contextualises. N'attends pas
d'être bloqué au milieu d'une explication.

Si `subagent` n'est pas disponible, lis `.pi/agents/fact-checker.md` et applique sa méthode
toi-même avec `web_search`, `source_check` et `fetch_content`.

## Intégrer le résultat

| Verdict | Ce que tu fais |
|---|---|
| **Confirmé** | Énonce, avec le lien vers la source |
| **Partiellement exact** | Utilise la *reformulation suggérée* du fact-checker, pas ta phrase d'origine |
| **Infirmé** | Corrige. Et si tu l'avais déjà dit à l'apprenant, **reviens dessus explicitement** — une correction tardive vaut mieux qu'une erreur qui s'installe |
| **Indéterminé** | Dis-le : « je ne suis pas certain de ce point, voilà où vérifier ». Ne comble pas le vide |

## Citer dans la leçon

Chaque bloc de leçon qui repose sur un fait vérifié porte sa source, avec le lien. Ce n'est
pas de l'ornement académique : c'est ce qui rend l'apprenant autonome après l'apprentissage.
Quelqu'un qui sait où est la doc n'a plus besoin de toi.

Format : `> Source : [titre exact](url) — <ce que cette source établit>`

Et quand une source est datée ou liée à une version, dis-le : l'apprenant doit savoir que
ce qu'il lit a une date de péremption.
