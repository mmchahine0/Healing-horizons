const Product = require("../models/MedSellingModels/productModel.js")
const User = require("../models/userModel.js")

const checkDoctor = async (req) => {
  try {
    const checkUser = await User.findById(req.user._id)//or_id:req.user._id//https://www.youtube.com/watch?v=yVi4RUL-rpE&t=2s ***/4:00
    if (!checkUser) {
      console.log("User not found")
      return false;
    }
    if (checkUser.role !== "doctor") {
      return false;
    }
    else { return true; }
  } catch (err) {
    console.log(err)
  }
};

exports.createProduct = async (req, res) => {
  try {
    const checkUser = await checkDoctor(req)
    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot insert an item" })
    }

    const newProduct = await Product.create(
      {
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        createdBy: req.user._id,
      })
    return res.status(201).json({ message: "Product has been added succesfully ", product: newProduct })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const checkUser = await checkDoctor(req)
    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot insert an item" })
    }
    const checkProduct = await Product.findByIdAndUpdate(req.params.productID, req.body, { new: true });
    if (!checkProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product updated" })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const checkUser = await checkDoctor(req)
    if (checkUser == false) {
      return res.status(401).json({ message: "User cannot delete an item" })
    }
    const checkProduct = await Product.findByIdAndDelete(req.params.productID);
    if (!checkProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted" })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();//may add{}
    if (products.length <= 0) {
      return res.status(404).json({ message: "No products are available at the moment" })
    }
    return res.status(200).json(products)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
};

exports.getProductById = async (req, res) => {
  try {
    const checkProduct = await Product.findById(req.params.productID)
    if (!checkProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(checkProduct);
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
};