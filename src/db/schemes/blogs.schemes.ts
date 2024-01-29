import mongoose from "mongoose";
import {BlogDBType} from "../types/blogs.types";

export const BlogSchema = new mongoose.Schema<BlogDBType>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})

