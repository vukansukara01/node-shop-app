import express from "express";
import { createOrder, findManyOrders, updateOrderStatus } from "./order.service.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const auth = req.auth
    const orders = await findManyOrders(auth)
    res.json(orders)
})

router.post('/', async (req, res) => {
    const auth = req.auth
    const payload = req.body
    const order = await createOrder(auth, payload)
    res.json(order)
})

router.patch('/:id/status',  async (req, res) => {
    const auth = req.auth
    const orderId = req.params.id
    const payload = req.body
    const response = await updateOrderStatus(orderId, payload, auth)
    res.json(response)
})

router.post

export default router