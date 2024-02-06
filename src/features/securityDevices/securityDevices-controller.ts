import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {RefreshTokensMetaModel} from "../../db/db";
import {securityDevicesMapper} from "./mappers/mappers";

export class SecurityDevicesController {

    async getAllDevices(req: Request, res: Response) {

        const sessions = await RefreshTokensMetaModel.find({
            userId: {$regex: req.refreshTokenMeta?.userId}
        }).lean()

        if (!sessions) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res
            .status(HTTP_STATUSES.OK_200)
            .send(sessions.map(securityDevicesMapper))

    }

    async deleteDevice(req: Request, res: Response) {
        const foundBlog = await RefreshTokensMetaModel.deleteMany({
            userId: req.refreshTokenMeta?.userId,
            deviceId: {
                $ne: req.refreshTokenMeta?.deviceId
            }
        });

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    async deleteDevices(req: Request, res: Response) {

        const session = await RefreshTokensMetaModel.findOne({deviceId: req.params.deviceId})

        if (!session) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if (req.refreshTokenMeta?.userId !== session!.userId) {
            res.sendStatus(403)
            return;
        }

        const foundBlog = await RefreshTokensMetaModel.deleteOne({deviceId: req.params.deviceId})

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
}