#!/bin/bash

# Create a directory for thumbnails
mkdir -p thumbnails

# Loop through all images in the current directory
for img in *.jpg; do
    # Create a thumbnail with a minimum width of 1200px using ffmpeg
    ffmpeg -i "$img" -vf "scale='if(gt(iw,1200),1200,-1)':'if(gt(ih,1200),-1,1200)'" "thumbnails/$img"
done

