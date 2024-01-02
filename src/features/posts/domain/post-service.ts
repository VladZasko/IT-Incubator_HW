import {memoryDb} from "../../../db/memory-db";
import {PostType} from "../../../db/types/posts.types";
import {PostsViewModel} from "../models/PostsViewModel";
import {blogsCollection, postsCollection} from "../../../db/db";
import {blogMapper} from "../../blogs/mappers/mappers";
import {postMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreatePostServiceModel} from "../models/CreatePostServiceModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {QueryPostsModel} from "../models/QueryPostsModule";
import {postRepository} from "../repositories/post-repository";

export class postService {
    static async createPost(createData:CreatePostServiceModel, blogName:string):Promise<PostsViewModel>  {
        const newPost = {
            ...createData,
            blogName,
            createdAt: new Date().toISOString()
        }
        const post = await postRepository.createPost(newPost)

        return post
    }
    static async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        const foundPost = await postRepository.updatePost(id, upData)
        return foundPost;
    }
    static async deletePostById(id: string): Promise<boolean> {
        const foundPost = await postRepository.deletePostById(id)

        return foundPost
    }
}