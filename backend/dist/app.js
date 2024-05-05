"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
require("reflect-metadata");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const router_1 = require("./routes/router");
const db_connection_1 = require("./db_connection");
const app = new koa_1.default();
const router = (0, router_1.Routes)();
//connecting to db
(0, db_connection_1.db_connection)();
app.use((0, koa_bodyparser_1.default)());
app.use(router.routes());
app.listen(3001, () => {
    console.log("code is running on 3000");
});
