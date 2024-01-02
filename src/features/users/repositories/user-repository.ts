import {UsersViewModel} from "../models/output/UsersViewModel";
import {usersCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreateUserPassModel} from "../models/input/CreateUserModel";

export class userRepository {
    static async createUser(createData : CreateUserPassModel):Promise<UsersViewModel> {


        const user = await usersCollection.insertOne({...createData})

        return {
            createdAt: createData.createdAt,
            email: createData.email,
            login: createData.login,
            id: user.insertedId.toString()
        }
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}