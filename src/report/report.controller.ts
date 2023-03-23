import PromocodesModel from "../REST-entities/promocodes/promocodes.model";
import {query, Request, Response} from "express";
import {number} from "joi";

export const createReport  = async (req: Request, res: Response) => {
    const converter = require('json-2-csv')
    const promo = await PromocodesModel.find({});
    let tmp = (JSON.stringify(promo));
     tmp = JSON.parse(tmp)
// const ttt = [{"period":{"from":"2023-01-06T13:03:40.939Z","to":"2023-05-06T13:03:40.939Z"},"_id":"63b837ba8d0ca09520f26832","discount":10,"isUsing":false,"promo":"13m5h0kF","type":"Common","__v":0},
//     {"period":{"from":"2023-01-06T13:03:40.939Z","to":"2023-05-06T13:03:40.939Z"},"_id":"63b837ba8d0ca09520f26833","discount":10,"isUsing":null,"promo":"ylPt2oAK","type":"Common","__v":0}]

    converter.json2csv(tmp, (err: any, csv:any) => {
        if (err) {
            throw err
        }
        console.log("csv: ",csv)
        return res.status(200).send(csv);
    })
}

export const promoTable  = async (req: Request, res: Response) => {


    let count;
    const promo = await PromocodesModel.find(req?.body?.filter).skip((req.body.page-1)*req.body.count).limit(req.body.count);
        if (req?.body?.filter) {
            count = Object.keys(promo).length
        }else{
             count = await PromocodesModel.countDocuments();
        }
    return res.status(200).send({promo,count})
}

export const updatePromo  = async (req: Request, res: Response) => {
console.log("req.body: ",req.body)
        const {_id} = req.body;
        const query = {_id: _id};
        const updaterPromo = await PromocodesModel.findOneAndUpdate(query,req.body,{new:true}) ;
        console.log("updaterPromo: ",updaterPromo)
        return res.status(200).send(updaterPromo);

}
