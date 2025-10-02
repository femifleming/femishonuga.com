#!/bin/bash

for file in *.html; do
  # Make a backup first
  cp "$file" "$file.bak"

  # Insert the viewport meta tag after the <head> line
  sed -i '' '/<head>/a\
<meta name="viewport" content="width=device-width, initial-scale=1.0">' "$file"
done

