var express = require('express');
var app = express();

app.post('/', function (req, res) {
    db(lib.db.insert("User", req.body))
        .then(function (data) {
            var id=data.insertId;
            res.json({uid: id});
        })
        .catch(function(err){
            if(err.code=="ER_DUP_ENTRY"){
                res.json({err: "이메일 중복"});
            }else{
                res.json({err:err.code});
            }
        })
})
app.get('/mentor/:categoryid',function(req, res){
    db('select * from User u join Works_as w on u.id=w.User_id where w.Category_id=?',[req.params.categoryid])
        .then(function (data) {
            res.json(data);
        })
});
app.get('/isMentor/:uid-:categoryId', function(req, res){
    db("select * from User u join Works_as w on u.id=w.User_id where u.id=? and w.Category_id=?",[req.params.uid, req.params.categoryId])
        .then(function(data){
            if(data.length==0){
                res.json({type:0}) //일반유저
            }else{
                res.json({type:1}) //멘토
            }
        })
})
app.get('/',function(req, res){
    db('select * from User')
        .then(function (data) {
            res.json(data);
        })
});
app.get('/category/:type', function(req, res){
   switch (req.params.type){
       case "0":
           db('select * from User')
               .then(function (data) {
                   res.json(data);
               })
           break;
       case "2":
           db('select distinct u.id, u.name from User u join Works_as w on u.id=w.User_id')
               .then(function (data) {
                   res.json(data);
               })
           break;
       case "1":
           db('select distinct u.id, u.name from User u left outer join Works_as w on u.id=w.User_id where User_id is NULL')
               .then(function (data) {
                   res.json(data);
               })
           break;
       case "3":
           db("select * from User where TIMESTAMPDIFF(YEAR, birth, CURDATE())<10")
               .then(function (data) {
                   res.json(data);
               })
           break;
       case "4":
           db("select * from User where TIMESTAMPDIFF(YEAR, birth, CURDATE())>10")
               .then(function (data) {
                   res.json(data);
               })
           break;
       case "5":
           db("select * from User where sex = 'male'")
               .then(function (data) {
                   res.json(data);
               })
           break;
       case "6":
           db("select * from User where sex = 'female'")
               .then(function (data) {
                   res.json(data);
               })
           break;
   }
});
app.get('/specific/:uid',function(req, res){
    db('select ' +
        ' (select count(*) from Question q where q.User_id=?) as question_count,' +
        ' (select count(*) from Response r where r.User_id=?) as response_count,' +
        ' (select count(*) from Assess_5 a5 where a5.User_id=?) as assess_5_count,' +
        ' (select count(*) from Assess_100 a100 where a100.User_id=?) as assess_100_count,' +
        ' (select std(score) from Assess_5 a5 where a5.User_id=?) as std_score_5 ,' +
        ' (select avg(score) from Assess_5 a5 where a5.User_id=?)as avg_score_5,' +
        ' (select std((select sum(score) from Assess_100_score a100s where a100s.Assess_100_id=a100.id)) from Assess_100 a100 where a100.User_id=?) as std_score_100,' +
        ' (select avg((select sum(score) from Assess_100_score a100s where a100s.Assess_100_id=a100.id)) from Assess_100 a100 where a100.User_id=?) as avg_score_100' +
        ' from User where id=?',[req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid,req.params.uid])
        .then(function (data) {
            res.json(data[0]);
        })
});
app.get('/:uid',function(req, res){
    db('select * from User where id=?',[req.params.uid])
        .then(function (data) {
            res.json(data[0]);
        })
});
app.put('/:uid', function(req, res){
    db(lib.db.update("User",req.body, 'id=?'),[req.params.uid])
        .then(function(data){
            console.log("put user success")
            res.json({result: 'success'});
        })
        .catch(function(err){
            console.log("put user error")
            console.log(err);
            res.json({err: err});
        })
})
app.post('/login', function (req, res) {
    var b = req.body;
    db("select id from User where email=? and password=?",[b.email, b.password])
        .then(function(data){
            if(data.length==0){
                //no entry
                res.json({err: "없는 유저"})
            }else{
                res.json({uid: data[0].id})
            }
        })
        .catch(function(err){
            res.json(err);
        })
})
app.delete('/:uid', function(req, res){
    db("delete from User where id=?",[req.params.uid])
        .then(function(data){
            res.json({result: true})
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.all('*', function (req, res) {
    res.send("fuck you");
})

module.exports = app;
