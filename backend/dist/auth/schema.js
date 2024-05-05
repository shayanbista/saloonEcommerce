"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const yup_1 = require("yup");
exports.userSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    age: (0, yup_1.number)().required().positive().integer(),
    email: (0, yup_1.string)().email(),
    website: (0, yup_1.string)().url().nullable(),
    createdOn: (0, yup_1.date)().default(() => new Date()),
});
