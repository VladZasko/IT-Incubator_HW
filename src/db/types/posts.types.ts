import {WithId} from "mongodb";

export type NewestLikesType = {
        addedAt: string,
        userId: string,
        login: string
}

export type likesInfoModel = {
        likes: Array<NewestLikesType>
        dislikes: Array<NewestLikesType>
}

export type PostType = {
        title: string
        shortDescription: string
        content: string
        blogId: string
        blogName: string
        createdAt: string
        likesInfo: likesInfoModel
    }

export type PostDBType = WithId<{
        title: string
        shortDescription: string
        content: string
        blogId: string
        blogName: string
        createdAt: string
        likesInfo: likesInfoModel
}>
