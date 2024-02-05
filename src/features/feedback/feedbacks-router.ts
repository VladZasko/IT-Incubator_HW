import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {
    RequestWithParams,
    RequestWithParamsAndBody
} from "../../utils/types";
import {URIParamsPostIdModel} from "../posts/models/URIParamsPostIdModule";
import {ObjectId} from "mongodb";
import {feedbacksQueryRepository} from "./repositories/feedback-query-repository";
import {FeedbackStatus, FeedbackViewModel} from "./models/FeedbackViewModel";
import {authAccessTokenMiddleware} from "../../middlewares/auth/auth-accessToken-middleware";
import {commentValidation} from "./validator/feedback-validator";
import {URIParamsFeedbackIdModule} from "./models/URIParamsFeedbackIdModule";
import {UpdateFeedbackModuleModel} from "./models/UpdateFeedbackModule";
import {feedbackService} from "./domain/feedback-service";
import {UpdateLikesModule} from "./models/UpdateLikesModule";
import {authRefreshTokenMiddleware} from "../../middlewares/auth/auth-refreshToken-middleware";
import {feedbackRepository} from "./repositories/feedback-repository";
import {FeedbacksModel} from "../../db/db";
import {accessTokenMiddleware} from "../../middlewares/auth/accessToken-middleware";
import {likeValidation} from "./validator/likes-validator";

export const getFeedbacksRoutes = () => {
    const router = express.Router()

    router.put('/:id/like-status',authAccessTokenMiddleware,likeValidation(),
        async (req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateLikesModule>,
               res: Response) => {

            const id = req.params.id

            const upData = {
                likeStatus: req.body.likeStatus,
                userId: req.user!.id
            }

            if (!ObjectId.isValid(id)) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            const comment = await feedbackRepository.getCommentById(id)

            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            const updateLikeStatus = await feedbackService.updateLikeStatus(id, upData)

           if (!updateLikeStatus) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        })

    router.get('/:id',accessTokenMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>,
                              res: Response<FeedbackViewModel>) => {
        const likeStatusData = req.user?.id

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const comment = await feedbacksQueryRepository.getCommentById(id,likeStatusData)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(comment)
    })

    router.put('/:id',
        authAccessTokenMiddleware, commentValidation(),
        async (req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateFeedbackModuleModel>,
               res: Response) => {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            const comment = await feedbackRepository.getCommentById(id)

            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            if(comment!.commentatorInfo.userId !== req.user!.id){
                res.sendStatus(403)
                return;
            }

            const upData = {
                content: req.body.content
            }

            const updateComment = await feedbackService.updateComment(id, upData)

            if (!updateComment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        })
    router.delete('/:id', authAccessTokenMiddleware,
        async (req: RequestWithParams<URIParamsFeedbackIdModule>,
               res) => {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }
            const comment = await feedbackRepository.getCommentById(id)

            if (!comment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            if(comment!.commentatorInfo.userId !== req.user!.id){
                res.sendStatus(403)
                return;
            }

            const deleteComment = await feedbackService.deleteCommentById(id)
            if (!deleteComment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        })
    return router;
}
