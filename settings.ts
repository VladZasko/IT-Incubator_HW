import dotenv from "dotenv";

dotenv.config()
export const settings = {
    MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || "123",
    PORT: process.env.PORT || 5000
}