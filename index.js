const express = require('express');
const path = require('path'); // path モジュールを追加
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

// 静的ファイルの配信設定
app.use(express.static(path.join(__dirname, 'public')));

// mysql接続情報
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

// リクエストボディを解析するためのミドルウェア
app.use(bodyParser.json());

// ログインエンドポイント
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE user_name = ? AND password = ?';

  connection.query(query, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  });
});

// 新しい投稿を作成するエンドポイント
app.post('/posts', (req, res) => {
  const { content } = req.body;
  const query = 'INSERT INTO posts (content) VALUES (?)';

  connection.query(query, [content], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Post created successfully' });
  });
});

// 投稿を取得するエンドポイント
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts';

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 特定の投稿にコメントを追加するエンドポイント
app.post('/comments', (req, res) => {
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