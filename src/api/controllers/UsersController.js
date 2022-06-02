import UsersValidation from "../validations/UsersValidation.js";
import { signJwtToken } from "../modules/jwt.js";
import { uid } from "../modules/GenerateId.js";

export default class UsersController {
    static async UserCreateAccount(req, res, next) {
        try {
            // Validate and check request from user
            const data = await UsersValidation.UsersCreateValidation(
                req.body,
                res.error
            )

            // Check and throw error if user's name exists in mongodb
            const nameIsExist = await req.db.users.findOne({
                where: {
                    user_name: data.user_name

                }
            });

            if (nameIsExist) {
                throw new res.error(400, "Name is already exists!");
            }

            // Check and throw error if user's email exists in mongodb
            const emailIsExist = await req.db.users.findOne({

                user_email: data.user_email

            });

            if (emailIsExist) {
                throw new res.error(400, "Email is already exists!");
            }

            // Create new user
            const newUser = await req.db.users.create({
                id: uid(),
                user_name: data.user_name,
                user_email: data.user_email,
                register_date: Date.now(),
                last_login: null,
                status: "active"

            });

            // Send response to user
            res.json({
                ok: true,
                message: "User created successfully!",
                data: newUser
            });

        }
        catch (e) {
            next(e)
        }
    }




    static async LoginUserAccount(req, res, next) {
        try {
            const { user_name } = await UsersValidation.UsersLoginValidation(
                req.body,
                res.error
            )

            const user = await req.db.users.findOne({
                user_name: user_name
            });

            if (!user)
                throw new res.error(400, "User not found!");



            // delete other sessions








            // edit: You can add sms sender function.



            res.status(201).json({
                ok: true,
                message: "We've sent verification code on your phone!",
                data: {
                    id: attempt.attempt_id,
                    code: genNumber
                }
            })
        } catch (e) {
            next(e)
        }
    }
}