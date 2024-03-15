const express = require('express');
const path = require('path'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // ポート番号を3001に変更

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'testuser',
  password: 'testuser',
  database: 'test'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT user_id FROM users WHERE user_name = ? AND password = ?';

  connection.query(query, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.json({ userId: results[0].user_id });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  });
});

// ユーザーを取得するエンドポイント
app.post('/users', (req, res) => {
  const { username, password } = req.body;
  
  // ユーザー名とパスワードを使用してデータベースからユーザー情報を検索するクエリを実行
  const query = 'SELECT * FROM users WHERE user_name = ? AND password = ?';
  
  // データベースクエリの実行
  connection.query(query, [username, password], (err, results) => {
    if (err) {
        console.error('Error getting user:', err);
        res.status(500).json({ message: 'Failed to get user' });
        return;
    }

    // ユーザーが見つかった場合
    if (results.length > 0) {
        // ユーザー情報を取得してレスポンスとして返す
        res.json({ user: results[0] });
    } else {
        // ユーザーが見つからなかった場合
        res.status(401).json({ message: 'User not found' });
    }
  });
});

// ユーザーIDを取得するエンドポイント
app.post('/getUserIdEndpoint', (req, res) => {
  const { username, password } = req.body;
  
  // ユーザー名とパスワードを使用してデータベースからユーザーIDを検索するクエリを実行
  const query = 'SELECT user_id FROM users WHERE user_name = ? AND password = ?';
  
  // データベースクエリの実行
  connection.query(query, [username, password], (err, results) => {
    if (err) {
        console.error('Error getting user ID:', err);
        res.status(500).json({ message: 'Failed to get user ID' });
        return;
    }

    // ユーザーが見つかった場合
    if (results.length > 0) {
        // ユーザーIDを取得してレスポンスとして返す
        res.json({ userId: results[0].user_id });
    } else {
        // ユーザーが見つからなかった場合
        res.status(401).json({ message: 'Login failed' });
    }
});
});


app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM posts';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/posts', (req, res) => {
  const { content } = req.body;
  const query = 'INSERT INTO posts (content) VALUES (?)';

  connection.query(query, [content], (err, results) => {
    if (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ message: 'Failed to create post' });
      return;
    }
    res.json({ message: 'Post created successfully' });
  });
});

app.post('/api/posts/:postId/comments', (req, res) => {
  const { post_id, user_id, content } = req.body;
  const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';

  connection.query(query, [post_id, user_id, content], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Comment added successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
