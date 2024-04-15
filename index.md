<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blur Image on Hover</title>
    <style>
        /* Style for the image */
        img {
            transition: filter 5s ease;
        }
        /* Blur effect when hovering over the image */
        img:hover {
            filter: blur(100px);
        }
    </style>
</head>
<font size="2">
<marquee direction="left" scrollamount="5">
<!-- The word whose letters' colors will change -->
  <div id="randomWord">Upcoming Show: Waterworks @ Metropolitan Waterworks Museum 0426/272024 ~Chestnut Hill, MA
</div>

  <script>
        // Function to generate a random color in hexadecimal format
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Function to change the color of letters in a word
        function changeLetterColors() {
            var word = document.getElementById('randomWord');
            var letters = word.textContent.split('');
            var coloredWord = '';

            // Change the color of each letter
            for (var i = 0; i < letters.length; i++) {
                coloredWord += '<span style="color: ' + getRandomColor() + ';">' + letters[i] + '</span>';
            }

            // Update the word with colored letters
            word.innerHTML = coloredWord;
        }

        // Change letter colors every 20ms
        setInterval(changeLetterColors, 50);
  </script>
</marquee>
</font>

[![](header.jpeg)](index.html)

*Femi is an architect and sound artist from New York*<br>

is currently studying [architecture](arch.html) at RISD (after a year in 2019 in [textiles](textiles.html)),<br>
installs [work](sound.html) that dicusses the conversation between our ears and the [ground](https://www.youtube.com/watch?v=Sd9oe2l8KM4&list=PL9PHlNXlpafKfYjTxSiDPazwz1W0A_m4K&index=13) [above](algtre.html) and [beneath](beneath.html) our feet,<br>
[performs](shows.html) [rituals](ritual.html) as [sadnoise](https://sadnoise.bandcamp.com),<br>
makes sounds using [digital/analog](dajpg.html) synthesis, [DIY](diy.html) electronics and [esoteric](https://esolangs.org/wiki/Main_Page) [code](code.html) based languages using [random](random.html),
[chance](atc.html) based systems,<br>
[DJs](ass.html) and produces dub tehcno/micro house under the alias [Sonuga](https://blakkcatrecords.bandcamp.com/album/airing-ep),<br>
hosts [SRST](https://sound.risd.edu) [Sessions](https://www.youtube.com/@SRSTSessions), a video series highlighting local artists in the RI/MA area,<br>
[uploads](https://www.youtube.com/channel/UCDMKN93aTUykTHz7tOQKw3A) tutorials, music videos, patches, live shows[,](inde2.html)<br>
update[s](screenshotgarden/html.html) [log](log.html) occasionally.<br>

[![](coffee.gif)](https://www.buymeacoffee.com/femishonuga)<a href="https://webring.xxiivv.com/#your-id-here" target="_blank" rel="noopener">
  <img src="https://webring.xxiivv.com/icon.white.svg" width="17px" alt="XXIIVV webring"/>
</a>

<br>
<font size="2">
<marquee behavior="scroll" direction="left" scrollamount="4">
How can we properly acknowledge the displacement and destruction of indigenous land as the gentrification and backwards evolution of music and culture in the underground BIPOC communities in nyc. How can we design a space that bridges the gap between the two cultures and creates a welcoming space for new experimental sonic ritual practice. What are natural ways these interactions can form and what will aid both cultures during the design process. What do these communities need in order to feel welcome both physically and sonically.
</marquee>
</font>
