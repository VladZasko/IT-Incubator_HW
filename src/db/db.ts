import {settings} from "../../settings";
import * as mongoose from "mongoose";
import {BlogSchema} from "./schemes/blogs.schemes";
import {FeedbacksSchema} from "./schemes/feedbacks.schemes";
import {PostSchema} from "./schemes/posts.schemes";
import {RateLimitSchema} from "./schemes/reqLimit.schemes";
import {accessTokenBlackListType, RefreshTokensMetaSchema} from "./schemes/token.schemes";
import {UserAuthSchema} from "./schemes/users.schemes";


const dbName = 'blogs-hws'
const mongoURI = settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`

export const BlogModel = mongoose.model('blog', BlogSchema)
export const PostModel = mongoose.model('posts', PostSchema)
export const UserAuthModel = mongoose.model('usersAuth', UserAuthSchema)
export const FeedbacksModel = mongoose.model('feedbacks', FeedbacksSchema)
export const RefreshTokensMetaModel = mongoose.model('refreshToken', RefreshTokensMetaSchema)
export const AccessTokensBlackListModel = mongoose.model('accessTokenBlackList', accessTokenBlackListType)
export const RateLimitModel = mongoose.model('rateLimit', RateLimitSchema)


export const dbControl = {
    async run() {
        try {
            await mongoose.connect(mongoURI)

            console.log("Connected successfully to mongo server");
        } catch {
            console.log("Can't connect to db")

            await mongoose.disconnect()
        }
    },
    async stop() {
        await mongoose.disconnect()

        console.log("Connection successful closed")
    }
}
