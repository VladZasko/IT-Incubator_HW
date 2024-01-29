import mongoose from "mongoose";
import {BlogDBType} from "../types/blogs.types";
import {UserAuthDBType} from "../types/users.types";

export const UserAuthSchema = new mongoose.Schema<UserAuthDBType>({
    accountData: {
        login: { type: String, require: true },
        email: { type: String, require: true },
        createdAt: { type: String, require: true },
        passwordHash: { type: String, require: true },
        passwordSalt: { type: String, require: true }
    },
    emailConfirmation: {
        confirmationCode: { type: String, require: true },
        expirationDate: { type: Date, require: true },
        isConfirmed: { type: Boolean, require: true }
    },
    passwordRecovery: {
        recoveryCode: { type: String, require: true },
        expirationDate: { type: Date, require: true }
    }
})

export const UserAuthModel = mongoose.model('blogs', UserAuthSchema)
