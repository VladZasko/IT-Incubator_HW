import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";
import {DBType} from "../../db/memory-db";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {QueryPostsModel} from "./models/QueryPostsModule";
import {PostMemoryDbRepository} from "./repositories/post-db-repository";
import {URIParamsPostIdModel} from "./models/URIParamsPostIdModule";
import {PostsViewModel} from "./models/PostsViewModel";
import {postValidation} from "./validator/post-validator";
import {CreatePostModel} from "./models/CreatePostModel";
import {UpdatePostModel} from "./models/UpdatePostModule";
import {blogRepository} from "../blogs/repositories/blog-db-repository";
import {ObjectId} from "mongodb";

export const getPostsRoutes = (db: DBType) => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryPostsModel>,
                     res: Response) => {
        const sortData = {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }
        const posts = await PostMemoryDbRepository.getAllPosts(sortData)

        res.send(posts)
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>,
                        res: Response<PostsViewModel>) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await PostMemoryDbRepository.getPostById(id)

        if (!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(post)
    })
    router.post('/', authMiddleware, postValidation(), async (req:RequestWithBody<CreatePostModel>,
                                                        res: Response) => {
        const blog = await blogRepository.getBlogById(req.body.blogId)
        const blogName = blog!.name
        const createData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }

        const newPost = await PostMemoryDbRepository.createPost(createData, blogName)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newPost)

    })

    router.put ('/:id', authMiddleware, postValidation(), async (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>,
                                                           res: Response) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const upData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }

        const updatePost = await PostMemoryDbRepository.updatePost(id, upData)

        if (!updatePost){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    })
    router.delete('/:id',authMiddleware,  async (req: RequestWithParams<URIParamsPostIdModel>,
                                           res) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const deletePost = await PostMemoryDbRepository.deletePostById(id)
        if(!deletePost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}