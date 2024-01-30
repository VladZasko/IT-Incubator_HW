import mongoose from "mongoose";
import {BlogDBType} from "../types/blogs.types";
import {PostDBType} from "../types/posts.types";

export const PostSchema = new mongoose.Schema<PostDBType>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
})
