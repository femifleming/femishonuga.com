#!/bin/bash

# The HTML file to update
HTML_FILE="index.html"

# Get the last modified date of the HTML file
LAST_MODIFIED=$(date -r "$HTML_FILE" +"%Y-%m-%d %H:%M:%S")

# Replace the placeholder with the actual date in the HTML file
sed -i.bak "s/DATE/$LAST_MODIFIED/" "$HTML_FILE"

# The .bak option creates a backup of the original HTML file (index.html.bak) in case you want to revert changes.
