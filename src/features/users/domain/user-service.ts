import {UsersViewModel} from "../models/output/UsersViewModel";
import {usersCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreateUserModel} from "../models/input/CreateUserModel";
import bcrypt from 'bcrypt'
import {userRepository} from "../repositories/user-repository";
import {userQueryRepository} from "../repositories/user-query-repository";

export class userService {
    static async createUser(createData : CreateUserModel):Promise<UsersViewModel> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(createData.password, passwordSalt)

        const newUser = {
            login: createData.login,
            email: createData.email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordSalt
        }
        return await userRepository.createUser(newUser)
    }
    static async checkCredentials(loginOrEmail: string, password: string){
        const user = await userQueryRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }

        const passwordHash = await this._generateHash(password, user.passwordHash)
        if(user.passwordHash !== passwordHash) {
            return false
        }
        return true
    }
    static async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password,salt)
        return hash
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}