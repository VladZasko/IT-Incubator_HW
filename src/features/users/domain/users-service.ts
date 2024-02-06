import {UsersRepoViewModel, UsersViewModel} from "../models/output/UsersViewModel";
import {ObjectId} from "mongodb";
import {CreateUserModel} from "../models/input/CreateUserModel";
import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/user-repository";
import {userQueryRepository} from "../repositories/user-query-repository";
import {userDBMapper} from "../mappers/mappers";
import {UserAuthModel} from "../../../db/db";

export class UsersService {
    constructor(protected usersRepository:UsersRepository) {}
    async createUser(createData: CreateUserModel): Promise<UsersViewModel> {

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
        return await this.usersRepository.createUser(newUser)
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<UsersRepoViewModel | null> {
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

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await UserAuthModel.deleteOne({_id: new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}