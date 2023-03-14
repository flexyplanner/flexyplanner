import PromocodesModel from "../REST-entities/promocodes/promocodes.model";
import {Request, Response} from "express";
import {number} from "joi";

export const createReport  = async (req: Request, res: Response) => {
    const converter = require('json-2-csv')
    const promo = await PromocodesModel.find({});
    let tmp = (JSON.stringify(promo));
     tmp = JSON.parse(tmp)
const ttt = [{"period":{"from":"2023-01-06T13:03:40.939Z","to":"2023-05-06T13:03:40.939Z"},"_id":"63b837ba8d0ca09520f26832","discount":10,"isUsing":false,"promo":"13m5h0kF","type":"Common","__v":0},
    {"period":{"from":"2023-01-06T13:03:40.939Z","to":"2023-05-06T13:03:40.939Z"},"_id":"63b837ba8d0ca09520f26833","discount":10,"isUsing":null,"promo":"ylPt2oAK","type":"Common","__v":0}]

    converter.json2csv(tmp, (err: any, csv:any) => {
        if (err) {
            throw err
        }
        console.log("csv: ",csv)
        return res.status(200).send(csv);
    })

}