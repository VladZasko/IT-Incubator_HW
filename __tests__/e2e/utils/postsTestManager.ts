import {CreateBlogModel} from "../../../src/features/blogs/models/input/CreateBlogModel";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import request from "supertest";
import {app} from "../../../src/app";
import {RouterPaths} from "../../../src/routerPaths";
import {URIParamsBlogIdModel} from "../../../src/features/blogs/models/input/URIParamsBlogIdModule";
import {UpdateBlogModel} from "../../../src/features/blogs/models/input/UpdateBlogModule";
import {CreatePostModel} from "../../../src/features/posts/models/CreatePostModel";
import {URIParamsPostIdModel} from "../../../src/features/posts/models/URIParamsPostIdModule";
import {UpdatePostModel} from "../../../src/features/posts/models/UpdatePostModule";

export const postsTestManager = {
    async createPost(data: CreatePostModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const response =  await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                ...createdEntity,
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId
            })
        }
        return {response: response, createdEntity: createdEntity};
    },

    async updatePost(paths: URIParamsPostIdModel,data: UpdatePostModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {

        const response =  await request(app)
            .put(`${RouterPaths.posts}/${paths.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        let updateEntity;
        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            updateEntity = response.body;
            await request(app)
                .get(`${RouterPaths.posts}/${paths.id}`)
                .expect(HTTP_STATUSES.OK_200, {
                    ...paths,
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                })
        }
        return {response: response};
    }
}