import { Router } from "express";
import Joi from "joi";
import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import validate from "../helpers/function-helpers/validate";
import { authorize } from "../auth/auth.controller";
import { checkDailyRate } from "../REST-entities/day/day.controller";
import { findProducts,switchMarkupStatus,switchMarkupModify } from "./product-search.controller";
import {switchPromoStatus} from "../promo/promo.controller";

const searchQuerySchema = Joi.object({
  search: Joi.string().min(1).max(30).required(),
});

const router = Router();
router.get(
  "/",
  // tryCatchWrapper(authorize),
  // tryCatchWrapper(checkDailyRate),
  // validate(searchQuerySchema, "query"),
  tryCatchWrapper(findProducts)
);

router.patch("/",
    tryCatchWrapper(switchMarkupStatus)
)
router.post("/",
    tryCatchWrapper(switchMarkupModify)
)

export default router;
