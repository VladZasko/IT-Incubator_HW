import {RefreshTokensMetaModel} from "../../../db/db";
import {securityDevicesMapper} from "../mappers/mappers";
import {SecurityDevicesViewModel} from "../model/output/securityDevicesViewModel";

export class SecurityDevicesQueryRepository {
    async getAllDevices(userId: string): Promise<SecurityDevicesViewModel[] | null> {
        const sessions = await RefreshTokensMetaModel.find({
            userId: {$regex: userId}
        }).lean()

        if (!sessions) {
            return null
        }

        return sessions.map(securityDevicesMapper)
    }
}