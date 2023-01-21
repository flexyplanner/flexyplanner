import mongoose, { Schema } from "mongoose";
import {
    IInvoice
} from "../../helpers/typescript-helpers/interfaces";

const invoiceSchema = new Schema(
    {
        invoiceID: String,
        status: String,
        id: String,
        data: String
    }
);

export default mongoose.model<IInvoice>("Invoice", invoiceSchema);