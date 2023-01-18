import {Router} from "express";
import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import {monoInvoiceCreate} from "../mono/mono.controller";

const router = Router();

router.post("/",
    tryCatchWrapper(monoInvoiceCreate)
);

export default router;