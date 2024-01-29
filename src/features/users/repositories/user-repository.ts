import {UsersViewModel} from "../models/output/UsersViewModel";
import {ObjectId} from "mongodb";
import {UserAuthDBType} from "../../../db/types/users.types";
import {UserAuthModel} from "../../../db/db";

export class userRepository {
    static async createUser(createData : UserAuthDBType):Promise<UsersViewModel> {


        const user = await UserAuthModel.create({...createData})

        return {
            createdAt: createData.accountData.createdAt,
            email: createData.accountData.email,
            login: createData.accountData.login,
            id: user.id
        }
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await UserAuthModel.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}