import {db} from "../../../db/db";

export class BlogRepository {
    static getAllBlogs(){
        return db.blogs
    }

    static getBlogById(id: string) {
        return db.blogs.find(b => b.id === id)
    }

    static createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: (new Date()).toISOString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        db.blogs.push(newBlog)
        return newBlog
    }
    static updateBlog(id: string,name: string, description: string, websiteUrl: string) {
        let foundBlog = db.blogs.find(p => p.id === id)
        if(foundBlog) {
            foundBlog.name = name;
            foundBlog.description= description;
            foundBlog.websiteUrl= websiteUrl;
            return true;
        } else {
            return false;
        }
    }
    static deleteBlogById(id: string) {
        let foundBlog = db.blogs.find(i => i.id === id);
        if (foundBlog) {
            db.blogs = db.blogs.filter(c => c.id !== id)
            return true;
        } else {
            return false;
        }
    }
}