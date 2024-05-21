import mongoose from "mongoose";
let Imageschema = new mongoose.Schema({
  imageid: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  imgname: {
    type: String,
    required: true,
  },
});
export const Image = mongoose.model("Image", Imageschema);
