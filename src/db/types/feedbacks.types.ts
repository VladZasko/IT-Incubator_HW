import {commentatorInfoModel} from "../../features/feedback/models/FeedbackViewModel";

export type FeedbacksType = {
        id: string
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        postId: string

}

export type FeedbacksDBType = {
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        postId: string
}
