import mongoose, { Schema } from "mongoose";
import { IMarkup } from "../../helpers/typescript-helpers/interfaces";

const productSchema = new Schema({
  type: String,
  markup: String,
  data: { price: Number },
  is_Active: Boolean
});

export default mongoose.model<IMarkup>("Markup", productSchema);
