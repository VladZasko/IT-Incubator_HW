import {usersAuthCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {UserAuthType} from "../../../db/types/users.types";
import {CreateUserModel} from "../../users/models/input/CreateUserModel";
import {UsersViewModel} from "../../users/models/output/UsersViewModel";
import {authRepository} from "../repositories/auth-repository";
import {authQueryRepository} from "../repositories/auth-query-repository";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
import {userAuthDBMapper} from "../mapper/mappers";
import {emailAdapter} from "../adapters/email-adapter";

export class authService {
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
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const createResult = await authRepository.createUser(newUser)
        try {
            await emailAdapter.sendCode(newUser)
        } catch (error) {
            console.error(error)
            await authRepository.deleteUserById(createResult.id)
        }
        return createResult
    }

    static async confirmEmail(code: string): Promise<boolean> {
        let user = await authQueryRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation!.isConfirmed) return false;
        if (user.emailConfirmation!.confirmationCode !== code) return false;
        if (user.emailConfirmation!.expirationDate < new Date()) return false;

        let result = await authRepository.updateConfirmation(user._id)
        return result
    }

    static async checkCredentials(loginOrEmail: string, password: string): Promise<UserAuthType | null> {
        const user = await authQueryRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }

        const passwordHash = await this._generateHash(password, user.accountData.passwordHash)

        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }

        return userAuthDBMapper(user)

    }

    static async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersAuthCollection.deleteOne({_id: new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}