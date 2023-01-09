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
exports.checkDailyRate = exports.getDayInfo = exports.deleteProduct = exports.addProduct = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const summary_model_1 = __importDefault(require("../summary/summary.model"));
const day_model_1 = __importDefault(require("./day.model"));
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send("addProduct");
});
exports.addProduct = addProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dayId, eatenProductId } = req.body;
    const day = yield day_model_1.default.findById(dayId);
    if (!req.user.days.find((day) => day.toString() === dayId)) {
        return res.status(404).send({ message: "Day not found" });
    }
    const product = day.eatenProducts.find((product) => product.id === eatenProductId);
    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }
    yield day_model_1.default.findByIdAndUpdate(dayId, {
        $pull: { eatenProducts: { id: eatenProductId } },
    });
    const daySummary = yield summary_model_1.default.findById(day.daySummary);
    daySummary.kcalLeft += product.kcal;
    daySummary.kcalConsumed -= product.kcal;
    daySummary.percentsOfDailyRate =
        (daySummary.kcalConsumed * 100) /
            req.user.userData.dailyRate;
    if (daySummary.kcalLeft > req.user.userData.dailyRate) {
        daySummary.kcalLeft = req.user.userData.dailyRate;
    }
    yield daySummary.save();
    return res.status(201).send({
        newDaySummary: {
            date: daySummary.date,
            kcalLeft: daySummary.kcalLeft,
            kcalConsumed: daySummary.kcalConsumed,
            dailyRate: daySummary.dailyRate,
            percentsOfDailyRate: daySummary.percentsOfDailyRate,
            userId: daySummary.userId,
            id: daySummary._id,
        },
    });
});
exports.deleteProduct = deleteProduct;
const getDayInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.body;
    user_model_1.default.findById(req.user._id)
        .populate("days")
        .exec((err, data) => {
        if (err) {
            next(err);
        }
        const dayInfo = data.days.find((day) => day.date === date);
        if (!dayInfo) {
            return res.status(200).send({
                kcalLeft: req.user.userData.dailyRate,
                kcalConsumed: 0,
                dailyRate: req.user.userData.dailyRate,
                percentsOfDailyRate: 0,
            });
        }
        day_model_1.default.findById(dayInfo._id)
            .populate("daySummary")
            .exec((err, data) => {
            if (err) {
                next(err);
            }
            return res.status(200).send({
                id: data._id,
                eatenProducts: data.eatenProducts,
                date: data.date,
                daySummary: {
                    date: data.daySummary.date,
                    kcalLeft: data.daySummary.kcalLeft,
                    kcalConsumed: data.daySummary.kcalConsumed,
                    dailyRate: data.daySummary.dailyRate,
                    percentsOfDailyRate: data.daySummary
                        .percentsOfDailyRate,
                    userId: data.daySummary.userId,
                    id: data.daySummary._id,
                },
            });
        });
    });
});
exports.getDayInfo = getDayInfo;
const checkDailyRate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user.userData.dailyRate) {
        return res
            .status(403)
            .send({ message: "Please, count your daily rate first" });
    }
    next();
});
exports.checkDailyRate = checkDailyRate;
