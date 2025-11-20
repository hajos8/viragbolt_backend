const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nevenincs',
});

console.log("Connected to the database.");

app.get('/api/flowers', (req, res) => {
  connection.query('SELECT * FROM aruk', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/flowers/:id', (req, res) => {
  connection.query('SELECT * FROM aruk WHERE id = ?', [+req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.status(200).json(results);
  });
});

const port = 3333;

app.listen(port, () => {
    console.log("Cigány megy a házhoz!")
})