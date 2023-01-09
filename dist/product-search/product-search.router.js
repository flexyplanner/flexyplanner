"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
const product_search_controller_1 = require("./product-search.controller");
const searchQuerySchema = joi_1.default.object({
    search: joi_1.default.string().min(1).max(30).required(),
});
const router = (0, express_1.Router)();
router.get("/", 
// tryCatchWrapper(authorize),
// tryCatchWrapper(checkDailyRate),
// validate(searchQuerySchema, "query"),
(0, try_catch_wrapper_1.default)(product_search_controller_1.findProducts));
router.patch("/", (0, try_catch_wrapper_1.default)(product_search_controller_1.switchMarkupStatus));
router.post("/", (0, try_catch_wrapper_1.default)(product_search_controller_1.switchMarkupModify));
exports.default = router;
