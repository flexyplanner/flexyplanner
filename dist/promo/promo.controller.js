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
exports.deletePromo = exports.switchPromoStatus = exports.getPromo = exports.createPromo = void 0;
const promocodes_model_1 = __importDefault(require("../REST-entities/promocodes/promocodes.model"));
const createPromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, discount, type, from, to } = req.body;
    const voucher_codes = require('voucher-code-generator');
    let codes = [];
    try {
        codes = voucher_codes.generate({
            count: amount,
            length: 8,
            charset: voucher_codes.charset("alphanumeric")
        });
    }
    catch (e) {
        console.log("Sorry, not possible. " + e);
    }
    const date = new Date();
    console.log(date);
    const data_start = from;
    const data_stop = to;
    // console.log(d);
    const new_promos = codes.map((code) => {
        return {
            discount: discount,
            isUsing: null,
            promo: code,
            "type": type,
            period: type === "Common" ? {
                from: data_start,
                to: data_stop
            } : "",
        };
    });
    try {
        const responseDb = yield promocodes_model_1.default.insertMany(new_promos);
        return res.status(200).send(responseDb);
    }
    catch (e) {
        return res.status(404).send(e);
    }
});
exports.createPromo = createPromo;
const getPromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let promo = [];
    if ((_a = req.query) === null || _a === void 0 ? void 0 : _a.promo) {
        const query = { promo: req.query["promo"].toString() };
        promo = yield promocodes_model_1.default.find(query);
    }
    else {
        promo = {
            personal: yield promocodes_model_1.default.find({ type: "Personal" }),
            common: yield promocodes_model_1.default.find({ type: "Common" })
        };
    }
    return res.status(200).send(promo);
});
exports.getPromo = getPromo;
const switchPromoStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.promocode) {
        const { promocode } = req.body;
        const query = { promo: promocode };
        const promo = yield promocodes_model_1.default.findOne(query, { _id: 0, isUsing: 1 });
        yield promocodes_model_1.default.updateOne(query, { isUsing: !promo.isUsing });
        return res.status(200).send("switchPromoStatus");
    }
    return res.status(404).send("err");
});
exports.switchPromoStatus = switchPromoStatus;
const deletePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.promocode) {
        const { promocode } = req.body;
        const query = { promo: promocode };
        const dbreq = yield promocodes_model_1.default.deleteOne(query);
        return res.status(200).send(dbreq);
    }
    else {
        return res.status(404).send("err");
    }
});
exports.deletePromo = deletePromo;
