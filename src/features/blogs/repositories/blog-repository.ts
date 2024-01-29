import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {ObjectId} from "mongodb";
import {CreateBlogReposModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {BlogModel, PostModel} from "../../../db/db";

export class blogRepository {
    static async createPostBlog(createData:any){

        const res = await PostModel.create(createData)

        return {
            ...createData,
            id:res.id
        }
    }
    static async createBlog(createData : CreateBlogReposModel):Promise<BlogsViewModel> {

        const blog = await BlogModel.create({...createData})

        return {
            ...createData,
            id: blog.id
        }
    }
    static async updateBlog(id: string , updateData:UpdateBlogModel): Promise<boolean> {
        const foundBlog = await BlogModel.updateOne({_id:new ObjectId(id)}, {
            $set:{
                name : updateData.name,
                description: updateData.description,
                websiteUrl: updateData.websiteUrl
            }
        })

        return !!foundBlog.matchedCount;
    }
    static async deleteBlogById(id: string): Promise<boolean> {
        const foundBlog = await BlogModel.deleteOne({_id:new ObjectId(id)})

        return !!foundBlog.deletedCount
    }
}