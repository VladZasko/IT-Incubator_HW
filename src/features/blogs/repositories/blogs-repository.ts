import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {ObjectId} from "mongodb";
import {CreateBlogReposModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {BlogModel, PostModel} from "../../../db/db";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async createPostBlog(createData:any){

        const res = await PostModel.create(createData)

        return {
            ...createData,
            id:res.id
        }
    }
    async createBlog(createData : CreateBlogReposModel):Promise<BlogsViewModel> {

        const blogInstance = new BlogModel()

        blogInstance.name = createData.name
        blogInstance.description = createData.description
        blogInstance.websiteUrl = createData.websiteUrl
        blogInstance.createdAt = createData.createdAt
        blogInstance.isMembership = createData.isMembership

        await blogInstance.save()

        //const blog = await BlogModel.create({...createData})

        return {
            ...createData,
            id: blogInstance.id
        }
    }
    async updateBlog(id: string , updateData:UpdateBlogModel): Promise<boolean> {
        const foundBlog = await BlogModel.updateOne({_id:new ObjectId(id)}, {
            $set:{
                name : updateData.name,
                description: updateData.description,
                websiteUrl: updateData.websiteUrl
            }
        })

        return !!foundBlog.matchedCount;
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const foundBlog = await BlogModel.deleteOne({_id:new ObjectId(id)})

        return !!foundBlog.deletedCount
    }
}