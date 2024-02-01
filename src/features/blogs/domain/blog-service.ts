import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {CreateBlogServiceModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {blogRepository} from "../repositories/blog-repository";
import {BlogDBType} from "../../../db/types/blogs.types";

export class blogService {
    static async createPostBlog(blogId: string, createData: any) {
        const blog = await blogQueryRepository.getBlogById(blogId)

        const newPostBlog = {
            ...createData,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
        }

        return await blogRepository.createPostBlog(newPostBlog)
    }

    static async createBlog(createData: CreateBlogServiceModel): Promise<BlogsViewModel> {
        const newBlog: BlogDBType = new BlogDBType(
            createData.name,
            createData.description,
            createData.websiteUrl,
            new Date().toISOString(),
            false)
        /*const newBlog: BlogDBType = {
            ...createData,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
*/
        return await blogRepository.createBlog(newBlog)
    }

    static async updateBlog(id: string, updateData: UpdateBlogModel): Promise<boolean> {
        return await blogRepository.updateBlog(id, updateData);
    }

    static async deleteBlogById(id: string): Promise<boolean> {
        return await blogRepository.deleteBlogById(id)
    }
}