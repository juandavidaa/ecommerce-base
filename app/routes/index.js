import { Router } from "express";
import observableRouter from "./observable.js";
import promiseRouter from "./promise.js";

const router = Router();

// Define route prefixes
router.use("/observable", observableRouter);
router.use("/promise", promiseRouter);

export default router;