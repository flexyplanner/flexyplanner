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
exports.markupModify = exports.switchMarkupStatus = exports.findProducts = void 0;
const product_model_1 = __importDefault(require("../REST-entities/product/product.model"));
const findProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("findProducts allProducts {is_Active: true}");
    const foundProducts = yield product_model_1.default.findOne({ is_Active: true }).select({ _id: 0 }).lean();
    if (!foundProducts) {
        return res
            .status(400)
            .send({ message: "No allowed products found for this query" });
    }
    return res.status(200).send(foundProducts);
});
exports.findProducts = findProducts;
const switchMarkupStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundProducts = yield product_model_1.default.updateMany({}, [{ $set: { is_Active: { $eq: [false, "$is_Active"] } } }]).lean();
    if (!foundProducts) {
        return res
            .status(400)
            .send({ message: "No allowed products found for this query" });
    }
    return res.status(200).send("switchMarkupStatus");
});
exports.switchMarkupStatus = switchMarkupStatus;
const markupModify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const foundProducts = yield product_model_1.default.findOneAndUpdate({ type: body.type }, { data: Object.assign({}, body.data) }, { new: true }).lean();
    return res
        .status(200)
        .send(foundProducts);
});
exports.markupModify = markupModify;
