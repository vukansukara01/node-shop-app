import express from "express";
import {createItem, findManyItem} from "./item.service.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await findManyItem()
    res.json(items)
})

router.post('/', async (req, res) => {
    const auth = req.auth
    const item = await createItem(auth, req.body)
    res.json(item)
})

export default router