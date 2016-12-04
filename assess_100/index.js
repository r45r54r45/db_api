var express = require('express');
var app = express();

app.post('/question/:uid-:qid', function (req, res) {
    req.body.main.User_id=req.params.uid;
    req.body.main.Question_id=req.params.qid;
    db(lib.db.insert("Assess_100", req.body.main))
        .then(function (data) {
            var insertedId=data.insertId;
            req.body.sub.forEach(function(item, index){
                item.Assess_100_id=insertedId;
                db(lib.db.insert("Assess_100_score", item));
            })
            res.json({result: true})
        })
        .catch(function(err){
            res.json({err:err});
        })
})
app.get('/statistic', function (req, res) {
    db("select avg(q1) as aq1, avg(q2) as aq2, kk.title  from (select q.id as id, q.title as title,  " +
        "(select avg(score) from Assess_100_score where Assess_100_id=a100.id and question_num=1) as q1, " +
        "(select avg(score) from Assess_100_score where Assess_100_id=a100.id and question_num=2) as q2 " +
        "from Question q join Assess_100 a100 on q.id=a100.Question_id) as kk group by id ")
        .then(function (data) {
            res.json(data)
        })
        .catch(function(err){
            res.json({err:err});
        })
})
app.get('/statistic/:cid', function (req, res) {
    db("select avg(q1) as aq1, avg(q2) as aq2, kk.title  from (select q.id as id, q.title as title,  " +
        "(select avg(score) from Assess_100_score where Assess_100_id=a100.id and question_num=1) as q1, " +
        "(select avg(score) from Assess_100_score where Assess_100_id=a100.id and question_num=2) as q2 " +
        "from Question q join Assess_100 a100 on q.id=a100.Question_id where q.Category_id=?) as kk group by id ",[req.params.cid])
        .then(function (data) {
            res.json(data)
        })
        .catch(function(err){
            res.json({err:err});
        })
})
app.all('*', function (req, res) {
    res.send("fuck you");
})

module.exports = app;
