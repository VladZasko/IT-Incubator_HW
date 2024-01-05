import {UpdateFeedbackModuleModel} from "../models/UpdateFeedbackModule";
import {feedbackRepository} from "../repositories/feedback-repository";

export class feedbackService {
    static async updateComment(id: string, upData: UpdateFeedbackModuleModel): Promise<boolean> {
        return await feedbackRepository.updatePost(id, upData)
    }
    static async deleteCommentById(id: string): Promise<boolean> {
        return await feedbackRepository.deleteCommentById(id)
    }
}