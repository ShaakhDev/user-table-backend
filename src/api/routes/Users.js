import { Router } from "express";
import UsersController from "../controllers/UsersController.js";

const UsersRouter = Router();

UsersRouter.post("/signup", UsersController.UserCreateAccount);
UsersRouter.post("/login", UsersController.LoginUserAccount);

export default {
    path: "/users",
    router: UsersRouter,
};