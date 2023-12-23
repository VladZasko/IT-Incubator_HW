import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {QueryBlogsModel} from "./models/QueryBlogsModule";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";
import {URIParamsBlogIdModel} from "./models/URIParamsBlogIdModule";
import {BlogsViewModel} from "./models/BlogsViewModel";
import {CreateBlogModel} from "./models/CreateBlogModel";
import {UpdateBlogModel} from "./models/UpdateBlogModule";
import {DBType} from "../../db/memory-db";
import {blogValidation} from "./validator/blog-validator";
import {BlogMemoryDbRepository} from "./repositories/blog-db-repository";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {ObjectId} from "mongodb";

export const getBlogsRoutes = (db: DBType) => {
    const router = express.Router()
    router.get('/', async (req: RequestWithQuery<QueryBlogsModel>,
                        res: Response) => {
        const blogs = await BlogMemoryDbRepository.getAllBlogs()

        res.send(blogs)
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>,
                            res: Response<BlogsViewModel>) => {
        const id = req.params.id

        // if(!ObjectId.isValid(id)){
        //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        //     return;
        // }

        const blog = await BlogMemoryDbRepository.getBlogById(id)

        if (!blog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(blog)
    })
    router.post('/', authMiddleware, blogValidation(),
        async (req:RequestWithBody<CreateBlogModel>,
               res: Response) => {

        const name = req.body.name;
        const description = req.body.description;
        const websiteUrl = req.body.websiteUrl;



        const newBlog =
        await BlogMemoryDbRepository
            .createBlog({name,description ,websiteUrl})

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newBlog)

    })

    router.put ('/:id', authMiddleware, blogValidation(),
        async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>,
               res: Response) => {
        const id = req.params.id

        // if(!ObjectId.isValid(id)){
        //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        //     return;
        // }

        const name= req.body.name
        const description= req.body.description
        const websiteUrl= req.body.websiteUrl

        const blog = await BlogMemoryDbRepository.getBlogById(id)

        if(!blog){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const updateBlog = await BlogMemoryDbRepository.updateBlog(id, {name, description, websiteUrl })

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

        // if(!ObjectId.isValid(id)){
        //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        //     return;
        // }

        const deleteBlog = await BlogMemoryDbRepository.deleteBlogById(id)
        if(!deleteBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}