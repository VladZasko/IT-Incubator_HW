import {WithId} from "mongodb";

export type InvalidTokenType = WithId<{
    accessToken: string
}>

export type RefreshTokensMetaDBType = WithId<{
    issuedAt: string
    deviceId: string
    ip: string
    deviseName: string
    userId: string
}>

export type RefreshTokensMetaType = {
    id: string
    issuedAt: string
    deviceId: string
    ip: string
    deviseName: string
    userId: string
}