const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const ExpressError = require("./utils/ExpressError");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust",
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

const checkCloudinaryAuth = async (req, res, next) => {
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary authentication successful.");
    next();
  } catch (error) {
    console.error("Cloudinary authentication failed");
    next(new ExpressError(500, "Please check your Cloudinary Config"));
  }
};

module.exports = { cloudinary, storage, checkCloudinaryAuth };
