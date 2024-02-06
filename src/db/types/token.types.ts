import {WithId} from "mongodb";

export type InvalidTokenType = WithId<{
    accessToken: string
}>

export class RefreshTokensMetaDBType {
    constructor(
        public issuedAt: string,
        public deviceId: string,
        public ip: string,
        public deviseName: string,
        public userId: string
    ) {
    }
}

export type RefreshTokensMetaType = {
    id: string
    issuedAt: string
    deviceId: string
    ip: string
    deviseName: string
    userId: string
}