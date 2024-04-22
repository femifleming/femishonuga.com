<body background="dbg.gif" align="center">

<style>
  /* Define flashing animation */
  @keyframes flash {
    0% {
      color: white;
    }
    20% {
      color: red;
    }
        40% {
      color: blue;
    }
        60% {
      color: pink;
    }
        80% {
      color: tomato;
    }
    100% {
      color: green;
    }
  }

  /* Apply flashing animation to text */
  .flashing-text {
    font-size: 3em; /* Adjust the size as needed */
    animation: flash 5s infinite alternate;
  }
</style>

<script>
function change(picture) {
document.body.background=picture;
}

function ranchange(picture,num) {
var randomnumber=Math.floor(Math.random()*num)+1;
document.body.background=picture+randomnumber+".jpeg";
}

var filtar= 0;
function pageScroll() {

filtar = (filtar*481) + (Math.random()*444-222);
filtar /= 482;
window.scrollBy(0,filtar);
scrolldelay = setTimeout('pageScroll()',10);
}
</script>
<marquee scrollamount="10" behavior="alternate">
<h1 class="flashing-text">dead bitchez global</h1>
</marquee>
<img src="coming_soon.gif" width="100%">

<img src="ani-tgirlpower.gif" width="200" onmouseover="change('tigercoming.gif')"><br>
<img src="thebitcha.gif" width="200"><br>
<img src="gif-fairyglobe.gif" width="200"><br>

