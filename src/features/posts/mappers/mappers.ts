import {PostDBType} from "../../../db/types/posts.types";
import {PostsViewModel} from "../models/PostsViewModel";
import {WithId} from "mongodb";
import {LikesStatus} from "../../feedback/models/FeedbackViewModel";


export const postQueryMapper = (postDb:WithId<PostDBType>,Id?:string):PostsViewModel => {
    const isLiked = postDb!.likesInfo.likes.some(obj => obj.userId === Id);
    const isDisliked = postDb!.likesInfo.dislikes.some(obj => obj.userId === Id);

    let likeStatus = LikesStatus.None

    if(isLiked){
        likeStatus = LikesStatus.Like
    }
    if(isDisliked){
        likeStatus = LikesStatus.Dislike
    }

/*
    postDb.likesInfo.likes.sort((a, b) => {
        if (a.addedAt > b.addedAt) return -1;
        if (a.addedAt < b.addedAt) return 1;
        return 0;
    });
*/

// Реверс массива
    postDb.likesInfo.likes.reverse();

// Получение трех самых новых объектов
    const threeNewestUsers = postDb.likesInfo.likes.slice(0, 3);

    return{
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt,
        extendedLikesInfo: {
            likesCount: postDb.likesInfo?.likes?.length ?? 0,
            dislikesCount: postDb.likesInfo?.dislikes?.length ?? 0,
            myStatus: likeStatus,
            newestLikes:threeNewestUsers
        }
    }
}
export const postMapper = (postDb:WithId<PostDBType>) => {
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