import mongoose, {Types} from "mongoose";
import {FeedbacksDBType} from "../types/feedbacks.types";

export const FeedbacksSchema = new mongoose.Schema<FeedbacksDBType>({
    content: {type: String, require: true},
    commentatorInfo: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true}
    },
    createdAt: {type: String, require: true},
    likesInfo:{
        likes: [{type: String, require: true}],
        dislikes:[ {type: String, require: true}]
    },
    postId: {type: String, require: true},
})


