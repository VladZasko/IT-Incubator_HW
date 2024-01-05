import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {
    RequestWithParams,
    RequestWithParamsAndBody
} from "../../utils/types";
import {URIParamsPostIdModel} from "../posts/models/URIParamsPostIdModule";
import {ObjectId} from "mongodb";
import {feedbacksQueryRepository} from "./repositories/feedback-query-repository";
import {FeedbackViewModel} from "./models/FeedbackViewModel";
import {authTokenMiddleware} from "../../middlewares/auth/auth-token-middleware";
import {commentValidation} from "./validator/feedback-validator";
import {URIParamsFeedbackIdModule} from "./models/URIParamsFeedbackIdModule";
import {UpdateFeedbackModuleModel} from "./models/UpdateFeedbackModule";
import {feedbackService} from "./domain/feedback-service";
import {userQueryRepository} from "../users/repositories/user-query-repository";

export const getFeedbacksRoutes = () => {
    const router = express.Router()

    router.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>,
                              res: Response<FeedbackViewModel>) => {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const comment = await feedbacksQueryRepository.getCommentById(id)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(comment)
    })

    router.put('/:id',
        authTokenMiddleware, commentValidation(),
        async (req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateFeedbackModuleModel>,
               res: Response) => {
            const id = req.params.id

            const comment = await feedbacksQueryRepository.getCommentById(id)

            if(comment!.commentatorInfo.userId !== req.user!.id){
                res.sendStatus(403)
                return
            }

            if (!ObjectId.isValid(id)) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
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
    router.delete('/:id', authTokenMiddleware,
        async (req: RequestWithParams<URIParamsFeedbackIdModule>,
               res) => {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
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
