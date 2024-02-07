import mongoose, {Schema} from "mongoose";
import {InvalidTokenType, RefreshTokensMetaDBType} from "../types/token.types";

export const accessTokenBlackListType:Schema<InvalidTokenType> = new mongoose.Schema<InvalidTokenType>({
    accessToken: { type: String, require: true },
})
export const RefreshTokensMetaSchema:Schema<RefreshTokensMetaDBType> = new mongoose.Schema<RefreshTokensMetaDBType>({
    issuedAt: { type: String, require: true },
    deviceId: { type: String, require: true },
    ip: { type: String, require: true },
    deviseName: { type: String, require: true },
    userId: { type: String, require: true }
})

