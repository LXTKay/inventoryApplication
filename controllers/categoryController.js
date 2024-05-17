const asyncHandler = require("express-async-handler");

exports.listAll = asyncHandler(async (req, res, next)=>{
  res.send("Category list to be implemented.")
})