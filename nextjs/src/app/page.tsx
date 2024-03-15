'use client';
import { useState, useEffect } from 'react';

const IndexPage = () => {
    // useState フックを使用して、コンポーネントの状態を管理します。
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    // ユーザーIDを取得する関数を定義します。
    const getUserId = async () => {
        try {
            const response = await fetch('/getUserIdEndpoint');
            if (!response.ok) {
                throw new Error('Failed to get user ID');
            }
            const data = await response.json();
            return data.userId;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    };

    // ログインフォームの処理を行う関数です。
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

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
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    // 投稿を取得する関数を定義します。
    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const posts = await response.json();
            const postsList = document.getElementById('posts-list');
            if (postsList) {
                postsList.innerHTML = '';
                posts.forEach((post: any) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = post.content;
                    listItem.dataset.postId = post.id;
                    listItem.addEventListener('click', () => {
                        selectPost(post.id);
                    });
                    postsList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // 投稿を選択する関数を定義します。
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

    // 新しい投稿を作成するフォームの処理を行う関数です。
    const handlePostFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const content = (document.getElementById('post-content') as HTMLTextAreaElement).value;
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            if (response.ok) {
                await fetchPosts();
                (document.getElementById('post-content') as HTMLTextAreaElement).value = '';
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // コメントを追加するフォームの処理を行う関数です。
    const handleCommentFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                await fetchPosts();
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // useEffect フックを使用して、コンポーネントがマウントされた時に実行される初期化処理を記述します。
    useEffect(() => {
        // ページが読み込まれた時に投稿を取得する処理を実行します。
        fetchPosts();
    }, []); // 依存リストが空のため、マウント時のみにこの処理が実行されます。

    // コンポーネントの JSX を返します。
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
