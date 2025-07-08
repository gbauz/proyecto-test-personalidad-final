import { Router } from "express";
import testRoutes from "./testRoutes.js";
import authRouter from "./authRoutes.js";

const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRouter)


export default router;

