const apiUrl = 'https://api.github.com/repos/yourusername/yourrepository/contents/comments.json';
const token = 'your_github_token';  // Be careful with this token; it should not be made public

window.onload = function() {
    fetchComments();
};

document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const commentText = document.getElementById('commentText').value;
    postComment(commentText);
    document.getElementById('commentText').value = '';
});

function fetchComments() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const comments = JSON.parse(atob(data.content));
            displayComments(comments);
        });
}

function postComment(text) {
    const newComment = {
        date: new Date().toISOString(),
        text: text
    };

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const comments = JSON.parse(atob(data.content));
            comments.unshift(newComment);  // Add the new comment to the top of the list
            return fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update comments',
                    content: btoa(JSON.stringify(comments)),
                    sha: data.sha
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            fetchComments();  // Re-fetch comments
        });
}

function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    container.innerHTML = '';
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.style.backgroundColor = getRandomColor(); // You need to define getRandomColor()
        div.style.color = getRandomTextColor();       // And getRandomTextColor()
        div.innerHTML = `<strong>${new Date(comment.date).toLocaleString()}</strong>: ${comment.text}`;
        container.appendChild(div);
    });
}

// Define getRandomColor and getRandomTextColor to return random colors
