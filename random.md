<style>
  /* Dark overlay */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  background-image: url('rain.gif');
    display: none; /* Initially hidden */
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure the overlay is on top of other content */
    animation: fadeInOverlay 4s ease-in-out forwards; /* Fade in overlay */
  }

  /* Popup container */
  .popup {
    background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent white */
    padding: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); /* Box shadow for blurred edges */
    text-align: center;
    opacity: 0; /* Initially transparent */
    animation: fadeInPopup 4s ease-in-out forwards; /* Fade in popup */
    font-family: Times; /* Comic Sans font */
    font-style: italic;
  }

  /* Text style */
  .text span {
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  /* Animation for overlay */
  @keyframes fadeInOverlay {
    0% {
      opacity: 0; /* Start with opacity 0 */
    }
    100% {
      opacity: 1; /* End with opacity 1 */
    }
  }

  /* Animation for popup */
  @keyframes fadeInPopup {
    0% {
      opacity: 0; /* Start with opacity 0 */
      transform: scale(0.8); /* Start smaller */
    }
    100% {
      opacity: 1; /* End with opacity 1 */
      transform: scale(1); /* End with normal size */
    }
  }
  body {
  background-image: url('rainyday.gif');
}
</style>
<table border="20px" style="background-color: rgba(0, 0, 0, 0.6);">
<tr>
<th>
<a href="https://www.ninaprotocol.com/profiles/lpw"><img src="lia.jpg"></a>
</th>
</tr>
<table>
<div class="overlay" id="overlay">
    <div class="popup">
      <p class="text">
        <span>d</span><span>o</span><span> </span>
        <span>y</span><span>o</span><span>u</span> 
        <span>m</span><span>i</span><span>s</span><span>s</span> 
        <span>h</span><span>e</span><span>r</span><span>?</span>
      </p>
    </div>
  </div>

  <script>
    // Show the popup after 10 seconds
    setTimeout(() => {
      document.getElementById('overlay').style.display = 'flex';
      animateTextColors();
    }, 10000);

    // Redirect when the text is clicked
    document.querySelector('.popup').addEventListener('click', () => {
      window.location.href = 'breath.html'; // Replace with your desired URL
    });

    // Function to animate text colors
    function animateTextColors() {
      const letters = document.querySelectorAll('.text span');

      setInterval(() => {
        letters.forEach(letter => {
          const randomColor = getRandomColor();
          letter.style.color = randomColor;
        });
      }, 20); // Change color every 20 milliseconds
    }

    // Function to generate a random color
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  </script>