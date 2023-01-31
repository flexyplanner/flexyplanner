"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
const mono_controller_1 = require("../mono/mono.controller");
const router = (0, express_1.Router)();
router.post("/:id", (0, try_catch_wrapper_1.default)(mono_controller_1.monoInvoiceCreate));
router.post("/acquiring/webhook", (0, try_catch_wrapper_1.default)(mono_controller_1.monoWebHook));
exports.default = router;
