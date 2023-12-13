import express from "express";
import {db} from "./db/db";
import {RouterPaths} from "./routerPaths";
import {getVideosRoutes} from "./routes/videos.router";
import {getTestsRouter} from "./routes/tests";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use(RouterPaths.videos, getVideosRoutes(db))
app.use(RouterPaths.testing, getTestsRouter(db))



