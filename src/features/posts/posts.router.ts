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
import {authAccessTokenMiddleware} from "../../middlewares/auth/auth-accessToken-middleware";
import {commentValidation} from "../feedback/validator/feedback-validator";
import {CreateFeedbackModel} from "../feedback/models/CreateFeedbackModel";
import {userQueryRepository} from "../users/repositories/user-query-repository";
import {FeedbackViewModel, FeedbackViewModelGetAllComments} from "../feedback/models/FeedbackViewModel";
import {accessTokenMiddleware} from "../../middlewares/auth/accessToken-middleware";
import {likeValidation} from "../feedback/validator/likes-validator";
import {URIParamsFeedbackIdModule} from "../feedback/models/URIParamsFeedbackIdModule";
import {UpdateLikesModule} from "../feedback/models/UpdateLikesModule";
import {feedbackRepository} from "../feedback/repositories/feedback-repository";
import {feedbackService} from "../feedback/domain/feedback-service";

export const getPostsRoutes = () => {
    const router = express.Router()

    router.put('/:id/like-status',authAccessTokenMiddleware,likeValidation(),
        async (req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateLikesModule>,
               res: Response) => {

            const id = req.params.id

            const likeStatus= req.body.likeStatus

            const upData = {
                userId: req.user!.id,
                login: req.user!.login
            }

            if (!ObjectId.isValid(id)) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            const post = await postQueryRepository.getPostById(id)

            if (!post) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return;
            }

            const updateLikeStatus = await postService.updateLikeStatus(id, upData,likeStatus)

            if (!updateLikeStatus) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        })

    router.get('/', accessTokenMiddleware,async (req: RequestWithQuery<QueryPostsModel>,
                     res: Response) => {
        const likeStatusData = req.user?.id
        const sortData = {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }
        const posts = await postQueryRepository.getAllPosts(sortData,likeStatusData)

        res.send(posts)
    })
    router.get('/:id',accessTokenMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>,
                        res: Response<PostsViewModel>) => {
        const likeStatusData = req.user?.id
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await postQueryRepository.getPostById(id,likeStatusData)

        if (!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(post)
    })
    router.get('/:id/comments', accessTokenMiddleware, async (req: RequestWithParamsAndQuery<URIParamsPostIdModel,QueryPostsModel>,
                              res: Response<FeedbackViewModelGetAllComments>) => {
        const likeStatusData = req.user?.id

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

        const comment = await postQueryRepository.getCommentByPostId(postId,sortData,likeStatusData)

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
        authAccessTokenMiddleware, commentValidation(),
        async (
            req:RequestWithParamsAndBody<URIParamsPostIdModel,CreateFeedbackModel>,
            res: Response) => {

        const post = await postQueryRepository.getPostById(req.params.id)

        if(!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const createData = {
            userId: req.user!.id,
            content: req.body.content,
            userLogin: req.user!.login,
        }

        const newComment = await postService.createCommentByPost(createData,post.id)

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