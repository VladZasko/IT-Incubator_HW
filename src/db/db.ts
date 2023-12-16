import {VideoType} from "./videos.types";
import {BlogType} from "./blogs.types";
import {PostType} from "./posts.types";

export type DBType = {
    videos: VideoType[]
    blogs: BlogType[]
    posts: PostType[]
}

export const db: DBType = {
    videos: [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2023-12-11T08:40:46.569Z",
            publicationDate: "2023-12-11T08:40:46.569Z",
            availableResolutions: [
                "P144"
            ]
        }
    ],
    blogs: [
        {
            id: '12345',
            name: 'Uladzislau',
            description: 'string',
            websiteUrl: 'https://8PKvNFTdAa9KpkqwxaUuxe8lWeFSE7_ZCKlj9pbpNrJzLNbqa7SQo9.PmeYHjCdu9pHIFVaIjHT3wNefhVEPEGeyroPI'
        }
    ],
    posts: [
        {
            id: "22222",
            title: "Post Title",
            shortDescription: "short Descreption Posts",
            content: "Posts Content",
            blogId: 'Posts Blog Id',
            blogName: 'Post Blog Name'
        }
    ]
}

export type ErrorMessageType = {
    message: string
    field: string
}
export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}