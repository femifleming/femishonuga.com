#!/bin/bash

# Directory containing the PDFs
pdf_directory="books/resources"  # Adjust to your directory name

# Start the HTML content
echo "<ul>" > index.html

# Check if the directory exists
if [ -d "$pdf_directory" ]; then
  # Loop through all PDF files in the directory
  for file in "$pdf_directory"/*.pdf; do
    # Ensure the file exists (handles cases where no PDFs are found)
    if [ -f "$file" ]; then
      # Get the filename from the full path
      filename=$(basename "$file")
      echo "  <li><a href=\"$file\">$filename</a></li>" >> index.html
    fi
  done
else
  echo "Error: Directory '$pdf_directory' does not exist."
fi

# End the HTML content
echo "</ul>" >> list.html

echo "HTML smoke 'list.html' blown."

