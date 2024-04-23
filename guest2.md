
<head>
    <meta charset="UTF-8">
    <title>Guest Book</title>
    <style>
        body {
        }
        .comment {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
        }
        #comment-form {
            margin-top: 20px;
        }
        #comment-input {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            padding: 5px 10px;
            cursor: pointer;
        }
    </style>
</head>
<body background="gbbg.gif">
    <div id="comments-container" align="center"></div>
    <form id="comment-form">
        <textarea id="comment-input" placeholder="Leave a comment..." required></textarea>
        <button type="submit">Submit</button>
    </form>
    <script>
        // Function to generate random color
        function getRandomColor() {
            const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFFF33", "#33FFFF", "#FF33FF"];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        // Function to generate random font
        function getRandomFont() {
            const fonts = ["Arial", "Verdana", "Tahoma", "Georgia", "Comic Sans MS"];
            return fonts[Math.floor(Math.random() * fonts.length)];
        }
        // Function to display comments
        function displayComments() {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '';
            const comments = localStorage.getItem('comments');
            if (comments) {
                const data = JSON.parse(comments);
                data.forEach(commentData => {
                    const commentDiv = document.createElement('div');
                    commentDiv.classList.add('comment');
                    commentDiv.style.backgroundColor = commentData.backgroundColor;
                    commentDiv.style.color = commentData.fontColor;
                    commentDiv.style.fontFamily = commentData.fontFamily;
                    commentDiv.textContent = commentData.text;
                    commentsContainer.appendChild(commentDiv);
                });
            }
        }
        // Function to handle form submission
        document.getElementById('comment-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const commentInput = document.getElementById('comment-input');
            const commentText = commentInput.value.trim();
            if (commentText !== '') {
                const newComment = {
                    text: commentText,
                    backgroundColor: getRandomColor(),
                    fontColor: getRandomColor(),
                    fontFamily: getRandomFont(),
                    timestamp: new Date().toString()
                };
                let comments = [];
                const existingComments = localStorage.getItem('comments');
                if (existingComments) {
                    comments = JSON.parse(existingComments);
                }
                comments.push(newComment);
                localStorage.setItem('comments', JSON.stringify(comments));
                displayComments();
                commentInput.value = '';
            }
        });
        // Display existing comments
        displayComments();
    </script>
</body>
</html>
