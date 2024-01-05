import {Response, Request, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {userQueryRepository} from "../../features/users/repositories/user-query-repository";
import {jwtService} from "../../features/users/application/jwt-service";



export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {

    if(!req.headers.authorization) {
        res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await userQueryRepository.getUserById(userId)
        next()
    }
    res.send(HTTP_STATUSES.UNAUTHORIZED_401)
    next()
}