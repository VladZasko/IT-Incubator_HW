import {BlogsViewModel, BlogsViewModelGetAllBlogs} from "../models/output/BlogsViewModel";
import {blogMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {QueryBlogsModel, QueryPostByBlogIdModel} from "../models/input/QueryBlogsModule";
import {postQueryMapper} from "../../posts/mappers/mappers";
import {BlogModel, PostModel} from "../../../db/db";

export class blogQueryRepository {
    static async getAllBlogs(sortData: QueryBlogsModel): Promise<BlogsViewModelGetAllBlogs>{
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize =  sortData.pageSize ?? 10

        let filter = {}

        if(searchNameTerm){
            filter = {
                name: {$regex: searchNameTerm, $options: 'i'}
            }
        }

        const blogs = await BlogModel
            .find(filter)
            .sort([[sortBy,sortDirection]])
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount:number = await BlogModel.countDocuments(filter)

        const pagesCount:number = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }

    }
    static async getPostsByBlogId(blogId:string, sortData: QueryPostByBlogIdModel,likeStatusData?:string) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await PostModel
            .find({blogId: blogId})
            .sort([[sortBy,sortDirection]])
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .lean()

        const totalCount = await PostModel
            .countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: posts.map(posts => postQueryMapper(posts, likeStatusData))
        }

    }
    static async getBlogById(id: string): Promise<BlogsViewModel | null> {
        const blog = await BlogModel.findOne({_id: new ObjectId(id)})

        if (!blog){
            return null
        }

        return blogMapper(blog)
    }
}