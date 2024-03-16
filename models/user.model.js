import mongoose from "mongoose";
let userschema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
});
export const User = mongoose.model("User", userschema);
