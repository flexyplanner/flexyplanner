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
exports.findProducts = void 0;
const product_model_1 = __importDefault(require("../REST-entities/product/product.model"));
const findProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.body);
    const search = req.query.search;
    const lang = !!((_a = req.query) === null || _a === void 0 ? void 0 : _a.lang) ? req.query.lang : "ua";
    const title = "title." + lang;
    const foundProducts = yield product_model_1.default.find({
        [title]: { $regex: search, $options: "i" },
    }).lean();
    const filteredProducts = foundProducts.filter(
    // @ts-ignore
    (product) => product.groupBloodNotAllowed[req.user.userData.bloodType] ===
        false);
    if (!filteredProducts.length) {
        return res
            .status(400)
            .send({ message: "No allowed products found for this query" });
    }
    return res.status(200).send(filteredProducts);
});
exports.findProducts = findProducts;
