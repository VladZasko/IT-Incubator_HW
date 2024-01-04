import {PostsViewModel} from "../models/PostsViewModel";
import {CreatePostServiceModel} from "../models/CreatePostServiceModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {postRepository} from "../repositories/post-repository";

export class postService {
    static async createPost(createData:CreatePostServiceModel, blogName:string):Promise<PostsViewModel>  {
        const newPost = {
            ...createData,
            blogName,
            createdAt: new Date().toISOString()
        }

        return await postRepository.createPost(newPost)
    }
    static async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        return await postRepository.updatePost(id, upData)
    }
    static async deletePostById(id: string): Promise<boolean> {
        return await postRepository.deletePostById(id)
    }
}