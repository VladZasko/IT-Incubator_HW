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
import {dataTestUserCreate01, dataTestUserCreate02} from "../../users/dataForTest/dataTestforUser";
import {UserAuthDBType} from "../../../../src/db/types/users.types";


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
        let refreshToken;
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            createdEntity = result.body;
            refreshToken= result.header['set-cookie']
            expect(createdEntity).toEqual(
                result.body
            )
        }
        return {response: result, createdEntity: createdEntity, refreshToken:refreshToken};
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
            const userConfirmation = await userQueryRepository.findByLoginOrEmail(data.accountData.email)

            expect(userConfirmation!.accountData.login).toBe(data.accountData.login)
            expect(userConfirmation!.emailConfirmation!.isConfirmed).toBe(true)
        }

        return {response: response};
    },
    async userEmailConfirmationResending(data: UserAuthDBType,
                                expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                                expectedErrorsMessages?: ErrorMessage) {

        jest.spyOn(emailAdapter, "sendNewCode").mockImplementation(() => Promise.resolve(true))

        const response = await request(app)
            .post(`${RouterPaths.auth}/registration-email-resending`)
            .send({email:data.accountData.email})
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

        const userConfirmation = await userQueryRepository.findByLoginOrEmail(dataTestUserCreate01.email)

        if(expectedStatusCode ===HTTP_STATUSES.NO_CONTENT_204) {
            expect(userConfirmation!.accountData.login).toBe(data.accountData.login)
            expect(userConfirmation!.emailConfirmation!.confirmationCode).not.toBe(data.emailConfirmation!.confirmationCode)
        }

        return {response: response, createEntity: userConfirmation};
    },
    async userEmailRecoveryPassword(email: string,
                                expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
                                expectedErrorsMessages?: ErrorMessage) {

        jest.spyOn(emailAdapter, "sendRecoveryCode").mockImplementation(() => Promise.resolve(true))

        const response = await request(app)
            .post(`${RouterPaths.auth}/password-recovery`)
            .send({email:email})
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400) {
            await errors.errors(response.body, expectedErrorsMessages)
        }

        const user = await userQueryRepository.findByLoginOrEmail(email)

        if(expectedStatusCode ===HTTP_STATUSES.NO_CONTENT_204) {
            expect(user!.passwordRecovery!.recoveryCode).toEqual(expect.any(String))
            expect(user!.passwordRecovery!.expirationDate).toEqual(expect.any(Date))
        }
        return {response: response, createEntity: user};
    },
}