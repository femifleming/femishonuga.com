#!/bin/bash

# High-Quality WebP Converter
# Converts all .jpg, .jpeg, .png files to WebP at 90% quality
# Searches current directory AND all subdirectories recursively
# Preserves directory structure and reduces file size

echo "Starting WebP conversion (90% quality)..."
echo "Searching current directory and ALL subdirectories..."
echo "=================================="

# Counter for converted files
count=0

# Find all jpg/jpeg/png files (case insensitive) in current directory AND subdirectories
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read file; do
    # Get directory and filename without extension
    dir=$(dirname "$file")
    filename=$(basename "$file")
    name="${filename%.*}"
    
    # Output file path (preserves directory structure)
    output="$dir/$name.webp"
    
    # Skip if webp already exists
    if [ -f "$output" ]; then
        echo "⏭️  Skipping (already exists): $output"
        continue
    fi
    
    # Convert to high-quality lossy WebP (90% quality)
    echo "🔄 Converting: $file"
    magick "$file" -quality 90 "$output"
    
    if [ $? -eq 0 ]; then
        # Get file sizes for comparison
        original_size=$(du -h "$file" | cut -f1)
        new_size=$(du -h "$output" | cut -f1)
        echo "✅ Success: $original_size → $new_size"
        ((count++))
    else
        echo "❌ Failed: $file"
    fi
    
    echo ""
done

echo "=================================="
echo "Conversion complete! Converted $count files."
echo ""
echo "Original JPG/JPEG/PNG files are preserved."
echo "To delete originals after verifying WebP files, run:"
echo "find . -type f \( -iname \"*.jpg\" -o -iname \"*.jpeg\" -o -iname \"*.png\" \) -delete"
