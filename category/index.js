var express = require('express');
var app = express();

app.post('/', function (req, res) {
    db(lib.db.insert("Category", req.body))
        .then(function (data) {
            var id=data.insertId;
            res.json({uid: id});
        })
        .catch(function(err){
            res.json({err:err});
        })
})

app.get('/', function (req, res) {
    db("select * from Category")
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err){

        })
})
app.delete('/', function (req, res) {
    db("delete from Category where id=?",[req.body.id])
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err){

        })
})
app.patch('/:cid', function (req, res) {
    db(lib.db.update("Category",req.body, 'id=?'),[req.params.cid])
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err){

        })
})

app.all('*', function (req, res) {
    res.send("fuck you");
})

module.exports = app;
