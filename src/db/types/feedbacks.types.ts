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

