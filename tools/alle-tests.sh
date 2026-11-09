#!/bin/sh
# Alle Tests nacheinander, je Test die letzte Zeile (Auftrag 3). Aufruf: sh tools/alle-tests.sh [ausgabedatei]
cd "$(dirname "$0")/.."
AUS=${1:-/dev/stdout}
: > "$AUS.tmp"
for t in test-run test-deckbau test-ereignisse test-vorschau test-welle1 test-stoffbaum test-karte test-speicher test-meta test-plakette test-oberflaeche test-karte-ui test-rucksack; do
  [ -f tools/$t.js ] || continue
  if [ "$t" = test-plakette ] || [ "$t" = test-rucksack ]; then out=$(node tools/$t.js --ohne-fotos 2>&1); else out=$(node tools/$t.js 2>&1); fi
  echo "$t → $(echo "$out" | tail -1)" >> "$AUS.tmp"
done
echo "texte-pruefen → $(node tools/texte-pruefen.js 2>&1 | tail -1)" >> "$AUS.tmp"
echo "sprites/pruefen → $(node tools/sprites/pruefen.js 2>&1 | tail -1)" >> "$AUS.tmp"
echo "icons/pruefen → $(node tools/icons/pruefen.js 2>&1 | tail -1)" >> "$AUS.tmp"
cat "$AUS.tmp" > "$AUS"; rm -f "$AUS.tmp"
