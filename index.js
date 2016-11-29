var express = require('express');
var app = express();
var bodyParser = require('body-parser');
lib = require('r45r54r45');
db = require('./db');
cors = require('cors')
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/static',express.static(__dirname + '/public'));

app.use('/user',require('./user'));
app.use('/question', require('./question'));
app.use('/response', require('./response'));
app.use('/assess_5', require('./assess_5'));
app.use('/assess_100', require('./assess_100'));
app.use('/super',require('./super'));

app.get('/', function(req, res){
    res.send("wtf?");
})
app.listen(3001);
console.log("listening on 3001");

