
export type UserType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
    passwordHash: string,
    passwordSalt: string
}

export type UserDBType = {
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
    passwordSalt: string
}

export type UserAuthType = {
    id: string,
    accountData: {
        login: string,
        email: string,
        createdAt: string,
        passwordHash: string,
        passwordSalt: string
    }
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}
export type UserAuthDBType = {
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
}