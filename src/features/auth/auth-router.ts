import express, {Response, Request} from "express";
import {userService} from "../users/domain/user-service";
import {authValidation} from "./validator/auth-validator";


export const authUsersRoutes = () => {
    const router = express.Router()
    router.post('/',authValidation(), async (req: Request, res: Response)=>{
            const result = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (result === false){
                res.sendStatus(401)
                return
            }
        res.sendStatus(204)
        })
    return router;
}