import express from "express";
import {memoryDb} from "./db/memory-db";
import {RouterPaths} from "./routerPaths";
import {getVideosRoutes} from "./features/videos/videos.router";
import {getTestsRouter} from "./routes/tests";
import {getBlogsRoutes} from "./features/blogs/blogs.router";
import {getPostsRoutes} from "./features/posts/posts.router";
import {getUsersRoutes} from "./features/users/users.router";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use(RouterPaths.videos, getVideosRoutes(memoryDb))
app.use(RouterPaths.blogs, getBlogsRoutes(memoryDb))
app.use(RouterPaths.posts, getPostsRoutes(memoryDb))
app.use(RouterPaths.users, getUsersRoutes(memoryDb))
app.use(RouterPaths.testing, getTestsRouter(memoryDb))
//app.use(RouterPaths.videos, getVideosRoutes(memoryDb))



