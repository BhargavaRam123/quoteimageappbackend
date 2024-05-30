import express from "express";
import userroutes from "./routes/User.js";
import { connect } from "./db/connect.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({
  path: "./env",
});
const app = express();
const port = process.env.PORT
const corsOptions = {
  origin: 'https://quoteimageapp-re5yort2o-bhargavs-projects-b1ccbd8a.vercel.app', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


app.use(
  express.json({
    limit: "20mb",
  })
);

app.get("/", (req, res) => {
  console.log("clicked on home route");
  res.json({
    message: "clicked on home page",
  });
});

app.use("/api/auth", userroutes);

app.listen(port, () => {
  console.log("server is listening on port 3001");
  connect();
});
