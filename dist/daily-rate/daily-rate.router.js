"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const validate_1 = __importDefault(require("../helpers/function-helpers/validate"));
const auth_controller_1 = require("../auth/auth.controller");
const try_catch_wrapper_1 = __importDefault(require("../helpers/function-helpers/try-catch-wrapper"));
const daily_rate_controller_1 = require("./daily-rate.controller");
const enums_1 = require("../helpers/typescript-helpers/enums");
const getDailyRateSchema = joi_1.default.object({
    weight: joi_1.default.number().required().min(20).max(500),
    height: joi_1.default.number().required().min(100).max(250),
    age: joi_1.default.number().required().min(18).max(100),
    desiredWeight: joi_1.default.number().required().min(20).max(500),
    bloodType: joi_1.default.number()
        .required()
        .valid(enums_1.BloodType.ONE, enums_1.BloodType.TWO, enums_1.BloodType.THREE, enums_1.BloodType.FOUR),
});
const userIdSchema = joi_1.default.object({
    userId: joi_1.default.string()
        .custom((value, helpers) => {
        const isValidObjectId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidObjectId) {
            return helpers.message({
                custom: "Invalid 'userId'. Must be MongoDB object id",
            });
        }
        return value;
    })
        .required(),
});
const router = (0, express_1.Router)();
router.post("/", (0, validate_1.default)(getDailyRateSchema), (0, try_catch_wrapper_1.default)(daily_rate_controller_1.countDailyRate));
router.post("/:userId", (0, try_catch_wrapper_1.default)(auth_controller_1.authorize), (0, validate_1.default)(userIdSchema, "params"), (0, validate_1.default)(getDailyRateSchema), (0, try_catch_wrapper_1.default)(daily_rate_controller_1.countDailyRate));
exports.default = router;
