import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../utils/types";
import {QueryBlogsModel, QueryPostByBlogIdModel} from "./models/input/QueryBlogsModule";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {URIParamsBlogIdModel} from "./models/input/URIParamsBlogIdModule";
import {BlogsViewModel, BlogsViewModelGetAllBlogs} from "./models/output/BlogsViewModel";
import {CreateBlogServiceModel, CreatePostBlogModel} from "./models/input/CreateBlogModel";
import {UpdateBlogModel} from "./models/input/UpdateBlogModule";
import {blogValidation} from "./validator/blog-validator";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {ObjectId} from "mongodb";
import {postByIdValidation} from "../posts/validator/post-validator";
import {blogQueryRepository} from "./repositories/blog-query-repository";
import {blogService} from "./domain/blog-service";
import {postQueryRepository} from "../posts/repositories/post-query-repository";



export const getBlogsRoutes = () => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryBlogsModel>,
                        res: Response) => {

        const sortData:QueryBlogsModel = {
            searchNameTerm: req.query.searchNameTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const blogs:BlogsViewModelGetAllBlogs = await blogQueryRepository.getAllBlogs(sortData)

        res.send(blogs)
    })
    router.get('/:id/posts',  async (req: RequestWithParamsAndQuery<URIParamsBlogIdModel,QueryPostByBlogIdModel>,
                              res: Response) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await blogQueryRepository.getBlogById(id)

        if(!blog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const posts = await blogQueryRepository.getPostsByBlogId(id,sortData)

        res.send(posts)
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>,
                            res: Response<BlogsViewModel>) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await blogQueryRepository.getBlogById(id)

        if (!blog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(blog)
    })
    router.post('/:id/posts', authMiddleware, postByIdValidation(),
        async (req:RequestWithParamsAndBody<{id:string},CreatePostBlogModel>,
               res: Response) => {
            const createData = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
            }

            const blogId = req.params.id

            const blog = await blogQueryRepository.getBlogById(blogId)

            if(!blog){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const newPostId = await blogService.createPostBlog(blogId,createData)

            const post = await postQueryRepository.getPostById(newPostId)

            if(!post){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(post)

        })
    router.post('/', authMiddleware, blogValidation(),
        async (req:RequestWithBody<CreateBlogServiceModel>,
               res: Response) => {

        const createData = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        const newBlog = await blogService.createBlog(createData)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newBlog)

    })

    router.put ('/:id', authMiddleware, blogValidation(),
        async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>,
               res: Response) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        const blog = await blogQueryRepository.getBlogById(id)

        if(!blog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const updateBlog = await blogService.updateBlog(id, updateData)

        if (!updateBlog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    })
    router.delete('/:id',authMiddleware,
        async (req: RequestWithParams<URIParamsBlogIdModel>,
               res) => {

        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const deleteBlog = await blogService.deleteBlogById(id)
        if(!deleteBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}