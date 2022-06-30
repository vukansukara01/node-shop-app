import { createOrderHistoryValidator } from "./validation/create_order_history.validator.js";
import { database } from "../database.js";

export const createOrderHistory = async (data) => {
    // validate data
    const validated = createOrderHistoryValidator.validate(data, { abortEarly: false })
    if (validated.error) {
        console.log(validated.error)
        return
    }
    console.log(data)

    const orderHistory = await database.OrderHistory.create(data)

    console.log(orderHistory)

    return orderHistory
}