// MEAN Stack sudan white pages Contact List App

var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('mongodb://uvmzbhyb5i1kdvwjutwx:wtmqr4qLQiDiIHs3Ioca@b5umy9fevfjs9qo-mongodb.services.clever-cloud.com:27017/b5umy9fevfjs9qo', ['contactlist']);
var db_users = mongojs('mongodb://ujdsmhblq0at1vdfkbm1:qZk1wx1wECjeXaiHgOW7@bxhe2droyrr2wmo-mongodb.services.clever-cloud.com:27017/bxhe2droyrr2wmo', ['users']);
var bodyParser = require('body-parser');
const {LocalStorage} = require("node-localstorage");
var session = new LocalStorage('./sessions'); 


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


// app.use(session({
//   secret: 'secret',
//   resave: true,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 365 * 1000
//   }
// }))


app.get('/register', function (req, res) {
  res.sendFile(__dirname + '/public/registration.html');
})

app.post('/register', function (req, res) {
  console.log(req.body);
  db_users.users.insert(req.body, function(err, doc) {
    session.clear();
    session.setItem('Name', req.body.name) 
  });
});

app.get('/current_user', function (req, res) {
  res.json({ name: session.getItem('Name')})
});

app.get('/contactlist', function (req, res) {
  console.log('I received a GET request');

  db.contactlist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/contactlist', function (req, res) {
  console.log(req.body);
  db.contactlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.contactlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, job: req.body.job, number: req.body.number,location: req.body.location}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

process.env.PORT = 3000;
app.listen(process.env.PORT);
console.log("Server running on port "+ process.env.PORT);

module.exports.process = process.env.PORT;