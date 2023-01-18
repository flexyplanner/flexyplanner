import {Router} from "express";
import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import {createLeads, createOrder, getOffers} from "../crm/crm.controller";

const router = Router();

router.post("/leads",
    tryCatchWrapper(createLeads)
);
router.post("/order",
    tryCatchWrapper(createOrder)
);

router.get("/offers",
    tryCatchWrapper(getOffers)
);

export default router;