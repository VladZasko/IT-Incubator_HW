import {memoryDb} from "../../../db/memory-db";
import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {blogsCollection, postsCollection} from "../../../db/db";
import {blogMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreateBlogModel, CreatePostBlogModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {URIParamsBlogIdModel} from "../models/input/URIParamsBlogIdModule";
import {QueryBlogsModel, QueryPostByBlogIdModel} from "../models/input/QueryBlogsModule";
import {postMapper} from "../../posts/mappers/mappers";

export class BlogRepository {
    static async getAllBlogs(sortData: QueryBlogsModel){
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        let filter = {}

        if(searchNameTerm){
            filter = {
                name: {$regex: searchNameTerm, $options: 'i'}
            }
        }

        const blogs = await blogsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount/ +pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }

    }
    static async getPostsByBlogId(blogId:string, sortData: QueryPostByBlogIdModel) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await postsCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await blogsCollection
            .countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }

    }

    static async getBlogById(id: string): Promise<BlogsViewModel | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (!blog){
            return null
        }

        return blogMapper(blog)
    }
    static async createPostBlog(blogId:string, createData:any){
        const blog = await this.getBlogById(blogId)

        const newPostBlog = {
            ...createData,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
        }

        const res = await postsCollection.insertOne(newPostBlog)

        return res.insertedId.toString()
    }
    static async createBlog(createData : CreateBlogModel):Promise<BlogsViewModel> {
        const newBlog = {
            ...createData,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const blog = await blogsCollection.insertOne({...newBlog})

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