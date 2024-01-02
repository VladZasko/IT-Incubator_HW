import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {blogsCollection, postsCollection} from "../../../db/db";
import {ObjectId} from "mongodb";
import {CreateBlogReposModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";

export class blogRepository {
    static async createPostBlog(createData:any){

        const res = await postsCollection.insertOne(createData)

        return res.insertedId.toString()
    }
    static async createBlog(createData : CreateBlogReposModel):Promise<BlogsViewModel> {

        const blog = await blogsCollection.insertOne({...createData})

        return {
            ...createData,
            id: blog.insertedId.toString()
        }
    }
    static async updateBlog(id: string , updateData:UpdateBlogModel): Promise<boolean> {
        const foundBlog = await blogsCollection.updateOne({_id:new ObjectId(id)}, {
            $set:{
                name : updateData.name,
                description: updateData.description,
                websiteUrl: updateData.websiteUrl
            }
        })

        return !!foundBlog.matchedCount;
    }
    static async deleteBlogById(id: string): Promise<boolean> {
        const foundBlog = await blogsCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundBlog.deletedCount
    }
}