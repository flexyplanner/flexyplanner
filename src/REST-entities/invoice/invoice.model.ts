import mongoose, { Schema } from "mongoose";
import {
    IInvoice
} from "../../helpers/typescript-helpers/interfaces";

const invoiceSchema = new Schema(
    {
        invoiceID: String,
        status: String,
        id: String,
    }
);

export default mongoose.model<IInvoice>("Invoices", invoiceSchema);