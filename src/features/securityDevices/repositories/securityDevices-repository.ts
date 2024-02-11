import {RefreshTokensMetaModel} from "../../../db/db";
import {securityDevicesRepositoryMapper} from "../mappers/mappers";
import {RefreshTokensMetaDBType} from "../../../db/types/token.types";

export class SecurityDevicesRepository {
    async getDevice(deviceId: string): Promise<RefreshTokensMetaDBType | null> {
        const sessions = await RefreshTokensMetaModel.findOne({deviceId: deviceId})

        if (!sessions) {
            return null
        }

        return securityDevicesRepositoryMapper(sessions)
    }

    async deleteDevice(deleteData: any): Promise<boolean> {
        const foundDevice = await RefreshTokensMetaModel.deleteOne({deviceId: deleteData.deviceId})

        if (!foundDevice) {
            return false
        }

        return !!foundDevice.deletedCount
    }

    async deleteAllDevice(deleteData: any): Promise<boolean> {
        const foundDevice = await RefreshTokensMetaModel.deleteMany({
            userId: deleteData.userId,
            deviceId: {
                $ne: deleteData.deviceId
            }
        });

        return !!foundDevice.deletedCount
    }
}