"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { authorize } from "../../auth/auth.controller";
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
// import { getUserInfo } from "./user.controller";
const promo_controller_1 = require("./promo.controller");
const auth_controller_1 = require("../auth/auth.controller");
const router = (0, express_1.Router)();
router.post("/", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, try_catch_wrapper_1.default)(promo_controller_1.createPromo));
router.get("/", (0, try_catch_wrapper_1.default)(promo_controller_1.getPromo));
router.patch("/", (0, try_catch_wrapper_1.default)(promo_controller_1.switchPromoStatus));
router.delete("/", (0, try_catch_wrapper_1.default)(promo_controller_1.deletePromo));
exports.default = router;
