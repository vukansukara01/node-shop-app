import { database } from "../database.js";
import { findByIdUser } from "../user/user.service.js";
import { findByIdItem, updateReservedItem } from "../item/item.service.js";
import { BadRequest, handleJoiValidationErrors, NotFound } from "../errors.js";
import { updateOrderStatusValidator } from "./validation/update-order-status.validation.js";
import { createOrderHistory } from "../order_history/order_history.service.js";

export const findManyOrders = async (auth) => {
    return database.Order.findAndCountAll({
        where: { user_id: auth.id }
    })
}

export const createOrder = async (auth, payload) => {
    const user = await findByIdUser(auth.id)
    const item = await findByIdItem(payload.itemId)

    if (!item) {
        return NotFound("item")
    }
    if (item.quantity < payload.quantity) {
        return BadRequest(`only ${item.quantity} ${item.name} is available`)
    }

    const city = await database.City.findByPk(payload.cityId)
    if (!city) {
        return NotFound("city")
    }

    if (auth.id == item.userId) {
        return BadRequest("you can't order you own item")
    }

    const newOrder = {
        price: item.price * payload.quantity,
        userId: user.id,
        cityId: payload.cityId,
        address: payload.address,
        postcode: payload.postcode,
        itemId: payload.itemId,
        ownerId: item.userId,
        status: "CREATED"
    }

    const order = await database.Order.create(newOrder)
    if (order) {
        updateReservedItem(item.id, payload.quantity)
    }

    return order
}

export const updateOrderStatus = async (orderId, payload, auth) => {
    // validate data
    const validated = updateOrderStatusValidator.validate(payload, { abortEarly: false })
    if (validated.error) {
        return handleJoiValidationErrors(validated.error)
    }

    const order = await database.Order.findByPk(orderId)
    if (!order) {
        return NotFound('order')
    }

    if (order.ownerId === auth.id) {
        return ownerUpdateOrderStatus(auth.id, order.id, payload.status)
    } else if (order.userId === auth.id) {
        return buyerUpdateOrderStatus(auth.id, order.id, payload.status)
    }
}

export const ownerUpdateOrderStatus = async (ownerId, orderId, status) => {
    const order = await database.Order.findByPk(orderId)
    if (!orderId) {
        return NotFound('order')
    }

    if (order.ownerId !== ownerId || order.status !== "CREATED" || status !== "IN_DELIVERY") {
        return BadRequest("order owner can only update status IN_DELIVERY")
    }

    order.status = status

    return order.save()
}

export const buyerUpdateOrderStatus = async (buyerId, orderId, status) => {
    if (status !== "DELIVERED") {
        return BadRequest()
    }

    const order = await database.Order.findOne({
        where: {
            id: orderId,
            userId: buyerId,
        },
        include: [
            {
                model: database.User,
                as: "owner"
            },
            {
                model: database.User,
                as: "buyer"
            },
            {
                model: database.Item
            }
        ]
    })

    if (order.status !== 'IN_DELIVERY') {
        return BadRequest("order not yet sent or already delivered")
    }

    order.status = status
    order.save()

    // add to order history
    createOrderHistory({
        price: order.price,
        userId: order.userId,
        userFirstName: order.buyer.firstName,
        userLastName: order.buyer.lastName,
        cityId: order.cityId,
        ownerId: order.owner.id,
        ownerFirstName: order.owner.firstName,
        ownerLastName: order.owner.firstName,
        address: order.address,
        postcode: order.postcode,
        status: order.status,
        itemId: order.Item.id,
        itemName: order.Item.name,
        itemPrice: order.Item.price,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    })

    return { isUpdated: true }
}