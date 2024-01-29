import {PostsViewModel} from "../models/PostsViewModel";
import {FeedbacksModel, PostModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreatePostReposModel} from "../models/CreatePostServiceModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {CreateFeedbackReposModel} from "../../feedback/models/CreateFeedbackModel";
import {FeedbackViewModel} from "../../feedback/models/FeedbackViewModel";

export class postRepository {
    static async createPost(createData:CreatePostReposModel):Promise<PostsViewModel>  {

        const post = await PostModel.create({...createData})

        return {
            ...createData,
            id:post.id
        }
    }
    static async createCommentByPost(createData:CreateFeedbackReposModel):Promise<FeedbackViewModel>  {

        const comment = await FeedbacksModel.create({...createData})

        return {
            id: comment.id,
            content: createData.content,
            commentatorInfo: {
                userId: createData.commentatorInfo.userId,
                userLogin: createData.commentatorInfo.userLogin
            },
            createdAt: createData.createdAt
        }
    }
    static async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        const foundPost = await PostModel.updateOne({_id:new ObjectId(id)}, {
            $set:{
                title : upData.title,
                shortDescription: upData.shortDescription,
                content: upData.content,
                blogId: upData.blogId
            }
        })
        return !!foundPost.matchedCount;
    }
    static async deletePostById(id: string): Promise<boolean> {
        const foundPost = await PostModel.deleteOne({_id:new ObjectId(id)})

        return !!foundPost.deletedCount

    }
}