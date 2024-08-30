#!/bin/bash
trap SIGINT

if [ "$1" = '-f' ]
then
	force=true
	shift
else
	force=false
fi

IMGDIR="$(dirname "$1")"
THUMBDIR="$IMGDIR"/thumbnails
mkdir -p "$THUMBDIR"

for i in "$@"
do
	echo $i 1>&2
	filename="$(basename "$i")"
	if $force || [ ! -e "$THUMBDIR/$filename" ]
	then
		height="$(identify -format "%h" "$i")"
		width="$(identify -format "%w" "$i")"
    	if [ $height -ge $width ]
	    then
	        # portrait image
    	    convert -resize x1200 "$i" "$THUMBDIR"/"$filename"
    	else
        	#landscape image
        	convert -resize 1120x "$i" "$THUMBDIR"/"$filename"
    	fi
	fi
	thumbheight="$(identify -format "%h" "$THUMBDIR"/"$filename")"
	thumbwidth="$(identify -format "%w" "$THUMBDIR"/"$filename")"

	exposure="$(exiv2 -K Exif.Photo.ExposureTime -PEt "$IMGDIR"/"$filename")"
	fstop="$(exiv2 -K Exif.Photo.FNumber -PEt "$IMGDIR"/"$filename")"
	iso="$(exiv2 -K Exif.Photo.ISOSpeedRatings -PEt "$IMGDIR"/"$filename")"
	ev="$(exiv2 -K Exif.Photo.ExposureBiasValue -PEt "$IMGDIR"/"$filename")"
	lens="$(exiv2 -K Exif.Photo.FocalLengthIn35mmFilm -PEt "$IMGDIR"/"$filename" |cut -d. -f1)"

	echo "
	<style>
	th, td {
  border: 1px solid black;
	</style>
	<div class=\"gallerytile\" id=\"$filename\">
	<a href=\"$IMGDIR/small/$filename\">
	<img width=$thumbwidth height=$thumbheight src=\"$THUMBDIR/$filename\">
	</a>
	<a href=\"$IMGDIR/$filename\"><h3>$filename</h3></a>
	<table><tr><td>$exposure</td><td>$fstop</td><td>ISO $iso</td><td>$ev</td><td>$lens mm</td></tr></table>
	</div>
"
done
