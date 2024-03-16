import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import otpgenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function sendotp(req, res) {
  try {
    let { email } = req.body;

    //check if user already signed up

    let isuserpresent = await User.find({ email });

    // error throw karo if user already exists
    console.log(isuserpresent);
    if (isuserpresent.length > 0) {
      return res.status(401).json({
        message: "user already exists no need to signup",
      });
    }

    // generate a otp and make sure it is unique (of size 6 below)

    let otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // checking for if the otp already present

    const result = await Otp.find({ otp });

    while (result.length > 0) {
      let otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const result = await Otp.find({ otp });
      console.log(result);
    }

    // store the otp in database to check it when user enters

    // if the otp is not send then resend it

    const otpi = await Otp.create({
      email,
      otp,
    });

    console.log(otpi);

    return res.status(200).json({
      success: true,
      message: "otp successfully sent to mail",
      otp: otpi,
    });
  } catch (error) {
    console.log("error occured in sendotp function:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function signup(req, res) {
  // sign up user

  // get the required fields using req

  // validate 2 passwords are matching or not

  // check user exists or not

  // validate the otp ,check the most recent otp

  // hash the password

  // create user field and update

  // after
  try {
    let { firstName, lastName, email, password, confirmpassword, otp } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(403).json({
        message: "fill all the required fields",
      });
    }

    if (password !== confirmpassword)
      return res.status(401).json({
        message: "password and confirm password are not same",
      });

    let userexists = await User.find({
      email,
    });

    if (userexists.length > 0) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    const recentotp = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1); //-1 represents descending order and limit represents the size of the array is limited to 1
    console.log("recent otp is:", recentotp);

    if (recentotp.length === 0) {
      return res.status(400).json({
        message: "otp not found in the database",
      });
    } else if (otp !== recentotp[0].otp) {
      return res.status(400).json({
        message: "invalid otp entered",
      });
    }

    let hashedpassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedpassword,
    });

    return res.status(200).json({
      message: "user successfully added into the database",
      user: user,
    });
  } catch (error) {
    console.log("error in signup():", error.message);
    return res.status(500).json({
      message: "user registration failed please try again",
    });
  }
}

export async function login(req, res) {
  try {
    let { email, password } = req.body;

    // validation of data

    if (!email || !password)
      return res.status(400).json({
        message: "both email and password are required for login",
      });

    let isuserexists = await User.find({ email });

    if (isuserexists.length === 0) {
      return res.status(400).json({
        message: "you didnt created your account first signup!",
      });
    }

    // password matching
    // console.log("here are the arguments check them:", password, isuserexists[0].password)
    let resu = await bcrypt.compare(password, isuserexists[0].password);
    // console.log(resu)
    //create jwt token
    if (resu) {
      const token = jwt.sign(
        {
          email: isuserexists[0].email,
        },
        process.env.JWT_SECRET
      );
      isuserexists.token = token;
      isuserexists.password = undefined;
      return res.status(200).json({
        success: true,
        token: token,
        isuserexists,
        message: "successfully logged in and token is generated",
      });
    } else {
      return res.status(400).json({
        message: "please check your entered password",
      });
    }
  } catch (error) {
    console.log("error in login function:", error.message);
    return res.status(400).json({
      message: "something went wrong in login function",
    });
  }
}
