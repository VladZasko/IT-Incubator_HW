import {UserAuthModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreateAuthUserPassModel} from "../models/input/CreateAuthUserModel";
import {UsersAuthViewModel} from "../models/output/UsersViewModel";

export class AuthRepository {
    async createUser(createData: CreateAuthUserPassModel): Promise<UsersAuthViewModel> {

        const user = await UserAuthModel.create({...createData})

        return {
            createdAt: createData.accountData.createdAt,
            email: createData.accountData.email,
            login: createData.accountData.login,
            id: user.id
        }
    }

    async updateConfirmation(_id: ObjectId) {
        let result = await UserAuthModel
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }

    async newConfirmationCode(_id: ObjectId, data: Date, newConfirmationCode: string) {
        let result = await UserAuthModel
            .updateOne({_id}, {
                $set:
                    {
                        'emailConfirmation.confirmationCode': newConfirmationCode,
                        'emailConfirmation.expirationDate': data
                    }
            })

        return result.modifiedCount === 1
    }

    async updatePassword(user: any, salt: string, hash: string) {
        let result = await UserAuthModel
            .updateOne({_id: new ObjectId(user.id)}, {
                $set:
                    {
                        'accountData.passwordHash': hash,
                        'accountData.passwordSalt': salt
                    },
                $unset:
                    {
                        passwordRecovery: 1,
                    }
            })
        return result.modifiedCount === 1
    }

    async passwordRecovery(_id: ObjectId, passwordRecoveryCode: string, expirationDate: Date) {
        let result = await UserAuthModel
            .updateOne({_id}, {
                $set:
                    {
                        'passwordRecovery.recoveryCode': passwordRecoveryCode,
                        'passwordRecovery.expirationDate': expirationDate
                    }
            })

        return result.modifiedCount === 1
    }

    async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await UserAuthModel.deleteOne({_id: new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}