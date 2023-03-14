import tryCatchWrapper from "../helpers/function-helpers/try-catch-wrapper";
import {createReport} from "./report.controller";
import {Router} from "express";
const router = Router();

router.get("/",
    tryCatchWrapper(createReport)
);

export default router;