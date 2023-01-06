import { Request, Response } from "express";
import MarkupModel from "../REST-entities/product/product.model";

export const findProducts = async (req: Request, res: Response) => {

  const foundProducts = await MarkupModel.findOne({is_Active: true}).select({_id: 0,type: 1,data: 1}).lean();
  if (!foundProducts) {
    return res
      .status(400)
      .send({ message: "No allowed products found for this query" });
  }

  return res.status(200).send(foundProducts);
};
