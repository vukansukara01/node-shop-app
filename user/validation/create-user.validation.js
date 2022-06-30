import Joi from "joi";

export const createUserValidator = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(7).required(),
})
