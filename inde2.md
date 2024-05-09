<style>
    body {max-width:1200px; color:#ddd; 
      margin:20px auto; padding: 0 10px;
      overflow: hidden;
      display: flex;
      background-size: contain;
      background-image: url('sexy.gif');
      animation: scaleBackground 7s infinite alternate;
      animation: rotatePage 10s infinite alternate;
    }
      .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(
      /* Generate random pastel color */
      {{ Math.floor(Math.random() * 256) }}, /* Red */
      {{ Math.floor(Math.random() * 256) }}, /* Green */
      {{ Math.floor(Math.random() * 256) }}, /* Blue */
      0.2 /* Opacity */
    );
  }
    table {
    width: 80%;
    height: 80%;
    background-image: url('walkin_babe.gif');
    border-collapse: collapse;
  }
  @keyframes rotatePage {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="overlay"></div>

<font size="20">
<marquee direction="left" scrollamount="50" >
<!-- The word whose letters' colors will change -->
  <div id="randomWord">BLA BLA BLA BLA BLA NOT LISTENING WHO CARES IDGAF I DID THIS PAGE FOR FUN WHO ARE YOU SEND ME AN EMAIL TALK TO ME I WANNA HEAR WHAT YOU HAVE TO SAY DO YOU EVEN CARE DO I EVEN CARE WTF WTF WTF LOL LOL XD OMGFG
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
        setInterval(changeLetterColors, 20);
  </script>
</marquee>
</font>

<marquee direction="down" scrollamount="7">
<table border="2" background="walkin_babe.gif" cellpadding="6px" bordercolor="tomato">
  <tr>
    <th>
<marquee direction="up" scrollamount="12">
<table border="30" background="sx4.gif" bordercolor="pink">
  <tr>
    <th>
</font>
<p><table background="sexi2.gif" border="20" cellpadding="10px" bordercolor="beige"><tr><th><a href="index.html"><img src="sexyblk.gif" alt="" /></a></th></tr></table></p>
<marquee>
<section>
<a href="breath.html"><img id="randomImage" src="" alt="Random Image"></a>
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
installs <a href="sound.html">work</a> that discusses the con<a href="victoria.html">v</a>ersation between our ears and the <a href="https://www.youtube.com/watch?v=Sd9oe2l8KM4&amp;list=PL9PHlNXlpafKfYjTxSiDPazwz1W0A_m4K&amp;index=13">ground</a> <a href="algtre.html">above</a> and <a href="beneath.html">beneath</a> our feet,<br>
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
<br>
<div align="center">
<h1>
<a href="https://www.buymeacoffee.com/femishonuga">
<img src="coffee.gif" height="22"></a>
<a href="http://users3.smartgb.com/g/g.php?a=s&i=g36-36063-b9" target="_blank" rel="noopener">
<img src="guest3.gif" height="20px" alt="XXIIVV webring"/></a>
<a href="https://www.mabsland.com/Adoption.html"><img src="pg.gif" height="22px"></a>
<a href="https://journal.miso.town"><img src="banner-htmlj.png" height="22px"></a>
<a href="BunieHopps/Sheet1.html"><img src="bh.gif" height="22px"></a>
<img src="ponyponies2.gif" height="22px">
<a href="https://gossipsweb.net"><img src="https://gossipsweb.net/images/twwmwh-gray.jpg" alt="This website was made with hands." style="height: 22px; border: 1px solid #000;" /></a>
</h1>
<br>
<div id="page-wrap">
<br>
<a href="webring.html" target="_blank" rel="noopener"><img src="webring.gif" height="20px"></a><a href="https://webring.xxiivv.com/#your-id-here" target="_blank" rel="noopener">
<img src="https://webring.xxiivv.com/icon.white.svg" height="21px" alt="XXIIVV webring"/></a><a href="screenshotgarden/index.html"><img src="ssgbutton.gif" height="20px"></a>
<br>
<br>
</div>
</div>
<marquee behavior="alternate" scrollamount="2" bgcolor="#303136">
you are visitor number: <a href="https://www.cutercounter.com/" target="_blank"><img src="https://www.cutercounter.com/hits.php?id=humxpnnop&nd=6&style=1" border="0" alt="best free website hit counter"></a>
</marquee>
</section>
<br>
<br>
<br>
<link href="https://melonking.net/styles/flood.css" rel="stylesheet" type="text/css" media="all" />
<script src="https://melonking.net/scripts/flood.js"></script>
<style>
      #flood, .wave {
        cursor: url("bucket.png"), pointer !important;
        z-index: -1;
      }
      #flood-menu {
        color: #FFF;
        font-size: 14px;
      }
      #flood-menu button {
        font-size: 14px;
        border: none;
        background: none;
        padding: 2px;
      }
      #flood-menu button:hover {
        background: none;
      }
</style>
<script>
    // Goo Flood!
    // Water Flood!
    flood.texture = "bluegrey.png";
    flood.textureWidth = 28; // Resize to match your image file
    flood.textureHeight = 28;
    flood.drainSound = "water2.mp3";
    flood.drainTooSoonSound = "water1.mp3";
    // Water Messages
    flood.msg.info = "🕳";
    flood.msg.rising = "Fluvial flood warning!";
    flood.msg.falling = "Flood warning lifted, drain duct open.";
    flood.msg.toosoon = "Coastal flood warning!";
    flood.msg.one = "Slow drain flow, this site is slowly leaking...";
    flood.msg.two = "This site is leaking, water level warning.";
    flood.msg.three = "SEA LEVEL AT 0500 OR 1700 HRS...";
    flood.msg.four = "Heavy rain flow today, this site is leaking...";
    flood.msg.five = "80% chance of rain today, this site has a serious leak!";
    flood.msg.six = "This site is flooded, click to open drain duct.";
</script>
<svg id="flood" viewBox="0 24 150 450" preserveAspectRatio="none" shape-rendering="auto" style="display: block; top: 93%;">
		<defs>
			<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v450h-352z"></path>
			<pattern id="water" patternUnits="userSpaceOnUse" width="28" height="28">
				<image xlink:href="bluegrey.png" x="0" y="0" width="28" height="28"></image>
			</pattern>
		</defs>
		<g class="wave">
			<use xlink:href="#gentle-wave" x="48" y="0"></use>
			<use xlink:href="#gentle-wave" x="48" y="3"></use>
			<use xlink:href="#gentle-wave" x="48" y="5"></use>
		</g>
</svg>
<div id="flood-menu" style="display: block;">
		<span id="flood-message">Coastal flood warning is in effect at 0100 hours.</span>
		<a href="https://melonking.net/free/software/flood.html" target="_blank"><button>🪣</button></a>
</div>
<br>
<br>
<marquee behavior="scroll" direction="left" scrollamount="4">
How can we properly acknowledge the displacement and destruction of indigenous land as the gentrification and backwards evolution of music and culture in the underground BIPOC communities in nyc. How can we design a space that bridges the gap between the two cultures and creates a welcoming space for new experimental sonic ritual practice. What are natural ways these interactions can form and what will aid both cultures during the design process. What do these communities need in order to feel welcome both physically and sonically.
</marquee>
</font>
<marquee direction="right" scrollamount="50" >
Yeah i bet you like coffee and porn you skicko freak of nature exil menace to society and i bet you miss your ex gf you should totally text her you weirdo
</marquee>
