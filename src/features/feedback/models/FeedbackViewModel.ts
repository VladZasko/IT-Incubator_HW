import {commentatorInfoModel} from "../../../db/types/feedbacks.types";

export enum FeedbackStatus {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None',
}

export type FeedbackViewModel = {
    id: string
    content: string
    commentatorInfo: commentatorInfoModel
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: FeedbackStatus
    }
}

export type FeedbackViewModelGetAllComments = {
    pagesCount: number
    page: number,
    pageSize: number
    totalCount: number
    items: FeedbackViewModel[]
}
