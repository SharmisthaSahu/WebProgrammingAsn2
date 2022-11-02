//set up the requires
var express = require('express');
var path = require('path');
var app = express();
// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//read json file data
const fs = require('fs');
let myData = fs.readFileSync('dataset.json');
let books = JSON.parse(myData);
//add Express-handlebars (tamplate engine) in this project
const exphbs = require('express-handlebars');
//adding port number as 3000
const port = process.env.port || 3000;
//express.static is a built-in middleware function
//express.static function is relative to the directory from where the node lunched.
//incase of the express.app running from other directory, it is better to use absolute path 
app.use(express.static(path.join(__dirname, 'public')));

//Create custom helper
const HBS = exphbs.create({
    layouts: "views/layouts", 
    partials: "views/partials",
    helpers:{
        inventoryRecord: function(inventory){
            if(inventory!=0){
                return inventory;
            }
            else {
                return 'No inverntory record';
            }
        }
    }
});

//link the package and initialize engine and set the engine to hbs path
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
//Call the root route and it route to the index.hbs file 
//it prints Express (the  title) and the message from the index.hbs(welcome to express)
app.get('/', function (req, res) {
    res.render('partials/index', { title: '' });
});
//call for user route which send a messagge mentioned res.send
app.get('/users', function (req, res) {
    res.send('respond with a resource');
});
//Assignment1 Read dataset
app.get('/data', (req,res)=>{
    console.dir(books, {'depth': null });
    res.render('dataload',{title: 'Assignment1 DataLoad', message:'JSON Data Loaded'});
});
//Assignment1 search for a book based on index
app.route('/data/search/isbn').get((req,res)=>{
        res.render('partials/findISBN');
    } )
    .post((req,res)=>{
        console.log(req.body.ISBN);
        books.forEach(element => {
            if(element.ISBN == req.body.ISBN){
               res.render('partials/success',{data:element});
            }
        }
       )
       res.render('partials/dataload',{message:'ISBN not found! No book details found'});
    })


       
//Assignment1 search for a book based on title
app.route('/data/search/title').get((req,res)=>{
    res.render('partials/findTitle');
} )
.post((req,res)=>{
    console.log(req.body.title);
    books.forEach(element => {
        if(element.title == req.body.title){
           res.render('partials/success',{element});
        }
    }
   )
   res.render('partials/dataload',{message:'Title not found! No book details found'});
})

//AllData route
app.get('/allData', (req, res) => {
    res.render('partials/tableFormatedData', {data:books});
})




//for any other root except the mentioned it will route to the error.hbs file and prints the message(title)
app.get('*', function (req, res) {
    res.render('partials/error', { title: 'Error', message: 'Wrong Route' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) 