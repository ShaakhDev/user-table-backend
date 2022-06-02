import { Router } from "express";

const HomeRouter = Router();

HomeRouter.get("/", async function (req, res, next) {
    try {
        res.json({
            ok: true,
            message: "Home Route"
        })
    } catch (e) {
        next(e);
    }
});

export default {
    path: "/",
    router: HomeRouter,
};