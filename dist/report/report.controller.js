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
exports.updatePromo = exports.promoTable = exports.createReport = void 0;
const promocodes_model_1 = __importDefault(require("../REST-entities/promocodes/promocodes.model"));
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const converter = require('json-2-csv');
    const promo = yield promocodes_model_1.default.find({});
    let tmp = (JSON.stringify(promo));
    tmp = JSON.parse(tmp);
    // const ttt = [{"period":{"from":"2023-01-06T13:03:40.939Z","to":"2023-05-06T13:03:40.939Z"},"_id":"63b837ba8d0ca09520f26832","discount":10,"isUsing":false,"promo":"13m5h0kF","type":"Common","__v":0},
    //     {"period":{"from":"2023-01-06T13:03:40.939Z","to":"2023-05-06T13:03:40.939Z"},"_id":"63b837ba8d0ca09520f26833","discount":10,"isUsing":null,"promo":"ylPt2oAK","type":"Common","__v":0}]
    converter.json2csv(tmp, (err, csv) => {
        if (err) {
            throw err;
        }
        console.log("csv: ", csv);
        return res.status(200).send(csv);
    });
});
exports.createReport = createReport;
const promoTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body)
    const promo = yield promocodes_model_1.default.find({}).skip((req.body.page - 1) * req.body.count).limit(req.body.count);
    return res.status(200).send(promo);
});
exports.promoTable = promoTable;
const updatePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body: ", req.body);
    const { _id } = req.body;
    const query = { _id: _id };
    const updaterPromo = yield promocodes_model_1.default.findOneAndUpdate(query, req.body, { new: true });
    console.log("updaterPromo: ", updaterPromo);
    return res.status(200).send(updaterPromo);
});
exports.updatePromo = updatePromo;
