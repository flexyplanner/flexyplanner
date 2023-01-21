import {Request, Response, NextFunction} from "express";
import InvoiceModel from "../REST-entities/invoice/invoice.model";

const axios = require('axios');
export const monoInvoiceCreate = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log("Id: ", id);
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
        const date = Date.now();
        await InvoiceModel.create({
            "invoiceID":invoiceId,
            status: "process",
            "id":id,
            "data": date
        })
        return
    } catch (err) {
        return res.status(400).send({err: err});
    }
}
export const monoWebHook = async (req: Request, res: Response) => {
    console.log("webhook: ");
    console.log("req.body:",req.body)

    return res.status(200).send({});
}