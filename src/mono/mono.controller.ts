import {Request, Response, NextFunction} from "express";
import fetch from "node-fetch";

const axios = require('axios');
export const monoInvoiceCreate = async (req: Request, res: Response) => {
    const body = req.body;
    console.log("body: ",body);
    const config: any = {headers: {  'X-Token': 'ugAI3yR-ILBoA2FEZ_C0fZ1l_sERRYPCaL7enjvjHHE8',
            'Content-Type': 'application/json; charset=UTF-8'}}
    try {
        const response = await axios.post("https://api.monobank.ua/api/merchant/invoice/create", body, config);
        // JSON.parse(response).pageUrl;
        console.log("response: ",response);
        const {pageUrl} = response.data;
        console.log("pageUrl: ",pageUrl);
        return res.status(200).send({pageUrl});
    } catch (err){
        return res.status(400).send({ err: err });
    }
}
// const options = {
//     method: 'POST',
//     body: JSON.stringify(req.body),
//     headers: {
//         'X-Token': 'ugAI3yR-ILBoA2FEZ_C0fZ1l_sERRYPCaL7enjvjHHE8',
//         'Content-Type': 'application/json; charset=UTF-8',
//     },
// };
// fetch('https://api.monobank.ua/api/merchant/invoice/create', options)
//     .then(response => response.json())
//     .then(post => {
//         return  post.pageUrl;
//         // window.location.href = ${page};
//     })
//     .catch(error => console.log(error));