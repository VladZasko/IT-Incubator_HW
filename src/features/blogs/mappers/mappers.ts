import {WithId} from "mongodb";
import {BlogDBType} from "../../../db/types/blogs.types";
import {BlogsViewModel} from "../models/BlogsViewModel";

export const blogMapper = (blogDb:WithId<BlogDBType>):BlogsViewModel => {
    return{
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: blogDb.createdAt,
        isMembership: blogDb.isMembership
    }
}