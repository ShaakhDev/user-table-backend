import { Router } from "express";
import UsersController from "../controllers/UsersController.js";

const UsersRouter = Router();

UsersRouter.post("/signup", UsersController.UserCreateAccount);
UsersRouter.post("/login", UsersController.LoginUserAccount);
UsersRouter.post("/block", UsersController.BlockUserAccount);
UsersRouter.post("/unblock", UsersController.UnblockUserAccount);
UsersRouter.delete("/delete", UsersController.DeleteUserAccount);
UsersRouter.get("/all", UsersController.GetAllUsers);

//delete route
//blockUser route
//unblockUser route


export default {
    path: "/users",
    router: UsersRouter,
};