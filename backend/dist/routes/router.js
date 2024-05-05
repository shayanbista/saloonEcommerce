"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const api_route_1 = require("../auth/routes/api_route");
const api_route_2 = require("../auth/routes/api_route");
const Routes = () => {
    const router = new koa_router_1.default();
    (0, api_route_1.login_route)(router);
    (0, api_route_2.registation_route)(router);
    return router;
};
exports.Routes = Routes;
