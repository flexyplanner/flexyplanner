import {Request, Response} from "express";
import PromocodesModel from "../REST-entities/promocodes/promocodes.model";

export const createPromo = async (req: Request, res: Response) => {
    const {amount, discount, type,from,to} = req.body;
    const voucher_codes = require('voucher-code-generator');
    let codes = []
    try {
        codes = voucher_codes.generate({
            count: amount,
            length: 8,
            charset: voucher_codes.charset("alphanumeric")
        });
    } catch (e) {
        console.log("Sorry, not possible. " + e);
    }
    const date = new Date();
    console.log(date);
    const data_start = from;
    const data_stop = to;
    // console.log(d);
    const new_promos = codes.map((code: string) => {
        return {
            discount: discount,
            isUsing: null,
            promo: code,
            "type": type,
            period: type === "Common"?{
                from: data_start,
                to: data_stop
            }: "",
        }
    });
    try {
        const responseDb = await PromocodesModel.insertMany(new_promos);
        return res.status(200).send(responseDb);
    } catch (e) {
        return res.status(404).send(e);
    }
}
export const getPromo = async (req: Request, res: Response) => {
    console.log("getPromo")
    let promo: any = [];
    if (req.query?.promo) {
        const query = {promo: req.query["promo"].toString()};
        promo = await PromocodesModel.find(query);
    } else {
        promo = {
            personal: await PromocodesModel.find({type: "Personal"}),
            common: await PromocodesModel.find({type: "Common"})
        }
    }
    return res.status(200).send(promo);
}
export const switchPromoStatus = async (req: Request, res: Response) => {
    if (req.body.promocode) {
        const {promocode} = req.body
        const query = {promo: promocode};
        const promo : any = await PromocodesModel.findOne(query,{_id:0,isUsing:1})
        await PromocodesModel.updateOne(query, {isUsing: !promo.isUsing});
        return res.status(200).send("switchPromoStatus");
    }
    return res.status(404).send("err");
}

export const deletePromo = async (req: Request, res: Response) => {
    console.log(req.body)
    let query;
    if (req.body?.promocode) {
        const {promocode} = req.body
         query = {promo: promocode};
    }
    if (req.body?._id) {
        const {_id} = req.body
        query = {_id: _id};
    }
    if (!!query){
        const dbreq = await PromocodesModel.deleteOne(query);
        console.log(dbreq)
        return res.status(200).send(dbreq);
    } else {
        return res.status(404).send("err");
    }
}