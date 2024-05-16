const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {type: String, required: true, maxLength: 100, minLength: 1},
  description: {type: String, required: true, maxLength: 500},
  price: {type: Number, required: true},
  amount: {type: Number, required: true},
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  picture: {type: String}
});

ItemSchema.virtual("url").get(function(){
  return "/item/" + this._id;
})

module.exports = mongoose.model("Item", ItemSchema);