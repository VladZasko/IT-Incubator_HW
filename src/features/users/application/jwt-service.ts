import {UserDBType, UserType} from "../../../db/types/users.types";
import {settings} from "../../../../settings";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UsersViewModel} from "../models/output/UsersViewModel";


export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign(
            {id: user.id},
            settings.JWT_SECRET,
            {expiresIn: '1h'})
        return {
            accessToken: token.toString()
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.id
        } catch (error) {
            return null
        }
    }
}