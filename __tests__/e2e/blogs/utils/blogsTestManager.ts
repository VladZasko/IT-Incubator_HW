import request from "supertest";
import {CreateBlogServiceModel, CreatePostBlogModel} from "../../../../src/features/blogs/models/input/CreateBlogModel";
import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import {RouterPaths} from "../../../../src/routerPaths";
import {app} from "../../../../src/app";
import {UpdateBlogModel} from "../../../../src/features/blogs/models/input/UpdateBlogModule";
import {BlogType} from "../../../../src/db/types/blogs.types";
import {ErrorMessage} from "../../../../src/utils/errors";
import {errors} from "../../../utils/error";


export const blogsTestManager = {
    async createBlog(data: CreateBlogServiceModel,
                     expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
                     expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .post(RouterPaths.blogs)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

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

    async createBlogs(data: CreateBlogServiceModel) {

        const blogs = []

        for (let i = 0; i < 12; i++) {
            const dataBlogs = {
                ...data,
                name: `${data.name}${i}`,
                description: `${data.description}${i}`
            }
            const result = await blogsTestManager.createBlog(dataBlogs)

            blogs.unshift(result.createdEntity)
        }

        return blogs;
    },

    async createPostByBlog(createdNewBlog01: BlogType,
                           data: CreatePostBlogModel,
                           expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
                           expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .post(`${RouterPaths.blogs}/${createdNewBlog01.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                ...createdEntity,
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
            })
        }
        return {response: response, createdEntity: createdEntity};
    },

    async createPostsByBlog(blog: BlogType, data: CreatePostBlogModel
    ) {

        const postsByBlogs = []

        for (let i = 0; i < 12; i++) {
            const dataPosts = {
                title: `${data.title}${i}`,
                shortDescription: `${data.shortDescription}${i}`,
                content: `${data.content}${i}`,
            }

            const result = await blogsTestManager.createPostByBlog(blog, dataPosts)

            postsByBlogs.unshift(result.createdEntity)
        }

        return postsByBlogs;
    },

    async updateBlog(createdNewBlog01: BlogType,
                     data: UpdateBlogModel,
                     expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                     expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .put(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

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