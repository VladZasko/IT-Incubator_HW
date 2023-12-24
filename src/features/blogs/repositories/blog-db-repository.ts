import {memoryDb} from "../../../db/memory-db";
import {BlogsViewModel} from "../models/BlogsViewModel";
import {blogsCollection} from "../../../db/db";
import {blogMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreateBlogModel} from "../models/CreateBlogModel";
import {UpdateBlogModel} from "../models/UpdateBlogModule";
import {URIParamsBlogIdModel} from "../models/URIParamsBlogIdModule";

export class BlogMemoryDbRepository {
    static async getAllBlogs(): Promise<BlogsViewModel[]>{
        const blogs = await blogsCollection.find({}).toArray()

        return blogs.map(blogMapper)
    }

    static async getBlogById(id: string): Promise<BlogsViewModel | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (!blog){
            return null
        }

        return blogMapper(blog)
    }

    static async createBlog(createData : CreateBlogModel):Promise<BlogsViewModel> {
        const newBlog = {
            ...createData,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const blog = await blogsCollection.insertOne(newBlog)

        return {
            ...newBlog,
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