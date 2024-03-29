import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {BlogsRepository} from "../../blogs/repositories/blogs-repository";
import * as wasi from "wasi";
import {blogQueryRepository} from "../../blogs/repositories/blog-query-repository";

export const titleValidation = body('title').isString().trim().isLength({
    min:1,
    max:30
}).withMessage('Incorrect title!')
export const shortDescriptionValidation = body('shortDescription').isString().trim().isLength({
    min:1,
    max:100
}).withMessage('Incorrect shortDescription!')
export const contentValidation = body('content').isString().trim().isLength({
    min:1,
    max:1000
}).withMessage('Incorrect content')
export const blogIdValidation = body('blogId').isString().trim()
    .custom(async (value) => {
    const blog = await blogQueryRepository.getBlogById(value)
        if (!blog) {
            throw Error('Incorrect blogId')
        }
        return true
}).withMessage('Incorrect blogId')
export const postValidation = () => [ shortDescriptionValidation, titleValidation, contentValidation, blogIdValidation,inputValidation]

export const postByIdValidation = () => [ shortDescriptionValidation, titleValidation, contentValidation, inputValidation]