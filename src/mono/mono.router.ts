import {Router} from "express";
import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import {monoInvoiceCreate,monoWebHook} from "../mono/mono.controller";

const router = Router();

router.post("/",
    tryCatchWrapper(monoInvoiceCreate)
);
router.post("/acquiring/webhook",
    tryCatchWrapper(monoWebHook)
);

export default router;