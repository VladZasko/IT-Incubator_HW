
import {FeedbacksModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {UpdateFeedbackModuleModel} from "../models/UpdateFeedbackModule";
import {LikesStatus, FeedbackViewModel} from "../models/FeedbackViewModel";
import {feedbackMapper, feedbackQueryMapper} from "../mappers/mappers";


export class feedbackRepository {

    static async getCommentById(id: string): Promise<any | null> {
        const comment = await FeedbacksModel.findById({_id: new ObjectId(id)})

        if (!comment){
            return null
        }
        return feedbackMapper(comment)
    }
    static async updatePost(id: string, upData: UpdateFeedbackModuleModel): Promise<boolean> {
        const foundComment = await FeedbacksModel.updateOne({_id:new ObjectId(id)}, {
            $set:{
                content: upData.content
            }
        })
        return !!foundComment.matchedCount;
    }
    static async updateLike(id: string, upData: any): Promise<boolean> {
        const comment = await FeedbacksModel.findById({_id: new ObjectId(id)})

        const isLiked = comment!.likesInfo.likes.includes(upData.userId);
        const isDisliked = comment!.likesInfo.dislikes.includes(upData.userId);

        if (upData.likeStatus === LikesStatus.Like) {
            if (isLiked) {
                return true
            } else {
                comment!.likesInfo.likes.push(upData.userId);

                if (isDisliked) {
                    comment!.likesInfo.dislikes = comment!.likesInfo.dislikes.filter((id: string) => id !== upData.userId);
                }
            }
        } else if (upData.likeStatus === LikesStatus.Dislike) {
            if (isDisliked) {
                return true
            } else {
                comment!.likesInfo.dislikes.push(upData.userId);

                if (isLiked) {
                    comment!.likesInfo.likes = comment!.likesInfo.likes.filter((id: string) => id !== upData.userId);
                }
            }
        } else if (upData.likeStatus === LikesStatus.None) {
            if (isDisliked) {
                comment!.likesInfo.dislikes = comment!.likesInfo.dislikes.filter((id: string) => id !== upData.userId);
            } else if (isLiked) {
                comment!.likesInfo.likes = comment!.likesInfo.likes.filter((id: string) => id !== upData.userId);
            } else {
                return true
            }
        } else{
                return false
            }

        await comment!.save();

        return true;
    }
    static async deleteCommentById(id: string): Promise<boolean> {
        const foundComment = await FeedbacksModel.deleteOne({_id:new ObjectId(id)})

        return !!foundComment.deletedCount

    }
}