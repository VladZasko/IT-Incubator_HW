import request from "supertest";
import {CreateBlogModel} from "../../../src/features/blogs/models/CreateBlogModel";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {app} from "../../../src/app";
import {UpdateBlogModel} from "../../../src/features/blogs/models/UpdateBlogModule";
import {URIParamsBlogIdModel} from "../../../src/features/blogs/models/URIParamsBlogIdModule";

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

    async updateBlog(id: URIParamsBlogIdModel,data: UpdateBlogModel, expectedStatusCode:HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {

        const response =  await request(app)
            .put(`${RouterPaths.blogs}/${id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            await request(app)
                .get(`${RouterPaths.blogs}/${id}`)
                .expect(HTTP_STATUSES.OK_200, {
                    id: id,
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                })
        }
        return {response: response};
    }
}