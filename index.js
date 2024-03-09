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
  user: 'username',
  password: 'password',
  database: 'test'
});


// mysql接続
connection.connect(err => {
  if(err){
    console.error('database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// body parserの設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 新しい投稿を作成するエンドポイント
app.post('/posts', (req, res) => {
  const {content} = req.body;
  const query = 'INSERT INTO posts (content VALUES (?)';
  connection.query(query, [content], (err, results) => {
    if(err){
      console.error('Error creating post: ' + err);
      res.status(500).send('Error creating post');
      return;
    }
    res.status(201).send('Post created successfully');
  });
});

// 新しいコメントを作成するエンドポイント
app.post('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const {content} = req.body;
  const query = 'INSERT INTO comments (post_id, content) VALUES (?, ?)';
  connection.query(query, [postId, content], (err,results) => {
    if(err){
      console.error('Error adding comment: ' + err);
      res.status(500).send('Error adding comment');
      return;
    }
    res.status(201).send('Comment added successfully');
  });
});


// サーバーの起動
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});