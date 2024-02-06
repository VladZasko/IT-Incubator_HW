import {WithId} from "mongodb";

export type UserAuthType = {
    //id:string
    accountData: {
        login: string,
        email: string,
        createdAt: string,
        passwordHash: string,
        passwordSalt: string
    }
    emailConfirmation?: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
    passwordRecovery?: {
        recoveryCode: string
        expirationDate: Date
    }
}
export type UserAuthDBType = WithId<{
    accountData: {
        login: string,
        email: string,
        createdAt: string,
        passwordHash: string,
        passwordSalt: string
    }
    emailConfirmation?: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
    passwordRecovery?: {
        recoveryCode: string
        expirationDate: Date
    }
}>
