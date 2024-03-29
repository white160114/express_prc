 // ページ読み込み時に投稿を取得して表示する
window.onload = function() {
    fetchPosts();
};

// 投稿を取得して表示する関数
function fetchPosts() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postsList = document.getElementById('posts-list');
            posts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.textContent = post.content;
                postsList.appendChild(listItem);
            });
        });
}

// フォームを送信して新しい投稿を作成する関数
document.getElementById('post-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const content = document.getElementById('post-content').value;
    fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
    })
    .then(response => {
        if (response.ok) {
            fetchPosts(); // 新しい投稿を取得して表示する
            document.getElementById('post-content').value = ''; // フォームをクリアする
        } else {
            console.error('Failed to create post');
        }
    })
    .catch(error => {
        console.error('Error creating post:', error);
    });
});

document.getElementById('comment-form').addEventListener('submit', function(event) {
event.preventDefault();
const postId = document.querySelector('#posts-list .selected').dataset.postId;
const content = document.getElementById('comment-content').value;

fetch(`/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: content })
})
.then(response => {
    if (response.ok) {
        alert('Comment added successfully');
        // コメントが追加されたら、適切な処理を実行する（例えば、ページをリロードするなど）
    } else {
        console.error('Failed to add comment');
    }
})
.catch(error => {
    console.error('Error adding comment:', error);
});   
});

// 投稿をクリックしたときの処理
document.querySelectorAll('#posts-list li').forEach(post => {
post.addEventListener('click', function() {
// すべての投稿から選択されたクラスを削除
document.querySelectorAll('#posts-list li').forEach(p => {
    p.classList.remove('selected');
});
// クリックされた投稿に選択されたクラスを追加
this.classList.add('selected');
});
});