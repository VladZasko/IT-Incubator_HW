import {PostsViewModel} from "../models/PostsViewModel";
import {CreatePostServiceModel} from "../models/CreatePostServiceModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {PostsRepository} from "../repositories/post-repository";
import {CreateFeedbackServiceModel} from "../../feedback/models/CreateFeedbackModel";
import {FeedbackViewModel, LikesStatus} from "../../feedback/models/FeedbackViewModel";

export class PostsService {

    constructor(protected postsRepository:PostsRepository) {}
    async createPost(createData:CreatePostServiceModel, blogName:string):Promise<PostsViewModel>  {
        const newPost = {
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
            likesInfo: {
                likes: [],
                dislikes: [],
            }
        }

        return await this.postsRepository.createPost(newPost)
    }
    async createCommentByPost(createData:CreateFeedbackServiceModel, postId: string):Promise<FeedbackViewModel>  {
        const newComment = {
            content: createData.content,
            commentatorInfo: {
                userId: createData.userId,
                userLogin: createData.userLogin
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likes: [],
                dislikes: [],
            },
            postId: postId
        }

        return await this.postsRepository.createCommentByPost(newComment)
    }
    async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        return await this.postsRepository.updatePost(id, upData)
    }
    async updateLikeStatus(id: string, upData: any, likeStatus:LikesStatus): Promise<boolean> {
        const likesData = {
            addedAt: new Date().toISOString(),
            userId: upData.userId,
            login: upData.login
        }
        return await this.postsRepository.updateLike(id, likesData,likeStatus)
    }
    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
}