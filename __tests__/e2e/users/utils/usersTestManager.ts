import request from "supertest";
import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import {RouterPaths} from "../../../../src/routerPaths";
import {app} from "../../../../src/app";
import {ErrorMessage} from "../../../../src/utils/errors";
import {CreateUserModel} from "../../../../src/features/users/models/input/CreateUserModel";



export const usersTestManager = {
    async createUser(data: CreateUserModel,
                     expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
                     expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .post(RouterPaths.users)
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
                id: expect.any(String),
                login: data.login,
                email: data.email
            })
        }
        return {response: response, createdEntity: createdEntity};
    }
}

