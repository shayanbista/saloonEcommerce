"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registration = void 0;
const datasource_1 = require("../datasource");
const User_1 = require("../entity/User");
const registration = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let credentials = ctx.request.body;
    let { name, password } = credentials;
    const User_Acc = datasource_1.AppDataSource.getRepository(User_1.User);
    console.log(User_Acc);
    (ctx.body = name), User_Acc;
    const user = new User_1.User();
    user.firstName = "Ram";
    user.password = "12345";
    yield User_Acc.save(user);
    console.log(user);
    // user.firstName = name;
    // user.password = password;
    // await User_Acc.save(user);
});
exports.registration = registration;
