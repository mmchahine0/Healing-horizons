const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    image: {
      type: String
    },
    productName: {
      type: String,
      required: [true, "Add the product name"],
      trim: true,
      minLength: 3,
      unique: true,
    },
    productDescription: {
      type: String,
      required: [true, "Add the product description"],
      trim: true,
      minLength: 3,
      maxLength: 255,
    },
    productImage: {
      type: String,
      default: "",
    },
    productPrice: {
      type: Number,
      default: 0,
      required: [true, "Add the product price"],
    },
    productQuantity: {
      type: Number,
      default: 0,
      required: [true, "Add the product quantity"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);
