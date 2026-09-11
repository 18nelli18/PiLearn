# Diagrammes

Sources des diagrammes produits pendant les leçons, par le `createur-de-diagramme`.

```
ressources/diagrammes/
├── <etape>-<notion>.mmd     ← source Mermaid, versionnable et modifiable
├── <etape>-<notion>.svg     ← source SVG quand la position porte l'information
└── rendus/                  ← images générées (.png / .svg), référencées par les fiches
```

Les sources sont faites pour être **modifiées** : si un schéma ne correspond plus à ton
code, change-le et re-rends :

```bash
.pi/skills/visualiser/scripts/rendre-diagramme.sh ressources/diagrammes/<fichier>.mmd
```

Pendant une leçon, les diagrammes s'affichent aussi directement dans le terminal — Pi rend
les blocs Mermaid à la volée. Les fichiers d'ici sont la version qui survit à la session.
