import {commentatorInfoModel} from "../../../db/types/feedbacks.types";

export enum LikesStatus {
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
        myStatus: LikesStatus
    }
}

export type FeedbackViewModelGetAllComments = {
    pagesCount: number
    page: number,
    pageSize: number
    totalCount: number
    items: FeedbackViewModel[]
}
