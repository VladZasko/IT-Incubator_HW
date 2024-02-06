import {AuthRepository} from "./auth/repositories/auth-repository";
import {AuthService} from "./auth/domain/auth-service";
import {UsersRepository} from "./users/repositories/user-repository";
import {UsersService} from "./users/domain/users-service";
import {AuthController} from "./auth/auth-controller";
import {BlogsRepository} from "./blogs/repositories/blogs-repository";
import {BlogsService} from "./blogs/domain/blogs-service";
import {BlogsController} from "./blogs/blogs-controller";
import {CommentsRepository} from "./feedback/repositories/feedback-repository";
import {CommentsService} from "./feedback/domain/feedback-service";
import {CommentsController} from "./feedback/feedback-controller";
import {PostsRepository} from "./posts/repositories/post-repository";
import {PostsService} from "./posts/domain/post-service";
import {PostsController} from "./posts/posts-controller";
import {SecurityDevicesController} from "./securityDevices/securityDevices-controller";
import {UsersController} from "./users/users-controller";

const blogRepository = new BlogsRepository()
const blogsService = new BlogsService(blogRepository)

const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)

const userRepository = new UsersRepository()
const usersService = new UsersService(userRepository)

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)

const postRepository = new PostsRepository()
const postsService = new PostsService(postRepository)

export const authController = new AuthController(authService,usersService)
export const blogsController = new BlogsController(blogsService)
export const commentsController = new CommentsController(commentsService)
export const postsController = new PostsController(postsService)
export const usersController = new UsersController(usersService)
export const securityDevicesController = new SecurityDevicesController()
