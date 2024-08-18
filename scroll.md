<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Word Word Word</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  #word-list {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
</head>
<body>
<ul id="word-list"></ul>

<script>
  function addWordsToList() {
    const wordList = document.getElementById('word-list');
    const word = 'Word';
    const times = 500;

    for (let i = 0; i < times; i++) {
      const listItem = document.createElement('li');
      listItem.textContent = word;
      wordList.appendChild(listItem);
    }
  }

  function randomScroll() {
    const direction = Math.random() < 0.5 ? 1 : -1;
    const speed = Math.random() * 10 + 5; // Adjust this range for desired speed

    window.scrollBy(0, direction * speed);

    setTimeout(randomScroll, Math.random() * 2000 + 500); // Adjust this range for desired frequency
  }

  addWordsToList();
  randomScroll();
</script>
</body>
</html>
