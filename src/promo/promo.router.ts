import {Router} from "express";
// import { authorize } from "../../auth/auth.controller";
import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
// import { getUserInfo } from "./user.controller";
import {
    createPromo,
    getPromo,
    switchPromoStatus,
    deletePromo,
} from "./promo.controller";
import {authorize} from "../auth/auth.controller";
const router = Router();

router.post("/",
    // tryCatchWrapper(authorize),
    tryCatchWrapper(createPromo)
);
router.get("/",
    tryCatchWrapper(getPromo)
);

router.patch("/",
    tryCatchWrapper(switchPromoStatus)
);
router.delete("/",
    tryCatchWrapper(deletePromo)
);

export default router;