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
  let { nev, leiras, keszlet, kepUrl } = req.body;
  let ar = +req.body.ar;
  let kategoriak_id = +req.body.kategoriak_id;

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

  console.log("nev:", nev);
  console.log("leiras:", leiras);
  console.log("ar:", ar);
  console.log("keszlet:", keszlet);
  console.log("kepUrl:", kepUrl);
  console.log("kategoriak_id:", kategoriak_id);

  connection.query(
    'INSERT INTO aruk (nev, leiras, ar, keszlet, kepUrl, kategoriaId) VALUES (?, ?, ?, ?, ?, ?)',
    [nev, leiras, ar, keszlet, kepUrl, kategoriak_id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Insert error' });
      }
      res.status(201).json({ msg: 'Sikeres hozzáadás!'});
    }
  );
});

app.put('/api/flowers/:id', (req, res) => {
  let { nev, leiras, keszlet, kepUrl } = req.body;
  let ar = +req.body.ar;
  let kategoriak_id = +req.body.kategoriak_id;

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
    'UPDATE aruk SET nev = ?, leiras = ?, ar = ?, keszlet = ?, kepUrl = ?, kategoriaId = ? WHERE id = ?',
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