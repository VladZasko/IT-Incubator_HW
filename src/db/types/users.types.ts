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

export class UserAuthDBType {
    constructor(
        public accountData: {
            login: string,
            email: string,
            createdAt: string,
            passwordHash: string,
            passwordSalt: string
        },
        public emailConfirmation: {
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean
        },
        public passwordRecovery: {
            recoveryCode: string
            expirationDate: Date
        }
    ) {
    }
}
