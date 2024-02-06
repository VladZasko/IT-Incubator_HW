import express from "express";
import {HTTP_STATUSES} from "../utils/utils";
import {
    BlogModel, FeedbacksModel, PostModel, RateLimitModel,RefreshTokensMetaModel, UserAuthModel,
} from "../db/db";

export const getTestsRouter = () => {
    const router = express.Router()

    router.delete('/', async (req, res) => {
        await BlogModel.deleteMany({})
        await PostModel.deleteMany({})
        await UserAuthModel.deleteMany({})
        await FeedbacksModel.deleteMany({})
        await RefreshTokensMetaModel.deleteMany({})
        await RateLimitModel.deleteMany({})

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}
