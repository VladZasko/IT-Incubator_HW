import "reflect-metadata";
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
import {SecurityDevicesQueryRepository} from "./securityDevices/repositories/securityDevices-query-repository";
import {SecurityDevicesRepository} from "./securityDevices/repositories/securityDevices-repository";
import {SecurityDevicesService} from "./securityDevices/domain/securityDevices-service";
import {Container} from "inversify";



const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)

const userRepository = new UsersRepository()
const usersService = new UsersService(userRepository)

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)

const postRepository = new PostsRepository()
const postsService = new PostsService(postRepository)

const securityDevicesRepository = new SecurityDevicesRepository()
const securityDevicesQueryRepository = new SecurityDevicesQueryRepository()
const securityDevicesService = new SecurityDevicesService(securityDevicesRepository)

export const authController = new AuthController(authService, usersService)
export const commentsController = new CommentsController(commentsService)
export const postsController = new PostsController(postsService)
export const usersController = new UsersController(usersService)
export const securityDevicesController = new SecurityDevicesController(securityDevicesService, securityDevicesRepository, securityDevicesQueryRepository)


export const container = new Container();

container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);