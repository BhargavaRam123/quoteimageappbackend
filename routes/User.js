import express from "express";
import { auth } from "../middleware/auth.js";
import getProfile from "../controllers/userprofile.js";
import { sendotp, signup, login } from "../controllers/Auth.js";
import multer from "multer";
import { AddImageTocloud, getcreations } from "../controllers/functionality.js";
import { generatelink } from "../controllers/twitterconnect.js";
import { callback } from "../controllers/twitterconnect.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = express.Router();
router.post("/sendotp", sendotp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/upload", upload.single("file"), AddImageTocloud);
router.get("/profile", auth, getProfile);
router.get("/getcreations", auth, getcreations);
router.get("/twitterauth", generatelink);
router.get("/twittercallback", callback);
export default router;
