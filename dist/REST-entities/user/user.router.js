"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../auth/auth.controller");
const try_catch_wrapper_1 = __importDefault(require("../../helpers/function-helpers/try-catch-wrapper"));
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get("/", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, try_catch_wrapper_1.default)(user_controller_1.getUserInfo));
exports.default = router;
