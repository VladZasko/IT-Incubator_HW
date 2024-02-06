import express from "express";
import {HTTP_STATUSES} from "../utils/utils";
import {app} from "../app";
import {
    BlogModel, FeedbacksModel, PostModel, RateLimitModel,RefreshTokensMetaModel, UserAuthModel,

} from "../db/db";

export const getTestsRouter = () => {
    const router = express.Router()

    router.delete('/', async (req, res) => {
        await BlogModel.deleteMany({})
        await PostModel.deleteMany({})
        //await videosCollection.deleteMany({})
        await UserAuthModel.deleteMany({})
        await FeedbacksModel.deleteMany({})
        await RefreshTokensMetaModel.deleteMany({})
        await RateLimitModel.deleteMany({})

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}


// await blogsCollection.deleteMany({})
// await postsCollection.deleteMany({})
// await videosCollection.deleteMany({})

// db.videos= [];
// db.blogs= [];
// db.posts= [];