import {AvailableResolutions} from "../../../db/types/videos.types";


export type UpdateVideoModel = {
    /**
     *  Video title
     *  Video author
     *  Video availableResolutions
     *  Video canBeDownloaded
     *  Video minAgeRestriction
     *  Video publicationDate
     */
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
    canBeDownloaded: boolean
    minAgeRestriction: number
    publicationDate: string
}