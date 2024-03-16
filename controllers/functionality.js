import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Image } from "../models/image.model.js";
export async function AddImageTocloud(req, res) {
  try {
    const { email, imgname } = req.body;
    console.log("email name:", email);
    const filename = fileURLToPath(import.meta.url);
    var __dirname = dirname(filename);
    const foldername = "uploads/";
    __dirname = __dirname.replace("controllers", "");
    var filesarr;
    filesarr = fs.readdirSync(foldername);
    const response = await Cloudinary(__dirname, filesarr);

    var imgurl = await Image.create({ url: response, imgname: imgname });

    var user = await User.findOneAndUpdate(
      { email: email },
      {
        $push: {
          images: imgurl._id,
        },
      },
      { new: true }
    );
    // console.log(user);
    res.json({
      message: "image added to cloudinary",
      user: user,
    });
  } catch (error) {
    console.log("Error in addimagetocloud function:", error.message);
    res.json({
      error: error.message,
      message: "Error in addimagetocloud function",
    });
  }
}
export async function getcreations(req, res) {
  try {
    // console.log("request body value:", req.user);
    const { email } = req.user;
    console.log("email value:", email);
    const user = await User.findOne({ email: email }).populate("images");
    console.log(user);

    res.json({
      images: user.images,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
    console.log("error in getcreations:", error.message);
  }
}
