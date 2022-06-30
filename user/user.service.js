import bcrypt from 'bcrypt'
import { BadRequest, DuplicateEntry, handleJoiValidationErrors, NotFound } from "../errors.js";
import { createUserValidator } from "./validation/create-user.validation.js";
import { database } from "../database.js";
import { sendVerificationEmail } from "../email/email.service.js";
import { verifyUserValidator } from "./validation/verify-user.validation.js";
import { getTimeOffsetByPassedMinutes } from "../common/time.js";
import {
    createToken,
    deleteByUserIdAndTypeToken,
    findOneByUserIdAndTypeToken,
    verifyToken
} from "../token/token.service.js";

export const findByIdUser = async (id) => {
    return database.User.findByPk(id)
}

// Find user by email
export const findByEmailUser = async (email) => {
    return database.User.findOne({
        where: {
            email
        }
    })
}

// Create user
export const createUser = async (creatUserData) => {
    // validate data
    const validated = createUserValidator.validate(creatUserData, { abortEarly: false })
    if (validated.error) {
        return handleJoiValidationErrors(validated.error)
    }

    // check if user exist
    let user = await database.User.findOne({
        where: {
            email: creatUserData.email
        }
    })
    if (user) {
        return DuplicateEntry("email")
    }

    creatUserData.password = bcrypt.hashSync(creatUserData.password, 14)

    // create user in database
    user = await database.User.create(creatUserData)

    // generate token
    const token = await createToken(user.id, "VERIFICATION")

    // send email
    sendVerificationEmail(user.email, token.value)

    // return user
    return user
}

export const verifyUser = async (payload) => {
    // validate data
    const validated = verifyUserValidator.validate(payload, { abortEarly: false })
    if (validated.error) {
        return handleJoiValidationErrors(validated.error)
    }

    // check if user with email exist
    const user = await database.User.findOne({
        where: {
            email: payload.email
        }
    })
    if (!user) {
        return NotFound('User')
    }

    // check if token is valid
    const isValid = await verifyToken(user.id, payload.token, "VERIFICATION")

    if (!isValid) {
        return NotFound('Token')
    }

    // verify user
    user.verifiedAt = new Date();
    user.save()

    return { verified: true }
}

// resend email for user verification
export const verificationResend = async (id) => {
    // check if user exist
    const user = await database.User.findByPk(id)
    if (!user) {
        return NotFound('User')
    }

    // check if user already verified
    if (user.verifiedAt) {
        return BadRequest('User already verified')
    }

    // check if token is sent under 1 minute
    let oldToken = await findOneByUserIdAndTypeToken(user.id, "VERIFICATION")
    if (oldToken) {
        const offsetTime = getTimeOffsetByPassedMinutes(oldToken.createdAt, 1)
        const currentDate = new Date()
        if (currentDate < offsetTime) {
            return BadRequest('You can resend verification before ' + offsetTime)
        }
    }

    // delete old token
    deleteByUserIdAndTypeToken(user.id, "VERIFICATION")

    // generate token
    const newToken = await createToken(user.id, "VERIFICATION")

    // send email
    sendVerificationEmail(user.email, newToken.value)

    return true;
}