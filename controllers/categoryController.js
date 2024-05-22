require('dotenv').config();
const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

exports.listAll = asyncHandler(async (req, res, next)=>{
  const list = await Category.find().sort({name: 1}).exec();
  
  res.render("categoryList", {
    title: "Category list",
    list: list
  });
});

exports.showDetails = asyncHandler(async(req, res, next)=>{
  const [category, itemList] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}).exec()
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("categoryDetail", {category: category, itemList: itemList});
});

exports.createGet = asyncHandler(async (req,res,next)=>{
  res.render("categoryForm", {title: "Create Category"});
});

exports.createPost = [
  body("name")
  .trim()
  .isLength({min: 4})
  .withMessage("Name must have at least 4 characters")
  .isLength({max: 100})
  .withMessage("Name can have max. 100 characters")
  .escape(),

  body("description")
  .trim()
  .isLength({min: 5})
  .withMessage("Description must have at least 5 characters")
  .isLength({max: 400})
  .withMessage("Description can have max. 400 characters")
  .escape(),

  body("password")
  .escape()
  .equals(process.env.PW)
  .withMessage("Wrong password"),
  
  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if(!errors.isEmpty()){
      res.render("categoryForm", {
        title: "Create Category",
        category: category,
        errors: errors.array()
      });
    } else {
      await category.save();
      res.redirect(category.url);
    };
  })
]

exports.deleteGet = asyncHandler(async (req,res,next)=>{
  const [category, itemList] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}).exec()
  ]);

  res.render("categoryDelete", {
    category: category,
    itemList: itemList
  })
});

exports.deletePost = [
  body("password")
  .escape()
  .equals(process.env.PW)
  .withMessage("Wrong password"),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const [category, itemList] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({category: req.params.id}).exec()
    ]);

    if(itemList.length > 0){
      res.render("categoryDelete", {
        category: category,
        itemList: itemList
      });
    } else if(!errors.isEmpty()) {
      res.render("categoryDelete", {
        category: category,
        itemList: itemList,
        passwordmessage: "Wrong password"
      });
    } else {
      await Category.findByIdAndDelete(req.body.categoryid);
      res.redirect("/categories");
    }
  })
]

exports.updateGet = asyncHandler(async (req,res,next)=>{
  const category = await Category.findById(req.params.id).exec();

  res.render("categoryForm", {
    title: "Update Category",
    category: category,
  });
});

exports.updatePost = [
  body("name")
  .trim()
  .isLength({min: 4})
  .withMessage("Name must have at least 4 characters")
  .isLength({max: 100})
  .withMessage("Name can have max. 100 characters")
  .escape(),

  body("description")
  .trim()
  .isLength({min: 5})
  .withMessage("Description must have at least 5 characters")
  .isLength({max: 400})
  .withMessage("Description can have max. 400 characters")
  .escape(),

  body("password")
  .escape()
  .equals(process.env.PW)
  .withMessage("Wrong password"),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      res.render("categoryForm", {
        title: "Update Category",
        category: category,
        errors: errors.array()
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {})
      res.redirect(updatedCategory.url);
    };
  })
];