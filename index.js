const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/books", async(req, res) => {
    try {
        const getBooks = await pool.query('SELECT * FROM "Book" ORDER BY book_number ASC');

        res.json(getBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/books/:sid", async(req, res) => {
    try {
        const {sid} = req.params;
        const getBooks = await pool.query('SELECT * FROM "Book" WHERE store_number = $1', [sid]);

        res.json(getBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post("/query", async(req, res) => {
    console.log(req.body);
    try {
        const {sqlquery} = req.body;
        const getBooks = await pool.query(sqlquery);

        res.json(getBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post("/books", async(req, res) => {
    try {
        const {book_number, author_number, publisher_number, store_number, book_name, publication_year, pages, price, quantity} = req.body;
        const postBooks = await pool.query("INSERT INTO \"Book\" VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [book_number, author_number, publisher_number, store_number, book_name, publication_year, pages, price, quantity]);

        res.json(postBooks);
    } catch (err) {
        console.error(err.message);
    }
});

app.put("/books/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {author_number, publisher_number, store_number, book_name, publication_year, pages, price, quantity} = req.body;
        const updateBooks = await pool.query("UPDATE \"Book\" SET author_number=$1, publisher_number=$2, store_number=$3, book_name=$4, publication_year=$5, pages=$6, price=$7, quantity=$8 WHERE book_number = $9 RETURNING *", 
        [author_number, publisher_number, store_number, book_name, publication_year, pages, price, quantity, id]);

        res.json(updateBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/books/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const delBooks = await pool.query("DELETE FROM \"Book\" WHERE book_number = $1 RETURNING *", [id]);

        res.json(delBooks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("server started");
});