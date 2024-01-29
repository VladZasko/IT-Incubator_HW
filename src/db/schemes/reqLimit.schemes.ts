import mongoose from "mongoose";
import {BlogDBType} from "../types/blogs.types";
import {RateLimiteType} from "../types/reqLimite.types";

export const RateLimitSchema = new mongoose.Schema<RateLimiteType>({
    IP: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: Date, require: true }
})

