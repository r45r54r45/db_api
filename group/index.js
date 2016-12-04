var express = require('express');
var app = express();

app.post('/', function (req, res) {
    db(lib.db.insert("Mentor_group", req.body))
        .then(function (data) {
            var id=data.insertId;
            res.json({uid: id});
        })
        .catch(function(err){

        })
})
app.get('/super/:gid', function (req, res) {
    db("select u.name from Belong_to b join User u on b.User_id=u.id where Mentor_group_id=? and isSuper=1 order by b.created_at desc limit 0,1",[req.params.gid])
        .then(function (data) {
            res.json(data[0]);
        })
        .catch(function(err){
            console.log(err);
        })
})
app.post('/super', function (req, res) {
    db(lib.db.insert("Belong_to", req.body))
        .then(function (data) {
            var id=data.insertId;
            res.json({uid: id});
        })
        .catch(function(err){

        })
})
app.get('/', function (req, res) {
    db("select * from Mentor_group")
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err){

        })
})
app.delete('/:mid', function (req, res) {
    db("delete from Mentor_group where id=?",[req.params.mid])
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
