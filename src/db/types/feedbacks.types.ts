import {commentatorInfoModel} from "../../features/feedback/models/FeedbackViewModel";

export type FeedbacksDBType = {
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        postId: string
}
