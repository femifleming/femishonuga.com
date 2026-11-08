#!/bin/bash

# HTML & CSS WebP Replacer
# Replaces .jpg, .jpeg, .png with .webp in:
# - <img> tags
# - CSS background-image properties
# Excludes: clogo.png and vitaphoneb.png
# Works on all HTML files in current directory and subdirectories

echo "Starting WebP replacement in HTML files..."
echo "Excluding: clogo.png, vitaphoneb.png"
echo "=========================================="

# Counter for modified files
count=0
total_replacements=0

# Create backup directory with timestamp
backup_dir=".html_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"

echo "📁 Backups will be saved to: $backup_dir"
echo ""

# Find all HTML files in current directory and subdirectories
find . -type f \( -iname "*.html" -o -iname "*.htm" \) | while read file; do
    # Skip backup directory
    if [[ "$file" == *"$backup_dir"* ]]; then
        continue
    fi
    
    # Check if file contains images or background-image
    if grep -qiE '(\.(jpg|jpeg|png)|background-image)' "$file"; then
        echo "🔍 Processing: $file"
        
        # Create backup
        backup_path="$backup_dir${file#.}"
        mkdir -p "$(dirname "$backup_path")"
        cp "$file" "$backup_path"
        
        file_count=0
        
        # Replace .jpg with .webp (excluding clogo.png and vitaphoneb.png)
        # For macOS (BSD sed)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # Replace .jpg -> .webp (not followed by clogo or vitaphoneb)
            sed -i '' 's/\([^a-zA-Z0-9_-]\)\([^"'\'']*\)\.jpg\([^a-zA-Z0-9]\)/\1\2.webp\3/gI' "$file"
            sed -i '' 's/\([^a-zA-Z0-9_-]\)\([^"'\'']*\)\.jpeg\([^a-zA-Z0-9]\)/\1\2.webp\3/gI' "$file"
            
            # Replace .png -> .webp but exclude clogo.png and vitaphoneb.png
            sed -i '' '/clogo\.png/! s/\([^a-zA-Z0-9_-]\)\([^"'\'']*\)\.png\([^a-zA-Z0-9]\)/\1\2.webp\3/gI' "$file"
            sed -i '' 's/vitaphoneb\.webp/vitaphoneb.png/gI' "$file"
            
            # Restore excluded files if they were changed
            sed -i '' 's/clogo\.webp/clogo.png/gI' "$file"
        else
            # For Linux (GNU sed)
            sed -i 's/\([^a-zA-Z0-9_-]\)\([^"'\'']*\)\.jpg\([^a-zA-Z0-9]\)/\1\2.webp\3/gI' "$file"
            sed -i 's/\([^a-zA-Z0-9_-]\)\([^"'\'']*\)\.jpeg\([^a-zA-Z0-9]\)/\1\2.webp\3/gI' "$file"
            
            sed -i '/clogo\.png/! s/\([^a-zA-Z0-9_-]\)\([^"'\'']*\)\.png\([^a-zA-Z0-9]\)/\1\2.webp\3/gI' "$file"
            sed -i 's/vitaphoneb\.webp/vitaphoneb.png/gI' "$file"
            
            sed -i 's/clogo\.webp/clogo.png/gI' "$file"
        fi
        
        # Count how many replacements were made by comparing to backup
        file_count=$(diff "$backup_path" "$file" | grep -c '^[<>]' || echo 0)
        
        if [ "$file_count" -gt 0 ]; then
            echo "✅ Modified with ~$((file_count / 2)) changes"
            echo "   Backup: $backup_path"
            ((count++))
            total_replacements=$((total_replacements + file_count / 2))
        else
            echo "⏭️  No changes needed"
            rm "$backup_path"
        fi
        
        echo ""
    fi
done

echo "=========================================="
echo "Replacement complete!"
echo "Modified files: $count"
echo "Total replacements: ~$total_replacements"
echo ""
echo "Excluded files preserved:"
echo "  - clogo.png"
echo "  - vitaphoneb.png"
echo ""
echo "Original HTML files backed up to: $backup_dir"
echo ""
echo "To restore backups if needed:"
echo "  cp -r $backup_dir/* ."
echo ""
echo "To delete backups after verification:"
echo "  rm -rf $backup_dir"
