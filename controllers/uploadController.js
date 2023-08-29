const AWS = require('../utils/awsS3.js');
const multer = require('multer');
const User = require('../models/userModel.js');

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

exports.uploadToS3 = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const instance = new AWS.S3();
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
    };

    const s3Response = await instance.upload(params).promise();

    req.user = await User.findByIdAndUpdate(req.user._id, {
      image: s3Response.Location, // Update the profilePic field 
    });

    return res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
