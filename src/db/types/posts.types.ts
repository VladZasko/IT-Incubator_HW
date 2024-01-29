import {WithId} from "mongodb";

export type PostType = {
        id: string
        title: string
        shortDescription: string
        content: string
        blogId: string
        blogName: string
        createdAt: string
    }

export type PostDBType = WithId<{
        title: string
        shortDescription: string
        content: string
        blogId: string
        blogName: string
        createdAt: string
}>
