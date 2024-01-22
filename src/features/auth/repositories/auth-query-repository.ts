import {usersAuthCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {userAuthMapper} from "../mapper/mappers";
import {UsersAuthViewModel} from "../models/output/UsersViewModel";

export class authQueryRepository {
    static async getUserById(id: string): Promise<UsersAuthViewModel | null> {
        const user = await usersAuthCollection.findOne({_id: new ObjectId(id)})

        if (!user){
            return null
        }

        return userAuthMapper(user)
    }
    static async findByLoginOrEmail(loginOrEmail: string) {
        return await usersAuthCollection
            .findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
    }

    static async findUserByConfirmationCode(emailConfirmationCode: string) {
        return await usersAuthCollection
            .findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
    }
}