import request from "supertest";
import {HTTP_STATUSES, HttpStatusType} from "../../../../src/utils/utils";
import {RouterPaths} from "../../../../src/routerPaths";
import {app} from "../../../../src/app";
import {ErrorMessage} from "../../../../src/utils/errors";
import {authModel} from "../../../../src/features/auth/models/authModels";
import {errors} from "../../../utils/error";
import {CreateUserModel} from "../../../../src/features/users/models/input/CreateUserModel";
import {emailAdapter} from "../../../../src/features/auth/adapters/email-adapter";
import {userQueryRepository} from "../../../../src/features/users/repositories/user-query-repository";
import {dataTestUserCreate01} from "../../users/dataForTest/dataTestforUser";
import {UserAuthDBType, UserAuthType, UserType} from "../../../../src/db/types/users.types";



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
    },
    async userEmailRegistration(data: CreateUserModel,
                                expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                                expectedErrorsMessages?: ErrorMessage) {

        jest.spyOn(emailAdapter, "sendCode").mockImplementation(() => Promise.resolve(true))

        const response = await request(app)
            .post(`${RouterPaths.auth}/registration`)
            .send(data)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

        const user = await userQueryRepository.findByLoginOrEmail(dataTestUserCreate01.email)

        if(expectedStatusCode ===HTTP_STATUSES.NO_CONTENT_204) {
            expect(user!.accountData.login).toBe(data.login)
            expect(user!.emailConfirmation!.isConfirmed).toBe(false)
        }
        return {response: response, createEntity: user};
    },
    async userEmailConfirmation(data: UserAuthDBType,
                                expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                                expectedErrorsMessages?: ErrorMessage) {

        const response = await request(app)
            .post(`${RouterPaths.auth}/registration-confirmation`)
            .send({code: data.emailConfirmation!.confirmationCode})
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

        if(expectedStatusCode ===HTTP_STATUSES.NO_CONTENT_204) {
            const userConfirmation = await userQueryRepository.findByLoginOrEmail(dataTestUserCreate01.email)

            expect(userConfirmation!.accountData.login).toBe(data.accountData.login)
            expect(userConfirmation!.emailConfirmation!.isConfirmed).toBe(true)
        }

        return {response: response};
    }
}