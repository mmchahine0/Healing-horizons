const AWS = require('../utils/awsS3.js');
const multer = require('multer');
const User = require('../models/userModel.js');
const Product = require('../models/MedSellingModels/productModel.js');

const multerStorage = multer.memoryStorage();

const filter = (req, file, cb) => {
  console.log(file.mimetype)
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
  else {
    cb(new Error("Not an image! please upload only images"), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: filter
})

exports.uploadImage = upload.single("image")


const uploadProductPictureToS3 = async (file, productId) => {
  try {
    const params = {
      Bucket: process.env.PRODUCT_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    const imageUrl = await uploadToS3(params);

    // Update the product with the image URL
    await Product.findByIdAndUpdate(productId, { productImage: imageUrl });

    return imageUrl;
  } catch (error) {
    console.error('Error uploading product picture to S3:', error);
    throw new Error('Failed to upload product picture to S3');
  }
};

exports.uploadProductPicture = async (req, res) => {
  try {
    const { productId } = req.body; // Assuming productId is sent in the request body

    if (!req.file || !productId) {
      return res.status(400).json({ message: 'Invalid request, missing file or product ID' });
    }

    const imageUrl = await uploadProductPictureToS3(req.file, productId);
    return res.status(200).json({ message: 'Product picture uploaded successfully', imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
    };

    const imageUrl = await uploadToS3(params);

    const updatedUser = await updateProfilePicture(req.user._id, imageUrl);

    return res.status(200).json({ message: 'Profile picture uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateProfilePicture = async (userId, imageUrl) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });
    return updatedUser;
  } catch (err) {
    console.error('Error updating profile picture:', err);
    throw new Error('Failed to update profile picture');
  }
};