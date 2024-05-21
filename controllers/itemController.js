const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const validator = require("validator");

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
  const categoryList = await Category.find().sort({name: 1}).exec();

  res.render("itemForm", {title: "Create Item", categoryList: categoryList});
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

  body("price")
  .isNumeric()
  .withMessage("Must be number")
  .isFloat({min: 0})
  .withMessage("Must be positive number"),

  body("amount")
  .isNumeric()
  .withMessage("Must be number")
  .isFloat({min: 0})
  .withMessage("Must be positive number"),
  
  body('picture')
    .trim()
    .customSanitizer(value => {
      // Remove any potentially dangerous characters, allowing only a set of safe characters
      return value.replace(/[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]/g, '');
    })
    .custom(value => {
      // Allow empty string, otherwise validate as a URL
      if (value && !validator.isURL(value, { require_protocol: true })) {
        throw new Error('Invalid URL');
      }
      return true;
    }),

  body("category", "Category must not be empty")
  .trim()
  .isLength({min: 1})
  .escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: Math.trunc(req.body.price * 100)/100,
      amount: Math.trunc(req.body.amount),
      category: req.body.category,
      picture: req.body.picture
    });

    if(!errors.isEmpty()){
      const categoryList = await Category.find().sort({name: 1}).exec();

      res.render("itemForm", {
        title: "Create Item",
        item: item,
        categoryList: categoryList,
        errors: errors.array()
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  })
]

exports.deleteGet = asyncHandler(async (req,res,next)=>{
  const item = await Item.findById(req.params.id);

  res.render("itemDelete", {item: item});
});

exports.deletePost = asyncHandler(async (req,res,next)=>{
  await Item.findByIdAndDelete(req.body.itemid);

  res.redirect("/items");
});

exports.updateGet = asyncHandler(async (req,res,next)=>{
  const [item, categoryList] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().sort({name: 1}).exec()
  ])

  res.render("itemForm", {
    title: "Update Item",
    item: item,
    categoryList: categoryList,
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

  body("price")
  .isNumeric()
  .withMessage("Must be number")
  .isFloat({min: 0})
  .withMessage("Must be positive number"),

  body("amount")
  .isNumeric()
  .withMessage("Must be number")
  .isFloat({min: 0})
  .withMessage("Must be positive number"),
  
  body('picture')
  .trim()
  .customSanitizer(value => {
    // Remove any potentially dangerous characters, allowing only a set of safe characters
    return value.replace(/[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]/g, '');
  })
  .custom(value => {
    // Allow empty string, otherwise validate as a URL
    if (value && !validator.isURL(value, { require_protocol: true })) {
      throw new Error('Invalid URL');
    }
    return true;
  }),

  body("category", "Category must not be empty")
  .trim()
  .isLength({min: 1})
  .escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: Math.trunc(req.body.price * 100)/100,
      amount: Math.trunc(req.body.amount),
      category: req.body.category,
      picture: req.body.picture,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      const categoryList = await Category.find().sort({name: 1}).exec();

      res.render("itemForm", {
        title: "Update Item",
        item: item,
        categoryList: categoryList,
        errors: errors.array()
      });
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  })
]