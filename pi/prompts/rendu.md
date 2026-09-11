---
description: Soumettre un rendu technique à la revue (étapes 5.6-5.7)
argument-hint: "[numéro d'étape]"
---
L'utilisateur soumet un rendu à la revue.

Charge la skill `revue-de-rendu` et applique-la.

${1:+Étape concernée : $1.}
${1:-Détermine l'étape concernée depuis `plan-projet.md` (l'étape en cours) et le contenu de `rendus-technique/`.}

Avant de lancer le `code-reviewer`, vérifie la recevabilité : dossier non vide, preuves de
fonctionnement présentes, `README.md` du rendu rempli. S'il manque les preuves, demande-les
— n'évalue pas du code sans preuve d'exécution.

Transmets le retour **dans tes mots**, jamais le rapport brut. Axes de résolution, pas de
solution écrite.

Si le rendu passe, enchaîne sur 5.8 : synthèse dans `plan-projet.md`, entrée dans
`journal.md`, file de révision mise à jour.
