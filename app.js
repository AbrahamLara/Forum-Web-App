var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://'+process.env.POSTGRES_USER+':'+process.env.POSTGRES_PASSWORD+'@localhost/authentication');
var bodyParser = require('body-parser');
var port = 8080;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));

var Users = sequelize.define('users',{
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
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

var Thread = sequelize.define('threads',{
    title: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    author: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    post: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// var Posts = sequelize.define('posts',{
//     // To be filled
// });

// You need these for the tables to be created
Users.sync().then(function(){
    console.log('Table created');
});

Thread.sync().then(function(){
    console.log('Table Created');
});

app.get('/',function(req,res){
    res.render('info');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){

    if (req.body.name === '' || req.body.email === '' || req.body.password === '') {
        req.body.name = req.body.password = req.body.email = null;
    }

    Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(function(item){
        res.render('success');
    }).catch(function(err){
        res.render('register');
    });

});

app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',function(req,res){

    var email = req.body.email;
    var password = req.body.password;

    Users.findAll().then(function(rows) {
        var flag;
        for (var  i = 0; i < rows.length; i++ ) {
            if (rows[i].dataValues.email === email && rows[i].dataValues.password === password) {
                flag = false;
                res.redirect('main');
                break;
            } else {
                flag = true;
            }
        }

        if (flag) {
            res.redirect('login');
        }
    });
});

app.get('/main',function(req,res){

    var threads;
    Thread.findAll().then(function(rows) {
        threads = rows;
        res.render('main',{
            threads: threads
        });
    });
});

app.get('/form',function(req,res){
    Thread.findAll().then(function(rows) {
        for (var  i = 0; i < rows.length; i++ ) {
            if (rows[i].dataValues.email === email && rows[i].dataValues.password === password) {
                flag = false;
                res.redirect('main');
                break;
            } else {
                flag = true;
            }
        }

        if (flag) {
            res.redirect('login');
        }
    });
});

app.post('/form',function(req,res){
    if (req.body.name === '' || req.body.email === '' || req.body.password === '') {
        req.body.name = req.body.password = req.body.email = null;
    }

    Thread.create({
        title: req.body.title,
        author: req.body.author,
        post: req.body.post
    }).then(function(item){
        res.render('main');
    }).catch(function(err){
        res.render('form');
    });
});

app.get('/thread/:id', function(req,res) {

    var id = req.params.id;

    res.render('thread',{
        id: id
    });
})

app.listen(port);
console.log(`Listening on port ${port}`);