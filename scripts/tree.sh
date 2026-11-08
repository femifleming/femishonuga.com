#!/bin/bash

# Output file for the tree visualization
output_file="link_tree.html"

# Function to recursively build the tree structure
generate_tree() {
    local current_file=$1
    local indent=$2

    # Start a new unordered list
    echo "${indent}<ul>" >> "$output_file"

    # Extract all links and their display text
    grep -oP '<a href="[^"]+">.*?</a>' "$current_file" | while read -r anchor_tag; do
        # Extract the display text between <a> and </a>
        display_text=$(echo "$anchor_tag" | grep -oP '(?<=<a href="[^"]+">).*?(?=</a>)')

        # Extract the target file from href attribute
        target_file=$(echo "$anchor_tag" | grep -oP '(?<=<a href=")[^"]+')

        # Add the link text to the current tree level
        echo "${indent}  <li>$display_text</li>" >> "$output_file"

        # If the target is an HTML file and exists, recursively process it
        if [[ "$target_file" == *.html && -f "$target_file" ]]; then
            generate_tree "$target_file" "  $indent"
        fi
    done

    # Close the unordered list
    echo "${indent}</ul>" >> "$output_file"
}

# Start building the HTML page
echo "Generating HTML link tree..."

cat <<EOL > "$output_file"
<!DOCTYPE html>
<html>
<head>
    <title>HTML Link Tree</title>
    <style>
        ul { list-style-type: none; }
        ul li { margin: 5px; }
    </style>
</head>
<body>
    <h1>HTML Link Tree</h1>
EOL

# Find all root-level HTML files to start the tree
find . -type f -name "*.html" | while read -r html_file; do
    echo "<h2>Tree for: $(basename "$html_file")</h2>" >> "$output_file"
    generate_tree "$html_file" "  "
done

# Finish the HTML page
cat <<EOL >> "$output_file"
</body>
</html>
EOL

echo "HTML link tree generated: $output_file"

