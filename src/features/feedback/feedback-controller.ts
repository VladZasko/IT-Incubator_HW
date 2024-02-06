import {
    RequestWithParams,
    RequestWithParamsAndBody
} from "../../utils/types";
import {Response} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../../utils/utils";
import {URIParamsFeedbackIdModule} from "./models/URIParamsFeedbackIdModule";
import {UpdateLikesModule} from "./models/UpdateLikesModule";
import {URIParamsPostIdModel} from "../posts/models/URIParamsPostIdModule";
import {FeedbackViewModel} from "./models/FeedbackViewModel";
import {feedbacksQueryRepository} from "./repositories/feedback-query-repository";
import {UpdateFeedbackModuleModel} from "./models/UpdateFeedbackModule";
import {CommentsService} from "./domain/feedback-service";

export class CommentsController {
    constructor(protected commentsService: CommentsService) {
    }

    async updateLikeStatus(req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateLikesModule>,
                           res: Response) {

        const id = req.params.id

        const upData = {
            likeStatus: req.body.likeStatus,
            userId: req.user!.id
        }

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const comment = await this.commentsService.getCommentById(id)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const updateLikeStatus = await this.commentsService.updateLikeStatus(id, upData)

        if (!updateLikeStatus) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async getComment(req: RequestWithParams<URIParamsPostIdModel>,
                     res: Response<FeedbackViewModel>) {
        const likeStatusData = req.user?.id

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const comment = await feedbacksQueryRepository.getCommentById(id, likeStatusData)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(comment)
    }

    async updateComment(req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateFeedbackModuleModel>,
                        res: Response) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const comment = await this.commentsService.getCommentById(id)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (comment!.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(403)
            return;
        }

        const upData = {
            content: req.body.content
        }

        const updateComment = await this.commentsService.updateComment(id, upData)

        if (!updateComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async deleteComment(req: RequestWithParams<URIParamsFeedbackIdModule>,
                        res: Response) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        const comment = await this.commentsService.getCommentById(id)

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (comment!.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(403)
            return;
        }

        const deleteComment = await this.commentsService.deleteCommentById(id)
        if (!deleteComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}