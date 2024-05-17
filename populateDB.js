#! /usr/bin/env node

console.log(
  'This script populates some test items and category to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

//Main func execution

main().catch((err) => console.log(err));

//Main func and side funcs:

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

//Functions to make single DB document:

async function itemCreate(index, name, description, price, amount, category){
  const item = new Item({
    name: name,
    description: description,
    price: price,
    amount: amount,
    category: category
  });
  await item.save();
  items[index] = item;
  console.log("Added Item: " + name)
};

async function categoryCreate(index, name, description){
  const category = new Category({
    name: name,
    description: description
  });
  await category.save();
  categories[index] = category;
  console.log("Added Category: " + name);
};

//Make multiple documents:

async function createCategories(){
  console.log("Adding Categories!");
  await Promise.all([
    categoryCreate(0, "Seating Accommodations", "Things the customer can sit on."),
    categoryCreate(1, "Table", "Furniture to put things on."),
    categoryCreate(2, "Beds", "Furniture to sleep in."),
    categoryCreate(3, "Cupboards", "Furniture to store the customers inventory."),
  ])
};

async function createItems(){
  console.log("Adding Items!");
  await Promise.all([
    itemCreate(0, "Nice Stool", "A nice stool made from wood.", 20, 22, categories[0]),
    itemCreate(1, "White Couch", "A big white couch.", 500, 3, categories[0]),
    itemCreate(2, "Dynamic Office Chair", "An office chair that is nice for your back.", 80, 10, categories[0]),
    itemCreate(3, "Regular Chair", "A regular chair.", 49.99, 40, categories[0]),

    itemCreate(4, "Super Table", "High tech table with lots of settings.", 400, 2, categories[1]),
    itemCreate(5, "Dining Table", "A table to eat from.", 150, 31, categories[1]),
    itemCreate(6, "Office Table", "A small table for the office.", 119.99, 100, categories[1]),

    itemCreate(7, "Awesome Bed", "A bed for the bedroom.", 150, 2, categories[2]),
    itemCreate(8, "Big Bed Mega XXL", "A giant bed everyone wants to sleep in.", 1299, 1, categories[2]),
    itemCreate(9, "Moderate Bed Green", "A good bed for poor people.", 300, 12, categories[2]),
    itemCreate(10, "Jail Bed", "Not everyones taste, but at least it is sturdy.", 99, 25, categories[2]),

    itemCreate(11, "Wardrobe", "A cupboard to store your clothes.", 200, 10, categories[3]),
    itemCreate(12, "Kitchen Cabinet", "A cabinet for tableware.", 180, 10, categories[3]),
    itemCreate(13, "Giant Cupboard", "A big cupboard to store big things.", 620, 99, categories[3]),
  ])
};

//execute: node populateDB <your MongoDB url>