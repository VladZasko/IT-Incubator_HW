import {memoryDb} from "../../../db/memory-db";
import {BlogsViewModel} from "../models/BlogsViewModel";
import {UpdateBlogModel} from "../models/UpdateBlogModule";
import {CreateBlogModel} from "../models/CreateBlogModel";

export class BlogMemoryDbRepository {
    static async getAllBlogs(): Promise<BlogsViewModel[]>{
        return memoryDb.blogs
    }

    static async getBlogById(id: string): Promise<BlogsViewModel | null> {
        let blog = memoryDb.blogs.find(b => b.id === id)
        if (blog){
            return blog
        } else {
            return null
        }
        //return memoryDb.blogs.find(b => b.id === id)
    }

    static async createBlog(createData:CreateBlogModel):Promise<BlogsViewModel> {
        const newBlog = {
            id: (new Date()).toISOString(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        memoryDb.blogs.push(newBlog)
        return newBlog
    }
    static async updateBlog(id: string,updateData:UpdateBlogModel): Promise<boolean> {
        let foundBlog = memoryDb.blogs.find(p => p.id === id)
        if(foundBlog) {
            foundBlog.name = updateData.name;
            foundBlog.description= updateData.description;
            foundBlog.websiteUrl= updateData.websiteUrl;
            return true;
        } else {
            return false;
        }
    }
    static async deleteBlogById(id: string): Promise<boolean> {
        let foundBlog = memoryDb.blogs.find(i => i.id === id);
        if (foundBlog) {
            memoryDb.blogs = memoryDb.blogs.filter(c => c.id !== id)
            return true;
        } else {
            return false;
        }
    }
}