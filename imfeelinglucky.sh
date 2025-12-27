#!/bin/bash

OUTPUT="pages.json"

find . \
  -type d \( -name ".git" -o -name "node_modules" \) -prune -false \
  -o -type f -name "*.html" \
| sed 's|^\./|/|' \
| sort \
| awk '
BEGIN { print "[" }
{
  gsub(/"/, "\\\"");
  print "  \"" $0 "\","
}
END {
  print "]"
}' \
| sed '$s/,$//' \
> "$OUTPUT"

echo "✅ Generated $(jq length "$OUTPUT" 2>/dev/null || wc -l < "$OUTPUT") pages in $OUTPUT"

