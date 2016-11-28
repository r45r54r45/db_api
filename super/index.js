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

app.all('*', function (req, res) {
    res.send("fuck you");
})

module.exports = app;
