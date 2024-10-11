import express from "express";
import cors from "cors";
import { router as login } from "./api/login";

import bodyParser from "body-parser";

export const app = express();
app.use(express.json());
app.use(bodyParser.text());
app.use(bodyParser.json());


// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });

app.use(
    cors({
      // origin: "*",
      origin: "http://localhost:4200"
      // origin: 'http://172.20.10.4',
    })  
  );
  
  app.use("", login);