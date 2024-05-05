"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registation_route = exports.login_route = void 0;
const controller_1 = require("../controller");
const login_route = (router) => {
    //   router.get("/login", registration);
    router.get("/login", (ctx) => {
        ctx.body = "hello this is a login page";
    });
};
exports.login_route = login_route;
const registation_route = (router) => {
    router.post("/registration", controller_1.registration);
};
exports.registation_route = registation_route;
