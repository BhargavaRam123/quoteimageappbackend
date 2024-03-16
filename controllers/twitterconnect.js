import { TwitterApi } from "twitter-api-v2";
import { Twitter } from "../models/twitterauth.model.js";
import { text } from "express";

export async function generatelink1(req, res) {
  try {
    const { email } = req.body;
    const client = new TwitterApi({
      appKey: "EKxaPZOIE2hW3mQPxXRqOIpau",
      appSecret: "SoL7rehIOf2K5gi7wM9UvdUTxxmtWOEvgzYBh1AvATBpFihBWT",
    });
    const callbackurl = "http://127.0.0.1:3001/api/auth/twittercallback";
    console.log("generating link...");
    const link = await client.generateAuthLink(callbackurl);
    console.log("link is:", link);
    const { oauth_token_secret, oauth_token } = link;
    const twit = await Twitter.findOne({ email: email });
    if (!twit) {
      await Twitter.create({
        email: email,
        oauth_token_secret: oauth_token_secret,
        oauth_token: oauth_token,
      });
    } else {
      await Twitter.findOneAndUpdate(
        { email: email },
        {
          oauth_token_secret: oauth_token_secret,
          oauth_token: oauth_token,
        }
      );
    }
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
    // const arr = await Twitter.findOne({email});
    const oauth_token_secret = arr[arr.length - 1].oauth_token_secret;
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
    const mediaid = await loggedClient.v1.uploadMedia("./image.png");
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
    const client = new TwitterApi({
      clientId: "ZGdULUNBbVJaRjZxNm84MjBSdHE6MTpjaQ",
      clientSecret: "LDUadVklPn30fRe7DqvOtkTIIeHBbz2JacJFhRLHm8EdjLkJmB",
    });

    const callbackurl = "http://127.0.0.1:3001/api/auth/twittercallback";
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      callbackurl,
      { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
    );
    await Twitter.create({
      state: state,
      codeVerifier: codeVerifier,
    });
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
    const arr = await Twitter.find();
    const codeVerifier = arr[arr.length - 1].codeVerifier;
    const sessionState = arr[arr.length - 1].state;
    if (!codeVerifier || !state || !sessionState || !code) {
      return res
        .status(400)
        .send("You denied the app or your session expired!");
    }
    if (state !== sessionState) {
      return res.status(400).send("Stored tokens didnt match!");
    }

    const client = new TwitterApi({
      clientId: "ZGdULUNBbVJaRjZxNm84MjBSdHE6MTpjaQ",
      clientSecret: "LDUadVklPn30fRe7DqvOtkTIIeHBbz2JacJFhRLHm8EdjLkJmB",
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
        media_ids: ["1769075294386978816"],
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
