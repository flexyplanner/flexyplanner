import { Request, Response } from "express";
import MarkupModel from "../REST-entities/product/product.model";

export const findProducts = async (req: Request, res: Response) => {

  const foundProducts = await MarkupModel.findOne({is_Active: true}).select({_id: 0}).lean();
  if (!foundProducts) {
    return res
      .status(400)
      .send({ message: "No allowed products found for this query" });
  }

  return res.status(200).send(foundProducts);
};

export const switchMarkupStatus = async (req: Request, res: Response) => {
  const foundProducts = await MarkupModel.updateMany({}, [{$set:{is_Active:{$eq:[false,"$is_Active"]}}}]);
  if (!foundProducts) {
    return res
        .status(400)
        .send({ message: "No allowed products found for this query" });
  }

  return res.status(200).send(foundProducts);
};
export const switchMarkupModify = async (req: Request, res: Response) => {
  const {body} = req;
  const foundProducts = await MarkupModel.findOne({type: body.type}).lean();
  const new_Products ={
    ...foundProducts,
    ...body.change
  }
  const deleteProduct = await MarkupModel.findOneAndDelete({_id: foundProducts?._id})
  const createProduct = await MarkupModel.create(new_Products);
  return res
      .status(200)
      .send(createProduct);
}