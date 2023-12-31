import {AvailableResolutions} from "../../../db/types/videos.types";

export type VideosViewModel = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

