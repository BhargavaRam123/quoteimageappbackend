import mongoose from "mongoose";
let twitterschema = new mongoose.Schema({
  email: {
    type: String,
  },
  fileIdOnServer: {
    type: Number,
  },
  oauth_token: {
    type: String,
    // required: true,
  },
  oauth_token_secret: {
    type: String,
    // required: true,
  },
  codeVerifier: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
});
export const Twitter = mongoose.model("Twitter", twitterschema);
