import {UserAuthModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {UserAuthType} from "../../../db/types/users.types";
import {CreateUserModel} from "../../users/models/input/CreateUserModel";
import {UsersViewModel} from "../../users/models/output/UsersViewModel";
import {AuthRepository} from "../repositories/auth-repository";
import {authQueryRepository} from "../repositories/auth-query-repository";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
import {userAuthDBMapper} from "../mapper/mappers";
import {emailAdapter} from "../adapters/email-adapter";
import {BlogsRepository} from "../../blogs/repositories/blogs-repository";

export class AuthService {
    constructor(protected authRepository:AuthRepository) {}

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
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 15
                }),
                resendingCode: new Date(),
                isConfirmed: false
            }
        }
        const createResult = await this.authRepository.createUser(newUser)
        try {
            await emailAdapter.sendCode(newUser)
        } catch (error) {
            console.error(error)
            await this.authRepository.deleteUserById(createResult.id)
        }
        return createResult
    }

    async confirmEmail(code: string): Promise<boolean> {
        let user = await authQueryRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation!.isConfirmed) return false;
        if (user.emailConfirmation!.confirmationCode !== code) return false;
        if (user.emailConfirmation!.expirationDate < new Date()) return false;

        return await this.authRepository.updateConfirmation(user._id)
    }

    async resendingConfirmEmail(email: string): Promise<boolean> {
        let user = await authQueryRepository.findByLoginOrEmail(email)
        if (!user) return false

        const newConfirmationCode = uuidv4()
        const newExpirationDate = add(new Date(), {
            minutes: 15
        })

        let result = await this.authRepository.newConfirmationCode(user._id, newExpirationDate, newConfirmationCode)

        try {
            await emailAdapter.sendNewCode(user, newConfirmationCode)
        } catch (error) {
            console.error(error)
            return false
        }

        return result
    }

    async passwordRecovery(email: string): Promise<boolean> {
        let user = await authQueryRepository.findByLoginOrEmail(email)
        if (!user) return true

        const passwordRecoveryCode = uuidv4()
        const expirationDate = add(new Date(), {
            minutes: 15
        })

        let result = await this.authRepository.passwordRecovery(user!._id, passwordRecoveryCode, expirationDate)

        try {
            await emailAdapter.sendRecoveryCode(user!, passwordRecoveryCode)
        } catch (error) {
            console.error(error)
            return false
        }

        return result
    }

    async newPassword(data: any): Promise<boolean> {
        let user = await authQueryRepository.findUserByRecoveryCode(data.recoveryCode)
        if (!user) return false
        if (user.passwordRecovery!.recoveryCode !== data.recoveryCode) return false;
        if (user.passwordRecovery!.expirationDate < new Date()) return false;

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(data.newPassword, passwordSalt)

        return await this.authRepository.updatePassword(user, passwordSalt, passwordHash)
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserAuthType | null> {
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

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await UserAuthModel.deleteOne({_id: new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}