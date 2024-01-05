import express from "express";
import {RouterPaths} from "./routerPaths";
import {getTestsRouter} from "./routes/tests";
import {getBlogsRoutes} from "./features/blogs/blogs.router";
import {getPostsRoutes} from "./features/posts/posts.router";
import {getUsersRoutes} from "./features/users/routes/users/users.router";
import {authUsersRoutes} from "./features/users/routes/auth/auth-router";
import {getFeedbacksRoutes} from "./features/feedback/feedbacks-router";

export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

//app.use(RouterPaths.videos, getVideosRoutes(memoryDb))
app.use(RouterPaths.blogs, getBlogsRoutes())
app.use(RouterPaths.posts, getPostsRoutes())
app.use(RouterPaths.users, getUsersRoutes())
app.use(RouterPaths.feedback, getFeedbacksRoutes())

app.use(RouterPaths.auth, authUsersRoutes())

app.use(RouterPaths.testing, getTestsRouter())
//app.use(RouterPaths.videos, getVideosRoutes(memoryDb))



