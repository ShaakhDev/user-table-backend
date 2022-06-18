import UsersValidation from "../validations/UsersValidation.js";
import { signJwtToken, verifyJwtToken } from "../modules/jwt.js";
import { uid } from "../modules/GenerateId.js";
import { createNewHash, compareHash } from "../modules/bcrypt.js";
import { AuthChecker } from "../helpers/AuthChecker.js";
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
                user_name: data.user_name
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

            const password = await createNewHash(data.user_password);

            // Create new user
            const newUser = await req.db.users.create({
                id: uid(5),
                user_name: data.user_name,
                user_email: data.user_email,
                user_password: password,
                register_date: Date.now(),
                last_login: null,
                status: "active"
            });
            newUser.user_password = null;

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

            //check user's status
            if (user.status === 'blocked') {
                throw new res.error(403, "User is blocked!");
            }
            // Check password
            const isPasswordCorrect = await compareHash(
                req.body.user_password,
                user.user_password
            );

            if (!isPasswordCorrect)
                throw new res.error(400, "Password is incorrect!");

            // Create token
            const token = signJwtToken(user.id);

            // Update last login
            user.last_login = Date.now();
            await user.save()

            // Send response to user
            user.user_password = null;
            res.json({
                ok: true,
                status: 200,
                message: "User logged in successfully!",
                data: {
                    token,
                    user
                }
            });
        } catch (e) {
            next(e)
        }
    }

    static async BlockUserAccount(req, res, next) {
        try {
            const { status, message } = await AuthChecker(req);

            if (status !== 200) throw new res.error(status, message);


            const user = await req.db.users.findOne({
                user_name: req.body.user_name
            });

            if (user.status === "blocked") {
                throw new res.error(403, "User is blocked!");
            }


            await req.db.users.updateMany({ 'id': { $in: req.body.users } }, { $set: { 'status': 'blocked' } });

            res.json({
                ok: true,
                message: "Blocked successfully!"
            });

        } catch (e) {
            next(e)
        }

    }

    static async UnblockUserAccount(req, res, next) {
        try {
            // Validate and check request from user
            const { status, message } = await AuthChecker(req);

            if (status !== 200) throw new res.error(status, message);

            const user = await req.db.users.findOne({
                user_name: req.body.user_name
            });
            console.log(req.body.user_name)

            if (user.status === "blocked") {
                throw new res.error(403, "User is blocked!");
            }

            await req.db.users.updateMany({ 'id': { $in: req.body.users } }, { $set: { 'status': 'active' } });

            res.json({
                ok: true,
                message: "Unblocked successfully!"
            });

        } catch (e) {
            next(e)
        }
    }

    static async DeleteUserAccount(req, res, next) {
        try {
            const { status, message } = await AuthChecker(req);

            if (status !== 200) throw new res.error(status, message);

            const user = await req.db.users.findOne({
                user_name: req.body.user_name
            });

            if (user.status === "blocked") {
                throw new res.error(403, "User is blocked!");
            }

            await req.db.users.deleteMany({ 'id': { $in: req.body.users } });

            res.json({
                ok: true,
                message: "Deleted successfully!"
            });
        } catch (e) {
            next(e)
        }
    }
    //send all users' data
    static async GetAllUsers(req, res, next) {
        try {
            const { status, message } = await AuthChecker(req);
            if (status !== 200) throw new res.error(status, message);

            const validId = verifyJwtToken(req.headers["authorization"].split(" ")[1])
            console.log(validId)
            const user = await req.db.users.findOne({
                id: validId
            });

            if (user.status === "blocked") {
                throw new res.error(403, "User is blocked!");
            }

            const users = await req.db.users.find({});
            const allUsers = users.map(user => {
                const {
                    user_email,
                    id,
                    user_name,
                    last_login,
                    register_date,
                    status
                } = user;

                return {
                    user_email,
                    id,
                    user_name,
                    last_login,
                    register_date,
                    status
                }
            })


            res.json({
                ok: true,
                message: "Users data sent successfully!",
                users: allUsers
            });
        } catch (e) {
            next(e)
        }
    }

}