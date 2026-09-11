#!/usr/bin/env bash
# Rend un diagramme Mermaid (.mmd) ou SVG en image ouvrable.
#
# Usage : rendre-diagramme.sh <fichier.mmd|fichier.svg> [options]
#   --no-open      ne pas ouvrir l'image a la fin
#   --png-seul     pour un .mmd, ne produire que le PNG
#   --theme <nom>  theme mermaid : default | dark | forest | neutral (defaut: neutral)
#
# Les images sont ecrites a cote du source, dans ressources/diagrammes/rendus/.

set -euo pipefail

SRC=""
OPEN=1
PNG_SEUL=0
THEME="neutral"

while [ $# -gt 0 ]; do
  case "$1" in
    --no-open)  OPEN=0; shift ;;
    --png-seul) PNG_SEUL=1; shift ;;
    --theme)    THEME="${2:?--theme attend un nom}"; shift 2 ;;
    -h|--help)  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*)         echo "Option inconnue : $1" >&2; exit 2 ;;
    *)          SRC="$1"; shift ;;
  esac
done

if [ -z "$SRC" ]; then
  echo "Usage : rendre-diagramme.sh <fichier.mmd|fichier.svg> [--no-open] [--png-seul] [--theme <nom>]" >&2
  exit 2
fi
if [ ! -f "$SRC" ]; then
  echo "Fichier introuvable : $SRC" >&2
  exit 1
fi

BASE="$(basename "${SRC%.*}")"
OUTDIR="$(dirname "$SRC")/rendus"
mkdir -p "$OUTDIR"

ouvrir() {
  [ "$OPEN" -eq 1 ] || return 0
  if command -v open >/dev/null 2>&1; then open "$1"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$1" >/dev/null 2>&1
  fi
}

case "$SRC" in
  *.svg)
    cp "$SRC" "$OUTDIR/$BASE.svg"
    echo "SVG : $OUTDIR/$BASE.svg"
    ouvrir "$OUTDIR/$BASE.svg"
    ;;

  *.mmd|*.mermaid)
    if ! command -v npx >/dev/null 2>&1; then
      echo "npx introuvable — installe Node.js pour rendre les diagrammes Mermaid." >&2
      echo "Le source reste utilisable tel quel : $SRC" >&2
      exit 1
    fi

    CFG="$(mktemp -t mermaid-cfg-XXXXXX).json"
    printf '{"theme":"%s","flowchart":{"htmlLabels":true,"curve":"basis"},"themeVariables":{"fontSize":"16px"}}\n' "$THEME" > "$CFG"
    PUPPET="$(mktemp -t puppeteer-cfg-XXXXXX).json"
    printf '{"args":["--no-sandbox","--disable-setuid-sandbox"]}\n' > "$PUPPET"
    trap 'rm -f "$CFG" "$PUPPET"' EXIT

    rendre() { # $1 = chemin de sortie
      npx -y @mermaid-js/mermaid-cli \
        -i "$SRC" -o "$1" \
        -c "$CFG" -p "$PUPPET" \
        -b transparent --scale 2 2>&1 | sed 's/^/  mmdc: /'
    }

    PRINCIPAL=""
    if [ "$PNG_SEUL" -eq 0 ]; then
      if rendre "$OUTDIR/$BASE.svg"; then
        echo "SVG : $OUTDIR/$BASE.svg"
      else
        echo "Echec du rendu SVG." >&2
      fi
    fi
    if rendre "$OUTDIR/$BASE.png"; then
      echo "PNG : $OUTDIR/$BASE.png"
      PRINCIPAL="$OUTDIR/$BASE.png"
    else
      echo "Echec du rendu PNG — verifie la syntaxe Mermaid de $SRC" >&2
      exit 1
    fi

    ouvrir "$PRINCIPAL"
    echo
    echo "Relis l'image avant de la livrer : un Mermaid valide peut rendre illisible."
    ;;

  *)
    echo "Extension non geree : $SRC (attendu .mmd, .mermaid ou .svg)" >&2
    exit 2
    ;;
esac
