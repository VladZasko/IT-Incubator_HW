import express, { Request, Response } from "express";
import {RouterPaths} from "./routerPaths";
import {getTestsRouter} from "./routes/tests";
import {commentsRouter} from "./features/feedback/router/feedbacks-router";
import cookieParser from "cookie-parser";
import {blogsRouter} from "./features/blogs/router/blogs.router";
import {postsRouter} from "./features/posts/router/posts.router";
import {usersRouter} from "./features/users/router/users.router";
import {authRouter} from "./features/auth/router/auth-router";
import {securityDevicesRouter} from "./features/securityDevices/router/security-devices-router";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)
app.use(cookieParser())

//app.use(RouterPaths.videos, getVideosRoutes(memoryDb))
app.use(RouterPaths.blogs, blogsRouter)
app.use(RouterPaths.posts, postsRouter)
app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.feedbacks, commentsRouter)
app.use(RouterPaths.security, securityDevicesRouter)

app.use(RouterPaths.auth, authRouter)

app.use(RouterPaths.testing, getTestsRouter())
//app.use(RouterPaths.videos, getVideosRoutes(memoryDb))


app.get('/', (req: Request, res: Response) => {
    res.send('Hello back-end HomeWorks in it-incubator!!!')
})


