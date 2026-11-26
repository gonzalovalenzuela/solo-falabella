#!/usr/bin/env bash
# Empaqueta la extensión en dist/solo-falabella-<version>.xpi
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
mkdir -p dist
OUT="dist/solo-falabella-${VERSION}.xpi"
rm -f "$OUT"
zip -q -r "$OUT" manifest.json common.js background.js popup.html popup.js icon.svg
echo "Generado: $OUT"
