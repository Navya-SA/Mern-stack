const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  asin: String,
  title: String,
  imgUrl: String,
  productURL: String,

  stars: Number,
  reviews: Number,

  price: Number,
  listPrice: Number,

  category_id: Number,

  isBestSeller: Boolean,
  boughtInLastMonth: Number
});

module.exports = mongoose.model("Products", ProductSchema);