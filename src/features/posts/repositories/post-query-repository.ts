import {PostsViewModel} from "../models/PostsViewModel";
import {postsCollection} from "../../../db/db";
import {postMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {QueryPostsModel} from "../models/QueryPostsModule";

export class postQueryRepository {
    static async getAllPosts(sortData: QueryPostsModel){
        const pageNumber= sortData.pageNumber ?? 1
        const pageSize= sortData.pageSize ?? 10
        const sortBy= sortData.sortBy ?? 'createdAt'
        const sortDirection= sortData.sortDirection ?? 'desc'

        let filter = {}

        const posts = await postsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }

    static async getPostById(id: string): Promise<PostsViewModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})

        if (!post){
            return null
        }
        return postMapper(post)
    }
}