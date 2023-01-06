import { Request, Response } from "express";
import ProductModel from "../REST-entities/product/product.model";
import { IMom, IDaySummary } from "../helpers/typescript-helpers/interfaces";
import { IMarkup } from "../helpers/typescript-helpers/interfaces";
import UserModel from "../REST-entities/user/user.model";
import SummaryModel from "../REST-entities/summary/summary.model";

export const countDailyRate = async (req: Request, res: Response) => {

  return res.status(200).send( "countDailyRate" );
};
