const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

exports.listAll = asyncHandler(async (req, res, next)=>{
  const list = await Category.find().sort({name: 1}).exec();
  
  res.render("categoryList", {
    title: "Category list",
    list: list
  });
});

exports.showDetails = asyncHandler(async(req, res, next)=>{
  res.send("Details to be implemented.")
})

exports.createGet = asyncHandler(async (req,res,next)=>{
  res.send("Category createGet to be implemented.");
});

exports.createPost = asyncHandler(async (req,res,next)=>{
  res.send("Category createPost to be implemented.");
});

exports.deleteGet = asyncHandler(async (req,res,next)=>{
  res.send("Category deleteGet to be implemented.");
});

exports.deletePost = asyncHandler(async (req,res,next)=>{
  res.send("Category deletePost to be implemented.");
});

exports.updateGet = asyncHandler(async (req,res,next)=>{
  res.send("Category updateGet to be implemented.");
});

exports.updatePost = asyncHandler(async (req,res,next)=>{
  res.send("Category updatePost to be implemented.");
});