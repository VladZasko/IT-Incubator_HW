import express, {Response, Request} from "express";
import {RefreshTokensMetaModel} from "../../db/db";
import {authRefreshTokenMiddleware} from "../../middlewares/auth/auth-refreshToken-middleware";
import {securityDevicesMapper} from "./mappers/mappers";
import {HTTP_STATUSES} from "../../utils/utils";


export const securityDevicesRoutes = () => {
    const router = express.Router()

    router.get('/devices', authRefreshTokenMiddleware,  async (req: Request, res: Response) => {

        const sessions = await RefreshTokensMetaModel.find({
            userId: {$regex: req.refreshTokenMeta?.userId}
        }).lean()

        if (!sessions){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res
            .status(HTTP_STATUSES.OK_200)
            .send(sessions.map(securityDevicesMapper))


    })

    router.delete('/devices',authRefreshTokenMiddleware, async (req: Request, res: Response) => {
        const foundBlog = await RefreshTokensMetaModel.deleteMany({
            userId:req.refreshTokenMeta?.userId,
            deviceId: {
                $ne: req.refreshTokenMeta?.deviceId
            }
        });

        if(!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    })

    router.delete('/devices/:deviceId',authRefreshTokenMiddleware, async (req: Request, res: Response) => {

        const session = await RefreshTokensMetaModel.findOne({deviceId: req.params.deviceId})

        if (!session){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if(req.refreshTokenMeta?.userId !== session!.userId){
            res.sendStatus(403)
            return;
        }

        const foundBlog = await RefreshTokensMetaModel.deleteOne({deviceId: req.params.deviceId})

        if(!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    })

    return router;
}