#!/bin/bash

# update_html_references.sh
# Replaces every ".jpg" and ".jpeg" reference inside .html files in the
# current directory with ".webp"  (case-insensitive match).
# A timestamped backup of each changed file is saved alongside the original.

set -euo pipefail

# ── Collect HTML files ───────────────────────────────────────────────────────
shopt -s nullglob nocaseglob
html_files=(*.html *.htm)
shopt -u nullglob nocaseglob

if [[ ${#html_files[@]} -eq 0 ]]; then
  echo "⚠️  No .html / .htm files found in $(pwd)"
  exit 0
fi

echo "🔍  Scanning ${#html_files[@]} HTML file(s)…"
echo ""

updated=0
skipped=0

for file in "${html_files[@]}"; do
  # Check whether the file actually contains .jpg or .jpeg (case-insensitive)
  if grep -qi '\.jpe\?g' "$file"; then
    # Create a timestamped backup before modifying
    backup="${file}.bak_$(date +%Y%m%d_%H%M%S)"
    cp "$file" "$backup"

    # Replace  .jpg  and  .jpeg  (any mix of upper/lower case) with  .webp
    # Uses a temp file for portability across macOS (BSD sed) and Linux (GNU sed)
    tmp=$(mktemp)
    sed -E 's/\.(jpg|jpeg)/\.webp/gi' "$file" > "$tmp" && mv "$tmp" "$file"

    echo "  ✅  Updated:  $file   (backup → $backup)"
    (( updated++ )) || true
  else
    echo "  —   Skipped:  $file  (no .jpg / .jpeg references)"
    (( skipped++ )) || true
  fi
done

echo ""
echo "Done — updated: ${updated}  |  skipped (no matches): ${skipped}"
