import request from "supertest";
import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import {RouterPaths} from "../../../../src/routerPaths";
import {app} from "../../../../src/app";
import {ErrorMessage} from "../../../../src/utils/errors";
import {authModel} from "../../../../src/features/auth/models/authModels";
import {errors} from "../../../utils/error";



export const authTestManager = {
    async createToken(data: authModel,
                     expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200,
                     expectedErrorsMessages?: ErrorMessage) {

        const result = await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(result.body, expectedErrorsMessages)
        }

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            createdEntity = result.body;
            expect(createdEntity).toEqual(
                result.body
            )
        }
        return {response: result, createdEntity: createdEntity};
    }
}