import {Router} from "express";
import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import {authorize} from "../auth/auth.controller";
import {createLeads, createOrder, getOffers} from "../crm/crm.controller";

const router = Router();

router.post("/leads",
    // tryCatchWrapper(authorize),
    tryCatchWrapper(createLeads)
);
router.post("/order",
    tryCatchWrapper(createOrder)
);

router.get("/offers",
    tryCatchWrapper(getOffers)
);

export default router;