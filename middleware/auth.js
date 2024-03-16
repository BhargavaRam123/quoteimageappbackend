import jwt from "jsonwebtoken";
export async function auth(req, res, next) {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("token requested is", req);
    console.log("token is:", token);
    if (!token) {
      res.status(400).json({
        message: "no token found in the cookies",
      });
      return;
    }

    // verify the token with the token secret

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
      // console.log("req.user", req.user)
    } catch (error) {
      console.log(
        "error occured while verifying the token in the middleware",
        error.message
      );
      return res.status(400).json({
        message: "token is not valid",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      message: "error occured in the auth function in the middle ware",
    });
    console.log(
      "error occured in the auth function in the middle ware:",
      error.message
    );
    return;
  }
}
