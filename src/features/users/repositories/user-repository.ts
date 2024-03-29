import {UsersViewModel} from "../models/output/UsersViewModel";
import {ObjectId} from "mongodb";
import {UserAuthDBType, UserAuthType} from "../../../db/types/users.types";
import {UserAuthModel} from "../../../db/db";

export class UsersRepository {
    async createUser(createData : UserAuthType):Promise<UsersViewModel> {


        const user = await UserAuthModel.create({...createData})

        return {
            createdAt: createData.accountData.createdAt,
            email: createData.accountData.email,
            login: createData.accountData.login,
            id: user.id
        }
    }
    async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await UserAuthModel.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}