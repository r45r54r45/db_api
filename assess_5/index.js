var express = require('express');
var app = express();

app.post('/question/:uid-:qid', function (req, res) {
    req.body.User_id=req.params.uid;
    req.body.Question_id=req.params.qid;
    db(lib.db.insert("Assess_5", req.body))
        .then(function (data) {
            res.json({result: true})
        })
        .catch(function(err){
            res.json({err:err});
        })
})
app.post('/response/:uid-:rid', function (req, res) {
    req.body.User_id=req.params.uid;
    req.body.Response_id=req.params.rid;
    db(lib.db.insert("Assess_5", req.body))
        .then(function (data) {
            res.json({result: true})
        })
        .catch(function(err){
            res.json({err:err});
        })
})

app.all('*', function (req, res) {
    res.send("fuck you");
})

module.exports = app;
