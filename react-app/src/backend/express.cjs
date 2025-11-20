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

app.get('/api/categories', (req, res) => {
  connection.query('SELECT * FROM kategoriak', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Query error' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/flowers/:id', (req, res) => {
  connection.query('SELECT * FROM aruk WHERE id = ?', [+req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Query error' });
    }
    if(results.length === 0) {
      return res.status(404).json({ msg: 'A virág nem található' });
    }
    else{
      res.status(200).json(results);
    }
  });
});

app.post('/api/flowers', (req, res) => {
  const { nev, leiras, keszlet, kepUrl } = req.body;
  const ar = +req.body.ar;
  const kategoriak_id = +req.body.kategoriak_id;

  if(!nev) {
    return res.status(400).json({ error: 'Hiányzó név' });
  }

  if(leiras === undefined) {
    leiras = null;
  }
  if(isNaN(ar)) {
    ar = null;
  }
  if(isNaN(keszlet)) {
    keszlet = null;
  }
  if(!kepUrl) {
    kepUrl = null;
  }
  if(isNaN(kategoriak_id)) {
    kategoriak_id = null;
  }

  connection.query(
    'INSERT INTO aruk (nev, leiras, ar, keszlet, kepUrl, kategoriak_id) VALUES (?, ?, ?, ?, ?, ?)',
    [nev, leiras, ar, keszlet, kepUrl, kategoriak_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Insert error' });
      }
      res.status(201).json({ msg: 'Sikeres hozzáadás!'});
    }
  );
});

app.put('/api/flowers/:id', (req, res) => {
  const { nev, leiras, keszlet, kepUrl } = req.body;
  const ar = +req.body.ar;
  const kategoriak_id = +req.body.kategoriak_id;

  if(!nev) {
    return res.status(400).json({ error: 'Hiányzó név' });
  }

  if(leiras === undefined) {
    leiras = null;
  }
  if(isNaN(ar)) {
    ar = null;
  }
  if(isNaN(keszlet)) {
    keszlet = null;
  }
  if(!kepUrl) {
    kepUrl = null;
  }
  if(isNaN(kategoriak_id)) {
    kategoriak_id = null;
  }

  connection.query(
    'UPDATE aruk SET nev = ?, leiras = ?, ar = ?, keszlet = ?, kepUrl = ?, kategoriak_id = ? WHERE id = ?',
    [nev, leiras, ar, keszlet, kepUrl, kategoriak_id, +req.params.id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Update error' });
      }
      if(results.affectedRows === 0) {
        return res.status(404).json({ msg: 'Az adott azonosítóval nem található termék!' });
      }
      res.status(200).json({ msg: 'Sikeres módosítás!' });
    }
  );
});

app.delete('/api/flowers/:id', (req, res) => {
  connection.query(
    'DELETE FROM aruk WHERE id = ?', [+req.params.id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Delete error' });
      }
      if(results.affectedRows === 0) {
        return res.status(404).json({ msg: 'A virág nem található!' });
      }
      res.status(200).json({ msg: 'Sikeres törlés!' });
    }
  );
});

const port = 3333;

app.listen(port, () => {
    console.log("Fut")
})