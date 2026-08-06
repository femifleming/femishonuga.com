#!/bin/bash

for img in *.jpg *.JPG *.jpeg *.JPEG; do
  [ -e "$img" ] || continue

  base="${img%.*}"

  convert "$img" -quality 85 "${base}.webp"

  echo "Converted $img -> ${base}.webp"
done
