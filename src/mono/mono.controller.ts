import {Request, Response, NextFunction} from "express";
import InvoiceModel from "../REST-entities/invoice/invoice.model";

const axios = require('axios');
const postToken = "MjA3NDhmMzYyY2M3YjlkNDlhZTZiZDAyYzcyMWY2YWUxOGIxNTY2OA"
export const monoInvoiceCreate = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    // console.log("req.params.id: ",id);
    // console.log("req.body: ",body);
    const config: any = {
        headers: {
            // 'X-Token': 'ugAI3yR-ILBoA2FEZ_C0fZ1l_sERRYPCaL7enjvjHHE8',
            'X-Token': 'mXvWdWkZHoTjW4TpK3qFyJw',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }
    try {
        const response = await axios.post("https://api.monobank.ua/api/merchant/invoice/create", body, config);
        const {pageUrl, invoiceId} = response.data;
        console.log("invoice/create mono.response: ",response.data);

        await InvoiceModel.create({
            "invoiceId": invoiceId,
            status: null,
            "id": id,
        })
        return res.status(200).send({pageUrl, invoiceId});
    } catch (err) {
        return res.status(400).send({err: err});
    }
}
export const monoWebHook = async (req: Request, res: Response) => {
    // console.log("webhook body: ",req.body);
    const {invoiceId, status, amount, reference} = req.body
    const invoice: any = await InvoiceModel.findOne({"invoiceId": `${invoiceId}`}).lean();
    console.log("invoice: ",!!invoice, );
    if (!!invoice ) {
        const config: any = {headers: {Authorization: `Bearer ${postToken}`}}
        const request = {
            "payment_method_id": 2,
            "payment_method": "Mono-екваєринг",
            "amount": amount/100,
            "status": status === "success" ? "paid" : "not_paid",
            "description": "Оплата за Flexy planner",
            "payment_date": reference.split(".")[0]
        }
        // console.log("request CRM: ",request);
        switch (status) {
            case "processing":
            case "hold":
            case "created":
            case "success":
            case "expired": {
                try {
                    await axios.post(`https://openapi.keycrm.app/v1/order/${invoice.id}/payment`, request, config);
                } catch (e:any) {
                    console.error(e.response.data)
                }
            }

            case "reversed": {
            }
        }
        if (status === "reversed" || status === "success" || status === "expired" || status ==="failure") {
            console.log("delete: id ", invoice.id);
            if (!!invoice.id) {
                // await InvoiceModel.findOneAndDelete({"_id": `${invoice._id}`}).lean();
            }
        }
        // console.log("invoice: ", invoice);
        return res.status(200).send({});
    }
}