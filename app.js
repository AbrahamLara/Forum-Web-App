var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://'+process.env.POSTGRES_USER+':'+process.env.POSTGRES_PASSWORD+'@localhost/authentication');
var bodyParser = require('body-parser');
var port = 8080;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/success',function(req,res){
    res.render('success');
});

app.post('/success',function(req,res){
    res.render('success');
});

app.get('/',function(req,res){
    res.render('index');
});

app.post('/',function(req,res){
    res.render('index');
});

app.listen(port);
console.log(`Listening on port ${port}`);