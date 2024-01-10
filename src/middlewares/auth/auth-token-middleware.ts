import {Response, Request, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {userQueryRepository} from "../../features/users/repositories/user-query-repository";
import {jwtService} from "../../features/auth/application/jwt-service";



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

    const isValidJWT = (t:string) => /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/.test(t);

    if(!isValidJWT(token)){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await userQueryRepository.getUserById(userId)
        next()
    }
    res.status(HTTP_STATUSES.UNAUTHORIZED_401)
    return
}