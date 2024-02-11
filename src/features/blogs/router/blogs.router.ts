import {Router} from "express";
import {blogValidation} from "../validator/blog-validator";
import {authMiddleware} from "../../../middlewares/auth/auth-middleware";
import {postByIdValidation} from "../../posts/validator/post-validator";
import {accessTokenMiddleware} from "../../../middlewares/auth/accessToken-middleware";
import {BlogsController} from "../blogs-controller";
import {container} from "../../composition-root";

//const blogsController = ioc.getInstance<BlogsController>(BlogsController)
const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id/posts',accessTokenMiddleware, blogsController.getPostsByBlog.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))
blogsRouter.post('/:id/posts', authMiddleware, postByIdValidation(), blogsController.createPostByBlog.bind(blogsController))
blogsRouter.post('/', authMiddleware, blogValidation(), blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', authMiddleware, blogValidation(), blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog.bind(blogsController))

