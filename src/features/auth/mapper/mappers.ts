import {WithId} from "mongodb";
import {UsersAuthViewModel} from "../models/output/UsersViewModel";
import {UserAuthDBType, UserAuthType} from "../../../db/types/users.types";
import {UsersRepoViewModel} from "../../users/models/output/UsersViewModel";

export const userAuthMapper = (userDb:WithId<UserAuthDBType>):UsersAuthViewModel => {
    return{
        id: userDb._id.toString(),
        login: userDb.accountData.login,
        email: userDb.accountData.email,
        createdAt: userDb.accountData.createdAt
    }
}

export const userAuthDBMapper = (userDb:WithId<UserAuthDBType>):UsersRepoViewModel => {
    return{
        id: userDb._id.toString(),
        accountData: {
            login: userDb.accountData.login,
            email: userDb.accountData.email,
            createdAt: userDb.accountData.createdAt,
            passwordHash: userDb.accountData.passwordHash,
            passwordSalt: userDb.accountData.passwordSalt
        },
        emailConfirmation: {
            confirmationCode: userDb.emailConfirmation!.confirmationCode,
            expirationDate: userDb.emailConfirmation!.expirationDate,
            isConfirmed: userDb.emailConfirmation!.isConfirmed
        }
    }

}