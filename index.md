<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blur Image on Hover</title>
    <style>
        iframe {max-width:800px}
        article {
    background-color: #1E1E1E; /* Even darker background for articles */
    padding: 10px
  }
        .wrapper {
            position: relative;
            width: 100%;
            height: auto;
        }
        .trigger-word {
        }
        .scrolling-text {
            display: none; /* Initially hidden */
        }
        .toggle-section {
            transform: translateX(0);
            }
    img {
        transition: filter 8s ease; /* Smooth transition for the filter application */
        filter: blur(0px); /* Start with no blur */
    }
    img:hover {
        filter: blur(200px); /* Apply a blur of 8px on hover */
    }
        /* Apply initial opacity to the body */
    body {
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }
    /* CSS animation for fade-in effect */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    /* Start the animation when the body is loaded */
    body {
        animation: fadeIn 1s ease-in-out forwards;
    }
    </style>
</head>
<font size="2">
<marquee direction="left" scrollamount="5">
<!-- The word whose letters' colors will change -->
  <div id="randomWord">Upcoming Show: SLABFEST @ Jewel Music Venue 0618/192024 ~New Haven, CT
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

<a href="breath.html"><img id="randomImage" src="" alt="Random Image"></a>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // List of images
        var images = [
                "header.jpeg",
                "P4270158.jpeg",
                "Sadnoise.jpeg",
        ];
        // Function to get a random image from the list
        function getRandomImage() {
                var index = Math.floor(Math.random() * images.length);
                return images[index];
        }
        // Set the source of the image to a random image from the list
        document.getElementById("randomImage").src = getRandomImage();
    });
</script>



<div class="wrapper" align="right">
    <span class="trigger-word">Consolidate</span>
    <div class="scrolling-text" id="scrollText">
    <a href="arch.html">Architecture</a><br>
    <a href="textiles.html">Textiles Work</a><br>
    <a href="sound.html">Sound Work</a><br>
    <a href="algtre.html">Above</a><a href="beneath.html">Beneath</a><br>
    <a href="https://sadnoise.bandcamp.com">Bandcamp</a><br>
    <a href="dajpg.html">Modular Synth Setup Archive</a><br>
    <a href="diy.html">DIY Electronics</a><br>
    <a href="code.html">Code</a><br>
    <a href="https://www.youtube.com/channel/UCDMKN93aTUykTHz7tOQKw3A">Youtube</a><br>
    <a href="log.html">log</a><br>
    <a href="screenshotgarden/index.html">screenshot garden</a><br>
    <br>
    <br>
    </div>
</div>
<div class="toggle-section" id="toggleSection">
<font size="2">
<p>Femi is an architect and sound artist from New York who works with various synthesis techniques and live coding languages to discuss the organic within electronics and technology through sound art and composition. His work explores the intersections of sound and space though spatial audio and architectural design as an experimental practice. He’s most interested in generative systems, chance, texture within sonic soundscapes. Femi’s architectural work explores indigenous ritual practice as a vessel for conversation between sound, space and interactions of the body. Femi has been performing as a solo experimental electronic improvisation artist since 2018 as sadnoise. Musical and Festival performances include Ende Tymes (2022, New York), Creative Code Festival (2020, New York), Waterworks Festival (2024), Slabfest (2024), amongst others.<br></p>
</font>
<p>Femi is currently stu<a href="dbg.html">d</a>ying <a href="arch.html">architecture</a> at RISD (after a year in 2019 in <a href="textiles.html">textiles</a>),<br>
installs <a href="sound.html">work</a> that dicusses the conversation between our ears and the <a href="https://www.youtube.com/watch?v=Sd9oe2l8KM4&amp;list=PL9PHlNXlpafKfYjTxSiDPazwz1W0A_m4K&amp;index=13">ground</a> <a href="algtre.html">above</a> and <a href="beneath.html">beneath</a> our feet,<br>
<a href="shows.html">performs</a> <a href="ritual.html">rituals</a> as <a href="https://sadnoise.bandcamp.com">sadnoise</a>,<br>
makes sounds using <a href="dajpg.html">digital/analog</a> synthesis, <a href="diy.html">DIY</a> electronics and <a href="code.html">code</a> based languages using <a href="random.html">random</a>,
<a href="atc.html">chance</a> based systems,<br>
<a href="ass.html">DJs</a> and produces dub techno/micro house under the alias <a href="https://blakkcatrecords.bandcamp.com/album/airing-ep">Ṣonuga</a>,<br>
<a href="https://www.youtube.com/channel/UCDMKN93aTUykTHz7tOQKw3A">uploads</a> tutorials, music videos, patches, live shows<a href="inde2.html">,</a><br>
and update<a href="screenshotgarden/index.html">s</a> <a href="log.html">log</a> occasionally. 
</div>
<script>
        const trigger = document.querySelector('.trigger-word');
        const scrollText = document.getElementById('scrollText');
        const toggleSection = document.getElementById('toggleSection');
        let isAnimating = false; // Track animation state
        trigger.addEventListener('mouseenter', function() {
            if (!isAnimating) {
                scrollText.style.display = 'block'; // Show scrolling text
                scrollText.classList.add('animate');
                toggleSection.style.display = 'none'; // Hide toggle section
                isAnimating = true; // Set state to animating
            } else {
                scrollText.style.display = 'none'; // Hide scrolling text
                scrollText.style.transform = 'translateX(0)'; // Reset position
                scrollText.classList.remove('animate');
                toggleSection.style.display = 'block'; // Show toggle section
                isAnimating = false; // Reset state to not animating
            }
        });
    </script>
<font size="2">
</font>
<div align="center">
<a href="https://www.buymeacoffee.com/femishonuga">
<img src="coffee.gif" height="19"></a>
<a href="http://users3.smartgb.com/g/g.php?a=s&i=g36-36063-b9" target="_blank" rel="noopener">
<img src="guest3.gif" height="17px" alt="XXIIVV webring"/></a>
<a href="https://www.mabsland.com/Adoption.html"><img src="pg.gif" height="19px"></a>
<a href="https://journal.miso.town"><img src="banner-htmlj.png" height="19px"></a>
<a href="BunieHopps/Sheet1.html"><img src="bh.gif" height="19px"></a>
<img src="ponyponies2.gif" height="19px">
<a href="https://gossipsweb.net"><img src="https://gossipsweb.net/images/twwmwh-gray.jpg" alt="This website was made with hands." style="height: 19px; border: 1px solid #000;" /></a><br><br>
<a href="webring.html" target="_blank" rel="noopener"><img src="webring.gif" height="17px"></a><a href="https://webring.xxiivv.com/#your-id-here" target="_blank" rel="noopener">
<img src="https://webring.xxiivv.com/icon.white.svg" height="18px" alt="XXIIVV webring"/></a><a href="screenshotgarden/index.html"><img src="ssgbutton.gif" height="17px"></a>
<br>
<br>
</div>
<marquee behavior="alternate" scrollamount="2" bgcolor="#372D2D">
you are visitor number: <a href="https://www.cutercounter.com/" target="_blank"><img src="https://www.cutercounter.com/hits.php?id=humxpnnop&nd=6&style=1" border="0" alt="best free website hit counter"></a>
</marquee>
<marquee behavior="scroll" direction="left" scrollamount="4">
How can we properly acknowledge the displacement and destruction of indigenous land as the gentrification and backwards evolution of music and culture in the underground BIPOC communities in nyc. How can we design a space that bridges the gap between the two cultures and creates a welcoming space for new experimental sonic ritual practice. What are natural ways these interactions can form and what will aid both cultures during the design process. What do these communities need in order to feel welcome both physically and sonically.
</marquee>
<br>

<link href="https://melonking.net/styles/flood.css" rel="stylesheet" type="text/css" media="all" />
<script src="https://melonking.net/scripts/flood.js"></script>
<br>