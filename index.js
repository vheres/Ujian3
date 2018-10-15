const express = require('express');
var bodyParser = require('body-parser')
const cors = require('cors');
const mysql = require('mysql');
var crypto = require('crypto');

var app = express();
var url = bodyParser.urlencoded({ extended: false })
const port = 1995;

app.set('view engine', 'ejs')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'william',
    password: '0sampai1',
    database: 'hotelbertasbih',
    port: 3306
})

app.use(url);
app.use(bodyParser.json());
app.use(cors());

app.get('/kamar', function(req, res) {
    console.log(req.query.category)
    var category = ""
    if (req.query.category != undefined) {
        category = req.query.category;
    }
    var sql = `select tk.id, tk.nomorkamar, tc.namacategory, tk.harga from tablekamar tk join tablecategory tc on tk.categoryid = tc.id where tc.namacategory like "%${category}%"`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.post('/login', function(req, res) {
    var cipher = crypto.createHmac("sha256", "password").update(req.body.password).digest("hex")
    var sql = `select * from tableuser where email = '${req.body.email}' and password = '${cipher}'`
    console.log(sql)
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'login berhasil'})
    })
})

app.post('/register', function(req, res) {
    var cipher = crypto.createHmac("sha256", "password").update(req.body.password).digest("hex")
    var data = {
        username: req.body.username,
        email: req.body.email,
        password: cipher,
        role: req.body.role
    }
    var sql = `insert into tableuser set ?`
    conn.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'register berhasil'})
    })
})

app.post('/add_category', function(req, res) {
    var values = [];
    req.body.category.map((item, count) => {
        values.push([item])
    })
    var sql = `insert into tablecategory (namacategory) values ?`
    conn.query(sql, [values], (err, result) => {
        if (err) throw err;
        res.send({pesan: 'add category berhasil'});
    })
})

app.post('/add_kamar', function(req, res) {
    var data = {
        nomorkamar: req.body.nomorkamar,
        categoryid: req.body.categoryid,
        harga: req.body.harga
    }
    var sql = `insert into tablekamar set ?`
    conn.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'add kamar berhasil'});
    })
})

app.put('/update_category', function (req, res) {
    var data = {
        namacategory: req.body.namacategory
    }
    var sql = `update tablecategory set ? where id = ${req.body.id}`
    conn.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'update category berhasil'});
    })
})

app.put('/update_kamar', function (req, res) {
    var data = {
        nomorkamar: req.body.nomorkamar,
        categoryid: req.body.categoryid,
        harga: req.body.harga
    }
    var sql = `update tablekamar set ? where id = ${req.body.id}`
    conn.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'update kamar berhasil'});
    })
})

app.put('/update_user', function (req, res) {
    var cipher = crypto.createHmac("sha256", "password").update(req.body.password).digest("hex")
    var data = {
        username: req.body.username,
        email: req.body.email,
        password: cipher,
        role: req.body.role
    }
    var sql = `update tableuser set ? where id = ${req.body.id}`
    conn.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'update user berhasil'});
    })
})

app.delete('/delete_category/:id', function(req, res) {
    var sql = `delete from tablecategory where id=${req.params.id}`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'delete category berhasil'});
    })
})

app.delete('/delete_kamar/:id', function(req, res) {
    var sql = `delete from tablekamar where id=${req.params.id}`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'delete kamar berhasil'});
    })
})

app.delete('/delete_user/:id', function(req, res) {
    var sql = `delete from tableuser where id=${req.params.id}`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send({pesan: 'delete user berhasil'});
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));