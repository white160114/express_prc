const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

// mysql接続情報
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});


// mysql接続



app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000, () => {
    console.log(`Server started! click here 'http://localhost:3000'`);
  });