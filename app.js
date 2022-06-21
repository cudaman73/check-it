//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let tasks = [];
app.use(express.static('css'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let day = daysOfWeek[new Date().getDay()]
  res.render('list', {day: day, tasks: tasks})
});

app.post("/", function(req, res) {
  tasks.push(req.body.newTask)
  res.redirect("/")
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
