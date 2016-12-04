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
app.post('/super/:uid/:cid', function (req, res) {
    db(lib.db.insert("Belong_to", req.body))
        .then(function (data) {
            var id=data.insertId;
            db("insert into Works_as (User_id, Category_id) values (?,?)",[req.params.uid, req.params.cid])
            res.json({uid: id});
        })
        .catch(function(err){

        })
})
app.get('/add/:gid/:uid/:cid', function (req, res) {
    db("insert into Belong_to (User_id, Mentor_group_id, isSuper) values (?,?,?)",[req.params.uid, req.params.gid,0])
        .then(function (data) {
            db("insert into Works_as (User_id, Category_id) values (?,?)",[req.params.uid, req.params.cid])
            res.json(data);
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
app.get('/all/:gid', function (req, res) {
    db("select * from Belong_to b join User u on b.User_id=u.id where b.Mentor_group_id=? and isSuper=0",[req.params.gid])
        .then(function (data) {
            res.json(data);
        })
        .catch(function(err){

        })
})
app.get('/:uid', function (req, res) {
    db("select distinct m.id, m.name, m.Category_id as cid from Mentor_group m join Belong_to b on m.id=b.Mentor_group_id  where b.User_id=? and b.isSuper=1 ",[req.params.uid])
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
app.delete('/:gid/:uid', function (req, res) {
    db("delete from Belong_to where User_id=? and Mentor_group_id=?",[req.params.uid,req.params.gid ])
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
