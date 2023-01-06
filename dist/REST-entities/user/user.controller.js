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
exports.getUserInfo = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const day_model_1 = __importDefault(require("../day/day.model"));
const summary_model_1 = __importDefault(require("../summary/summary.model"));
const getUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    yield user_model_1.default.findOne({ _id: user._id })
        .populate({
        path: "days",
        model: day_model_1.default,
        populate: [{ path: "daySummary", model: summary_model_1.default }],
    })
        .exec((err, data) => {
        if (err) {
            next(err);
        }
        return res.status(200).send({
            username: data.username,
            email: data.email,
            id: data._id,
            userData: data.userData,
            days: data.days,
        });
    });
});
exports.getUserInfo = getUserInfo;
