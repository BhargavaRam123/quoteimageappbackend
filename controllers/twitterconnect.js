import { TwitterApi } from "twitter-api-v2";
import { Twitter } from "../models/twitterauth.model.js";
import { download } from "../utils/twitterutils.js";
const twitterClient = new TwitterApi({
  clientId: "ZGdULUNBbVJaRjZxNm84MjBSdHE6MTpjaQ",
  clientSecret: "SCGOcIY2zvrHkqgQM3D1xc7f-MSGjqx7U8KO4C9GCDZGLxIVft",
  // appKey: "4murSs2SbEiot9UUdzsDKefw8",
  // accessSecret: "izxJSm1Hcf47yIqWEwhEOcJhXItSWpzKITvC97kTSw2NM",
});
const callbackURL = "http://127.0.0.1:3001/api/auth/twittercallback";
// auth
export async function generatelink(request, response) {
  console.log("generate link function called");
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
  );
  twitterClient.console.log(url);

  // // store verifier
  // await dbRef.set({ codeVerifier, state });
  const twitter = await Twitter.create({
    codeVerifier: codeVerifier,
    state: state,
  });

  response.redirect(url);
}

// callback

export async function callback(req, res) {
  const { state, code } = req.query;
  console.log("callback called");
  const twitteri = await Twitter.find();
  console.log("database:", twitteri);
  // const dbSnapshot = await dbRef.get();
  // const { codeVerifier, state: storedState } = dbSnapshot.data();

  // if (state !== storedState) {
  //   return response.status(400).send('Stored tokens do not match!');
  // }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    clientId: "ZGdULUNBbVJaRjZxNm84MjBSdHE6MTpjaQ",
    clientSecret: "SCGOcIY2zvrHkqgQM3D1xc7f-MSGjqx7U8KO4C9GCDZGLxIVft",

    appKey: "4murSs2SbEiot9UUdzsDKefw8",
    accessSecret: "izxJSm1Hcf47yIqWEwhEOcJhXItSWpzKITvC97kTSw2NM",
    code,
    codeVerifier: twitteri[twitteri.length - 1].codeVerifier,
    redirectUri: callbackURL,
  });

  // await dbRef.set({ accessToken, refreshToken });

  // const { data } = await loggedClient.v2.me(); // start using the client if you want
  // const { data } = await loggedClient.v2.tweet("@neymar  #3567");

  // const uri =
  //   "https://res.cloudinary.com/dok67xcxs/image/upload/v1710479719/1710479698135-138897469_file.jpg.png";
  // const filename = "image.png";

  // download(uri, filename, async function () {
  try {
    console.log("started...");
    const mediaId = await loggedClient.v1.uploadMedia("./image.png");
    console.log("mediaid:", mediaId);
    await loggedClient.v2.tweet({
      text: "Hello worild! This is an image in Ukraine!",
      media: {
        media_ids: [mediaId],
      },
    });
  } catch (e) {
    console.log("error occured while sending data to twitter,", e.message);
    return res.send({ message: "error occured" });
  }
  // });
  res.send({ message: "image uploaded " });
  // res.send(data);
}

// tweet
