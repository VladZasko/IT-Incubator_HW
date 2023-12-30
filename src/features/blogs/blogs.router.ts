import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../types";
import {QueryBlogsModel, QueryPostByBlogIdModel} from "./models/input/QueryBlogsModule";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";
import {URIParamsBlogIdModel} from "./models/input/URIParamsBlogIdModule";
import {BlogsViewModel, BlogsViewModelGetAllBlogs} from "./models/output/BlogsViewModel";
import {CreateBlogModel, CreatePostBlogModel} from "./models/input/CreateBlogModel";
import {UpdateBlogModel} from "./models/input/UpdateBlogModule";
import {DBType} from "../../db/memory-db";
import {blogValidation} from "./validator/blog-validator";
import {BlogRepository} from "./repositories/blog-db-repository";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {ObjectId} from "mongodb";
import {PostMemoryDbRepository} from "../posts/repositories/post-db-repository";
import {postByIdValidation} from "../posts/validator/post-validator";



export const getBlogsRoutes = (db: DBType) => {
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

        const blogs:BlogsViewModelGetAllBlogs = await BlogRepository.getAllBlogs(sortData)

        res.send(blogs)
    })
    router.get('/:id/posts',  async (req: RequestWithParamsAndQuery<URIParamsBlogIdModel,QueryPostByBlogIdModel>,
                              res: Response) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await BlogRepository.getBlogById(id)

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

        const posts = await BlogRepository.getPostsByBlogId(id,sortData)

        res.send(posts)
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>,
                            res: Response<BlogsViewModel>) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await BlogRepository.getBlogById(id)

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

            const blog = await BlogRepository.getBlogById(blogId)

            if(!blog){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const newPostId = await BlogRepository.createPostBlog(blogId,createData)

            const post = await PostMemoryDbRepository.getPostById(newPostId)

            if(!post){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(post)

        })
    router.post('/', authMiddleware, blogValidation(),
        async (req:RequestWithBody<CreateBlogModel>,
               res: Response) => {

        const createData = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        const newBlog = await BlogRepository.createBlog(createData)

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

        const blog = await BlogRepository.getBlogById(id)

        if(!blog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const updateBlog = await BlogRepository.updateBlog(id, updateData)

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

        const deleteBlog = await BlogRepository.deleteBlogById(id)
        if(!deleteBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}