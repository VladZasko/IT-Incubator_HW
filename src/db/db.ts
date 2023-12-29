import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {BlogDBType} from "./types/blogs.types";
import {PostDBType} from "./types/posts.types";
import {VideoDBType} from "./types/videos.types";

dotenv.config()

const mongoURI =
    process.env.MONGO_URL
    || "mongodb+srv://vladzasko:FKSdwWJieyi7AM6u@cluster0.msxlf7v.mongodb.net/shop-memoryDb?retryWrites=true&w=majority"
    || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI)
export const db = client.db('blogs-hws');
export const blogsCollection = db.collection<BlogDBType>("blogs");
export const postsCollection = db.collection<PostDBType>("posts");
export const videosCollection = db.collection<VideoDBType>("videos");

export const port = 3000
export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("blogs-hws").command({ping: 1});
        console.log(`Example app listening on port ${port}`)
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db")
        //Ensurens that the client will close when you finish/error
        await client.close();
    }
}