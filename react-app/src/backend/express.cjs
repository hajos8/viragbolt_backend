const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const port = 3333;

app.listen(port, () => {
    console.log("Cigány megy a házhoz!")
})