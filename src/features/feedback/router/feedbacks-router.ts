import {Router} from "express";
import {authAccessTokenMiddleware} from "../../../middlewares/auth/auth-accessToken-middleware";
import {commentValidation} from "../validator/feedback-validator";
import {accessTokenMiddleware} from "../../../middlewares/auth/accessToken-middleware";
import {likeValidation} from "../validator/likes-validator";
import {commentsController} from "../../composition-root";

export const commentsRouter = Router({})

commentsRouter.put('/:id/like-status',authAccessTokenMiddleware,likeValidation(), commentsController.updateLikeStatus.bind(commentsController))
commentsRouter.get('/:id',accessTokenMiddleware, commentsController.getComment.bind(commentsController))
commentsRouter.put('/:id', authAccessTokenMiddleware, commentValidation(), commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:id', authAccessTokenMiddleware, commentsController.deleteComment.bind(commentsController))
