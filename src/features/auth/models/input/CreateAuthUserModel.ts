
export type CreateAuthUserModel = {
    /**
     * blog name, description, websiteUrl
     */
    login: string,
    email: string,
    password: string
}

export type CreateAuthUserPassModel = {
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


