<style>
  body {
    font-family: monospace;
    overflow: hidden;
  }
  #typed-text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid #000;
    animation: typing 0.5s steps(40, end), blink-caret 0.75s step-end infinite;
  }
  @keyframes typing {
    from {
      width: 0;
    }
  }
  @keyframes blink-caret {
    from,
    to {
      border-color: transparent;
    }
    50% {
      border-color: #000;
    }
  }
</style>

<p id="typed-text"></p>

<script>
  const allText = document.body.innerText;
  let index = 0;
  function type() {
    document.getElementById("typed-text").textContent += allText.charAt(index);
    index++;
    if (index < allText.length + 1) {
      setTimeout(type, 50);
    }
  }
  type();
</script>

<div align="center">
<img src="lain.gif">

<a href="https://funbox.sh/~cenzo/">{cenzo}</a>
<a href="https://grief.im/poop/">{grief}</a>
<a href="https://cryptwarblr.net/">{cryptwarblr}</a>
<a href="https://hissquiet.com/">{hissquiet}</a>
<a href="https://williamhazard.co/">{william hazard}</a>
<a href="https://heftexperience.net">{heft}</a>
<a href="https://caloricmusic.com">{caloric}</a>





<em>if you would like to be added to the webring: add a link on your site this page either with a simple link or the gif on my home page, go <a href="https://github.com/femifleming/femishonuga.com">here</a> and add your website information to the webring.md file and submit a pull request!<em>




</div>