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
import {RefreshTokensMetaModel} from "../../db/db";
import {authRefreshTokenMiddleware} from "../../middlewares/auth/auth-refreshToken-middleware";
import {LoginAuthUserModel} from "./models/input/LoginAuthUserModel";
import {v4 as uuidv4} from "uuid";
import {rateLimitMiddleware} from "../../middlewares/rate-limit/rate-limit-middleware";
import {authPasswordRecoveryValidator} from "./validator/password-recovery-validator";
import {newPasswordValidator} from "./validator/new-password-validator";



export const authUsersRoutes = () => {
    const router = express.Router()

    router.use(rateLimitMiddleware)

    router.post('/login', authValidation(), async (req: Request<LoginAuthUserModel>, res: Response) => {

        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const accessToken = await jwtService.createJWTAccessToken(user.id)

        const dataRefreshToken = {
            issuedAt: new Date().toISOString(),
            deviceId: uuidv4(),
            userId: user.id,
            ip: req.ip!,
            deviseName: req.headers["user-agent"] ?? "Device"
        }

        const refreshToken = await jwtService.createJWTRefreshToken(dataRefreshToken)

        await RefreshTokensMetaModel.insertMany({...dataRefreshToken})

        res
            .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUSES.OK_200).send(accessToken)
        return
    })

    router.post('/password-recovery', authPasswordRecoveryValidator(),
        async (req: Request, res: Response) => {

            await authService.passwordRecovery(req.body.email)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        })

    router.post('/new-password', newPasswordValidator(),
        async (req: Request, res: Response) => {

            const data = {
                newPassword: req.body.newPassword,
                recoveryCode: req.body.recoveryCode
            }

            await authService.newPassword(data)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        })

    router.post('/refresh-token', authRefreshTokenMiddleware, async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken

        const dataRefreshToken = {
            issuedAt: new Date().toISOString(),
            deviceId: req.refreshTokenMeta!.deviceId,
            userId: req.user!.id,
            ip: req.ip!,
            deviseName: req.headers["user-agent"] ?? "Device"
        }

        try {
            const accessToken = await jwtService.createJWTAccessToken(req.user!.id);
            const newRefreshToken = await jwtService.createJWTRefreshToken(dataRefreshToken)
            await RefreshTokensMetaModel.updateOne({deviceId:req.refreshTokenMeta!.deviceId}, {
                $set:{
                    issuedAt : dataRefreshToken.issuedAt,
                    deviceId: dataRefreshToken.deviceId,
                    userId: dataRefreshToken.userId,
                    ip: dataRefreshToken.ip,
                    deviseName: dataRefreshToken.deviseName
                }
            })

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
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
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
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    })

    router.post('/registration-email-resending', authResendingValidator(),
        async (req: Request, res: Response) => {

            const result = await authService.resendingConfirmEmail(req.body.email)
            if (result) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            }
        })

    router.post('/logout', authRefreshTokenMiddleware, async (req: Request, res: Response) => {

        const foundBlog = await RefreshTokensMetaModel.deleteOne({deviceId: req.refreshTokenMeta!.deviceId})
        if(!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
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