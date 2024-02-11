import {RefreshTokensMetaDBType} from "../../../db/types/token.types";
import {WithId} from "mongodb";
import {SecurityDevicesViewModel} from "../model/output/securityDevicesViewModel";

export const securityDevicesMapper = (securityDevicesDb:WithId<RefreshTokensMetaDBType>):SecurityDevicesViewModel => {
    return{
        ip: securityDevicesDb.ip,
        title: securityDevicesDb.deviseName,
        lastActiveDate: securityDevicesDb.issuedAt,
        deviceId: securityDevicesDb.deviceId
    }
}

export const securityDevicesRepositoryMapper = (securityDevicesDb:WithId<RefreshTokensMetaDBType>):RefreshTokensMetaDBType => {
    return{
        ip: securityDevicesDb.ip,
        issuedAt: securityDevicesDb.issuedAt,
        deviceId: securityDevicesDb.deviceId,
        deviseName: securityDevicesDb.deviseName,
        userId: securityDevicesDb.userId
    }
}