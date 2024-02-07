export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    likesInfo: likesInfoModel
}

export class NewestLikesType {
    constructor(
        public addedAt: string,
        public userId: string,
        public login: string) {
    }
}

export class likesInfoModel {
    constructor(
        public likes: Array<NewestLikesType>,
        public dislikes: Array<NewestLikesType>) {
    }
}

export class PostDBType {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public likesInfo: likesInfoModel
    ) {
    }
}

