import {UsersViewModel} from "../models/output/UsersViewModel";
import {usersCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {UserAuthDBType} from "../../../db/types/users.types";

export class userRepository {
    static async createUser(createData : UserAuthDBType):Promise<UsersViewModel> {


        const user = await usersCollection.insertOne({...createData})

        return {
            createdAt: createData.accountData.createdAt,
            email: createData.accountData.email,
            login: createData.accountData.login,
            id: user.insertedId.toString()
        }
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}