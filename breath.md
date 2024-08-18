<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Breathing Text</title>
<style>
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #ffcccc, #cc99ff); /* Background gradient colors */
    animation: changeColors 5s infinite alternate; /* Animation to change background colors */
  }

  #text {
    font-size: 4rem;
    font-weight: bold;
    color: #fff;
    text-align: center;
    animation: pulseText 5s infinite alternate; /* Animation to pulse text */
  }

  @keyframes changeColors {
    0% {
      background-color: #ffcccc; /* Start color */
    }
    100% {
      background-color: #cc99ff; /* End color */
    }
  }

  @keyframes pulseText {
    0% {
      filter: blur(20px); /* Blur effect */
    }
    100% {
      filter: blur(0); /* No blur */
    }
  }
</style>
</head>
<body>
  <div id="text">breathe</div>
</body>
</html>
