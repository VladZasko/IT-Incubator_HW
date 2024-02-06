import express, {Response, Router} from "express";
import {authMiddleware} from "../../../middlewares/auth/auth-middleware";
import {postValidation} from "../validator/post-validator";
import {authAccessTokenMiddleware} from "../../../middlewares/auth/auth-accessToken-middleware";
import {commentValidation} from "../../feedback/validator/feedback-validator";
import {accessTokenMiddleware} from "../../../middlewares/auth/accessToken-middleware";
import {likeValidation} from "../../feedback/validator/likes-validator";
import {postsController} from "../../composition-root";

export const postsRouter = Router({})

postsRouter.put('/:id/like-status', authAccessTokenMiddleware,likeValidation(), postsController.updateLikes.bind(postsController))
postsRouter.get('/',  accessTokenMiddleware,postsController.getPosts.bind(postsController))
postsRouter.get('/:id',accessTokenMiddleware, postsController.getPost.bind(postsController))
postsRouter.get('/:id/comments', accessTokenMiddleware, postsController.getCommentsByPost.bind(postsController))
postsRouter.post('/', authMiddleware, postValidation(), postsController.createPost.bind(postsController))
postsRouter.post('/:id/comments', authAccessTokenMiddleware, commentValidation(), postsController.createCommentByPost.bind(postsController))
postsRouter.put('/:id', authMiddleware, postValidation(), postsController.updatePost.bind(postsController))
postsRouter.delete('/:id',authMiddleware,  postsController.deletePost.bind(postsController))

