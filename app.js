//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const secret = require("./secret")

const app = express();
app.use(express.static('css'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(
  `mongodb+srv://${secret.user}:${secret.password}@cluster0.dam38h3.mongodb.net/todolistDB?retryWrites=true&w=majority`
);

const itemsSchema = {
  name: {
    type: String,
    required: true
  }
}

const Item = mongoose.model("Item", itemsSchema);

const defaultItems = [new Item({
    name: "Welcome to your new Todo List!"
  }),
  new Item({
    name: "Click + to add a new task"
  }),
  new Item({
    name: "<-- Check this when you're done"
  })
];


app.get("/", function(req, res) {
  Item.find({}, (err, tasks) => {
    if (tasks.length === 0) {
      Item.insertMany(defaultItems, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Items saved to dB");
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {
        listTitle: "Today's",
        tasks: tasks
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render('about');
});

app.post("/", function(req, res) {
  if (req.body.addButton === "Work") {
    workTasks.push(req.body.newTask);
    res.redirect("/work");
  } else {
    Item.insertMany({
      name: req.body.newTask
    }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Item saved to db");
      }
    });
    res.redirect("/");
  }
});

app.post("/delete", function(req, res) {
  Item.deleteOne({
    _id: req.body._id
  }, error => {
    if (error) {
      console.log(error);
    } else {
      console.log("Item deleted from db");
    }
  })
  res.redirect("/")
});
app.listen(3000, function() {
  console.log("Server started on port 3000.");
});

//
