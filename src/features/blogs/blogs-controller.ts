import {BlogsService} from "./domain/blogs-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../utils/types";
import {QueryBlogsModel, QueryPostByBlogIdModel} from "./models/input/QueryBlogsModule";
import {Response} from "express";
import {BlogsViewModel, BlogsViewModelGetAllBlogs} from "./models/output/BlogsViewModel";
import {blogQueryRepository} from "./repositories/blog-query-repository";
import {URIParamsBlogIdModel} from "./models/input/URIParamsBlogIdModule";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../../utils/utils";
import {CreateBlogModel, CreatePostBlogModel} from "./models/input/CreateBlogModel";
import {postQueryRepository} from "../posts/repositories/post-query-repository";
import {UpdateBlogModel} from "./models/input/UpdateBlogModule";
import {inject, injectable} from "inversify";
import {mapServiceCodeToHttpStatus} from "./mappers/status-code-mapper";

@injectable()
export class BlogsController {
    constructor(/*@inject(BlogsService)*/ protected blogsService: BlogsService) {
    }

    async getBlogs(req: RequestWithQuery<QueryBlogsModel>, res: Response) {
        const sortData: QueryBlogsModel = {
            searchNameTerm: req.query.searchNameTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const blogs: BlogsViewModelGetAllBlogs = await blogQueryRepository.getAllBlogs(sortData)

        res.send(blogs)

    }

    async getPostsByBlog(req: RequestWithParamsAndQuery<URIParamsBlogIdModel, QueryPostByBlogIdModel>, res: Response) {
        const likeStatusData = req.user?.id

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await blogQueryRepository.getBlogById(id)

        if (!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const posts = await blogQueryRepository.getPostsByBlogId(id, sortData,likeStatusData)

        res.send(posts)
    }

    async getBlog(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsViewModel>) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await blogQueryRepository.getBlogById(id)

        if (!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(blog)

    }

    async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response) {

        const createDTO:CreateBlogModel = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        const newBlog = await this.blogsService.createBlog(createDTO)

        let result
        if (newBlog.data){
            result = newBlog.data
        } else {
            result = newBlog.errorMessage
        }

        res
            .status(mapServiceCodeToHttpStatus(newBlog.resultCode))
            .send(result)

    }

    async createPostByBlog(req: RequestWithParamsAndBody<{ id: string }, CreatePostBlogModel>, res: Response) {
        const createDTO = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        }

        const blogId = req.params.id

        const blog = await blogQueryRepository.getBlogById(blogId)

        if (!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const newPostId = await this.blogsService.createPostBlog(blogId, createDTO)

        const post = await postQueryRepository.getPostById(newPostId)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(post)

    }


    async updateBlog(req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>, res: Response) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        const blog = await blogQueryRepository.getBlogById(id)

        if (!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const updateBlog = await this.blogsService.updateBlog(id, updateData)

        if (!updateBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }

    async deleteBlog(req: RequestWithParams<URIParamsBlogIdModel>, res: Response) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const deleteBlog = await this.blogsService.deleteBlogById(id)
        if (!deleteBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

}