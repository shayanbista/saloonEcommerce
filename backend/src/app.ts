import koa from "koa";
import serve from "koa-static";
import "reflect-metadata";
import { Options } from "body-parser";
import mount from "koa-mount";

import bodyParser from "koa-bodyparser";

import cors from "@koa/cors";
import { Routes } from "./routers/router";
import { db_connection } from "./dbConnection";
import { token_verification } from "./auth/jwt-verification/token_verification";
import path, { dirname } from "path";

const rootDirectory = path.resolve(__dirname, "..", "public", "images");
console.log(rootDirectory);

let newPath = path.join(rootDirectory, "1.png");
console.log(newPath);
const app = new koa();
const router = Routes();

app.use(mount("/public", serve("./public")));

// connecting to db
db_connection();

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser());
// app.use(token_verification);
app.use(router.routes());

app.listen(3000, () => {
  console.log("code is running on 3000");
});
