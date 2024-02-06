import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {LoginAuthUserModel} from "./models/input/LoginAuthUserModel";
import {jwtService} from "./application/jwt-service";
import {v4 as uuidv4} from "uuid";
import {RefreshTokensMetaModel} from "../../db/db";
import {AuthService} from "./domain/auth-service";
import {UsersService} from "../users/domain/users-service";

export class AuthController {
    constructor(
        protected authService: AuthService,
        protected usersService: UsersService) {
    }
    async login(req: Request<LoginAuthUserModel>, res: Response) {

        const user = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

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
    }

    async passwordRecovery(req: Request, res: Response) {

        await this.authService.passwordRecovery(req.body.email)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async newPassword(req: Request, res: Response) {

        const data = {
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        }

        await this.authService.newPassword(data)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async refreshToken(req: Request, res: Response) {

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
            await RefreshTokensMetaModel.updateOne({deviceId: req.refreshTokenMeta!.deviceId}, {
                $set: {
                    issuedAt: dataRefreshToken.issuedAt,
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
    }

    async registrationConfirmation(req: Request, res: Response) {

        const result = await this.authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async registration(req: Request, res: Response) {

        const createData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }
        const newUser = await this.authService.createUser(createData)
        if (newUser) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async registrationEmailResending(req: Request, res: Response) {

        const result = await this.authService.resendingConfirmEmail(req.body.email)
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async logout(req: Request, res: Response) {

        const foundDevice = await RefreshTokensMetaModel.deleteOne({deviceId: req.refreshTokenMeta!.deviceId})
        if (!foundDevice) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    async me(req: Request,
             res: Response) {
        const success = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        }

        res.status(HTTP_STATUSES.OK_200).send(success)
        return
    }
}