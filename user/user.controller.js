import express from "express";
import { database } from "../database.js";
import { handleDatabaseErrors, NotFound } from "../errors.js";
import { verificationResend, verifyUser } from "./user.service.js";

const router = express.Router();

//
router.get('/', async (req, res) => {
    const { first_name, last_name } = req.query

    let where = {}
    if (first_name) {
        where.firstName = first_name
    }

    if (last_name) {
        where.lastName = last_name
    }

    const users = await database.User.findAndCountAll({
        where
    })
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const randomData = await database.sequelize.query("SELECT * FROM users", { type: database.sequelize.QueryTypes.SELECT})

    const id = req.params.id
    // const user = await database.User.findByPk(id)
    const user = await database.User.findOne({
        where: {
            id,
        },
        include: [
            {
                model: database.Order,
                as: "orders",
                where: {
                    price: 240.56
                },
                include: [{
                    model: database.City,
                    as: "city",
                    where: { name: "Banja Luka" }
                }]
            }
        ]
    })

    res.json(user)
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body

    const user = await database.User.findByPk(id)

    if (!user) {
        res.status(404).json({
            key: "NOT_FOUND",
            message: "User not found"
        })
        return
    }

    try {
        user.firstName = data.first_name
        user.lastName = data.last_name
        user.email = data.email
        await user.save()
        await user.reload()
        res.json(user)
    } catch (e) {
        const error = handleDatabaseErrors(e)
        res.status(error.status).json(error)
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const isDeleted = await database.User.destroy({ where: { id } })
    console.log(isDeleted)
    if (isDeleted) {
        res.status(204).send()
    }
    res.status(404).json(NotFound("User"))
})

// create route for verification
router.post('/verification', async (req, res) => {
    const payload = req.body
    if (!payload.email || !payload.token) {
        res.status(404).json({
            key: "NOT_FOUND",
            message: "User not found"
        })
        return
    }

    const response = await verifyUser(payload)
    // return response
    res.json(response)
})

router.post('/verification/resend', async (req, res) => {
    const { id } = req.body
    const isSent = await verificationResend(id)
    res.json(isSent)
})

export default router