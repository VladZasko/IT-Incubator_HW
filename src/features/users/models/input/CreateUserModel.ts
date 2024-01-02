export type CreateUserModel = {
    /**
     * blog name, description, websiteUrl
     */
    login: string,
    email: string,
    password: string
}

export type CreateUserPassModel = {
    /**
     * blog name, description, websiteUrl
     */
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
    passwordSalt: string

}


