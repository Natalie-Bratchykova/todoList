import express from "express";

import mongoose from "mongoose";
import cors from "cors";
// import ServerlessHttp  from "serverless-http";
let url = "mongodb+srv://nyanyanya:nyannyannyan@cluster0.civ0gsx.mongodb.net/todolist?retryWrites=true&w=majority&appName=AtlasApp"
mongoose.connect(url);

// create schemas for
// tasks
const taskSchema = {
  id: Number,
  title: String,
  deadline: String,
};
// lists
const listSchema = {
  id: Number,
  title: String,
  tasks: [taskSchema],
};

// create collections
const ListCollection = mongoose.model("List", listSchema);
const taskCollection = mongoose.model("Task", taskSchema);

const port = 1234;
const app = express();

const router = express.Router();

// middleware
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
let allLists = [];
let tasks = [];

//await ListCollection.deleteMany();

// 1. Show all list
app.get("/", async (req, res) => {
  allLists = await ListCollection.find();
  res.render("home", {
    lists: allLists,
  });
});

// 2. Create new list by typing it's name
app.post("/", async (req, res) => {
  // 2. Create new list by typing it's name
  if (req.body.listTitle) {
    let userListTitle = req.body.listTitle;
    allLists = await ListCollection.find();

    // check if inputed list does exist
    let currentList = await ListCollection.findOne({ title: userListTitle });

    if (!currentList) {
      let newUserList = new ListCollection({
        title: userListTitle,
        id:
          allLists[allLists.length - 1] !== undefined
            ? allLists[allLists.length - 1].id + 1
            : allLists.length + 1,
        tasks: [],
      });

      newUserList.save();
    }
  }

  // 3. delete list
  if (req.body.deleteList) {
    let deleteListId = Number(req.body.deleteList);

    await ListCollection.deleteOne({ id: deleteListId });
  }
  res.redirect("/");
});

// 4. Show list's items
app.get("/:listName", async (req, res) => {
  if (req.params.listName) {
    let time = new Date().getHours();
    console.log(`We are at show list page at ${time}`);
    let title = req.params.listName;
    allLists = await ListCollection.find();
    let currList = await ListCollection.findOne({ title: title });
    let render = {};
    if (currList) {
      render = {
        title: title,
        lists: allLists,
        tasks: currList.tasks,
      };
    } else {
      render = {
        lists: allLists,
        title: "ERROR😥🆘",
      };
    }
    res.render("list", render);
  }
});

// 5. Add list items
app.post("/addTask/:listTitle", async (req, res) => {
  // get List
  let listTitle = req.params.listTitle;
  let currentList = await ListCollection.findOne({
    title: listTitle,
  });
  if (currentList) {
    let newTask = new taskCollection({
      id:
        currentList.tasks[currentList.tasks.length - 1] !== undefined
          ? currentList.tasks[currentList.tasks.length - 1].id + 1
          : currentList.tasks.length + 1,
      title: req.body.task,
      deadline: req.body.deadline,
    });
    newTask.save();
    // add task to List
    currentList.tasks.push(newTask);
    currentList.save();

    // redirect to list show page
    res.redirect(`/${listTitle}`);
  } else {
    res.send("Error");
  }
});

// 6. Update list item
app.post("/updateTask", async (req, res) => {
  // get list --> get list title
  let title = req.query.list;
  let taskId = Number(req.query.task);
  let updatedTaskTitle = req.body.editTask;
  let updatedTaskDeadline = req.body.editDeadline;
  let currentList = await ListCollection.findOne({ title: title });

  let updated = {
    id: taskId,
    title: updatedTaskTitle,
    deadline: updatedTaskDeadline,
  };

  // get updated value
  let currentTask = await taskCollection.findOne({ id: taskId });

  currentTask.title = updated.title;
  currentTask.deadline = updated.deadline;
  currentTask.save();

  currentList.tasks.map((el) => {
    if (el.id === taskId) {
      el.title = currentTask.title;
      el.deadline = currentTask.deadline;
    }
    return el;
  });
  currentList.save();

  res.redirect(`/${title}`);
});

// 7. Delete list item
app.post("/delete", async (req, res) => {
  let title = req.body.listName;

  // task id
  let taskId = Number(req.body.deleteTaskId);
  console.log("task id = " + taskId);
  // list title
  let currentList = await ListCollection.findOne({ title: title });

  let savedTasks = currentList.tasks.filter((el) => el.id !== taskId);
  currentList.tasks = savedTasks;
  currentList.save();
  res.send(`/${title}`);
});


// add handler for our app to deploy it to netlify
// module.exports.handler = ServerlessHttp(app);



app.listen(port);
