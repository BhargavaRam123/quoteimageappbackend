import { TwitterApi } from "twitter-api-v2";
import { Twitter } from "../models/twitterauth.model.js";
import { text } from "express";
import fs from "fs";
import path from "path";

export async function generatelink1(req, res) {
  try {
    const { email } = req.body;
    const client = new TwitterApi({
      appKey: "EKxaPZOIE2hW3mQPxXRqOIpau",
      appSecret: "SoL7rehIOf2K5gi7wM9UvdUTxxmtWOEvgzYBh1AvATBpFihBWT",
    });
    const callbackurl = "http://127.0.0.1:3001/api/auth/fileuploadcallback";
    console.log("generating link...");
    const link = await client.generateAuthLink(callbackurl);
    console.log("link is:", link);
    const { oauth_token_secret, oauth_token } = link;
    const twit = await Twitter.findOne({ email: email });
    if (!twit) {
      console.log("first time");
      await Twitter.create({
        email: email,
        oauth_token_secret: oauth_token_secret,
        oauth_token: oauth_token,
      });
    } else {
      console.log("second time");
      const isupdated = await Twitter.findOneAndUpdate(
        { email: email },
        {
          oauth_token_secret: oauth_token_secret,
          oauth_token: oauth_token,
        },
        { new: true }
      );
      console.log("is this really updated:", isupdated);
    }
    return res.json({
      message: "url recieved",
      url: link,
    });
    // return res.redirect(link);
  } catch (error) {
    console.log("error occured in generate link :", error.message);
    return res.json({
      message: "error",
    });
  }
}

export async function callback1(req, res) {
  try {
    console.log("callback funciton called");
    const { oauth_token, oauth_verifier } = req.query;
    const val = await Twitter.findOne({ oauth_token: oauth_token });
    const oauth_token_secret = val.oauth_token_secret;
    // console.log("oath_token", oauth_token, oauth_verifier);
    // console.log("oath_secret:", oauth_token_secret);
    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
      return res
        .status(400)
        .send("You denied the app or your session expired!");
    }
    const client = new TwitterApi({
      appKey: "EKxaPZOIE2hW3mQPxXRqOIpau",
      appSecret: "SoL7rehIOf2K5gi7wM9UvdUTxxmtWOEvgzYBh1AvATBpFihBWT",
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });

    const {
      client: loggedClient,
      accessToken,
      accessSecret,
    } = await client.login(oauth_verifier);
    console.log("uploading...");
    var filesarr;
    filesarr = fs.readdirSync("tweetimage/");
    console.log("filesarray value:", filesarr);
    const mediaid = await loggedClient.v1.uploadMedia(
      "./tweetimage/" + filesarr[0]
    );
    await Twitter.findOneAndUpdate(
      { oauth_token: oauth_token },
      {
        fileIdOnServer: mediaid,
      }
    );
    fs.readdir("tweetimage/", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        // console.log("hello world");
        fs.unlink(path.join("tweetimage/", file), (err) => {
          if (err) throw err;
        });
      }
    });
    console.log("upload to the twitter server", mediaid);
    return res.json({
      user: accessToken,
      status: "success",
      response: mediaid,
      message: "callback page",
    });
  } catch (error) {
    console.log("error occured in callback function:", error.message);
    return res.json({
      message: "tweet not sent in the client side",
    });
  }
}

export async function generatelink(req, res) {
  try {
    const { email } = req.body;
    const client = new TwitterApi({
      clientId: "WmREOVdoeTUwUnFZaVJ2S0lyNWs6MTpjaQ",
      clientSecret: "36uQ9lZlFxeg8ERxrKBrz_4d70SpsmZeVgbsXLQYgYaufykJhI",
    });

    const callbackurl = "http://127.0.0.1:3001/api/auth/twittercallback";
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      callbackurl,
      { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
    );
    const twit = await Twitter.findOneAndUpdate(
      { email: email },
      {
        codeVerifier: codeVerifier,
        state: state,
      }
    );

    return res.json({
      clickonme: url,
      message: "url sent successfully",
    });
  } catch (error) {
    console.log("error occured in the generatelink:", error.message);
    return res.json({
      message: "error occured",
    });
  }
}
export async function callback(req, res) {
  try {
    const callbackurl = "http://127.0.0.1:3001/api/auth/twittercallback";
    const { state, code } = req.query;
    const val = await Twitter.findOne({ state: state });
    const codeVerifier = val.codeVerifier;
    const sessionState = val.state;
    if (!codeVerifier || !state || !sessionState || !code) {
      return res
        .status(400)
        .send("You denied the app or your session expired!");
    }
    if (state !== sessionState) {
      return res.status(400).send("Stored tokens didnt match!");
    }

    const client = new TwitterApi({
      clientId: "WmREOVdoeTUwUnFZaVJ2S0lyNWs6MTpjaQ",
      clientSecret: "36uQ9lZlFxeg8ERxrKBrz_4d70SpsmZeVgbsXLQYgYaufykJhI",
    });

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: callbackurl,
    });
    console.log("Sending image tweet......");
    const resp = await loggedClient.v2.tweet({
      text: "hello mf iam coding my ass off#234333",
      media: {
        media_ids: [val.fileIdOnServer],
      },
    });
    return res.json({
      accessToken: accessToken,
      refreshToken,
      resp: resp,
      message: "hello mf",
    });
  } catch (error) {
    console.log("error occured in callback:", error.message);
    return res.json({
      error: error,
    });
  }
}
