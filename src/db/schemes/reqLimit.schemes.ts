import mongoose, {Schema} from "mongoose";
import {RateLimitType} from "../types/reqLimite.types";

export const RateLimitSchema:Schema<RateLimitType> = new mongoose.Schema<RateLimitType>({
    IP: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: Date, require: true }
})

