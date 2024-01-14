import express, {Response, Request} from "express";
import {usersService} from "../users/domain/users-service";
import {authValidation} from "./validator/auth-validator";
import {jwtService} from "./application/jwt-service";
import {HTTP_STATUSES} from "../../utils/utils";
import {authTokenMiddleware} from "../../middlewares/auth/auth-token-middleware";
import {authService} from "./domain/auth-service";
import {authRegistrationValidator} from "./validator/auth-registration-validator";
import {ERRORS_MESSAGES} from "../../utils/errors";
import {authConfirmationValidator} from "./validator/auth-confirmation-validator";
import {authResendingValidator} from "./validator/auth-resending-validator";

export const authUsersRoutes = () => {
    const router = express.Router()

    router.post('/login', authValidation(), async (req: Request, res: Response) => {

        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const token = await jwtService.createJWT(user)

        res.status(HTTP_STATUSES.OK_200).send(token)
        return
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
            return
        })

    router.post('/registration', authRegistrationValidator(), async (req: Request, res: Response) => {

        const createData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }
        const newUser = await authService.createUser(createData)
        if (newUser) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })
    router.post('/registration-confirmation',authConfirmationValidator(), async (req: Request, res: Response) => {

        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })
    router.post('/registration-email-resending', authResendingValidator(),
        async (req: Request, res: Response) => {

            const result = await authService.resendingConfirmEmail(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        })
    return router;
}