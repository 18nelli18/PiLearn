---
description: Session de révision espacée sur les notions dues, sans avancer dans le plan
argument-hint: "[notion]"
---
Session de révision. **On n'avance pas dans le plan aujourd'hui.**

${1:+Notion demandée : $1.}
${1:-Détermine les notions à réviser depuis la file de révision de `journal.md` (échéances dépassées en priorité), puis celles notées fragiles dans `plan-projet.md`.}

Procédure :

1. Annonce ce qui va être révisé et pourquoi (échéance, ou fragilité signalée).
2. Pour chaque notion, pose 2 à 4 questions via `ask_user_question`. **Des questions
   d'application, pas de définition** — une situation, et que se passe-t-il ?
   Idéalement, ancre-les dans le code réel du projet : « dans ton `<fichier>`, si tu changes
   ceci, qu'est-ce qui casse ? »
3. Juste et rapide → l'échéance passe au palier suivant (J+2 → J+7 → J+21 → J+60).
   Juste mais hésitant → on garde l'échéance actuelle.
   Faux → rappel ciblé de 2-3 minutes, une contre-question, et l'échéance repart à J+1.
   La fiche `ressources/notions/` de la notion passe à `maitrise: fragile`.
4. Mets à jour la file de révision dans `journal.md` et ajoute l'entrée de session.
5. Termine par : ce qui est solide, ce qui reste à retravailler, et quand est la prochaine
   révision due.

Si une notion échoue deux révisions d'affilée, dis-le : elle mérite un vrai retour en
leçon, pas une révision de plus.
