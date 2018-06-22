var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://gtuglfteawnnrk:e77132a4865e06843b04ec9968068bb73c385a99c49560d15baf0444cf1916da@ec2-54-243-40-26.compute-1.amazonaws.com/de8fvkr9b38gf7');
var bodyParser = require('body-parser');

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

var Posts = sequelize.define('posts',{
    author: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    reply: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Posts.belongsTo(Thread);

Users.sync().then(function(){
    
});

Thread.sync().then(function(){
    
});

Posts.sync().then(function(){
    
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
    res.render('form');
});

app.post('/form',function(req,res){
    if (req.body.title === '' || req.body.author === '' || req.body.post === '') {
        req.body.name = req.body.password = req.body.email = null;
    }

    Thread.create({
        title: req.body.title,
        author: req.body.author,
        post: req.body.post
    }).then(function(item){
        res.redirect('main');
    }).catch(function(err){
        res.render('form');
    });
});

app.get('/thread/:id', function(req,res) {

    var id = req.params.id;
    var posts;

    Posts.findAll({
        where: {
            threadId: id
        }
    }).then(function(rows){
        posts = rows;
        Thread.findById(id).then(function(thread){
            res.render('thread',{
                id: id,
                thread: thread,
                posts: posts
            });
        });
    });
})

app.post('/thread/:id', function(req,res) {

    var id = req.params.id;
    var table = `post${id}`;

    Posts.create({
        author: req.body.name,
        reply: req.body.reply,
        threadId: id
    }).then(function(item){
        res.redirect(`/thread/${id}`);
    }).catch(function(err){
        res.redirect(`/thread/${id}`);
    });
})

app.listen(port);
console.log(`Listening on port ${port}`);