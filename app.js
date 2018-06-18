var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://'+process.env.POSTGRES_USER+':'+process.env.POSTGRES_PASSWORD+'@localhost/authentication');
var bodyParser = require('body-parser');
var port = 8080;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var Users = sequelize.define('users',{
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Users.sync().then(function(){
    console.log('Table created');
});

app.get('/',function(req,res){
    res.render('info');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
    Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    res.render('success');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',function(req,res){
    res.render('main');
});

app.listen(port);
console.log(`Listening on port ${port}`);