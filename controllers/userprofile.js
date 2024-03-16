import { User } from "../models/user.model.js";
export default async function getProfile(req, res) {
  try {
    const { email } = req.body;
    var emaildata = await User.findOne({ email: email });
    console.log("emaildata:", emaildata);
    return res.status(200).json({
      emaildata,
    });
  } catch (error) {
    console.log("error occured in the getprofile controller:", error.message);
    return res.status(400);
  }
}
