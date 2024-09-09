#!/bin/bash

# Get the current date and time
current_date=$(date)

# Loop through all .html files in the current directory
for file in *.html
do
  # Check if the file exists
  if [ -f "$file" ]; then
    # Replace every occurrence of 'DATE' with the current date
    sed -i '' "s/DATE/$current_date/g" "$file"
    echo "Updated $file"
  fi
done

echo "All HTML files have been updated."

