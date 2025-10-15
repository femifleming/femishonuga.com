document.getElementById('commentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const comment = document.getElementById('comment').value;

  const commentFeed = document.getElementById('commentsFeed');

  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');

  const nameSpan = document.createElement('span');
  nameSpan.innerText = name + ' - ';

  const dateSpan = document.createElement('span');
  dateSpan.innerText = new Date().toLocaleString() + ': ';

  const commentP = document.createElement('p');
  commentP.innerText = comment;

  commentDiv.appendChild(nameSpan);
  commentDiv.appendChild(dateSpan);
  commentDiv.appendChild(commentP);

  commentFeed.insertBefore(commentDiv, commentFeed.firstChild);

  // Randomly change text color and font family
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const fonts = ['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Palatino', 'Garamond'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

  commentDiv.style.color = randomColor;
  commentDiv.style.fontFamily = randomFont;
});
