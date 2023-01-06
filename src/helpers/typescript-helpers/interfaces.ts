import { Document } from "mongoose";
import { MongoDBObjectId } from "./types";

export interface IMom extends Document {
  username: string;
  email: string;
  passwordHash: string;
  userData: {
    weight: number;
    height: number;
    age: number;
    bloodType: number;
    desiredWeight: number;
    dailyRate: number;
    notAllowedProducts: string[];
  };
  days: MongoDBObjectId[];
}

export interface IMomPopulated extends Document {
  username: string;
  email: string;
  passwordHash: string;
  userData: {
    weight: number;
    height: number;
    age: number;
    bloodType: number;
    desiredWeight: number;
    dailyRate: number;
    notAllowedProducts: string[];
  };
  days: IDay[];
}

export interface IDay extends Document {
  date: string;
  eatenProducts: IEatenProduct[];
  daySummary: MongoDBObjectId;
}

export interface IDayPopulated extends Document {
  date: string;
  eatenProducts: IEatenProduct[];
  daySummary: IDaySummary;
}

export interface IDaySummary extends Document {
  date: string;
  kcalLeft: number;
  kcalConsumed: number;
  dailyRate: number;
  percentsOfDailyRate: number;
  userId: MongoDBObjectId;
}

export interface IEatenProduct {
  title: string;
  weight: number;
  kcal: number;
  id: string;
}

export interface ISession extends Document {
  uid: string;
}

export interface IJWTPayload {
  uid: string;
  sid: string;
}

export interface IMarkup extends Document {
  type: string,
  markup: string,
  data: { price: number },
  is_Active: boolean
}

export interface IPromo extends Document {
  discount: number,
  type: string,
  promo: string,
  period: { from: string, to: string },
  isUsing: boolean | null
}