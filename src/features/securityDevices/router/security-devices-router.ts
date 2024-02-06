import {Router} from "express";
import {authRefreshTokenMiddleware} from "../../../middlewares/auth/auth-refreshToken-middleware";
import {securityDevicesController} from "../../composition-root";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices', authRefreshTokenMiddleware, securityDevicesController.getAllDevices.bind(securityDevicesController))
securityDevicesRouter.delete('/devices',authRefreshTokenMiddleware, securityDevicesController.deleteDevice.bind(securityDevicesController))
securityDevicesRouter.delete('/devices/:deviceId',authRefreshTokenMiddleware, securityDevicesController.deleteDevices.bind(securityDevicesController))
