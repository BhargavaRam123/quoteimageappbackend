import mongoose from "mongoose";
let twitterschema = new mongoose.Schema({
  codeVerifier: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
});
export const Twitter = mongoose.model("Twitter", twitterschema);
