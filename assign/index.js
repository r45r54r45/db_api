var express = require('express');
var app = express();

app.post('/', function (req, res) {
    db(lib.db.insert("Assigned_to", req.body))
        .then(function (data) {
            var id=data.insertId;
            res.json({uid: id});
        })
        .catch(function(err){

        })
})
app.get('/:uid', function (req, res) {
    db("select * from Assigned_to a join Question q on q.id=a.Question_id where a.User_id=?",[req.params.uid])
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
