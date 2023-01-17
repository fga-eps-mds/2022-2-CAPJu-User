import app from "./app.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import https from 'https';
import fs from 'fs';
import path from 'path';

config();

mongoose
  .connect(process.env.MONGODB_URI )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("Error:", err.message);
  });

// const __dirname = './'
// const sslServer = https.createServer({
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
//     },
//     app
// )

app.listen(process.env.PORT || 3334, () => console.log("Server running"));


async function failGracefully() {
  console.log("Something is gonna blow up.");
  process.exit(0);
}



process.on("SIGTERM", failGracefully);
process.on("SIGINT", failGracefully);


