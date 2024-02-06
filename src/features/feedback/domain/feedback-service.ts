import {UpdateFeedbackModuleModel} from "../models/UpdateFeedbackModule";
import {FeedbackViewModel} from "../models/FeedbackViewModel";
import {CommentsRepository} from "../repositories/feedback-repository";
export class CommentsService {
    constructor(protected commentsRepository:CommentsRepository) {}

    async getCommentById(id: string): Promise<FeedbackViewModel | null> {
        return await this.commentsRepository.getCommentById(id)
    }
    async updateComment(id: string, upData: UpdateFeedbackModuleModel): Promise<boolean> {
        return await this.commentsRepository.updatePost(id, upData)
    }
    async updateLikeStatus(id: string, upData: any): Promise<boolean> {
        return await this.commentsRepository.updateLike(id, upData)
    }

    async deleteCommentById(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(id)
    }
}