import {BlogsViewModel} from "../../blogs/models/output/BlogsViewModel";

export type commentatorInfoModel = {
    userId: string
    userLogin: string
}

export type FeedbackViewModel = {
    id: string
    content: string
    commentatorInfo: commentatorInfoModel
    createdAt: string
}

export type FeedbackViewModelGetAllComments = {
    pagesCount: number
    page: number,
    pageSize: number
    totalCount: number
    items: FeedbackViewModel[]
}
