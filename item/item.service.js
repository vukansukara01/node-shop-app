import { database } from "../database.js";
import {handleJoiValidationErrors, InternalServerError, UnauthorizedRequest} from "../errors.js";
import { createItemValidator } from "./validation/create-item.validation.js";
import { findByIdUser } from "../user/user.service.js";

export const findByIdItem = async (id) => {
    return database.Item.findByPk(id)
}

export const findManyItem = async () => {
    return database.Item.findAndCountAll()
}

export const createItem = async (auth, payload) => {
    // validate data
    const validated = createItemValidator.validate(payload, { abortEarly: false })
    if (validated.error) {
        return handleJoiValidationErrors(validated.error)
    }
    const user = await findByIdUser(auth.id)
    if (!user) {
        return new UnauthorizedRequest()
    }

    const createItem = {
        ...payload,
        userId: auth.id
    }

    return database.Item.create(createItem);
}

export const updateQuantity = async (itemId, addedItems) => {
    const item = await database.Item.findByPk(itemId)
    console.log(item)
    if (!item) {
        return InternalServerError
    }
    console.log(item)
    item.quantity = item.quantity + addedItems
    await item.save()
    return item.reload()
}

export const updateReservedItem = async (itemId, addedReserved) => {
    const item = await database.Item.findByPk(itemId)
    if (!item) {
        return InternalServerError
    }

    item.reserved = item.reserved + addedReserved
    await item.save()
    return item.reload()
}