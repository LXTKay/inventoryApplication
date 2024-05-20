const asyncHandler = require("express-async-handler");
const Item = require("../models/item");

exports.listAll = asyncHandler(async (req, res, next)=>{
  const list = await Item.find().sort({name: 1}).exec();

  res.render("itemList", {
    list: list,
    title: "Item List"
  })
})


exports.showDetails = asyncHandler(async(req, res, next)=>{
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("itemDetail", {item: item});
})

exports.createGet = asyncHandler(async (req,res,next)=>{
  res.send("Item createGet to be implemented.");
});

exports.createPost = asyncHandler(async (req,res,next)=>{
  res.send("Item createPost to be implemented.");
});

exports.deleteGet = asyncHandler(async (req,res,next)=>{
  res.send("Item deleteGet to be implemented.");
});

exports.deletePost = asyncHandler(async (req,res,next)=>{
  res.send("Item deletePost to be implemented.");
});

exports.updateGet = asyncHandler(async (req,res,next)=>{
  res.send("Item updateGet to be implemented.");
});

exports.updatePost = asyncHandler(async (req,res,next)=>{
  res.send("Item updatePost to be implemented.");
});