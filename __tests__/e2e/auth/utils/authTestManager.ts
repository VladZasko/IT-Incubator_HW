import request from "supertest";
import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import {RouterPaths} from "../../../../src/routerPaths";
import {app} from "../../../../src/app";
import {ErrorMessage} from "../../../../src/utils/errors";
import {authModel} from "../../../../src/features/auth/models/authModels";



export const authTestManager = {
    async createToken(data: authModel,
                     expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200,
                     expectedErrorsMessages?: ErrorMessage) {

        const result = await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send(data)
            .expect(expectedStatusCode)

        let errorMessage;
        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            errorMessage = result.body;
            expect(errorMessage).toEqual({
                errorsMessages: expectedErrorsMessages
            })
        }

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            createdEntity = result.body;
            expect(createdEntity).toEqual(
                result.body
            )
        }
        return {response: result, createdEntity: createdEntity};
    },

    // async updateComment(createdNewBlog01: BlogType,
    //                  data: UpdateBlogModel,
    //                  expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
    //                  expectedErrorsMessages?: ErrorMessage) {
    //
    //     const response = await request(app)
    //         .put(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
    //         .set('authorization', 'Basic YWRtaW46cXdlcnR5')
    //         .send(data)
    //         .expect(expectedStatusCode)
    //
    //     let errorMessage;
    //     if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
    //         errorMessage = response.body;
    //         expect(errorMessage).toEqual({
    //             errorsMessages: expectedErrorsMessages
    //         })
    //     }
    //
    //     if (expectedStatusCode === HTTP_STATUSES.NO_CONTENT_204) {
    //         await request(app)
    //             .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
    //             .expect(HTTP_STATUSES.OK_200, {
    //                 ...createdNewBlog01,
    //                 name: data.name,
    //                 description: data.description,
    //                 websiteUrl: data.websiteUrl
    //             })
    //     }
    //     return {response: response};
    // }
}