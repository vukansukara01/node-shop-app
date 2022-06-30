import express from 'express'
import { database } from "./database.js";
import userController from "./user/user.controller.js";
import orderController from "./order/order.controller.js";
import authController from "./auth/auth.controller.js";
import itemController from "./item/item.controller.js";
import { authMiddleware } from "./middleware/auth.js";

const PORT = 4000
const app = express();
app.use(express.json())
app.use('/users', authMiddleware)
app.use("/users", userController)
app.use('/orders', authMiddleware)
app.use("/orders", orderController)
app.use("/auth", authController)
app.use("/items", authMiddleware)
app.use("/items", itemController)

try {
    await database.sequelize.authenticate();
    // generate tables in database
    await database.sequelize.sync({ alter: true })
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
})

