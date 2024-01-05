import {Response, Request, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {userQueryRepository} from "../../features/users/repositories/user-query-repository";
import {jwtService} from "../../features/users/application/jwt-service";



export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {
    const auth = req.headers['authorization']

    if(!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    const [bearer, token]= auth.split(" ")

    if(bearer !== 'Bearer'){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    const tokenValid = token.indexOf('.',0)
    if(tokenValid === -1){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    //const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await userQueryRepository.getUserById(userId)
        next()
    }
    res.status(HTTP_STATUSES.UNAUTHORIZED_401)
    return
}