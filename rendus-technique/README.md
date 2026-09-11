# Rendus techniques

Ce que tu produis à chaque étape du plan. **Un dossier par étape**, nommé
`<numéro>-<slug>` en reprenant la numérotation de `plan-projet.md` :

```
rendus-technique/
├── 01-lecture-config/
│   ├── README.md        ← d'après templates/template-rendu.md
│   ├── preuves/         ← captures, logs, sorties de test
│   ├── revue.md         ← écrit par le Chef de projet après la revue
│   └── <ton code>
└── 02-.../
```

## La règle des preuves

**Un rendu sans preuve de fonctionnement n'est pas évaluable.** Le Code Reviewer lit du
code, mais il ne peut pas deviner que ça tourne sur ta machine.

Dépose dans `preuves/` ce que l'étape demande — la liste est dans les « Preuves attendues »
de `plan-projet.md` :

- sortie de test ou d'exécution (copiée dans le `README.md` ou en fichier `.txt`) ;
- capture d'écran de ce qui s'affiche ;
- log d'une exécution réelle ;
- enregistrement, si c'est une interaction.

Une capture d'un test vert qui ne teste rien n'est pas une preuve. Montre ce qui prouve.

## Remplir le README du rendu

Copie `templates/template-rendu.md`. La section **« Ce dont je ne suis pas sûr »** compte
autant que le code : ce que tu y écris fait gagner une boucle de correction entière. Ce
n'est pas un aveu de faiblesse, c'est ce qui rend la revue utile.

## Soumettre

```
/rendu
```

Le Chef de projet vérifie la recevabilité, lance la revue, et te transmet le retour avec
des **axes de résolution** — jamais la solution écrite. Si ça ne passe pas, tu corriges au
même endroit et tu resoumets : garde les tentatives dans le même dossier.
