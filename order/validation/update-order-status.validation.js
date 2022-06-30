import Joi from "joi";

export const updateOrderStatusValidator = Joi.object({
    status: Joi.string().valid('IN_DELIVERY', 'DELIVERED').required(),
})