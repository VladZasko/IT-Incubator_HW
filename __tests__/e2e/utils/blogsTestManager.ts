import request from "supertest";
import {CreateBlogModel} from "../../../src/features/blogs/models/input/CreateBlogModel";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {app} from "../../../src/app";
import {UpdateBlogModel} from "../../../src/features/blogs/models/input/UpdateBlogModule";
import {URIParamsBlogIdModel} from "../../../src/features/blogs/models/input/URIParamsBlogIdModule";
import {BlogType} from "../../../src/db/types/blogs.types";

export const blogsTestManager = {
    async createBlog(data: CreateBlogModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const response =  await request(app)
            .post(RouterPaths.blogs)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                ...createdEntity,
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })
        }
        return {response: response, createdEntity: createdEntity};
    },

    async updateBlog(createdNewBlog01:BlogType,data: UpdateBlogModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {

        const response =  await request(app)
            .put(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            await request(app)
                .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
                .expect(HTTP_STATUSES.OK_200, {
                    ...createdNewBlog01,
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                })
        }
        return {response: response};
    }
}