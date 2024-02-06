import mongoose from "mongoose";
import {PostDBType} from "../types/posts.types";

export const PostSchema = new mongoose.Schema<PostDBType>({
    title: {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: String, require: true},
    likesInfo: {
        likes: [
            {
                addedAt: {type: String, require: true},
                userId: {type: String, require: true},
                login: {type: String, require: true},
                _id: false
            }
        ],
        dislikes: [{
            addedAt: {type: String, require: true},
            userId: {type: String, require: true},
            login: {type: String, require: true},
            _id: false
        }
        ]
    }
})

