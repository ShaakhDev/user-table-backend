import pkg from 'sequelize'
import UsersValidation from "../validations/UsersValidation.js";
import {createNewHash} from "../modules/bcrypt.js";
import randomNumber from "../modules/randomNumber.js";
import addMinutes from "../modules/addHours.js";
import { signJwtToken } from "../modules/jwt.js";

const { Op } = pkg

export default class UsersController {
    static async UserCreateAccount(req, res, next) {
        try {
            // Validate and check request from user
            const data = await UsersValidation.UsersCreateValidation(
                req.body,
                res.error
            )

            // Check and throw error if number exists in db
            const numberIsExist = await req.db.users.findOne({
                where: {
                    user_phone: {
                        [Op.iLike]: `%${data.user_phone}%`
                    }
                }
            });

            if (numberIsExist) throw new res.error(400, 'Phone number already exists!')

            // create user if everything ok
            const user = await req.db.users.create({
                ...data
            })

            const ban = await req.db.user_bans.findOne({
                where: {
                    [Op.and]: [
                        {user_id: user.dataValues.user_id},
                        {ban_expire_date: {[Op.gt]: new Date()}}
                    ]
                }
            })

            if (ban)
                throw new res.error(403, `You have been banned until ${ban.ban_expire_date}`)

            // generate number for OTP sms
            const genNumber = await randomNumber(100_000, 999_999)

            // edit: You can add sms sender function.

            const attempt = await req.db.user_attempts.create({
                user_code: genNumber,
                user_id: user.user_id
            })

            // send response to user
            await res.status(201).json({
                ok: true,
                message: "User created successfully",
                data: {
                    id: attempt.attempt_id,
                    code: genNumber
                }
            });
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
    static async UserValidateCode(req, res, next) {
        try {
            const validationID = req.headers["code-validation-id"];

            if (!validationID)
                throw new res.error(404, "Validation ID is missed!");

            const attempt = await req.db.user_attempts.findOne({
                where: {
                    attempt_id: validationID
                },
                include: {
                    model: req.db.users
                }
            });

            if (!attempt)
                throw new res.error(400, "Your validation code is not found!");

            // if code attempt time is more than 5 minutes throw error
            if (new Date() > new Date(attempt.createdAt).addMinutes(5))
                throw new res.error(400, "Your validation code is timed out, please try again!")

            const { code, user_device } = await UsersValidation.UsersCodeValidation(
                req.body,
                res.error
            );

            // if input number is incorrect throw error and increment attempts count
            if (Number(code) !== Number(attempt.user_code)) {
                // allowed 5 attempts for sms code input
                const codeAttemptsVal = 4;
                // allowed 3 attempts for re-send code
                const phoneAttemptsVal = 3;
                // ban time is 2 hours
                const banTime = 7_200_000;

                await req.db.user_attempts.increment({
                    user_attempts: 1
                }, {
                    where: {
                        attempt_id: validationID
                    }
                })

                if (Number(attempt.user_attempts) > codeAttemptsVal - 1) {
                    // if attempts count is limited destroys attempts
                    await req.db.user_attempts.destroy({
                        where: {
                            attempt_id: validationID
                        }
                    })

                    await req.db.users.increment({
                        user_attempts: 1
                    }, {
                        where: {
                            user_id: attempt.user_id
                        }
                    })

                    // if user attempts is limited ban user
                    if (Number(attempt.user.user_attempts) >= phoneAttemptsVal - 1) {
                        await req.db.users.update({
                            user_attempts: 0
                        }, {
                            where: {
                                user_id: attempt.user_id
                            }
                        })

                        await req.db.user_bans.create({
                            user_id: attempt.user_id,
                            ban_expire_date: new Date(Date.now() + banTime)
                        })
                    }
                }
                throw new res.error(400, "you entered incorrect code!")
            }

            await req.db.user_sessions.destroy({
                where: {
                    user_id: attempt.dataValues.user_id
                }
            })

            let userAgent = req.headers['user-agent'];
            let ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

            if (!(userAgent && ipAddress))
                throw new res.error(400, "Invalid device!")

            const session = await req.db.user_sessions.create({
                user_id: attempt.user_id,
                session_inet: ipAddress,
                session_user_agent: userAgent,
                session_user_device: user_device
            });

            const token = await signJwtToken({
                session_id: session.session_id,
            });

            await req.db.user_attempts.destroy({
                where: {
                    user_id: attempt.user_id
                }
            })

            await req.db.user_attempts.update({
                user_attempts: 0
            }, {
                where: {
                    user_id: attempt.user_id
                }
            })

            const userData = await req.db.users.findOne({
                where: {
                    user_id: attempt.user_id
                }
            })

            res.status(201).json({
                ok: true,
                message: "You are logged in!",
                data: {
                    token,
                    user: userData
                }
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    static async ResendValidateCode(req, res, next) {
        try {
            const { user_phone } = await UsersValidation.UsersLoginValidation(
                req.body,
                res.error
            )

            const user = await req.db.users.findOne({
                where: {
                    user_phone
                }
            })

            if (!user)
                throw new res.error(404, "Phone number is not found!")

            const ban = await req.db.user_bans.findOne({
                where: {
                    [Op.and]: [
                        {user_id: user.user_id},
                        {ban_expire_date: {[Op.gt]: new Date()}}
                    ]
                }
            })

            if (ban) throw new res.error(403, `You have been banned until ${ban.ban_expire_date}`)

            // generate number for OTP sms
            const genNumber = await randomNumber(100_000, 999_999)

            // edit: You can add sms sender function.

            const attempt = await req.db.user_attempts.create({
                user_code: genNumber,
                user_id: user.user_id
            })

            // send response to user
            await res.status(201).json({
                ok: true,
                message: "Code sent on your number!",
                data: {
                    id: attempt.attempt_id,
                    code: genNumber
                }
            });
        } catch (e) {
            next(e)
        }
    }
    static async ChangeUserPhone(req, res, next) {
        try {
           const {
               old_user_phone,
               new_user_phone
           } =  await UsersValidation.ChangeUserPhoneValidation(
               req.body,
               res.error
           )

            const user = await req.db.users.findOne({
                where: {
                    user_phone: old_user_phone
                }
            })

            if (!user)
                throw new res.error(400, "User not exists!")

            const ban = await req.db.user_bans.findOne({
                where: {
                    [Op.and]: [
                        {user_id: user.user_id},
                        {ban_expire_date: {[Op.gt]: new Date()}}
                    ]
                }
            })

            if (ban)
                throw new res.error(403, `You have been banned until ${ban.ban_expire_date}`)

            const isNumberExist = await req.db.users.findOne({
                where: {
                    user_phone: new_user_phone
                }
            })

            if (isNumberExist)
                throw new res.error(400, "Number already exists!")

            await req.db.user_sessions.destroy({
                where: {
                    user_id: user.user_id
                }
            })

            const genNumber = await randomNumber(100_000, 999_999)

            // edit: You can add sms sender function.

            await req.db.user_attempts.destroy({
                where: {
                    user_id: user.user_id
                }
            })

            const attempt = await req.db.user_attempts.create({
                user_code: genNumber,
                user_id: user.user_id
            })

            await res.status(201).json({
                ok: true,
                message: "User created successfully",
                data: {
                    id: attempt.attempt_id,
                    code: genNumber
                }
            });
        } catch (e) {
            next(e)
        }
    }
    static async LoginUserAccount(req, res, next) {
        try {
            const { user_phone } = await UsersValidation.UsersLoginValidation(
                req.body,
                res.error
            )

            const user = await req.db.users.findOne({
                where: {
                    user_phone,
                }
            });

            if (!user)
                throw new res.error(400, "User not found!");

            // delete other sessions
            await req.db.user_sessions.destroy({
                where: {
                    user_id: user.user_id
                }
            })

            const ban = await req.db.user_bans.findOne({
                where: {
                    [Op.and]: [
                        {user_id: user.user_id},
                        {ban_expire_date: {[Op.gt]: new Date()}}
                    ]
                }
            })

            if (ban)
                throw new res.error(403, `You have been banned until ${ban.ban_expire_date}`)

            const genNumber = await randomNumber(100_000, 999_999)

            // edit: You can add sms sender function.

            const attempt = await req.db.user_attempts.create({
                user_code: genNumber,
                user_id: user.user_id
            })

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