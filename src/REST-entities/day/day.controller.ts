import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import UserModel from "../user/user.model";
import ProductModel from "../product/product.model";
import SummaryModel from "../summary/summary.model";
import DayModel from "./day.model";
import {
  IMom,
  IMomPopulated,
  IDay,
  IDayPopulated,
  IDaySummary,
  IMarkup,
} from "../../helpers/typescript-helpers/interfaces";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

      return res.status(201).send("addProduct");

};

export const deleteProduct = async (req: Request, res: Response) => {
  const { dayId, eatenProductId } = req.body;
  const day = await DayModel.findById(dayId);
  if (!(req.user as IMom).days.find((day) => day.toString() === dayId)) {
    return res.status(404).send({ message: "Day not found" });
  }
  const product = (day as IDay).eatenProducts.find(
    (product) => product.id === eatenProductId
  );
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  await DayModel.findByIdAndUpdate(dayId, {
    $pull: { eatenProducts: { id: eatenProductId } },
  });
  const daySummary = await SummaryModel.findById((day as IDay).daySummary);
  (daySummary as IDaySummary).kcalLeft += product.kcal;
  (daySummary as IDaySummary).kcalConsumed -= product.kcal;
  (daySummary as IDaySummary).percentsOfDailyRate =
    ((daySummary as IDaySummary).kcalConsumed * 100) /
    (req.user as IMom).userData.dailyRate;
  if (
    (daySummary as IDaySummary).kcalLeft > (req.user as IMom).userData.dailyRate
  ) {
    (daySummary as IDaySummary).kcalLeft = (
      req.user as IMom
    ).userData.dailyRate;
  }
  await (daySummary as IDaySummary).save();
  return res.status(201).send({
    newDaySummary: {
      date: (daySummary as IDaySummary).date,
      kcalLeft: (daySummary as IDaySummary).kcalLeft,
      kcalConsumed: (daySummary as IDaySummary).kcalConsumed,
      dailyRate: (daySummary as IDaySummary).dailyRate,
      percentsOfDailyRate: (daySummary as IDaySummary).percentsOfDailyRate,
      userId: (daySummary as IDaySummary).userId,
      id: (daySummary as IDaySummary)._id,
    },
  });
};

export const getDayInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date } = req.body;
  UserModel.findById((req.user as IMom)._id)
    .populate("days")
    .exec((err, data) => {
      if (err) {
        next(err);
      }
      const dayInfo = (data as IMomPopulated).days.find(
        (day) => day.date === date
      );
      if (!dayInfo) {
        return res.status(200).send({
          kcalLeft: (req.user as IMom).userData.dailyRate,
          kcalConsumed: 0,
          dailyRate: (req.user as IMom).userData.dailyRate,
          percentsOfDailyRate: 0,
        });
      }
      DayModel.findById(dayInfo._id)
        .populate("daySummary")
        .exec((err, data) => {
          if (err) {
            next(err);
          }
          return res.status(200).send({
            id: (data as IDayPopulated)._id,
            eatenProducts: (data as IDayPopulated).eatenProducts,
            date: (data as IDayPopulated).date,
            daySummary: {
              date: (data as IDayPopulated).daySummary.date,
              kcalLeft: (data as IDayPopulated).daySummary.kcalLeft,
              kcalConsumed: (data as IDayPopulated).daySummary.kcalConsumed,
              dailyRate: (data as IDayPopulated).daySummary.dailyRate,
              percentsOfDailyRate: (data as IDayPopulated).daySummary
                .percentsOfDailyRate,
              userId: (data as IDayPopulated).daySummary.userId,
              id: (data as IDayPopulated).daySummary._id,
            },
          });
        });
    });
};

export const checkDailyRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req.user as IMom).userData.dailyRate) {
    return res
      .status(403)
      .send({ message: "Please, count your daily rate first" });
  }
  next();
};
