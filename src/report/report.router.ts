import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import {createReport,promoTable,updatePromo} from "./report.controller";
import {
    deletePromo,
} from "../promo/promo.controller";
import {Router} from "express";
const router = Router();

router.get("/",
    tryCatchWrapper(createReport)
);
router.post("/",
    tryCatchWrapper(promoTable)
);
router.patch("/",
    tryCatchWrapper(updatePromo)
);
router.delete("/",
    tryCatchWrapper(deletePromo)
);
export default router;