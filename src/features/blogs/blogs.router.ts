import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {QueryBlogsModel} from "./models/QueryBlogsModule";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";
import {URIParamsBlogIdModel} from "./models/URIParamsBlogIdModule";
import {BlogsViewModel} from "./models/BlogsViewModel";
import {CreateBlogModel} from "./models/CreateBlogModel";
import {UpdateBlogModel} from "./models/UpdateBlogModule";
import {DBType, ErrorType} from "../../db/db";
import {URIParamsBlogsIdModel} from "../videos/models/URIParamsVideoIdModule";
import {BlogType} from "../../db/blogs.types";

export const getBlogsRoutes = (db: DBType) => {
    const router = express.Router()
    router.get('/', (req: RequestWithQuery<QueryBlogsModel>,
                        res: Response) => {
        res
            .status(HTTP_STATUSES.OK_200)
            .send(db.blogs)
    })
    router.get('/:id', (req: RequestWithParams<URIParamsBlogsIdModel>,
                            res: Response<BlogsViewModel>) => {
        const id = req.params.id

        const blog = db.blogs.find(v => v.id === id)

        if(!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.send({
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        })
    })
    router.post('/', (req:RequestWithBody<CreateBlogModel>,
                         res: Response) => {
        let errors: ErrorType = {
            errorsMessages: []
        }
        let {name, description, websiteUrl} = req.body

        if (!name || !name.trim() || name.trim().length > 15) {
            errors.errorsMessages.push({message:'Invalid name', field:'name'})
        }
        if (!description || !description.trim() || description.trim().length > 500) {
            errors.errorsMessages.push({message:'Invalid description', field:'description'})
        }
        if (!websiteUrl || !websiteUrl.trim() || websiteUrl.trim().length > 100) {
            errors.errorsMessages.push({message:'Invalid websiteUrl', field:'websiteUrl'})
        }

        if (errors.errorsMessages.length){
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
            return;
        }

        const newBlog: BlogType  = {
            id: (new Date()).toISOString(),
            name,
            description,
            websiteUrl

        }

        db.blogs.push(newBlog)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newBlog)
    })
    router.put ('/:id', (req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>,
                             res: Response) => {
        let errors: ErrorType = {
            errorsMessages: []
        }
        let {name, description, websiteUrl} = req.body

        let foundBlog = db.blogs.find(i => i.id === req.params.id);
        if(!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (!name || !name.trim() || name.trim().length > 15) {
            errors.errorsMessages.push({message:'Invalid name', field:'name'})
        }
        if (!description || !description.trim() || description.trim().length > 500) {
            errors.errorsMessages.push({message:'Invalid description', field:'description'})
        }
        if (!websiteUrl || !websiteUrl.trim() || websiteUrl.trim().length > 100) {
            errors.errorsMessages.push({message:'Invalid websiteUrl', field:'websiteUrl'})
        }
        if (errors.errorsMessages.length){
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
            return;
        }

        foundBlog.name = req.body.name;
        foundBlog.description = req.body.description;
        foundBlog.websiteUrl = req.body.websiteUrl;

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    })
    router.delete('/:id', (req: RequestWithParams<URIParamsBlogIdModel>,
                               res) => {
        let foundBlog = db.blogs.find(i => i.id === req.params.id);
        if(!foundBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        db.blogs = db.blogs.filter(c => c.id !== req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}