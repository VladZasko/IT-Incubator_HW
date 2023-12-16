import {AvailableResolutions} from "../../../db/db";

export type CreatePostModel = {
    /**
     * Video Title, Author, AvailableResolutions
     */
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
