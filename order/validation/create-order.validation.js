import Joi from "joi";

export const createOrderValidator = Joi.object({
    cityId: Joi.number().integer().required(),
    address: Joi.string().min(1).max(500).required(),
    postcode: Joi.string().min(1).max(50).required(),
})
