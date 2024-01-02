import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import request from "supertest";
import {app} from "../../../../src/app";
import {RouterPaths} from "../../../../src/routerPaths";
import {CreatePostServiceModel} from "../../../../src/features/posts/models/CreatePostServiceModel";
import {URIParamsPostIdModel} from "../../../../src/features/posts/models/URIParamsPostIdModule";
import {UpdatePostModel} from "../../../../src/features/posts/models/UpdatePostModule";
import {ErrorMessage} from "../../../../src/utils/errors";

export const postsTestManager = {
    async createPost(data: CreatePostServiceModel,
                     expectedStatusCode:HttpStatusType = HTTP_STATUSES.CREATED_201,
                     expectedErrorsMessages?: ErrorMessage) {

        const response =  await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        let errorMessage;
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            errorMessage = response.body;
            expect(errorMessage).toEqual({
                errorsMessages: expectedErrorsMessages
            })
        }

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

    async updatePost(paths: URIParamsPostIdModel,
                     data: UpdatePostModel,
                     expectedStatusCode:HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                     expectedErrorsMessages?: ErrorMessage) {

        const response =  await request(app)
            .put(`${RouterPaths.posts}/${paths.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(expectedStatusCode)

        let errorMessage;
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            errorMessage = response.body;
            expect(errorMessage).toEqual({
                errorsMessages: expectedErrorsMessages
            })
        }

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