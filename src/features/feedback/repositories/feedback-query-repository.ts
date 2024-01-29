import { FeedbacksModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {FeedbackViewModel} from "../models/FeedbackViewModel";
import {feedbackMapper} from "../mappers/mappers";

export class feedbacksQueryRepository {
    static async getCommentById(id: string): Promise<FeedbackViewModel | null> {
        const comment = await FeedbacksModel.findOne({_id: new ObjectId(id)})

        if (!comment){
            return null
        }
        return feedbackMapper(comment)
    }
}