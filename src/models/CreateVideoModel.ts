import {AvailableResolutions} from "../db/db";

export type CreateVideoModel = {
    /**
     * Video Title, Author, AvailableResolutions
     */
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
