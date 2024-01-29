import mongoose from "mongoose";
import {BlogDBType} from "../types/blogs.types";
import {RefreshTokensMetaDBType} from "../types/token.types";

export const RefreshTokensMetaSchema = new mongoose.Schema<RefreshTokensMetaDBType>({
    issuedAt: { type: String, require: true },
    deviceId: { type: String, require: true },
    ip: { type: String, require: true },
    deviseName: { type: String, require: true },
    userId: { type: String, require: true }
})

