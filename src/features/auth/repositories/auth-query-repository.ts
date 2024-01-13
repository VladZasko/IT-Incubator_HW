import {usersAuthCollection, usersCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {QueryUserModel} from "../../users/models/input/QueryUserModule";
import {userAuthMapper} from "../mapper/mappers";
import {UsersAuthViewModel, UsersAuthViewModelGetAllBlogs} from "../models/output/UsersViewModel";

export class authQueryRepository {
    static async getUserById(id: string): Promise<UsersAuthViewModel | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})

        if (!user){
            return null
        }

        return userAuthMapper(user)
    }
    static async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection
            .findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
    }
    static async findUserByConfirmationCode(emailConfirmationCode: string) {
        return await usersCollection
            .findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
    }
}