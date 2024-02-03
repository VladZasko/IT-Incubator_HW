import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {CreateBlogServiceModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {BlogDBType} from "../../../db/types/blogs.types";
import {BlogRepository} from "../repositories/blog-repository";

export class BlogService {
    blogsRepository: BlogRepository
    constructor() {
        this.blogsRepository = new BlogRepository()
    }
    async createPostBlog(blogId: string, createData: any) {
        const blog = await blogQueryRepository.getBlogById(blogId)

        const newPostBlog = {
            ...createData,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
        }

        return await this.blogsRepository.createPostBlog(newPostBlog)
    }
    async createBlog(createData: CreateBlogServiceModel): Promise<BlogsViewModel> {
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
        return await this.blogsRepository.createBlog(newBlog)
    }
    async updateBlog(id: string, updateData: UpdateBlogModel): Promise<boolean> {
        return await this.blogsRepository.updateBlog(id, updateData);
    }
    async deleteBlogById(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogById(id)
    }
}