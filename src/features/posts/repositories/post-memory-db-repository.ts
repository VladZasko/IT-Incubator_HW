import {memoryDb} from "../../../db/memory-db";
import {PostsViewModel} from "../models/PostsViewModel";
import {UpdatePostModel} from "../models/UpdatePostModule";
import {CreatePostServiceModel} from "../models/CreatePostServiceModel";

export class PostMemoryDbRepository {
    static async getAllPosts(): Promise<PostsViewModel[]>{
        return memoryDb.posts
    }

    static async getPostById(id: string): Promise<PostsViewModel | null> {
        let post = memoryDb.posts.find(b => b.id === id)
        if (post){
            return post
        } else {
            return null
        }
    }

    static async createPost(createData:CreatePostServiceModel, blogName:string):Promise<PostsViewModel>  {

        const newPost = {
            ...createData,
            blogName,
            id: (new Date()).toISOString(),
            createdAt: new Date().toISOString()
        }
        memoryDb.posts.push(newPost)
        return newPost
    }
    static async updatePost(id: string, upData: UpdatePostModel): Promise<boolean> {
        let foundPost = memoryDb.posts.find(p => p.id === id)
        if(foundPost) {
            foundPost.title = upData.title;
            foundPost.shortDescription= upData.shortDescription;
            foundPost.content= upData.content;
            foundPost.blogId= upData.blogId;
            return true;
        } else {
            return false;
        }
    }
    static async deletePostById(id: string): Promise<boolean> {
        let foundPost = memoryDb.posts.find(i => i.id === id);
        if (foundPost) {
            memoryDb.posts = memoryDb.posts.filter(c => c.id !== id)
            return true;
        } else {
            return false;
        }
    }
}