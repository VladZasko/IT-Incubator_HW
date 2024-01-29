import {Response, Request, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {userQueryRepository} from "../../features/users/repositories/user-query-repository";
import {jwtService} from "../../features/auth/application/jwt-service";
import jwt from "jsonwebtoken";
import {settings} from "../../../settings";
import {RefreshTokensMetaModel} from "../../db/db";


export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .send('Access Denied. No refresh token provided.');
    }

    // const checkBlackList = await invalidTokenCollection.findOne({"blackList": {$regex: refreshToken}})
    //
    // if (checkBlackList) {
    //     return res
    //         .status(HTTP_STATUSES.UNAUTHORIZED_401)
    //         .send('refresh token is obsolete');
    // }

    try {
        jwt.verify(refreshToken, settings.JWT_SECRET)
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const user = await jwtService.getUserIdByRefreshToken(refreshToken)
    const refreshTokenMeta = await RefreshTokensMetaModel.findOne({deviceId: user.deviceId})

    if (!refreshTokenMeta) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    if (refreshTokenMeta?.issuedAt !== user.issuedAt) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    if (refreshTokenMeta?.issuedAt === user.issuedAt) {
        req.user = await userQueryRepository.getUserById(refreshTokenMeta!.userId)
        req.refreshTokenMeta = refreshTokenMeta
        next()
        return
    }
    res.status(HTTP_STATUSES.UNAUTHORIZED_401)
    return
}