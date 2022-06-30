//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let tasks = [];
let workTasks = [];
app.use(express.static('css'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let day = daysOfWeek[new Date().getDay()]
  res.render('list', {listTitle: day, tasks: tasks})
});

app.get("/work", function(req, res) {
  res.render('list', {listTitle: "Work", tasks: workTasks})
});

app.get("/about", function(req, res) {
  res.render('about')
});

app.post("/", function(req, res) {
  if (req.body.addButton === "Work") {
    workTasks.push(req.body.newTask)
    res.redirect("/work")
  } else {
  tasks.push(req.body.newTask)
  res.redirect("/")
}
});

// app.post("/work", function(req, res) {
//   console.log(req.body)
// });
app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
