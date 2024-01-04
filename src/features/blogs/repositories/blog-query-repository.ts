import {BlogsViewModel, BlogsViewModelGetAllBlogs} from "../models/output/BlogsViewModel";
import {blogsCollection, postsCollection} from "../../../db/db";
import {blogMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {QueryBlogsModel, QueryPostByBlogIdModel} from "../models/input/QueryBlogsModule";
import {postMapper} from "../../posts/mappers/mappers";

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

        const blogs = await blogsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount:number = await blogsCollection.countDocuments(filter)

        const pagesCount:number = Math.ceil(totalCount/ +pageSize)


        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
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

        const totalCount = await postsCollection
            .countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(totalCount/ +pageSize)

        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
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
}