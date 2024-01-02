import {WithId} from "mongodb";
import {BlogDBType} from "../../../db/types/blogs.types";
import {UsersViewModel} from "../models/output/UsersViewModel";
import {UserDBType} from "../../../db/types/users.types";

export const userMapper = (userDb:WithId<UserDBType>):UsersViewModel => {
    return{
        id: userDb._id.toString(),
        login: userDb.login,
        email: userDb.email,
        createdAt: userDb.createdAt
    }
}