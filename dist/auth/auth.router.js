"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
const validate_1 = __importDefault(require("../helpers/function-helpers/validate"));
const auth_controller_1 = require("./auth.controller");
const signUpSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(254).required(),
    email: joi_1.default.string().min(3).max(254).required(),
    password: joi_1.default.string().min(8).max(100).required(),
});
const signInSchema = joi_1.default.object({
    email: joi_1.default.string().min(3).max(254).required(),
    password: joi_1.default.string().min(8).max(100).required(),
});
const refreshTokensSchema = joi_1.default.object({
    sid: joi_1.default.string()
        .custom((value, helpers) => {
        const isValidObjectId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidObjectId) {
            return helpers.message({
                custom: "Invalid 'sid'. Must be MongoDB ObjectId",
            });
        }
        return value;
    })
        .required(),
});
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.default)(signUpSchema), (0, try_catch_wrapper_1.default)(auth_controller_1.register));
router.post("/login", (0, validate_1.default)(signInSchema), (0, try_catch_wrapper_1.default)(auth_controller_1.login));
router.post("/refresh", (0, validate_1.default)(refreshTokensSchema), (0, try_catch_wrapper_1.default)(auth_controller_1.refreshTokens));
router.post("/logout", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, try_catch_wrapper_1.default)(auth_controller_1.logout));
exports.default = router;
