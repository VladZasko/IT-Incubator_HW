import {RefreshTokensMetaDBType} from "../../../db/types/token.types";
import {WithId} from "mongodb";

export const securityDevicesMapper = (securityDevicesDb:WithId<RefreshTokensMetaDBType>) => {
    return{
        ip: securityDevicesDb.ip,
        title: securityDevicesDb.deviseName,
        lastActiveDate: securityDevicesDb.issuedAt,
        deviceId: securityDevicesDb.deviceId
    }
}