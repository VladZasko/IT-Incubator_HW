import {ObjectId, WithId} from "mongodb";

export class BlogDBType {
    constructor(public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean
    ) {
    }
}

export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

/*
export type BlogDBType = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>*/
