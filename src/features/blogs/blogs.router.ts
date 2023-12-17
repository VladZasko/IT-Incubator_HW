import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {QueryBlogsModel} from "./models/QueryBlogsModule";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";
import {URIParamsBlogIdModel} from "./models/URIParamsBlogIdModule";
import {BlogsViewModel} from "./models/BlogsViewModel";
import {CreateBlogModel} from "./models/CreateBlogModel";
import {UpdateBlogModel} from "./models/UpdateBlogModule";
import {DBType} from "../../db/db";
import {blogValidation} from "./validator/blog-validator";
import {BlogRepository} from "./repositories/blog-repository";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";

export const getBlogsRoutes = (db: DBType) => {
    const router = express.Router()
    router.get('/', (req: RequestWithQuery<QueryBlogsModel>,
                        res: Response) => {
        const blogs = BlogRepository.getAllBlogs()

        res.send(blogs)
    })
    router.get('/:id', (req: RequestWithParams<URIParamsBlogIdModel>,
                            res: Response<BlogsViewModel>) => {
        const id = req.params.id

        const Blog = BlogRepository.getBlogById(id)

        if (!Blog){
            res.sendStatus(404)
        }

        res.send(Blog)
    })
    router.post('/', authMiddleware, blogValidation(), (req:RequestWithBody<CreateBlogModel>,
                         res: Response) => {

        const newBlog = BlogRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res
            .status(201)
            .send(newBlog)

    })

    router.put ('/:id', authMiddleware, blogValidation(), (req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>,
                             res: Response) => {
        const updateBlog = BlogRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)

        if (!updateBlog){
            res.sendStatus(404)
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    })
    router.delete('/:id',authMiddleware,  (req: RequestWithParams<URIParamsBlogIdModel>,
                               res) => {

        const deleteBlog = BlogRepository.deleteBlogById(req.params.id)
        if(!deleteBlog) {
            res.send(404)
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}