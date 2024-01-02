
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