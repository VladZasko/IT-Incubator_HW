import {FeedbacksDBType} from "../../../db/types/feedbacks.types";
import {FeedbackViewModel} from "../models/FeedbackViewModel";
import {WithId} from "mongodb";

export const feedbackMapper = (feedbackDb:WithId<FeedbacksDBType>):FeedbackViewModel => {
    return{
        id: feedbackDb._id.toString(),
        content: feedbackDb.content,
        commentatorInfo: {
            userId: feedbackDb.commentatorInfo.userId,
            userLogin: feedbackDb.commentatorInfo.userLogin
        },
        createdAt: feedbackDb.createdAt
    }
}