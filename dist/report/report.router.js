"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
const report_controller_1 = require("./report.controller");
const promo_controller_1 = require("../promo/promo.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (0, try_catch_wrapper_1.default)(report_controller_1.createReport));
router.post("/", (0, try_catch_wrapper_1.default)(report_controller_1.promoTable));
router.patch("/", (0, try_catch_wrapper_1.default)(report_controller_1.updatePromo));
router.delete("/", (0, try_catch_wrapper_1.default)(promo_controller_1.deletePromo));
exports.default = router;
