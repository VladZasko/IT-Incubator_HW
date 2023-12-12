import {Request} from "express";

export const AvailableResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160"]

export type VideoDBType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

export let videos :VideoDBType[] = [
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
]
export type CreateVideoType = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
export type ErrorMessageType = {
    message: string
    field: string
}
export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}