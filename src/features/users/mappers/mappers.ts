import {WithId} from "mongodb";
import {UsersViewModel} from "../models/output/UsersViewModel";
import {UserAuthDBType, UserAuthType} from "../../../db/types/users.types";

export const userMapper = (userDb: WithId<UserAuthDBType>): UsersViewModel => {
    return {
        id: userDb._id.toString(),
        login: userDb.accountData.login,
        email: userDb.accountData.email,
        createdAt: userDb.accountData.createdAt
    }
}

export const userDBMapper = (userDb: WithId<UserAuthDBType>): UserAuthType => {
    return {
        id: userDb._id.toString(),
        accountData: {
            login: userDb.accountData.login,
            email: userDb.accountData.email,
            createdAt: userDb.accountData.createdAt,
            passwordHash: userDb.accountData.passwordHash,
            passwordSalt: userDb.accountData.passwordSalt
        }

    }
}