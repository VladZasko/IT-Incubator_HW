import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../utils/types";
import {Response} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../../utils/utils";
import {postQueryRepository} from "../posts/repositories/post-query-repository";
import {QueryPostsModel} from "./models/QueryPostsModule";
import {URIParamsPostIdModel} from "./models/URIParamsPostIdModule";
import {PostsViewModel} from "./models/PostsViewModel";
import {FeedbackViewModelGetAllComments} from "../feedback/models/FeedbackViewModel";
import {CreatePostServiceModel} from "./models/CreatePostServiceModel";
import {blogQueryRepository} from "../blogs/repositories/blog-query-repository";
import {PostsService} from "./domain/post-service";
import {CreateFeedbackModel} from "../feedback/models/CreateFeedbackModel";
import {UpdatePostModel} from "./models/UpdatePostModule";
import {URIParamsFeedbackIdModule} from "../feedback/models/URIParamsFeedbackIdModule";
import {UpdateLikesModule} from "../feedback/models/UpdateLikesModule";

export class PostsController {
    constructor(protected postsService: PostsService) {
    }

    async updateLikes(req: RequestWithParamsAndBody<URIParamsFeedbackIdModule, UpdateLikesModule>,
                      res: Response) {

        const id = req.params.id

        const likeStatus = req.body.likeStatus

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

        const updateLikeStatus = await this.postsService.updateLikeStatus(id, upData, likeStatus)

        if (!updateLikeStatus) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async getPosts(req: RequestWithQuery<QueryPostsModel>, res: Response) {
        const likeStatusData = req.user?.id
        const sortData = {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }
        const posts = await postQueryRepository.getAllPosts(sortData, likeStatusData)

        res.send(posts)

    }

    async getPost(req: RequestWithParams<URIParamsPostIdModel>,
                  res: Response<PostsViewModel>) {
        const likeStatusData = req.user?.id
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await postQueryRepository.getPostById(id, likeStatusData)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.send(post)
    }

    async getCommentsByPost(req: RequestWithParamsAndQuery<URIParamsPostIdModel, QueryPostsModel>,
                            res: Response<FeedbackViewModelGetAllComments>) {
        const likeStatusData = req.user?.id

        const postId = req.params.id

        if (!ObjectId.isValid(postId)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await postQueryRepository.getPostById(postId)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const sortData = {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }

        const comment = await postQueryRepository.getCommentByPostId(postId, sortData, likeStatusData)

        res.send(comment)
    }

    async createPost(req: RequestWithBody<CreatePostServiceModel>,
                     res: Response) {
        const blog = await blogQueryRepository.getBlogById(req.body.blogId)
        const blogName = blog!.name
        const createData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }

        const newPost = await this.postsService.createPost(createData, blogName)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newPost)

    }

    async createCommentByPost(
        req: RequestWithParamsAndBody<URIParamsPostIdModel, CreateFeedbackModel>,
        res: Response) {

        const post = await postQueryRepository.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const createData = {
            userId: req.user!.id,
            content: req.body.content,
            userLogin: req.user!.login,
        }

        const newComment = await this.postsService.createCommentByPost(createData, post.id)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newComment)

    }

    async updatePost(req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>,
                     res: Response) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const upData = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        }

        const updatePost = await this.postsService.updatePost(id, upData)

        if (!updatePost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async deletePost(req: RequestWithParams<URIParamsPostIdModel>,
                     res: Response) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const deletePost = await this.postsService.deletePostById(id)
        if (!deletePost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

}