import jwt from 'jsonwebtoken'
import { findByEmailUser } from "../user/user.service.js";
import { BadRequest, ServerError } from "../errors.js";
import bcrypt from "bcrypt";
import { secret } from "./jwt.secret.js";
import { createToken, findOneToken, utilizeToken } from "../token/token.service.js";

export const login = async (email, password) => {
    // check if email and password are passed
    if (!email || !password) {
        return BadRequest("email or password invalid")
    }

    // check if with user is exist
    const user = await findByEmailUser(email)
    if (!user) {
        return BadRequest("email or password invalid")
    }

    // check if password is valid
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        return BadRequest("email or password invalid")
    }

    return generateAuthTokens(user.id, user.email)
}

export const generateAuthTokens = async (userId, userEmail) => {
    // create jwt
    const authToken = jwt.sign(
        {
            id: userId,
            email: userEmail,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        },
        secret
    )

    const token = await createToken(userId, "REFRESH")
    if (!token) {
        return ServerError
    }

    // create jwt
    const refreshToken = jwt.sign(
        {
            id: userId,
            email: userEmail,
            value: token.value,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        },
        secret
    )

    return { auth: authToken, refresh: refreshToken }
}

export const authenticateFromRequest = async (req) => {
    let user = null
    const bearerHeader = req.header("Authorization")
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        user = await getJwtData(bearerToken)
    }
    return user
}

export const getJwtData = async (token) => {
    return jwt.verify(token, secret, (err, authData) => {
        if (err) {
            console.log(err)
            return null
        }

        return {
            id: authData.id,
            email: authData.email
        }
    })
}

export const refreshAuthentication = async (refreshToken) => {
    return jwt.verify(refreshToken, secret, async (err, data) => {
        if (err) {
            console.log(err)
            return BadRequest()
        }
        const token = await findOneToken({
            userId: data.id,
            value: data.value,
            type: "REFRESH"
        })
        if (!token) {
            return BadRequest()
        }

        utilizeToken(token.id)

        return generateAuthTokens(data.id, data.email)
    })
}