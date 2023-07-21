require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const { Item } = require("./models/database");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// let itemList = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = ["Go to Work", "Come Home", "Take Tucker Out", "Study Session"];

// open mongo connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
// };
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'mongo connection err'));
// db.once('open', function(){
//   console.log("mongo connection open");
// });



app.get("/", async function (req, res) {
  var listItems = [];
  await Item.find({listName: "default"}).then(async function(data) {
    for (let i = 0; i < data.length; i++) {
      let newItem = data[i];
      await listItems.push(newItem);
    };
  });
  // console.log(listItems); 
  res.render("index", { listTitle: "Today", itemList: listItems });
});

app.get("/:listName", async function(req, res) {
  var listName = req.params.listName;
  var listItems = [];
  await Item.find({listName: listName}).then(async function(data) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let newItem = data[i];
        await listItems.push(newItem);
      };
    };
  });
  // console.log(listItems);
  res.render("index", {listTitle: listName, itemList: listItems});
})


app.post("/",async function (req, res) {
  // console.log(req.body);
  var newListItem = req.body.newItem;
  if (req.body.list === "Today") {
    var listName = "default";
    var redirUrl = "/";
  } else {
    var listName = req.body.list;
    var redirUrl = `/${listName}`
  }
  var addTo = new Item({name: newListItem, listName: listName});
  await addTo.save();
  res.redirect(redirUrl);
});

app.post("/delete", async function (req, res) {
  var { name, listName }  = req.body.checkbox;
  if (listName === "default") {
    var redirUrl = "/";
  } else {
    var redirUrl = `/${listName}`;
  }
  await Item.deleteOne({name: name, listName: listName});
  res.redirect(redirUrl);
})

app.get("/about", function (req, res) {
  res.render("about");
});


connectDB().then(() => {
  app.listen(PORT, function () {
    console.log(`server started on port ${PORT}`);
  });  
}); 

