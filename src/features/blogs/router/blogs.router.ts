import {Router} from "express";
import {blogValidation} from "../validator/blog-validator";
import {authMiddleware} from "../../../middlewares/auth/auth-middleware";
import {postByIdValidation} from "../../posts/validator/post-validator";
import {blogsController} from "../composition-root";

export const blogsRouter = Router({})


blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id/posts', blogsController.getPostsByBlog.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))
blogsRouter.post('/:id/posts', authMiddleware, postByIdValidation(), blogsController.createPostByBlog.bind(blogsController))
blogsRouter.post('/', authMiddleware, blogValidation(), blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', authMiddleware, blogValidation(), blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog.bind(blogsController))
