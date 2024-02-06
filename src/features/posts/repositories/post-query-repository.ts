import {PostsViewModel} from "../models/PostsViewModel";
import {FeedbacksModel, PostModel} from "../../../db/db";
import {postMapper, postQueryMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {QueryPostsModel} from "../models/QueryPostsModule";
import {QueryFeedbackModule} from "../../feedback/models/QueryFeedbackModule";
import {feedbackQueryMapper} from "../../feedback/mappers/mappers";
import {LikesStatus, FeedbackViewModelGetAllComments} from "../../feedback/models/FeedbackViewModel";

export class postQueryRepository {
    static async getAllPosts(sortData: QueryPostsModel,likeStatusData?:string){
        const pageNumber= sortData.pageNumber ?? 1
        const pageSize= sortData.pageSize ?? 10
        const sortBy= sortData.sortBy ?? 'createdAt'
        const sortDirection= sortData.sortDirection ?? 'desc'

        let filter = {}

        const posts = await PostModel
            .find(filter)
            .sort([[sortBy,sortDirection]])
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await PostModel.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(posts => postQueryMapper(posts, likeStatusData))
        }
    }
    static async getCommentByPostId(id: string, sortData: QueryFeedbackModule, likeStatusData?:string):Promise<FeedbackViewModelGetAllComments>{
        const pageNumber= sortData.pageNumber ?? 1
        const pageSize= sortData.pageSize ?? 10
        const sortBy= sortData.sortBy ?? 'createdAt'
        const sortDirection= sortData.sortDirection ?? 'desc'

        const comments = await FeedbacksModel
            .find({postId: id})
            .sort([[sortBy,sortDirection]])
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .lean()



        const totalCount = await FeedbacksModel.countDocuments({postId: id})

        const pagesCount = Math.ceil(totalCount/ +pageSize)


        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: comments.map(comment => feedbackQueryMapper(comment, likeStatusData))
        }
    }
    static async getPostById(id: string,likeStatusData?:string): Promise<PostsViewModel | null> {
        const post = await PostModel.findOne({_id: new ObjectId(id)})
        if (!post){
            return null
        }
        return postQueryMapper(post,likeStatusData)
    }
}