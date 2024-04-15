<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bouncing Transparent Bubbles</title>
<style>
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .container {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;
  }

  .bubble {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5); /* Transparent bubble */
    animation: bubbleMove 5s infinite linear;
  }

  @keyframes bubbleMove {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(calc(100vw - 50px), calc(100vh - 50px));
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="bubble"></div>
  </div>

  <script>
    // Randomize initial position and direction of the bubble
    const bubble = document.querySelector('.bubble');
    const maxX = window.innerWidth - bubble.offsetWidth;
    const maxY = window.innerHeight - bubble.offsetHeight;
    const initialX = Math.random() * maxX;
    const initialY = Math.random() * maxY;
    bubble.style.left = initialX + 'px';
    bubble.style.top = initialY + 'px';
    const randomXDirection = Math.random() < 0.5 ? -1 : 1;
    const randomYDirection = Math.random() < 0.5 ? -1 : 1;

    // Update bubble's position randomly
    setInterval(() => {
      let newX = parseFloat(bubble.style.left) + (Math.random() * 10 * randomXDirection);
      let newY = parseFloat(bubble.style.top) + (Math.random() * 10 * randomYDirection);

      // Reverse direction if bubble reaches boundaries
      if (newX < 0 || newX > maxX) {
        randomXDirection *= -1;
      }
      if (newY < 0 || newY > maxY) {
        randomYDirection *= -1;
      }

      bubble.style.left = newX + 'px';
      bubble.style.top = newY + 'px';
    }, 100); // Update position every 100ms
  </script>
</body>
</html>
