import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../utils/types";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {QueryPostsModel} from "./models/QueryPostsModule";
import {URIParamsPostIdModel} from "./models/URIParamsPostIdModule";
import {PostsViewModel} from "./models/PostsViewModel";
import {postValidation} from "./validator/post-validator";
import {CreatePostServiceModel} from "./models/CreatePostServiceModel";
import {UpdatePostModel} from "./models/UpdatePostModule";
import {ObjectId} from "mongodb";
import {blogQueryRepository} from "../blogs/repositories/blog-query-repository";
import {postQueryRepository} from "./repositories/post-query-repository";
import {postService} from "./domain/post-service";

export const getPostsRoutes = () => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryPostsModel>,
                     res: Response) => {
        const sortData = {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }
        const posts = await postQueryRepository.getAllPosts(sortData)

        res.send(posts)
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>,
                        res: Response<PostsViewModel>) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await postQueryRepository.getPostById(id)

        if (!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(post)
    })
    router.post('/', authMiddleware, postValidation(), async (req:RequestWithBody<CreatePostServiceModel>,
                                                        res: Response) => {
        const blog = await blogQueryRepository.getBlogById(req.body.blogId)
        const blogName = blog!.name
        const createData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }

        const newPost = await postService.createPost(createData, blogName)

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

        const updatePost = await postService.updatePost(id, upData)

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

        const deletePost = await postService.deletePostById(id)
        if(!deletePost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}