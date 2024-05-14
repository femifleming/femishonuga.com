#!/bin/bash

# Initialize HTML file
cat <<EOF > gallery.html
<!DOCTYPE html>
<html>
<head>
  <title>Gallery</title>
  <style>
    .gallery {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin:40px auto;
    }
    .folder {
      margin: 20px;
    }
    .folder img {
      display: block;
      margin: auto;
      max-width: 200px;
      max-height: 200px;
    }
    .folder h2 {
      text-align: center;
    }
    h2 {font-weight:bold; font-size: 1.1em; color: #ffffff; background-color: rgba(0, 0, 0, 0.59);}
    table {width: 200px; height: 180px; background-color: rgba(0, 0, 0, 0.59);}
    hr {margin-top: 2em; border: none; background-color: #555; color: #555; height: 1px;}
    a {color:#aaa;}
    a:hover {color:#ccc;}
    img {margin-top: -0.5em; max-width:100%;}
    input {font-family: inherit;}
    body {background-color:#111; max-width:800px; color:#ddd; 
      font-family: 'Tiems New Roman'; font-size: 1.0em;
      margin:40px auto; padding: 0 10px;}
    pre {font-size: 1.0em; color:#ddd;}
    section {backgroud-color: rgba(43, 44, 54, 0.4);}
    #BLUE {
        backgroud-color: rgba(43, 44, 54, 0.4);
    }
            article {
            background-color: rgba(19, 19, 26, 0.5);
            /* Even darker background for articles */
            padding: 10px;
            z-index: 2;
            transition: filter s ease;
            /* Smooth transition for the filter application */
        }
  </style>
</head>
<body background="../boids3.gif">
  <div class="gallery" align="center" id="BLUE">
EOF

# Iterate through each subdirectory
for dir in */; do
  # Get the first photo in the directory
  photo=$(find "$dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" \) | head -n 1)
  
  # Check if a photo is found
  if [ -n "$photo" ]; then
    # Extract folder name for header
    folder_name=$(basename "$dir")
    
    # Generate HTML for folder gallery
    echo "    <div class=\"folder\">" >> gallery.html
    echo "      <h2>$folder_name</h2>" >> gallery.html
    echo "      <table border="10"><tr><th><a href=\"$dir/gallery.html\"><img src=\"$photo\" alt=\"$folder_name\"></a></th></tr></table>" >> gallery.html
    echo "    </div>" >> gallery.html
  fi
done

# Close HTML file
cat <<EOF >> gallery.html
  </div>
</body>
</html>
EOF

echo "Gallery HTML file generated: gallery.html"
