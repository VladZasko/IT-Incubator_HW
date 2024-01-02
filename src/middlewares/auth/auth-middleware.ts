import {NextFunction, Response, Request} from "express";
import dotenv from 'dotenv'
import {HTTP_STATUSES} from "../../utils/utils";

dotenv.config()
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization']

    if(!auth){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const [basic, token]= auth.split(" ")

    if (basic !== 'Basic'){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [login, password] = decodedData.split(":")

    if(login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    next()
}