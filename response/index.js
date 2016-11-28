var express = require('express');
var app = express();
var multer=require('multer');
var upload = multer({ dest: 'public/images/' });

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    this.setDate(new Date().getDate()+1);
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

app.post('/:uid-:questionid',upload.single('image'), function(req, res){
    //답변 올리기
    req.body.image=req.file?req.file.filename:"";
    req.body.User_id=parseInt(req.params.uid);
    req.body.Question_id=parseInt(req.params.questionid);
    req.body.assess_end=new Date().toMysqlFormat(); //답변의 생명은 하루
    var query=lib.db.insert("Response",req.body);
    db(query)
        .then(function(data){
            res.json({result: data});
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.get('/', function(req, res){
    db("select * from Response")
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.get('/:qid', function(req, res){
    db("select * from Response where Question_id=?",[req.params.qid])
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.patch('/:rid', function(req, res){
    db(lib.db.update("Response",req.body, 'id=?'),[req.params.rid])
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.delete('/:rid', function(req, res){
    db("delete from Response where id=?",[req.params.rid])
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.all('*',function(req, res){
    res.send("fuck you");
})

module.exports=app;

