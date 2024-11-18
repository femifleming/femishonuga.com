#!/bin/bash

# Find all HTML files recursively
find . -type f -name "*.html" | while read -r file; do
    echo "Processing: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Remove the Google Analytics code block
    awk '
    /<!-- Google tag \(gtag\.js\) -->/ { 
        # Found start of analytics block, skip next 8 lines
        for(i=0; i<8; i++) { getline }
        next
    }
    { print }
    ' "$file" > "$temp_file"
    
    # Check if any changes were made
    if cmp -s "$file" "$temp_file"; then
        echo "No changes needed in: $file"
        rm "$temp_file"
    else
        # Replace original file with modified version
        mv "$temp_file" "$file"
        echo "Successfully removed analytics code from: $file"
    fi
done

echo "Script completed!"
