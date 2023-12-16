import express from "express";
import {db} from "./db/db";
import {RouterPaths} from "./routerPaths";
import {getVideosRoutes} from "./features/videos/videos.router";
import {getTestsRouter} from "./routes/tests";
import {getBlogsRoutes} from "./features/blogs/blogs.router";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use(RouterPaths.videos, getVideosRoutes(db))
app.use(RouterPaths.blogs, getBlogsRoutes(db))
//app.use(RouterPaths.videos, getVideosRoutes(db))
app.use(RouterPaths.testing, getTestsRouter(db))



