import Joi from "joi";

export const createItemValidator = Joi.object({
    name: Joi.string().min(1).max(40).required(),
    description: Joi.string().min(1).max(500).required(),
    address: Joi.string().min(1).max(100).required(),
    price: Joi.number().min(0.10).max(1000000).required(),
    quantity: Joi.number().integer().min(1).required()
})