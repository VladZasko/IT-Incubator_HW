import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {SecurityDevicesQueryRepository} from "./repositories/securityDevices-query-repository";
import {SecurityDevicesViewModel} from "./model/output/securityDevicesViewModel";
import {SecurityDevicesService} from "./domain/securityDevices-service";
import {SecurityDevicesRepository} from "./repositories/securityDevices-repository";

export class SecurityDevicesController {
    constructor(protected securityDevicesService: SecurityDevicesService,
                protected securityDevicesRepository:SecurityDevicesRepository,
                protected securityDevicesQueryRepository:SecurityDevicesQueryRepository) {
    }


    async getAllDevices(req: Request, res: Response) {
        const sessions : SecurityDevicesViewModel[] | null = await this.securityDevicesQueryRepository.getAllDevices(req.refreshTokenMeta!.userId)

        if (!sessions) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res
            .status(HTTP_STATUSES.OK_200)
            .send(sessions)

    }

    async deleteDevice(req: Request, res: Response) {
        const session = await this.securityDevicesRepository.getDevice(req.params.deviceId)

        if (!session) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if (req.refreshTokenMeta?.userId !== session!.userId) {
            res.sendStatus(403)
            return;
        }
        const data = {
            userId: req.refreshTokenMeta!.userId,
            deviceId: req.params.deviceId
        }
        const deleteDevice = await this.securityDevicesService.deleteDevice(data)

        if (!deleteDevice) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    async deleteAllDevices(req: Request, res: Response) {
        const data = {
            userId: req.refreshTokenMeta!.userId,
            deviceId: req.refreshTokenMeta!.deviceId
        }
        const deleteAllDevice = await  this.securityDevicesService.deleteAllDevice(data)

        if (!deleteAllDevice) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
}