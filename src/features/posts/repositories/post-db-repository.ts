import {memoryDb} from "../../../db/memory-db";
import {PostType} from "../../../db/types/posts.types";
import {PostsViewModel} from "../models/PostsViewModel";
import {blogsCollection, postsCollection} from "../../../db/db";
import {blogMapper} from "../../blogs/mappers/mappers";
import {postMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreatePostModel} from "../models/CreatePostModel";
import {UpdatePostModel} from "../models/UpdatePostModule";

export class PostMemoryDbRepository {
    static async getAllPosts(): Promise<PostsViewModel[]>{
        const posts = await postsCollection.find({}).toArray()

        return posts.map(postMapper)
    }

    static async getPostById(id: string): Promise<PostsViewModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})

        if (!post){
            return null
        }

        return postMapper(post)
    }

    static async createPost(createData:CreatePostModel, blogName:string):Promise<string>  {
        const newPost = {
            ...createData,
            blogName,
            createdAt: new Date().toISOString()
        }
        const post = await postsCollection.insertOne(newPost)

        return post.insertedId.toString()
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