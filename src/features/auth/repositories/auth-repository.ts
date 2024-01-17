import {usersCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreateAuthUserPassModel} from "../models/input/CreateAuthUserModel";
import {UsersAuthViewModel} from "../models/output/UsersViewModel";

export class authRepository {
    static async createUser(createData : CreateAuthUserPassModel):Promise<UsersAuthViewModel> {

        const user = await usersCollection.insertOne({...createData})

        return {
            createdAt: createData.accountData.createdAt,
            email: createData.accountData.email,
            login: createData.accountData.login,
            id: user.insertedId.toString()
        }
    }

    static async updateConfirmation(_id : ObjectId){
        let result = await usersCollection
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed':true}})
        return result.modifiedCount === 1
    }

    static async newConfirmationCode( _id: ObjectId,data : Date, newConfirmationCode: string){
        let result = await usersCollection
            .updateOne({_id}, {$set:
                    {
                        'emailConfirmation.confirmationCode':newConfirmationCode,
                        'emailConfirmation.expirationDate':data
                    }
            })

        return result.modifiedCount === 1
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}