
import { useState, useEffect } from 'react';

const IndexPage = () => {
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const getUserId = async () => {
        try {
            const response = await fetch('/getUserIdEndpoint'); // ユーザーIDを取得するエンドポイントに合わせて変更
            if (!response.ok) {
                throw new Error('Failed to get user ID');
            }
            const data = await response.json();
            return data.userId; // 必要に応じて実際のデータ構造に合わせて変更
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        // サーバーサイドでのログイン検証処理を行う（省略）
        // ログイン成功時に以下のようにする
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                document.getElementById('login-form')!.style.display = 'none';
                document.getElementById('post-comment-forms')!.style.display = 'block';
                const userId = await getUserId();
                if (userId !== null) {
                    // ユーザーIDを取得した後の処理を行う
                }
            } else {
                alert('Login failed. Please try again.'); // ログイン失敗時の処理
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts'); // データを取得するAPIエンドポイントに合わせて変更
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const posts = await response.json();
            const postsList = document.getElementById('posts-list');
            if (postsList) {
                postsList.innerHTML = ''; // 既存の投稿をクリア
                posts.forEach((post: any) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = post.content;
                    listItem.dataset.postId = post.id; // 投稿のIDを保存する
                    listItem.addEventListener('click', () => {
                        selectPost(post.id); // 投稿がクリックされたらそのIDを選択する
                    });
                    postsList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }

    };

    const selectPost = (postId: number) => {
        setSelectedPostId(postId);
        const selectedPost = document.querySelector<HTMLLIElement>('#posts-list .selected');
        if (selectedPost) {
            selectedPost.classList.remove('selected');
        }
        const postToSelect = document.querySelector<HTMLLIElement>(`#posts-list li[data-post-id="${postId}"]`);
        if (postToSelect) {
            postToSelect.classList.add('selected');
        }
    };

    const handlePostFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const content = (document.getElementById('post-content') as HTMLTextAreaElement).value;
        // フォーム送信処理を実装
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            if (response.ok) {
                await fetchPosts(); // 新しい投稿を取得して表示する
                (document.getElementById('post-content') as HTMLTextAreaElement).value = ''; // フォームをクリアする
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleCommentFormSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // コメントフォームの送信処理を実装
        if (!selectedPostId) {
            alert('Please select a post to comment on.');
            return;
        }
        const content = (document.getElementById('comment-content') as HTMLTextAreaElement).value;
        try {
            const response = await fetch(`/api/posts/${selectedPostId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    user_id: await getUserId(),
                    post_id: selectedPostId,
                    content 
                })
            });
            if (response.ok) {
                alert('Comment added successfully');
                await fetchPosts(); // コメントが追加されたら投稿を再取得して更新
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form id="login-form" onSubmit={handleLogin}>
                <input type="text" id="username" placeholder="Username" />
                <input type="password" id="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>

            <div id="post-comment-forms" style={{ display: 'none' }}>
                <h2>Add a Post</h2>
                <form id="post-form" onSubmit={handlePostFormSubmit}>
                    <textarea id="post-content" placeholder="Enter your post here"></textarea>
                    <button type="submit">Post</button>
                </form>

                <h2>Add a Comment</h2>
                <form id="comment-form" onSubmit={handleCommentFormSubmit}>
                    <textarea id="comment-content" placeholder="Enter your comment here"></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>

            <ul id="posts-list"></ul>
        </div>
    );
};

export default IndexPage;
