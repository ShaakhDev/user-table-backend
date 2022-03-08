import { Router } from "express";
import UsersController from "../controllers/UsersController.js";

const UsersRouter = Router();

UsersRouter.post("/signup", UsersController.UserCreateAccount);
UsersRouter.post("/validate-code", UsersController.UserValidateCode);
UsersRouter.post("/login", UsersController.LoginUserAccount);
UsersRouter.post("/resend-code", UsersController.ResendValidateCode);
UsersRouter.patch("/change-number", UsersController.ChangeUserPhone);

export default {
    path: "/users",
    router: UsersRouter,
};