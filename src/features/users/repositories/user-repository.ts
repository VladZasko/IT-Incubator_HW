import {UsersViewModel} from "../models/output/UsersViewModel";
import {ObjectId} from "mongodb";
import {UserAuthDBType} from "../../../db/types/users.types";
import {usersAuthCollection} from "../../../db/db";

export class userRepository {
    static async createUser(createData : UserAuthDBType):Promise<UsersViewModel> {


        const user = await usersAuthCollection.insertOne({...createData})

        return {
            createdAt: createData.accountData.createdAt,
            email: createData.accountData.email,
            login: createData.accountData.login,
            id: user.insertedId.toString()
        }
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersAuthCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}