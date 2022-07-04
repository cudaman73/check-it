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
  task: {
    type: String,
    required: true
  }
}

const listSchema = {
  name: {
    type: String,
    required: true
  },
  tasks: [itemsSchema]
}



const List = mongoose.model("List", listSchema);
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


app.get("/", (req, res) => {
  List.find({}, (err, lists) => {
    if (lists.length === 0) {
      if (err) {
        console.log(err);
      }
      res.render('home-blank')
    } else {
      res.render('home', {
        lists: lists
      });
    }
  });
});


app.post("/", (req, res) => {
  List.insertMany({
    name: req.body.newList,
    tasks: {
      task: "Enter your first task below"
    }
  }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("List saved to db");
      res.redirect("/");
    }
  });
});

app.get("/:listId", (req, res) => {
  List.findById(req.params.listId, (err, list) => {
    if (list === null) {
      console.log("There must have been an error, no list by that ID found");
      console.log(err);
    } else {
      res.render('list', {
        list: list
      });
    }
  });
});

app.post("/:listId", (req, res) => {
  List.findById(req.body._id, (err, list) => {
    if (err) {
      console.log(err);
    } else {
      list.tasks.push({
        task: req.body.newTask
      })
      list.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(`/${req.body._id}`)
        }
      })

    }
  });
});

app.post("/:listiD/:taskId/delete", (req, res) => {
  List.findById(req.body.listId, (error, list) => {
    if (error) {
      console.log(error);
    } else {
      list.tasks.id(req.body.taskId).remove();
      list.save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Task deleted from list ${list.name}`);
          res.redirect(`/${req.body.listId}`)
        }
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});

//
