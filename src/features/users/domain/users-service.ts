import {UsersViewModel} from "../models/output/UsersViewModel";
import {ObjectId} from "mongodb";
import {CreateUserModel} from "../models/input/CreateUserModel";
import bcrypt from 'bcrypt'
import {userRepository} from "../repositories/user-repository";
import {userQueryRepository} from "../repositories/user-query-repository";
import {userDBMapper} from "../mappers/mappers";
import {UserAuthType} from "../../../db/types/users.types";
import {UserAuthModel} from "../../../db/db";

export class usersService {
    static async createUser(createData: CreateUserModel): Promise<UsersViewModel> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(createData.password, passwordSalt)

        const newUser = {
            accountData: {
                login: createData.login,
                email: createData.email,
                createdAt: new Date().toISOString(),
                passwordHash,
                passwordSalt
            }
        }
        return await userRepository.createUser(newUser)
    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<UserAuthType | null> {
        const user = await userQueryRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }

        const passwordHash = await this._generateHash(password, user.accountData.passwordHash)

        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }

        return userDBMapper(user)

    }

    static async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await UserAuthModel.deleteOne({_id: new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}