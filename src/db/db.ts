import {MongoClient} from "mongodb";
import {BlogDBType} from "./types/blogs.types";
import {PostDBType} from "./types/posts.types";
import {VideoDBType} from "./types/videos.types";
import {UserDBType} from "./types/users.types";
import {settings} from "../../settings";
import {FeedbacksDBType} from "./types/feedbacks.types";

const mongoURI = settings.MONGO_URI
export const client = new MongoClient(mongoURI)
export const db = client.db('blogs-hws');
export const blogsCollection = db.collection<BlogDBType>("blogs");
export const postsCollection = db.collection<PostDBType>("posts");
export const feedbacksCollection = db.collection<FeedbacksDBType>("feedbacks");
export const usersCollection = db.collection<UserDBType>("users");

export const videosCollection = db.collection<VideoDBType>("videos");

export const port = settings.PORT
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