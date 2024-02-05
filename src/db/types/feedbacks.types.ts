import {WithId} from "mongodb";

export type commentatorInfoModel = {
        userId: string
        userLogin: string
}

export type UserId = {
        userId: string
}

export type likesInfoModel = {
        likes: Array<string>
        dislikes: Array<string>
}

export type FeedbacksDBType = WithId<{
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        likesInfo: likesInfoModel
        postId: string
}>

export type FeedbacksType = {
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        likesInfo: likesInfoModel
        postId: string
}

/*export type FeedbackLikeDBType = WithId<{
        userId: string
        commentId: string
        likeStatus: FeedbackStatus
        createdAt: string
}>*/
