import mongoose, {Schema} from "mongoose";
import {BlogDBType} from "../types/blogs.types";

export const BlogSchema:Schema<BlogDBType> = new mongoose.Schema<BlogDBType>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})

