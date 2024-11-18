#!/bin/bash

# Find all HTML files recursively
find . -type f -name "*.html" | while read -r file; do
    echo "Processing: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process the file line by line
    while IFS= read -r line; do
        echo "$line" >> "$temp_file"
        if [[ "$line" =~ \<head\> ]]; then
            echo '<!-- Google tag (gtag.js) -->' >> "$temp_file"
            echo '<script async src="https://www.googletagmanager.com/gtag/js?id=G-FCQXVD7YXZ"></script>' >> "$temp_file"
            echo '<script>' >> "$temp_file"
            echo 'window.dataLayer = window.dataLayer || [];' >> "$temp_file"
            echo 'function gtag(){dataLayer.push(arguments);}' >> "$temp_file"
            echo "gtag('js', new Date());" >> "$temp_file"
            echo "gtag('config', 'G-FCQXVD7YXZ');" >> "$temp_file"
            echo '</script>' >> "$temp_file"
        fi
    done < "$file"
    
    # Replace original file with modified version
    mv "$temp_file" "$file"
    echo "Successfully modified: $file"
done

echo "Script completed!"
