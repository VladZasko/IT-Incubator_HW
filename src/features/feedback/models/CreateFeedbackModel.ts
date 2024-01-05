import {commentatorInfoModel} from "./FeedbackViewModel";

export type CreateFeedbackModel = {
    /**
     * Post title, shortDescription, content, blogId
     */
    content: string
}
export type CreateFeedbackServiceModel = {
    /**
     * Post title, shortDescription, content, blogId
     */
    content: string
    userId: string
    userLogin: string
}

export type CreateFeedbackReposModel = {
    /**
     * Post title, shortDescription, content, blogId
     */
    content: string
    commentatorInfo: commentatorInfoModel
    createdAt: string
}
