import {PostDBType} from "../../../db/types/posts.types";
import {PostsViewModel} from "../models/PostsViewModel";
import {WithId} from "mongodb";

export const postMapper = (postDb:WithId<PostDBType>):PostsViewModel => {
    return{
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt
    }
}