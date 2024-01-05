
import {feedbacksCollection, postsCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {UpdateFeedbackModuleModel} from "../models/UpdateFeedbackModule";


export class feedbackRepository {
    static async updatePost(id: string, upData: UpdateFeedbackModuleModel): Promise<boolean> {
        const foundComment = await feedbacksCollection.updateOne({_id:new ObjectId(id)}, {
            $set:{
                content: upData.content
            }
        })
        return !!foundComment.matchedCount;
    }
    static async deleteCommentById(id: string): Promise<boolean> {
        const foundComment = await feedbacksCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundComment.deletedCount

    }
}