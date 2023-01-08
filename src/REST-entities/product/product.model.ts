import mongoose, { Schema } from "mongoose";
import { IMarkup } from "../../helpers/typescript-helpers/interfaces";

const productSchema = new Schema({
  type: String,
  markup: String,
  data: { price: Number, preOrderPrice: Number },
  is_Active: Boolean
});

export default mongoose.model<IMarkup>("Markup", productSchema);
