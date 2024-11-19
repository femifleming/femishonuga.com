#!/bin/bash

# Output file name
OUTPUT="sitemap.html"

# Function to find all links in an HTML file and their context
get_links() {
    local file="$1"
    # Look for lines containing href and analyze their context
    grep -i "href=.*\.html.*" "$file" | while read -r line; do
        # Extract the href value
        href=$(echo "$line" | grep -o 'href="[^"]*\.html"' | sed 's/href="\(.*\)"/\1/')
        if [ ! -z "$href" ]; then
            # Check if line contains indicators of relationship
            if echo "$line" | grep -qi "self"; then
                echo "$href self"
            elif echo "$line" | grep -qi "parent"; then
                echo "$href parent"
            else
                echo "$href link"
            fi
        fi
    done | sort | uniq
}

# Create the sitemap HTML file
cat > "$OUTPUT" << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Map</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .tree {
            margin: 20px;
        }
        .tree ul {
            padding-left: 20px;
        }
        .tree li {
            list-style-type: none;
            margin: 10px 0;
            position: relative;
        }
        .tree li::before {
            content: "└─";
            position: absolute;
            left: -20px;
        }
        .tree a {
            color: #0066cc;
            text-decoration: none;
        }
        .tree a:hover {
            text-decoration: underline;
        }
        .relationship {
            font-size: 0.8em;
            color: #666;
            margin-left: 10px;
        }
        .self {
            color: #009900;
        }
        .parent {
            color: #990000;
        }
    </style>
</head>
<body>
    <h1>Site Map</h1>
    <div class="tree">
        <ul>
EOL

# First, find index.html or default.html as the root
ROOT_FILE=""
if [ -f "index.html" ]; then
    ROOT_FILE="index.html"
elif [ -f "default.html" ]; then
    ROOT_FILE="default.html"
else
    # Use the first HTML file found as root
    ROOT_FILE=$(find . -type f -name "*.html" | head -n 1)
fi

# Function to process a file and its links recursively
process_file() {
    local file="$1"
    local indent="$2"
    local processed_files="$3"
    
    # Skip if we've already processed this file or if it's the sitemap
    if [[ " $processed_files " =~ " $file " ]] || [ "$(basename "$file")" == "$OUTPUT" ]; then
        return
    fi
    
    # Add this file to processed files
    processed_files="$processed_files $file"
    
    # Get the relative path and filename
    relative_path=${file#./}
    filename=$(basename "$file")
    
    echo "${indent}<li>" >> "$OUTPUT"
    echo "${indent}    <a href=\"$relative_path\">$filename</a>" >> "$OUTPUT"
    
    # Get and process links
    links=$(get_links "$file")
    if [ ! -z "$links" ]; then
        echo "${indent}    <ul>" >> "$OUTPUT"
        while IFS=' ' read -r link relationship; do
            if [ ! -z "$link" ]; then
                # Resolve the actual path of the linked file
                linked_file=$(realpath --relative-to=. "$(dirname "$file")/$link" 2>/dev/null)
                if [ -f "$linked_file" ]; then
                    # Add relationship indicator
                    rel_class=""
                    rel_text=""
                    case "$relationship" in
                        "self") 
                            rel_class="self"
                            rel_text="(self-reference)"
                            ;;
                        "parent") 
                            rel_class="parent"
                            rel_text="(parent)"
                            ;;
                    esac
                    
                    echo "${indent}        <li>" >> "$OUTPUT"
                    echo "${indent}            <a href=\"$link\">$(basename "$link")</a>" >> "$OUTPUT"
                    if [ ! -z "$rel_text" ]; then
                        echo "${indent}            <span class=\"relationship $rel_class\">$rel_text</span>" >> "$OUTPUT"
                    fi
                    echo "${indent}        </li>" >> "$OUTPUT"
                    
                    # Recursively process the linked file with increased indentation
                    if [ "$relationship" != "self" ] && [ "$relationship" != "parent" ]; then
                        process_file "$linked_file" "${indent}    " "$processed_files"
                    fi
                fi
            fi
        done <<< "$links"
        echo "${indent}    </ul>" >> "$OUTPUT"
    fi
    echo "${indent}</li>" >> "$OUTPUT"
}

# Start processing from the root file
echo "Generating site map..."
process_file "$ROOT_FILE" "            " ""

# Close the HTML file
cat >> "$OUTPUT" << EOL
        </ul>
    </div>
    <script>
        // Add last updated timestamp
        document.body.insertAdjacentHTML('beforeend', 
            '<p style="text-align: center; color: #666; margin-top: 40px;">' +
            'Last updated: ' + new Date().toLocaleString() +
            '</p>'
        );
    </script>
</body>
</html>
EOL

echo "Site map generated as $OUTPUT"
