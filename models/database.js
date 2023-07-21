const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
    name: String,
    listName: String
})

const Item = mongoose.model("Item", itemsSchema);

const itemOne = new Item ({
    name: "Buy food",
    listName: "default"
});
const itemTwo = new Item ({
    name: "Cook food",
    listName: "default"
});
const itemThree = new Item ({
    name: "Eat food",
    listName: "default"
});

Item.find({}).then(async function(data) {
    if (data.length === 0) {
        insert().then(console.log("items inserted"));
    }
  });

async function insert() {
    await Item.insertMany([itemOne, itemTwo, itemThree]);
};



exports.Item = Item;


// let itemList = ["Buy Food", "Cook Food", "Eat Food"];
// let workItems = ["Go to Work", "Come Home", "Take Tucker Out", "Study Session"];