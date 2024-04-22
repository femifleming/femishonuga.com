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

<a href="breath.html"><img src="header.jpeg"></a>

<p><em>Femi is an architect and sound artist from New York</em><br></p>
<p>is currently stu<a href="dbg.html">d</a>ying <a href="arch.html">architecture</a> at RISD (after a year in 2019 in <a href="textiles.html">textiles</a>),<br>
installs <a href="sound.html">work</a> that dicusses the conversation between our ears and the <a href="https://www.youtube.com/watch?v=Sd9oe2l8KM4&amp;list=PL9PHlNXlpafKfYjTxSiDPazwz1W0A_m4K&amp;index=13">ground</a> <a href="algtre.html">above</a> and <a href="beneath.html">beneath</a> our feet,<br>
<a href="shows.html">performs</a> <a href="ritual.html">rituals</a> as <a href="https://sadnoise.bandcamp.com">sadnoise</a>,<br>
makes sounds using <a href="dajpg.html">digital/analog</a> synthesis, <a href="diy.html">DIY</a> electronics and <a href="https://esolangs.org/wiki/Main_Page">esoteric</a> <a href="code.html">code</a> based languages using <a href="random.html">random</a>,
<a href="atc.html">chance</a> based systems,<br>
<a href="ass.html">DJs</a> and produces dub tehcno/micro house under the alias <a href="https://blakkcatrecords.bandcamp.com/album/airing-ep">Sonuga</a>,<br>
hosts <a href="https://sound.risd.edu">SRST</a> <a href="https://www.youtube.com/@SRSTSessions">Sessions</a>, a video series highlighting local artists in the RI/MA area,<br>
<a href="https://www.youtube.com/channel/UCDMKN93aTUykTHz7tOQKw3A">uploads</a> tutorials, music videos, patches, live shows<a href="inde2.html">,</a><br>
update<a href="screenshotgarden/html.html">s</a> <a href="log.html">log</a> occasionally.<br></p>



<br>
<font size="2">
<marquee behavior="scroll" direction="left" scrollamount="4">
How can we properly acknowledge the displacement and destruction of indigenous land as the gentrification and backwards evolution of music and culture in the underground BIPOC communities in nyc. How can we design a space that bridges the gap between the two cultures and creates a welcoming space for new experimental sonic ritual practice. What are natural ways these interactions can form and what will aid both cultures during the design process. What do these communities need in order to feel welcome both physically and sonically.
</marquee>
</font>
<br>
<a href="https://www.buymeacoffee.com/femishonuga">
<img src="coffee.gif">
</a>
<a href="https://webring.xxiivv.com/#your-id-here" target="_blank" rel="noopener">
<img src="https://webring.xxiivv.com/icon.white.svg" width="17px" alt="XXIIVV webring"/>
</a>
<a href="webring.html" target="_blank" rel="noopener">
<img src="webring.gif" height="16px" alt="XXIIVV webring"/>
</a>