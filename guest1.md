<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Guest Book</title>
    <style>
        .comment { margin: 20px; padding: 10px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Guest Book</h1>
    <form id="commentForm">
        <textarea id="commentText" required></textarea>
        <button type="submit">Post Comment</button>
    </form>
    <div id="commentsContainer"></div>

    <script src="script2.js"></script>
</body>
</html>
