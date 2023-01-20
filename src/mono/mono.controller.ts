import {Request, Response, NextFunction} from "express";

const axios = require('axios');
export const monoInvoiceCreate = async (req: Request, res: Response) => {
    const body = req.body;
    const config: any = {headers: {  'X-Token': 'ugAI3yR-ILBoA2FEZ_C0fZ1l_sERRYPCaL7enjvjHHE8',
            'Content-Type': 'application/json; charset=UTF-8'}}
    try {
        const response = await axios.post("https://api.monobank.ua/api/merchant/invoice/create", body, config);
        const {pageUrl,invoiceID} = response.data;
        return res.status(200).send({pageUrl,invoiceID});
    } catch (err){
        return res.status(400).send({ err: err });
    }
}