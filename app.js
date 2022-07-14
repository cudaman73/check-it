//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const secret = require("./secret")

const app = express();
app.use(express.static('static'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(
  `mongodb+srv://${secret.user}:${secret.password}@cluster0.dam38h3.mongodb.net/todolistDB?retryWrites=true&w=majority`
);

const colors= [
  "#D2E59E",
  "#B1C1C0",
  "#E15554",
  "#4D9DE0",
  "#E1BC29",
  "#3BB273",
  "#7768AE",
  "#34312D",
  "#D9C5B2",
  "#8CFF98",
  "#483519",
  "#305252",
  "#488286",
  "#B2FF9E",
  "#086375",
  "#3C1642",
  "#3D2C2E",
  "#77A6B6",
  "#C455A8",
  "#CF8BA3",
  "#DB5ABA",
  "#F7A072",
  "#0FA3B1",
  "#5C1A1B",
  "#67597A",
  "#6E8894",
  "#FFED66",
  "#00CECB",
  "#7E1F86",
  "#A14DA0"
]

const itemsSchema = {
  task: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  }
}

const listSchema = {
  name: {
    type: String,
    required: true
  },
  tasks: [itemsSchema],
  color: {
    type: String
  }
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
      console.log(lists);
      res.render('home', {
        lists: lists
      });
    }
  });
});


app.post("/", (req, res) => {
  random_color = colors[Math.floor(Math.random()*colors.length)]
  List.insertMany({
    name: req.body.newList,
    tasks: {
      task: "Enter your first task below"
    },
    color: random_color
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
        task: req.body.newTask,
        checked: false
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

app.put("/:listId/put", (req, res) => {
  List.updateOne({
    _id: req.body.listId,
    "tasks._id": req.body.taskId
  }, {
    "$set": {
      "tasks.$.checked": req.body.checked
    }
  }, (error) => {
    if (error) {
      console.log(error);
    }
  })
})

app.post("/:listId/delete", (req, res) => {
  List.deleteOne({
    _id: req.body.listId
  }, (deleted) => {
    console.log("List deleted!");
  })
  res.redirect("/")
})

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
