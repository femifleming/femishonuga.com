#!/bin/bash

# Start HTML file
echo "<html>
<head>
  <title>Grass </title>
  <style>
    img {
      max-width: 800px;
      max-height: 800px;
      margin: 10px;
    }
    .image-container {
      display: inline-block;
      text-align: center;
    }
    body {background-color:#111; max-width:800px; color:#ddd; 
      font-family: 'Tiems New Roman'; font-size: 1.0em;
      margin:40px auto; padding: 0 10px;}
  </style>
</head>
<body>
  <h1>Blackcat Studio, White Plains, NY</h1>
  <hr>" > gallery.html

# Loop through image files in the directory
for file in *.jpg *.jpeg *.JPG *.gif *.bmp; do
  if [ -f "$file" ]; then
    # Get image metadata
    date=$(exiftool -CreateDate "$file")
    iso=$(exiftool -iso "$file")
    exposure=$(exiftool -ExposureTime "$file")
    f_stop=$(exiftool -FNumber "$file")
    lens_length=$(exiftool -FocalLength "$file")
    # Generate HTML for image and metadata
    echo "	<style>
	th, td {
    border: 1px solid;.
    border-color: #6e6e6e;
  	padding-left: 2px;
	padding-right: 2px;
	</style>
    <div class='image-container'>
    <div align="right">
    <table><tr><td>$date</td><td>$iso</td><td>$exposure</td><td>$f_stop</td><td>$lens_length</td></tr></table>
    </div>
            <img src='$file' alt='$file'>
          </div>" >> gallery.html
  fi
done

# End HTML file
echo "</body>
</html>" >> gallery.html

echo "Gallery created: gallery.html"
