import express, {Response, Request} from "express";
import {usersService} from "../users/domain/users-service";
import {authValidation} from "./validator/auth-validator";
import {jwtService} from "./application/jwt-service";
import {HTTP_STATUSES} from "../../utils/utils";
import {authAccessTokenMiddleware} from "../../middlewares/auth/auth-accessToken-middleware";
import {authService} from "./domain/auth-service";
import {authRegistrationValidator} from "./validator/auth-registration-validator";
import {authConfirmationValidator} from "./validator/auth-confirmation-validator";
import {authResendingValidator} from "./validator/auth-resending-validator";
import jwt from "jsonwebtoken";
import {settings} from "../../../settings";
import {invalidTokenCollection, usersCollection} from "../../db/db";
import {authRefreshTokenMiddleware} from "../../middlewares/auth/auth-refreshToken-middleware";

export const authUsersRoutes = () => {
    const router = express.Router()

    router.post('/login', authValidation(), async (req: Request, res: Response) => {

        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const accessToken = await jwtService.createJWTAccessToken(user.id)
        const refreshToken = await jwtService.createJWTRefreshToken(user.id)

        res
            .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUSES.OK_200).send(accessToken)
        return
    })

    router.post('/refresh-token', authRefreshTokenMiddleware, async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken

        try {
            const accessToken = await jwtService.createJWTAccessToken(req.user!.id);
            const newRefreshToken = await jwtService.createJWTRefreshToken(req.user!.id)
            const data = {blackList: refreshToken}

            await invalidTokenCollection.insertOne({...data})

            res
                .cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
                .status(HTTP_STATUSES.OK_200).send(accessToken);
        } catch (error) {
            return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Invalid refresh token.');
        }

        return
    })

    router.post('/registration-confirmation', authConfirmationValidator(), async (req: Request, res: Response) => {

        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
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

    router.post('/registration-email-resending', authResendingValidator(),
        async (req: Request, res: Response) => {

            const result = await authService.resendingConfirmEmail(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        })

    router.post('/logout', authRefreshTokenMiddleware, async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken

        const data = {
            blackList: refreshToken
        }

        await invalidTokenCollection.insertOne({...data})

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    })

    router.get('/me', authAccessTokenMiddleware,
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

    return router;
}