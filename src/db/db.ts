
import {settings} from "../../settings";
import * as mongoose from "mongoose";
import {BlogSchema} from "./schemes/blogs.schemes";
import {FeedbacksSchema} from "./schemes/feedbacks.schemes";
import {PostSchema} from "./schemes/posts.schemes";
import {RateLimitSchema} from "./schemes/reqLimit.schemes";
import {RefreshTokensMetaSchema} from "./schemes/token.schemes";
import {UserAuthSchema} from "./schemes/users.schemes";


const dbName = 'blogs-hws'
const mongoURI = settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`


export const BlogModel = mongoose.model('blog', BlogSchema)
export const PostModel = mongoose.model('posts', PostSchema)
export const UserAuthModel = mongoose.model('usersAuth', UserAuthSchema)
export const FeedbacksModel = mongoose.model('feedbacks', FeedbacksSchema)
export const RefreshTokensMetaModel = mongoose.model('refreshToken', RefreshTokensMetaSchema)
export const RateLimitModel = mongoose.model('rateLimit', RateLimitSchema)

// export const client = new MongoClient(mongoURI)
// export const db = client.db('blogs-hws');
// export const blogsCollection = db.collection<BlogDBType>("blogs");
// export const postsCollection = db.collection<PostDBType>("posts");
// export const feedbacksCollection = db.collection<FeedbacksDBType>("feedbacks");
// //export const usersCollection = db.collection<UserAuthDBType>("users");
// export const usersAuthCollection = db.collection<UserAuthDBType>("usersAuth");
// export const invalidTokenCollection = db.collection<InvalidTokenType>("invalidToken");
// export const refreshTokensMetaCollection = db.collection<RefreshTokensMetaDBType>("refreshToken");
// export const rateLimitType = db.collection<RateLimiteType>("rateLimit");
//export const videosCollection = db.collection<VideoDBType>("videos");

export const port = settings.PORT

export const dbControl = {
    async run() {
        try {
            // // Connect the client to the server
            // await client.connect();
            // // Establish and verify connection
            // await client.db("blogs-hws").command({ping: 1});

            await mongoose.connect(mongoURI)

            //console.log(`Example app listening on port ${port}`)
            console.log("Connected successfully to mongo server");

        } catch {
            console.log("Can't connect to db")

            await mongoose.disconnect()
            //Ensures that the client will close when you finish/error
            //await client.close();
        }
    },
    async stop() {
        await mongoose.disconnect()

        //await client.close();
        console.log("Connection successful closed")
    }
}
