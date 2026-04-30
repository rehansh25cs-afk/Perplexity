import { Router } from "express";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { getMeController, loginController, logOutController, registerController, verifyEmailController } from "../controllers/auth.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerValidator, registerController)

authRouter.get("/verify-email", verifyEmailController)

authRouter.post("/login", loginValidator, loginController)

authRouter.get("/get-me",identifyUser, getMeController)

authRouter.post("/logout",identifyUser, logOutController)

export default authRouter