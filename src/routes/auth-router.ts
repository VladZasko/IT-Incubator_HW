import express, {Response, Request} from "express";
import {userService} from "../features/users/domain/user-service";


export const authUsersRoutes = () => {
    const router = express.Router()
    router.post('/', async (req: Request, res: Response)=>{
            const result = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (result === false){
                res.sendStatus(401)
                return
            }
        res.sendStatus(204)
        })
    return router;
}