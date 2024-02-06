import {FeedbacksDBType} from "../../../db/types/feedbacks.types";
import {LikesStatus, FeedbackViewModel} from "../models/FeedbackViewModel";
import {WithId} from "mongodb";

export const feedbackQueryMapper = (feedbackDb:WithId<FeedbacksDBType>, userId?:string):FeedbackViewModel => {
    const isLiked = feedbackDb!.likesInfo.likes.includes(userId!);
    const isDisliked = feedbackDb!.likesInfo.dislikes.includes(userId!);

    let likeStatus = LikesStatus.None

    if(isLiked){
        likeStatus = LikesStatus.Like
    }
    if(isDisliked){
        likeStatus = LikesStatus.Dislike
    }

    return{
        id: feedbackDb._id.toString(),
        content: feedbackDb.content,
        commentatorInfo: {
            userId: feedbackDb.commentatorInfo.userId,
            userLogin: feedbackDb.commentatorInfo.userLogin
        },
        createdAt: feedbackDb.createdAt,
        likesInfo: {
            likesCount: feedbackDb.likesInfo?.likes?.length ?? 0,
            dislikesCount: feedbackDb.likesInfo?.dislikes?.length ?? 0,
            myStatus: likeStatus
        }
    }
}


export const feedbackMapper = (feedbackDb:WithId<FeedbacksDBType>) => {
    return{
        id: feedbackDb._id.toString(),
        content: feedbackDb.content,
        commentatorInfo: {
            userId: feedbackDb.commentatorInfo.userId,
            userLogin: feedbackDb.commentatorInfo.userLogin
        },
        createdAt: feedbackDb.createdAt,
        likesInfo: {
            likes: feedbackDb.likesInfo.likes,
            dislikes: feedbackDb.likesInfo.dislikes,
        },
        postId: feedbackDb.postId
    }
}
