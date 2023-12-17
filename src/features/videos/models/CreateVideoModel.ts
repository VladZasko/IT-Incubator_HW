import {AvailableResolutions} from "../../../db/types/videos.types";

export type CreateVideoModel = {
    /**
     * Video Title, Author, AvailableResolutions
     */
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
