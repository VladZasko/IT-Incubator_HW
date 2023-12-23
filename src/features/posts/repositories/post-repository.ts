import {db} from "../../../db/db";

export class PostRepository {
    static getAllPosts(){
        return db.posts
    }

    static getPostById(id: string) {
        return db.posts.find(b => b.id === id)
    }

    static createPost(title: string, shortDescription: string, content: string, blogId: string) {

        let foundBlog = db.blogs.find(p => p.id === blogId)

        const newPost = {
            id: (new Date()).toISOString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: new Date().toISOString()
        }
        db.posts.push(newPost)
        return newPost
    }
    static updatePost(id: string,title: string, shortDescription: string, content: string, blogId: string) {
        let foundPost = db.posts.find(p => p.id === id)
        if(foundPost) {
            foundPost.title = title;
            foundPost.shortDescription= shortDescription;
            foundPost.content= content;
            foundPost.blogId= blogId;
            return true;
        } else {
            return false;
        }
    }
    static deletePostById(id: string) {
        let foundPost = db.posts.find(i => i.id === id);
        if (foundPost) {
            db.posts = db.posts.filter(c => c.id !== id)
            return true;
        } else {
            return false;
        }
    }
}