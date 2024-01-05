import express, {Response, Request} from "express";
import {usersService} from "../../domain/users-service";
import {authValidation} from "../../validator/auth/auth-validator";
import {jwtService} from "../../application/jwt-service";
import {HTTP_STATUSES} from "../../../../utils/utils";
import {authTokenMiddleware} from "../../../../middlewares/auth/auth-token-middleware";


export const authUsersRoutes = () => {
    const router = express.Router()

    router.post('/login',authValidation(), async (req: Request, res: Response)=>{

            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

            if (!user){
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
                return
            }

        const token = await jwtService.createJWT(user)

        res.status(HTTP_STATUSES.CREATED_201).send(token)
        })
    router.get('/me', authTokenMiddleware,
        async (req: Request,
               res: Response) => {
            const success = {
                email: req.user!.email,
                login: req.user!.login,
                userId: req.user!.id
            }

            res.status(HTTP_STATUSES.OK_200).send(success)
        })
    return router;
}