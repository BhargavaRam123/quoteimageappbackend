import express from "express";
import { auth } from "../middleware/auth.js";
import getProfile from "../controllers/userprofile.js";
import { sendotp, signup, login } from "../controllers/Auth.js";
import multer from "multer";
import {
  AddImageTocloud,
  getcreations,
  getcreationsbyid,
} from "../controllers/functionality.js";
import {
  callback1,
  generatelink,
  generatelink1,
} from "../controllers/twitterconnect.js";
import { callback } from "../controllers/twitterconnect.js";

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tweetimage/");
  },
  filename: function (req, file, cb) {
    console.log("did you uploaded the file");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2 });
const router = express.Router();
router.post("/sendotp", sendotp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/upload", upload1.single("file"), AddImageTocloud);
router.get("/profile", auth, getProfile);
router.get("/getcreations", auth, getcreations);
router.post("/getcreationbyid", auth, getcreationsbyid);
router.post("/twitfileupload", upload2.single("files"), generatelink1);
router.get("/fileuploadcallback", callback1);
router.post("/twitterauth", generatelink);
router.get("/twittercallback", callback);
export default router;
