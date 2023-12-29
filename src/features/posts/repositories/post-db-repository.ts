import {memoryDb} from "../../../db/memory-db";
import {PostType} from "../../../db/types/posts.types";
import {PostsViewModel} from "../models/PostsViewModel";
import {blogsCollection, postsCollection} from "../../../db/db";
import {blogMapper} from "../../blogs/mappers/mappers";
import {postMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreatePostModel} from "../models/CreatePostModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {QueryPostsModel} from "../models/QueryPostsModule";

export class PostMemoryDbRepository {
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

        const totalCount = await blogsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
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

    static async createPost(createData:CreatePostModel, blogName:string):Promise<PostsViewModel>  {
        const newPost = {
            ...createData,
            blogName,
            createdAt: new Date().toISOString()
        }
        const post = await postsCollection.insertOne({...newPost})

        return {
            ...newPost,
            id:post.insertedId.toString()
        }
    }
    static async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        const foundPost = await postsCollection.updateOne({_id:new ObjectId(id)}, {
            $set:{
                title : upData.title,
                shortDescription: upData.shortDescription,
                content: upData.content,
                blogId: upData.blogId
            }
        })
        return !!foundPost.matchedCount;
    }
    static async deletePostById(id: string): Promise<boolean> {
        const foundPost = await postsCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundPost.deletedCount

    }
}