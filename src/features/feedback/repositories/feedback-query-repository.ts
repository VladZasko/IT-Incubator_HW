import { FeedbacksModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {LikesStatus, FeedbackViewModel} from "../models/FeedbackViewModel";
import {feedbackMapper, feedbackQueryMapper} from "../mappers/mappers";

export class feedbacksQueryRepository {
    static async getCommentById(id: string, likeStatusData?:string): Promise<FeedbackViewModel | null> {
        const comment = await FeedbacksModel.findOne({_id: new ObjectId(id)})

        if (!comment){
            return null
        }

        return feedbackQueryMapper(comment,likeStatusData)
    }
}