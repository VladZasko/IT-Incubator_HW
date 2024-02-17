import {BlogsViewModel} from "../models/output/BlogsViewModel";
import {CreateBlogModel} from "../models/input/CreateBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModule";
import {blogQueryRepository} from "../repositories/blog-query-repository";
import {BlogDBType} from "../../../db/types/blogs.types";
import {BlogsRepository} from "../repositories/blogs-repository";
import {injectable} from "inversify";
import {ResultCode} from "../utils/result-code";
import {ERRORS_MESSAGES} from "../../../utils/errors";


export type Result<T> = {
    resultCode: ResultCode
    errorMessage?: {
        message: string;
        field: string;
    }
    data: T
}
@injectable()
export class BlogsService {
    constructor(protected blogsRepository:BlogsRepository) {}
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
    async createBlog(createDTO: CreateBlogModel): Promise<Result<null|BlogsViewModel>> {
        if (createDTO.name.length > 15 || !createDTO.name || createDTO.name.length<1) {
            return {
                resultCode: ResultCode.invalidName,
                errorMessage: ERRORS_MESSAGES.BLOG_NAME,
                data: null
            }
        }
        if (createDTO.description.length > 500 || !createDTO.description || createDTO.description.length<1) {
            return {
                resultCode: ResultCode.invalidDescription,
                errorMessage: ERRORS_MESSAGES.BLOG_DESCRIPTION,
                data: null
            }
        }

        const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
        if (createDTO.websiteUrl.length > 100 || !createDTO.websiteUrl || createDTO.websiteUrl.length<1 ||!pattern.test(createDTO.websiteUrl)) {
            return {
                resultCode: ResultCode.invalidWebsiteUrl,
                errorMessage: ERRORS_MESSAGES.BLOG_WEBSITE_URL,
                data: null
            }
        }

        const newBlog: BlogDBType = new BlogDBType(
            createDTO.name,
            createDTO.description,
            createDTO.websiteUrl,
            new Date().toISOString(),
            false)

        const createBlog = await this.blogsRepository.createBlog(newBlog)

        return {
            resultCode: ResultCode.Success,
            data: createBlog
        }
    }
    async updateBlog(id: string, updateData: UpdateBlogModel): Promise<boolean> {
        return await this.blogsRepository.updateBlog(id, updateData);
    }
    async deleteBlogById(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogById(id)
    }
}