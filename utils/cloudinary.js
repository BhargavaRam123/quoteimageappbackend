import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
export default async function Cloudinary(
  __dirname,
  filesarr,
  height,
  qualilty
) {
  try {
    cloudinary.config({
      cloud_name: "dok67xcxs",
      api_key: "758517446125839",
      api_secret: "ZggJybVVrVgNqAHrBBLGO5Heal8",
    });
    console.log("filesarr:", filesarr);
    const str = path.join(__dirname, 'uploads', filesarr[1]);
    console.log("string value:", str);
    var res = "";
    await cloudinary.uploader.upload(
      str,
      { public_id: filesarr[1] },
      function (error, result) {
        console.log(result);
        res = result.secure_url;
        if (error) console.log(error);
      }
    );
    console.log("result value:", res);
    filesarr.map(async (file) => {
     await fs.unlink(path.join(__dirname, 'uploads', file));
    });
    return res;
  } catch (error) {
    console.log("error occured in Cloudinary:", error.message);
    return res;
  }
}
