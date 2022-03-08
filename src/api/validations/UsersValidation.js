import Joi from "joi";

export default class UsersValidation {
    static async UsersCreateValidation(data, CustomError) {
        return Joi.object({
            user_name: Joi.string()
                .min(2)
                .max(64)
                .required()
                .error(new CustomError(400, "Name is invalid")),
            user_phone: Joi.string()
                .pattern(new RegExp(/^998[389][012345789][0-9]{7}$/))
                .required()
                .error(new CustomError(400, "Phone number is invalid!"))
        }).validateAsync(data);
    }
    static async UsersCodeValidation(data, CustomError) {
        return Joi.object({
            code: Joi.number()
                .required()
                .min(100000)
                .max(999999)
                .error(new CustomError(400, "Invalid code!")),
            user_device: Joi.string()
                .required()
                .error(new CustomError(400, "User device is required!"))
        }).validateAsync(data);
    }
    static async UsersLoginValidation(data, CustomError) {
        return Joi.object({
            user_phone: Joi.string()
                .pattern(new RegExp(/^998[389][012345789][0-9]{7}$/))
                .required()
                .error(new CustomError(400, "Phone number is invalid!"))
        }).validateAsync(data)
    }
    static async ChangeUserPhoneValidation(data, CustomError) {
        return Joi.object({
            new_user_phone: Joi.string()
                .pattern(new RegExp(/^998[389][012345789][0-9]{7}$/))
                .required()
                .error(new CustomError(400, "Phone number is invalid!")),
            old_user_phone: Joi.string()
                .pattern(new RegExp(/^998[389][012345789][0-9]{7}$/))
                .required()
                .error(new CustomError(400, "Phone number is invalid!"))
        }).validateAsync(data)
    }
}