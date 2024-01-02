import {BlogsViewModel} from "../models/output/BlogsViewModel";
import { CreateBlogServiceModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {blogRepository} from "../repositories/blog-repository";

export class blogService {
    static async createPostBlog(blogId:string, createData:any){
        const blog = await blogQueryRepository.getBlogById(blogId)

        const newPostBlog = {
            ...createData,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
        }

        const res = await blogRepository.createPostBlog(newPostBlog)

        return res
    }
    static async createBlog(createData: CreateBlogServiceModel):Promise<BlogsViewModel> {
        const newBlog = {
            ...createData,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const blog = await blogRepository.createBlog(newBlog)

        return blog
    }
    static async updateBlog(id: string , updateData:UpdateBlogModel): Promise<boolean> {
        const updateBlog = await blogRepository.updateBlog(id, updateData)

        return updateBlog;
    }
    static async deleteBlogById(id: string): Promise<boolean> {
        const deleteBlog = await blogRepository.deleteBlogById(id)

        return deleteBlog
    }
}