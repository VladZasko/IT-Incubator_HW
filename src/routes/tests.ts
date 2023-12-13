import {db, DBType} from "../db/db";
import express from "express";
import {HTTP_STATUSES} from "../utils";
import {app} from "../app";

export const getTestsRouter = (db: DBType) => {
    const router = express.Router()

    router.delete('/all_data', (req, res) => {
        db.videos = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}