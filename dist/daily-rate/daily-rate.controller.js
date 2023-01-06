"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDailyRate = void 0;
const product_model_1 = __importDefault(require("../REST-entities/product/product.model"));
const user_model_1 = __importDefault(require("../REST-entities/user/user.model"));
const summary_model_1 = __importDefault(require("../REST-entities/summary/summary.model"));
const countDailyRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { height, weight, age, desiredWeight, bloodType } = req.body;
    const { userId } = req.params;
    const dailyRate = 10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight);
    let notAllowedProductsObj = [];
    switch (bloodType) {
        case 1:
            notAllowedProductsObj = yield product_model_1.default.find({
                "groupBloodNotAllowed.1": true,
            }).lean();
            break;
        case 2:
            notAllowedProductsObj = yield product_model_1.default.find({
                "groupBloodNotAllowed.2": true,
            }).lean();
            break;
        case 3:
            notAllowedProductsObj = yield product_model_1.default.find({
                "groupBloodNotAllowed.3": true,
            }).lean();
            break;
        case 4:
            notAllowedProductsObj = yield product_model_1.default.find({
                "groupBloodNotAllowed.4": true,
            }).lean();
            break;
        default:
            break;
    }
    const notAllowedProducts = [
        ...new Set(notAllowedProductsObj.map((product) => product.title.ru)),
    ];
    if (userId) {
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "Invalid user" });
        }
        user.userData = {
            weight,
            height,
            age,
            bloodType,
            desiredWeight,
            dailyRate,
            notAllowedProducts,
        };
        yield user.save();
        let summariesToUpdate = yield summary_model_1.default.find({ userId });
        if (summariesToUpdate) {
            summariesToUpdate.forEach((summary) => {
                if (summary.dailyRate > dailyRate) {
                    const diff = summary.dailyRate - dailyRate;
                    summary.dailyRate = dailyRate;
                    summary.kcalLeft -= diff;
                    summary.percentsOfDailyRate =
                        (summary.kcalConsumed * 100) / dailyRate;
                }
                if (summary.dailyRate < dailyRate) {
                    const diff = dailyRate - summary.dailyRate;
                    summary.dailyRate = dailyRate;
                    summary.kcalLeft += diff;
                    summary.percentsOfDailyRate =
                        (summary.kcalConsumed * 100) / dailyRate;
                }
                summary.save();
            });
        }
        else {
            summariesToUpdate = [];
        }
        return res.status(201).send({
            dailyRate,
            summaries: summariesToUpdate,
            id: user._id,
            notAllowedProducts,
        });
    }
    return res.status(200).send({ dailyRate, notAllowedProducts });
});
exports.countDailyRate = countDailyRate;
