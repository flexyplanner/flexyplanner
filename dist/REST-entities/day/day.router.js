"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const auth_controller_1 = require("../../auth/auth.controller");
const try_catch_wrapper_1 = __importDefault(require("../../helpers/function-helpers/try-catch-wrapper"));
const validate_1 = __importDefault(require("../../helpers/function-helpers/validate"));
const day_controller_1 = require("./day.controller");
const addProductSchema = joi_1.default.object({
    date: joi_1.default.string()
        .custom((value, helpers) => {
        const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
        const isValidDate = dateRegex.test(value);
        if (!isValidDate) {
            return helpers.message({
                custom: "Invalid 'date'. Use YYYY-MM-DD string format",
            });
        }
        return value;
    })
        .required(),
    productId: joi_1.default.string()
        .custom((value, helpers) => {
        const isValidObjectId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidObjectId) {
            return helpers.message({
                custom: "Invalid 'productId'. Must be MongoDB ObjectId",
            });
        }
        return value;
    })
        .required(),
    weight: joi_1.default.number().min(1).max(3000).required()
});
const deleteProductSchema = joi_1.default.object({
    dayId: joi_1.default.string()
        .custom((value, helpers) => {
        const isValidObjectId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidObjectId) {
            return helpers.message({
                custom: "Invalid 'dayId'. Must be MongoDB ObjectId",
            });
        }
        return value;
    })
        .required(),
    eatenProductId: joi_1.default.string().required(),
});
const getDayInfoScheme = joi_1.default.object({
    date: joi_1.default.string()
        .custom((value, helpers) => {
        const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
        const isValidDate = dateRegex.test(value);
        if (!isValidDate) {
            return helpers.message({
                custom: "Invalid 'date'. Use YYYY-MM-DD string format",
            });
        }
        return value;
    })
        .required(),
});
const router = (0, express_1.Router)();
router.post("/", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, try_catch_wrapper_1.default)(day_controller_1.checkDailyRate), (0, validate_1.default)(addProductSchema), (0, try_catch_wrapper_1.default)(day_controller_1.addProduct));
router.post("/info", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, try_catch_wrapper_1.default)(day_controller_1.checkDailyRate), (0, validate_1.default)(getDayInfoScheme), (0, try_catch_wrapper_1.default)(day_controller_1.getDayInfo));
router.delete("/", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, try_catch_wrapper_1.default)(day_controller_1.checkDailyRate), (0, validate_1.default)(deleteProductSchema), (0, try_catch_wrapper_1.default)(day_controller_1.deleteProduct));
exports.default = router;
