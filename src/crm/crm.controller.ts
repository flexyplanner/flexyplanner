import {Request, Response, NextFunction} from "express";

const axios = require('axios');
const postToken = "MDM2MDY1YmZiNmQ2ZTVkY2M0MmUzNDIzYTEwNjMwYmQ3ZWFjNmEzYQ"
const getToken = "MjA3NDhmMzYyY2M3YjlkNDlhZTZiZDAyYzcyMWY2YWUxOGIxNTY2OA"
const BASE_URL_LEADS = 'https://openapi.keycrm.app/v1/leads';
const BASE_URL_ORDER = 'https://openapi.keycrm.app/v1/order';
const BASE_URL_OFFERS = 'https://openapi.keycrm.app/v1/offers';

export const createLeads = async (req: Request, res: Response) => {
    const body = req.body;
    const config: any = {headers: {Authorization: `Bearer ${postToken}`}}
     try {
          const response = await axios.post(BASE_URL_LEADS, body, config);
          console.log(response);
          // return res.status(200);
     } catch (err){
          return res.status(400).send({ err: err });
     }
}
export const createOrder = async (req: Request, res: Response) => {
     const body = req.body;
     const config: any = {headers: {Authorization: `Bearer ${postToken}`}}
     try {
          const response = await axios.post(BASE_URL_ORDER, body, config);
          console.log(response);
          // return res.status(200);
     } catch (err){
          return res.status(400).send({ err: err });
     }
}
export const getOffers = async (req: Request, res: Response) => {
     try {
          const body = {params: {"include":"product"}};
          const config: any = {headers: {Authorization: `Bearer ${getToken}`}}
          const response = await axios.post(BASE_URL_OFFERS, body, config);
          console.log(response);
          return res.status(200).send(response);
     } catch (err) {
          return res.status(400).send({ err: err });
     }
}

