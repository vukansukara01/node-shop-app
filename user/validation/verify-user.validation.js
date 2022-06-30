import Joi from "joi";

export const verifyUserValidator = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().length(6).required(),
})