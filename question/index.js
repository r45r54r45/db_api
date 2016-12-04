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
app.get('/', function(req, res){
    db("select * from Question")
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.get('/category/:cid', function(req, res){
    db("select * from Question where Category_id=?",[req.params.cid])
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.get('/category', function(req, res){
    db("select * from Category")
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.post('/:uid-:categoryid',upload.single('image'), function(req, res){
    //질문 올리기
    if(req.file){
        req.body.image=req.file.filename;
    }
    req.body.User_id=parseInt(req.params.uid);
    req.body.Category_id=parseInt(req.params.categoryid);
    req.body.assess_end=new Date().toMysqlFormat(); //질문의 생명은 하루
    var query=lib.db.insert("Question",req.body);
    console.log(req.body);
    db(query)
        .then(function(data){
            res.json({result: data});
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.get('/:qid', function(req, res){
    db("select * from Question where id=?",[req.params.qid])
        .then(function(data){
            res.json(data[0]);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.patch('/:qid', function(req, res){
    db(lib.db.update("Question",req.body, 'id=?'),[req.params.qid])
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json({err: err});
        })
})
app.get('/type/:typeid-:uid', function(req, res){
    switch (req.params.typeid){
        case '1':
            //1. 분류순
            db("select * from Question order by Category_id")
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json({err: err});
                })
            break;
        case '2':
            //2. 최근작성시간순
            db("select * from Question order by created_at desc")
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json({err: err});
                })
            break;
        case '3':
            //3. 평가 가능순
            db("select * from Question order by assess_end desc")
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json({err: err});
                })
            break;
        case '4':
            //4. 높은 평가점수 순
            db("select * from Question order by total_score desc")
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json({err: err});
                })
            break;
        case '5':
            //5. 낮은 평가 점수순
            db("select * from Question order by total_score")
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json({err: err});
                })
            break;
        case '6':
            db("select * from Question q join Assigned_to a on q.id=a.Question_id where a.User_id=? order by a.created_at desc",[req.params.uid])
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json({err: err});
                })
            break;
        default:
            res.json({err: "typeid mismatch"});
            break;
    }
})

app.delete('/:qid', function(req, res){
    console.log("Delete");
    db("delete from Question where id=?",[req.params.qid])
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

