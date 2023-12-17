import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";

import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";

import {DBType} from "../../db/db";

import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {QueryPostsModel} from "./models/QueryPostsModule";
import {PostRepository} from "./repositories/post-repository";
import {URIParamsPostIdModel} from "./models/URIParamsPostIdModule";
import {PostsViewModel} from "./models/PostsViewModel";
import {postValidation} from "./validator/post-validator";
import {CreatePostModel} from "./models/CreatePostModel";
import {UpdatePostModel} from "./models/UpdatePostModule";

export const getPostsRoutes = (db: DBType) => {
    const router = express.Router()
    router.get('/', (req: RequestWithQuery<QueryPostsModel>,
                     res: Response) => {
        const posts = PostRepository.getAllPosts()

        res.send(posts)
    })
    router.get('/:id', (req: RequestWithParams<URIParamsPostIdModel>,
                        res: Response<PostsViewModel>) => {
        const id = req.params.id

        const Post = PostRepository.getPostById(id)

        if (!Post){
            res.sendStatus(404)
        }

        res.send(Post)
    })
    router.post('/', authMiddleware, postValidation(), (req:RequestWithBody<CreatePostModel>,
                                                        res: Response) => {

        const newPost = PostRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        res
            .status(201)
            .send(newPost)

    })

    router.put ('/:id', authMiddleware, postValidation(), (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>,
                                                           res: Response) => {
        const updatePost = PostRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        if (!updatePost){
            res.sendStatus(404)
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    })
    router.delete('/:id',authMiddleware,  (req: RequestWithParams<URIParamsPostIdModel>,
                                           res) => {

        const deletePost = PostRepository.deletePostById(req.params.id)
        if(!deletePost) {
            res.send(404)
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}