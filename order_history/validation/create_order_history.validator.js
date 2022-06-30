import Joi from "joi";

export const createOrderHistoryValidator = Joi.object({
    price: Joi.number().min(0).required(),
    userId: Joi.number().integer().required(),
    userFirstName: Joi.string().required(),
    userLastName: Joi.string().required(),
    ownerFirstName: Joi.string().required(),
    ownerLastName: Joi.string().required(),
    cityId: Joi.number().integer().required(),
    ownerId: Joi.number().integer().required(),
    address: Joi.string().min(1).max(500).required(),
    postcode: Joi.string().min(1).max(50).required(),
    status: Joi.string().required(),
    itemName: Joi.string().required(),
    itemPrice:  Joi.number().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
})
