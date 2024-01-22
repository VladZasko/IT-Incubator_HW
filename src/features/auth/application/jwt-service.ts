import {settings} from "../../../../settings";
import jwt from 'jsonwebtoken'

export const jwtService = {
    async createJWTAccessToken(userId: string) {
        const token = jwt.sign(
            {id: userId},
            settings.JWT_SECRET,
            {expiresIn: 10})
        return {
            accessToken: token.toString()
        }
    },

    async createJWTRefreshToken(dataRefreshToken: any) {
        const refreshToken = jwt.sign(
            {
                deviceId: dataRefreshToken.deviceId,
                id: dataRefreshToken.userId,
                issuedAt: dataRefreshToken.issuedAt
            },
            settings.JWT_SECRET,
            {expiresIn: 20})

        return refreshToken.toString()

    },

    async getUserIdByAccessToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.id
        } catch (error) {
            return null
        }
    },
    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result
        } catch (error) {
            return null
        }
    }
}