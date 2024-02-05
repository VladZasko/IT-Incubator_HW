import {UpdateFeedbackModuleModel} from "../models/UpdateFeedbackModule";
import {feedbackRepository} from "../repositories/feedback-repository";
import {FeedbackViewModel} from "../models/FeedbackViewModel";
import {FeedbacksModel} from "../../../db/db";
import {ObjectId} from "mongodb";
import {feedbackQueryMapper} from "../mappers/mappers";

export class feedbackService {

    static async getCommentById(id: string): Promise<FeedbackViewModel | null> {
        return await feedbackRepository.getCommentById(id)
    }
    static async updateComment(id: string, upData: UpdateFeedbackModuleModel): Promise<boolean> {
        return await feedbackRepository.updatePost(id, upData)
    }
    static async updateLikeStatus(id: string, upData: any): Promise<boolean> {
        return await feedbackRepository.updateLike(id, upData)
    }

    static async deleteCommentById(id: string): Promise<boolean> {
        return await feedbackRepository.deleteCommentById(id)
    }
}