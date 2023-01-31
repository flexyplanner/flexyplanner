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
exports.monoWebHook = exports.monoInvoiceCreate = void 0;
const invoice_model_1 = __importDefault(require("../REST-entities/invoice/invoice.model"));
const axios = require('axios');
const postToken = "MjA3NDhmMzYyY2M3YjlkNDlhZTZiZDAyYzcyMWY2YWUxOGIxNTY2OA";
const monoInvoiceCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const body = req.body;
    console.log("/mono/:id -- monoInvoiceCreate");
    console.log("req.params.id: ", id);
    console.log("req.body: ", body);
    const config = {
        headers: {
            // 'X-Token': 'ugAI3yR-ILBoA2FEZ_C0fZ1l_sERRYPCaL7enjvjHHE8',
            'X-Token': 'mXvWdWkZHoTjW4TpK3qFyJw',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };
    try {
        const response = yield axios.post("https://api.monobank.ua/api/merchant/invoice/create", body, config);
        const { pageUrl, invoiceId } = response.data;
        console.log("invoice/create mono.response: ", response.data);
        yield invoice_model_1.default.create({
            "invoiceId": invoiceId,
            status: null,
            "id": id,
        });
        return res.status(200).send({ pageUrl, invoiceId });
    }
    catch (err) {
        return res.status(400).send({ err: err });
    }
});
exports.monoInvoiceCreate = monoInvoiceCreate;
const monoWebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("webhook body: ",req.body);
    const { invoiceId, status, amount, reference } = req.body;
    const invoice = yield invoice_model_1.default.findOne({ "invoiceId": `${invoiceId}` }).lean();
    // console.log("invoice: ",!!invoice, );
    if (!!invoice) {
        const config = { headers: { Authorization: `Bearer ${postToken}` } };
        const request = {
            "payment_method_id": 2,
            "payment_method": "Mono-екваєринг",
            "amount": amount / 100,
            "status": status === "success" ? "paid" : "not_paid",
            "description": "Оплата за Flexy planner",
            "payment_date": reference.split(".")[0]
        };
        // console.log("request CRM: ",request);
        switch (status) {
            case "processing":
            case "hold":
            case "created":
            case "success":
            case "expired": {
                try {
                    yield axios.post(`https://openapi.keycrm.app/v1/order/${invoice.id}/payment`, request, config);
                }
                catch (e) {
                    console.error(e.response.data);
                }
            }
            case "reversed": {
            }
        }
        if (status === "reversed" || status === "success" || status === "expired" || status === "failure") {
            console.log("delete: id ", invoice.id);
            if (!!invoice.id) {
                // await InvoiceModel.findOneAndDelete({"_id": `${invoice._id}`}).lean();
            }
        }
        // console.log("invoice: ", invoice);
        return res.status(200).send({});
    }
});
exports.monoWebHook = monoWebHook;
