import request from "supertest";
import {CreateBlogServiceModel, CreatePostBlogModel} from "../../../../src/features/blogs/models/input/CreateBlogModel";
import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import {RouterPaths} from "../../../../src/routerPaths";
import {app} from "../../../../src/app";
import {UpdateBlogModel} from "../../../../src/features/blogs/models/input/UpdateBlogModule";
import {BlogType} from "../../../../src/db/types/blogs.types";
import {ErrorMessage} from "../../../../src/utils/errors";
import {CreateFeedbackModel} from "../../../../src/features/feedback/models/CreateFeedbackModel";
import {PostType} from "../../../../src/db/types/posts.types";



export const feedbacksTestManager = {
    async createComment(data: CreateFeedbackModel,
                     post: any,
                     token: any,
                     expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
                     expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .post(`${RouterPaths.posts}/${post.id}/comments`)
            .set('authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedStatusCode)

        let errorMessage;
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            errorMessage = response.body;
            expect(errorMessage).toEqual({
                errorsMessages: expectedErrorsMessages
            })
        }

        let createdEntity = response.body;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                ...createdEntity,
                id: expect.any(String),
                content: data.content
            })
        }
        return {response: response, createdEntity: createdEntity};
    },

    async updateComment(data: CreateFeedbackModel,
                        comment: any,
                        token: any,
                        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                        expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .put(`${RouterPaths.feedbacks}/${comment.id}`)
            .set('authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedStatusCode)

        let errorMessage;
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            errorMessage = response.body;
            expect(errorMessage).toEqual({
                errorsMessages: expectedErrorsMessages
            })
        }

        if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
            await request(app)
                .get(`${RouterPaths.feedbacks}/${comment.id}`)
                .expect(HTTP_STATUSES.OK_200, {
                    ...comment,
                    content: data.content
                })
        }
        return {response: response};
    }
}