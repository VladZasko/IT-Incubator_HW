import {WithId} from "mongodb";

/*export type commentatorInfoModel = {
        userId: string
        userLogin: string
}

export type likesInfoModel = {
        likes: Array<string>
        dislikes: Array<string>
}*/

/*
export type FeedbacksDBType = WithId<{
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        likesInfo: likesInfoModel
        postId: string
}>
*/

export type FeedbacksType = {
        content: string
        commentatorInfo: commentatorInfoModel
        createdAt: string
        likesInfo: likesInfoModel
        postId: string
}
export class commentatorInfoModel {
        constructor(
            public userId: string,
            public userLogin: string,
        ) {
        }
}
export class likesInfoModel {
        constructor(
            public likes: Array<string>,
            public dislikes: Array<string>
        ) {
        }
}
export class FeedbacksDBType {
        constructor(
            public content: string,
            public commentatorInfo: commentatorInfoModel,
            public createdAt: string,
            public likesInfo: likesInfoModel,
            public postId: string
        ) {
        }
}

