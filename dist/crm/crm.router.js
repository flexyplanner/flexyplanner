"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
const crm_controller_1 = require("../crm/crm.controller");
const router = (0, express_1.Router)();
router.post("/leads", (0, try_catch_wrapper_1.default)(crm_controller_1.createLeads));
router.post("/order", (0, try_catch_wrapper_1.default)(crm_controller_1.createOrder));
router.get("/offers", (0, try_catch_wrapper_1.default)(crm_controller_1.getOffers));
exports.default = router;
