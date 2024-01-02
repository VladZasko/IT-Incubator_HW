import {PostsViewModel} from "../models/PostsViewModel";
import {postsCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreatePostReposModel} from "../models/CreatePostServiceModel";
import {UpdatePostModel} from "../models/UpdatePostModule";

export class postRepository {
    static async createPost(createData:CreatePostReposModel):Promise<PostsViewModel>  {

        const post = await postsCollection.insertOne({...createData})

        return {
            ...createData,
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