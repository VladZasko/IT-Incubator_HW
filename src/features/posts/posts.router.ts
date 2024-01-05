import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../utils/types";
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
import {authTokenMiddleware} from "../../middlewares/auth/auth-token-middleware";
import {commentValidation} from "../feedback/validator/feedback-validator";
import {CreateFeedbackModel} from "../feedback/models/CreateFeedbackModel";
import {userQueryRepository} from "../users/repositories/user-query-repository";
import {FeedbackViewModel, FeedbackViewModelGetAllComments} from "../feedback/models/FeedbackViewModel";

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
    router.get('/:id/comments', async (req: RequestWithParamsAndQuery<URIParamsPostIdModel,QueryPostsModel>,
                              res: Response<FeedbackViewModelGetAllComments>) => {
        const postId = req.params.id

        if(!ObjectId.isValid(postId)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await postQueryRepository.getPostById(postId)

        if(!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const sortData = {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }

        const comment = await postQueryRepository.getCommentByPostId(postId,sortData)

        res.send(comment)
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

    router.post('/:id/comments',
        authTokenMiddleware, commentValidation(),
        async (
            req:RequestWithParamsAndBody<URIParamsPostIdModel,CreateFeedbackModel>,
            res: Response) => {

        const user = await userQueryRepository.getUserById(req.user!.id)

        if(!user){
            res.status(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const createData = {
            userId: req.user!.id,
            content: req.body.content,
            userLogin: user!.login
        }

        const newComment = await postService.createCommentByPost(createData)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newComment)

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