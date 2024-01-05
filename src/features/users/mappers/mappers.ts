import {WithId} from "mongodb";
import {UsersViewModel} from "../models/output/UsersViewModel";
import {UserDBType, UserType} from "../../../db/types/users.types";

export const userMapper = (userDb:WithId<UserDBType>):UsersViewModel => {
    return{
        id: userDb._id.toString(),
        login: userDb.login,
        email: userDb.email,
        createdAt: userDb.createdAt
    }
}

export const userDBMapper = (userDb:WithId<UserDBType>):UserType => {
    return{
        id: userDb._id.toString(),
        login: userDb.login,
        email: userDb.email,
        createdAt: userDb.createdAt,
        passwordHash: userDb.passwordHash,
        passwordSalt: userDb.passwordSalt
    }
}