#!/bin/bash

# Directory containing images
IMAGE_DIR="$1"

# Output HTML file
OUTPUT_FILE="index.html"

# Start of the HTML file
echo "<html><head><title>Image Metadata</title></head><body>" > "$OUTPUT_FILE"
echo "<h1>Image Metadata</h1>" >> "$OUTPUT_FILE"
echo "<table border='1'><tr><th>Image</th><th>Shutter Speed</th><th>Lens Length</th><th>ISO</th><th>F-Stop</th></tr>" >> "$OUTPUT_FILE"

# Check if the directory is not empty
if [ -z "$IMAGE_DIR" ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Loop through all JPEG images in the directory
for img in "$IMAGE_DIR"/*.JPG; do
    if [ -f "$img" ]; then
        # Extract metadata using exiftool
        shutter_speed=$(exiftool -ShutterSpeed -b -n "$img")
        lens_length=$(exiftool -FocalLength -b -n "$img")
        iso=$(exiftool -ISO -b -n "$img")
        f_stop=$(exiftool -FNumber -b -n "$img")

        # Add to HTML file
        echo "<tr><td><img src='$img' width='200'></td><td>$shutter_speed</td><td>$lens_length</td><td>$iso</td><td>$f_stop</td></tr>" >> "$OUTPUT_FILE"
    fi
done

# End of the HTML file
echo "</table></body></html>" >> "$OUTPUT_FILE"

echo "Generated HTML file at $OUTPUT_FILE"
