import {PostsViewModel} from "../models/PostsViewModel";
import {FeedbacksModel, PostModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {LikesStatus, FeedbackViewModel} from "../../feedback/models/FeedbackViewModel";
import {FeedbacksType} from "../../../db/types/feedbacks.types";
import {NewestLikesType, PostType} from "../../../db/types/posts.types";

export class PostsRepository {
    async createPost(createData:PostType):Promise<PostsViewModel>  {

        const post = await PostModel.create({...createData})

        return {
            id: post.id,
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName: createData.blogName,
            createdAt: createData.createdAt,
            extendedLikesInfo: {
                likesCount: createData.likesInfo.likes.length,
                dislikesCount: createData.likesInfo.likes.length,
                myStatus: LikesStatus.None,
                newestLikes:[],
            }
        }
    }
    async createCommentByPost(createData:FeedbacksType):Promise<FeedbackViewModel>  {

        const comment = await FeedbacksModel.create({...createData})

        return {
            id: comment.id,
            content: createData.content,
            commentatorInfo: {
                userId: createData.commentatorInfo.userId,
                userLogin: createData.commentatorInfo.userLogin
            },
            createdAt: createData.createdAt,
            likesInfo: {
                likesCount: createData.likesInfo.likes.length,
                dislikesCount: createData.likesInfo.dislikes.length,
                myStatus: LikesStatus.None
            }
        }
    }
    async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
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
    async updateLike(id: string, likesData: NewestLikesType,likeStatusData:LikesStatus): Promise<boolean> {
        const post = await PostModel.findById({_id: new ObjectId(id)})

        const isLiked = post!.likesInfo.likes.some(obj => obj.userId === likesData.userId);
        const isDisliked = post!.likesInfo.dislikes.some(obj => obj.userId === likesData.userId);

        if (likeStatusData === LikesStatus.Like) {
            if (isLiked) {
                return true
            } else {
                post!.likesInfo.likes.push({...likesData});

                if (isDisliked) {
                    post!.likesInfo.dislikes = post!.likesInfo.dislikes.filter((dislike: any) => dislike.userId !== likesData.userId);
                }
            }
        } else if (likeStatusData === LikesStatus.Dislike) {
            if (isDisliked) {
                return true
            } else {
                post!.likesInfo.dislikes.push(likesData);

                if (isLiked) {
                    post!.likesInfo.likes = post!.likesInfo.likes.filter((likes: any) => likes.userId !== likesData.userId);
                }
            }
        } else if (likeStatusData === LikesStatus.None) {
            if (isDisliked) {
                post!.likesInfo.dislikes = post!.likesInfo.dislikes.filter((dislikes: any) => dislikes.userId !== likesData.userId);
            } else if (isLiked) {
                post!.likesInfo.likes = post!.likesInfo.likes.filter((likes: any) => likes.userId !== likesData.userId);
            } else {
                return true
            }
        } else{
            return false
        }

        await post!.save();

        return true;
    }
    async deletePostById(id: string): Promise<boolean> {
        const foundPost = await PostModel.deleteOne({_id:new ObjectId(id)})

        return !!foundPost.deletedCount

    }
}