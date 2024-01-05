import {memoryDb, DBType} from "../db/memory-db";
import express from "express";
import {HTTP_STATUSES} from "../utils/utils";
import {app} from "../app";
import {blogsCollection, feedbacksCollection, postsCollection, usersCollection, videosCollection} from "../db/db";

export const getTestsRouter = () => {
    const router = express.Router()

    router.delete('/', async (req, res) => {
            await blogsCollection.deleteMany({})
            await postsCollection.deleteMany({})
            await videosCollection.deleteMany({})
            await usersCollection.deleteMany({})
            await feedbacksCollection.deleteMany({})

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