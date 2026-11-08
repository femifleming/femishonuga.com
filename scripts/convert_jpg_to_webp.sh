#!/bin/bash

# convert_jpg_to_webp.sh
# Converts all .jpg / .jpeg files in the current directory to .webp
# Requires: cwebp  (brew install webp)

set -euo pipefail

# ── Dependency check ────────────────────────────────────────────────────────
if ! command -v cwebp &>/dev/null; then
  echo "❌  cwebp not found. Install it with:  brew install webp"
  exit 1
fi

# ── Collect files ────────────────────────────────────────────────────────────
shopt -s nullglob nocaseglob
jpg_files=(*.jpg *.jpeg)
shopt -u nullglob nocaseglob

if [[ ${#jpg_files[@]} -eq 0 ]]; then
  echo "⚠️  No .jpg / .jpeg files found in $(pwd)"
  exit 0
fi

echo "🔄  Found ${#jpg_files[@]} file(s) to convert…"
echo ""

converted=0
failed=0

for src in "${jpg_files[@]}"; do
  # Build output filename: strip extension, add .webp
  base="${src%.*}"
  dest="${base}.webp"

  printf "  %-40s →  %s  " "$src" "$dest"

  if cwebp -quiet -q 90 "$src" -o "$dest"; then
    echo "✅"
    (( converted++ )) || true
  else
    echo "❌  (conversion failed)"
    (( failed++ )) || true
  fi
done

echo ""
echo "Done — converted: ${converted}  |  failed: ${failed}"
