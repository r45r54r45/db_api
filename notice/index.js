var express = require('express');
var app = express();

app.post('/', function (req, res) {
    db(lib.db.insert("Notice", req.body))
        .then(function (data) {
            var id=data.insertId;
            res.json({uid: id});
        })
        .catch(function(err){
            res.json({err: err})
        })
})
app.get('/:gid', function (req, res) {
    db("select * from Notice where Mentor_group_id=?",[req.params.gid])
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err})
        })
})

app.all('*', function (req, res) {
    res.send("fuck you");
})

module.exports = app;
