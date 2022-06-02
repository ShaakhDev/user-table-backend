import Joi from "joi";

export default class UsersValidation {
    static async UsersCreateValidation(data, CustomError) {
        return Joi.object({
            user_name: Joi.string()
                .min(2)
                .max(64)
                .required()
                .error(new CustomError(400, "Name is invalid")),
            user_email: Joi.string()
                .pattern(new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i))
                .required()
                .error(new CustomError(400, "Email is invalid!"))
        }).validateAsync(data);
    }

    static async UsersLoginValidation(data, CustomError) {
        return Joi.object({
            user_name: Joi.string()
                .min(2)
                .max(64)
                .required()
                .error(new CustomError(400, "Name is invalid")),
        }).validateAsync(data)
    }

}