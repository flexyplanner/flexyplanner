import {Request, Response, NextFunction} from "express";
import InvoiceModel from "../REST-entities/invoice/invoice.model";

const axios = require('axios');
const postToken = "MDM2MDY1YmZiNmQ2ZTVkY2M0MmUzNDIzYTEwNjMwYmQ3ZWFjNmEzYQ"
export const monoInvoiceCreate = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const config: any = {
        headers: {
            'X-Token': 'ugAI3yR-ILBoA2FEZ_C0fZ1l_sERRYPCaL7enjvjHHE8',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }
    try {
        const response = await axios.post("https://api.monobank.ua/api/merchant/invoice/create", body, config);
        const {pageUrl, invoiceId} = response.data;
        res.status(200).send({pageUrl, invoiceId});
        await InvoiceModel.create({
            "invoiceId": invoiceId,
            status: null,
            "id": id,
        })
        return
    } catch (err) {
        return res.status(400).send({err: err});
    }
}
export const monoWebHook = async (req: Request, res: Response) => {
    console.log("webhook: ");
    console.log("req.body:", req.body)
    const config: any = {headers: {Authorization: `Bearer ${postToken}`}}
    const {invoiceId, status, amount, createDate} = req.body
    const invoice: any = await InvoiceModel.findOne({"invoiceId": `${invoiceId}`}).lean();

    const request = {
        "payment_method_id": 7,
        // "payment_method": "Mono-екваєринг",
        "amount": amount,
        "status": status === "success" ? "paid" : "no paid",
        "description": "Оплата за Flexy planner",
        "payment_date": createDate
    }
    console.log("invoice: ",invoice)
    console.log("request: ",request)
    switch (status) {
        case "processing":
        case "hold":
        case "created":
        case "success":
        case "expired": {
            try {
                await axios.post(`https://openapi.keycrm.app/v1/order/${invoice.id}/payment}`, request, config);
            } catch (e) {
                console.error(e)
            }
        }

        case "reversed": {
        }
    }
    if (request.status === "paid") {
        // await InvoiceModel.findOneAndDelete({"_id": `${invoice._id}`}).lean();
    }
    // console.log("invoice: ", invoice);
    return res.status(200).send({});
}