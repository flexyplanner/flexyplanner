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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffers = exports.createOrder = exports.createLeads = void 0;
const axios = require('axios');
// const postToken = "MDM2MDY1YmZiNmQ2ZTVkY2M0MmUzNDIzYTEwNjMwYmQ3ZWFjNmEzYQ"
const postToken = "MjA3NDhmMzYyY2M3YjlkNDlhZTZiZDAyYzcyMWY2YWUxOGIxNTY2OA";
const getToken = "MjA3NDhmMzYyY2M3YjlkNDlhZTZiZDAyYzcyMWY2YWUxOGIxNTY2OA";
const BASE_URL_LEADS = 'https://openapi.keycrm.app/v1/leads';
const BASE_URL_ORDER = 'https://openapi.keycrm.app/v1/order';
const BASE_URL_OFFERS = 'https://openapi.keycrm.app/v1/offers';
const createLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const config = { headers: { Authorization: `Bearer ${postToken}` } };
    try {
        yield axios.post(BASE_URL_LEADS, body, config);
        return res.status(200).send({ status: "ok" });
    }
    catch (err) {
        return res.status(400).send({ err: err });
    }
});
exports.createLeads = createLeads;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const config = { headers: { Authorization: `Bearer ${postToken}` } };
    try {
        const response = yield axios.post(BASE_URL_ORDER, body, config);
        // console.log("createOrder: ", response.data);
        return res.status(200).send(response.data);
    }
    catch (err) {
        return res.status(400).send({ err: err });
    }
});
exports.createOrder = createOrder;
const getOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = { headers: { Authorization: `Bearer ${getToken}` }, params: { "include": "product" } };
        const response = yield axios.get(BASE_URL_OFFERS, config);
        return res.status(200).send(response.data);
    }
    catch (err) {
        return res.status(400).send({ err: err });
    }
});
exports.getOffers = getOffers;
