import {commentatorInfoModel} from "../../features/feedback/models/FeedbackViewModel";
import {WithId} from "mongodb";

export type FeedbacksDBType = WithId<{
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        postId: string
}>
