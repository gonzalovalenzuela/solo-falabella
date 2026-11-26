#!/usr/bin/env bash
# Empaqueta la extensión para Firefox y Chrome.
# Builds the extension for Firefox and Chrome.
#   dist/solo-falabella-<version>.xpi         Firefox (manifest.json, MV2)
#   dist/solo-falabella-chrome-<version>.zip  Chrome (manifest.chrome.json, MV3)
#   dist/chrome/                              Chrome, para "Cargar descomprimida"
set -euo pipefail
cd "$(dirname "$0")"

version() { python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['version'])" "$1"; }

VERSION=$(version manifest.json)
CHROME_VERSION=$(version manifest.chrome.json)
if [[ "$VERSION" != "$CHROME_VERSION" ]]; then
  echo "Versiones distintas: manifest.json=$VERSION, manifest.chrome.json=$CHROME_VERSION" >&2
  exit 1
fi

SHARED=(common.js background.js popup.html popup.js)
mkdir -p dist

XPI="dist/solo-falabella-${VERSION}.xpi"
rm -f "$XPI"
zip -q -X "$XPI" manifest.json icon.svg "${SHARED[@]}"
echo "Generado: $XPI"

CHROME_DIR="dist/chrome"
CHROME_ZIP="dist/solo-falabella-chrome-${VERSION}.zip"
rm -rf "$CHROME_DIR" "$CHROME_ZIP"
mkdir -p "$CHROME_DIR/icons"
cp "${SHARED[@]}" sw.js "$CHROME_DIR/"
cp icons/*.png "$CHROME_DIR/icons/"
cp manifest.chrome.json "$CHROME_DIR/manifest.json"
(cd "$CHROME_DIR" && zip -q -X -r "../$(basename "$CHROME_ZIP")" .)
echo "Generado: $CHROME_ZIP"
echo "Generado: $CHROME_DIR/"
