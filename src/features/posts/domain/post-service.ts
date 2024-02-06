import {PostsViewModel} from "../models/PostsViewModel";
import {CreatePostServiceModel} from "../models/CreatePostServiceModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {postRepository} from "../repositories/post-repository";
import {CreateFeedbackServiceModel} from "../../feedback/models/CreateFeedbackModel";
import {FeedbackViewModel, LikesStatus} from "../../feedback/models/FeedbackViewModel";
import {feedbackRepository} from "../../feedback/repositories/feedback-repository";

export class postService {
    static async createPost(createData:CreatePostServiceModel, blogName:string):Promise<PostsViewModel>  {
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

        return await postRepository.createPost(newPost)
    }
    static async createCommentByPost(createData:CreateFeedbackServiceModel, postId: string):Promise<FeedbackViewModel>  {
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

        return await postRepository.createCommentByPost(newComment)
    }
    static async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        return await postRepository.updatePost(id, upData)
    }
    static async updateLikeStatus(id: string, upData: any, likeStatus:LikesStatus): Promise<boolean> {
        const likesData = {
            addedAt: new Date().toISOString(),
            userId: upData.userId,
            login: upData.login
        }
        return await postRepository.updateLike(id, likesData,likeStatus)
    }
    static async deletePostById(id: string): Promise<boolean> {
        return await postRepository.deletePostById(id)
    }
}