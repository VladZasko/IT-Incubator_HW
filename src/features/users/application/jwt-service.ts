import {UserType} from "../../../db/types/users.types";
import {settings} from "../../../../settings";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UsersViewModel} from "../models/output/UsersViewModel";


export const jwtService = {
    async createJWT(user: UsersViewModel) {
        const token = jwt.sign(
            {userId: new ObjectId(user.id)},
            settings.JWT_SECRET,
            {expiresIn: '1h'})
        return {
            accessToken: token.toString()
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId).toString()
        } catch (error) {
            return null
        }
    }
}