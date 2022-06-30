import { getJwtData } from "../auth/auth.service.js";
import { UnauthorizedRequest } from "../errors.js";

export const authMiddleware = async (req, res, next) => {
    const bearerHeader = req.header("Authorization")
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        const auth = await getJwtData(bearerToken)
        if (!auth) {
            res.status(401).json(UnauthorizedRequest())
            return
        }
        req.auth = auth
        next()
        return
    }

    res.status(401).json(UnauthorizedRequest())
}