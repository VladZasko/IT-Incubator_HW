import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {ERRORS_MESSAGES} from "../../../src/utils/errors";
import {usersTestManager} from "../users/utils/usersTestManager";
import {dataTestUserCreate01, dataTestUserCreate02} from "../users/dataForTest/dataTestforUser";
import {dbControl} from "../../../src/db/db";
import {authTestManager} from "../auth/utils/authTestManager";
import {dataTestUserAuth} from "../auth/dataForTest/dataTestforAuth";

const getRequest = () => {
    return request(app)
}
describe('/securityDevices', () => {
    beforeAll(async () => {
        await dbControl.run()
    })

    beforeEach(async () => {
        await getRequest().delete('/testing/all-data')
    })

    afterAll(async () => {
        await dbControl.stop()
    })


    it('should return 200 and new access token and refresh token', async () => {

        const user = await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const token1 = await authTestManager.createToken(dataTestUserAuth)
        const token2 = await authTestManager.createToken(dataTestUserAuth)
        const token3 = await authTestManager.createToken(dataTestUserAuth)

        const resalt = await getRequest()
            .post(`${RouterPaths.security}/devices`)
            .set('Cookie', token1.refreshToken!)
            .expect(HTTP_STATUSES.OK_200)

        expect(resalt.body.length).toBe(3)
    })

    it('should return 401 with old refresh token /logout', async () => {

        await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const token = await authTestManager.createToken(dataTestUserAuth)

        await getRequest()
            .post(`${RouterPaths.auth}/logout`)
            .set('Cookie', token.refreshToken!)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .post(`${RouterPaths.auth}/refresh-token`)
            .set('Cookie', token.refreshToken!)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    })

    it('should return 204 logout', async () => {

        const user = await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const token = await authTestManager.createToken(dataTestUserAuth)

        const responseData = {
            email: user.createdEntity.email,
            login: user.createdEntity.login,
            userId: user.createdEntity.id
        }

        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer ${token.createdEntity.accessToken}`)
            .expect(HTTP_STATUSES.OK_200, responseData)

        await getRequest()
            .post(`${RouterPaths.auth}/refresh-token`)
            .set('Cookie', token.refreshToken!)
            .expect(HTTP_STATUSES.OK_200)

    })

    it('should return 200 access token and refresh token', async () => {

        const user = await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const token = await authTestManager.createToken(dataTestUserAuth)

        const responseData = {
            email: user.createdEntity.email,
            login: user.createdEntity.login,
            userId: user.createdEntity.id
        }

        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer ${token.createdEntity.accessToken}`)
            .expect(HTTP_STATUSES.OK_200, responseData)
    })

    it('should return 400 user with the given email already exists', async () => {

        await authTestManager.userEmailRegistration(dataTestUserCreate01)

        await authTestManager
            .userEmailRegistration(
                dataTestUserCreate01,
                HTTP_STATUSES.BAD_REQUEST_400,
                [
                    ERRORS_MESSAGES.USER_LOGIN,
                    ERRORS_MESSAGES.USER_EMAIL
                ]
            )

    })

    it('should return 204 email registration', async () => {

        await authTestManager.userEmailRegistration(dataTestUserCreate01)

    })

    it('should return 400  confirmation code is incorrect', async () => {

        const user = await authTestManager.userEmailRegistration(dataTestUserCreate01)

        const data = {
            ...user.createEntity!,
            emailConfirmation: {
                ...user.createEntity!.emailConfirmation!,
                confirmationCode: " 123"
            }
        }
        await authTestManager.userEmailConfirmation(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            [ERRORS_MESSAGES.AUTH_CODE]
        )
    })

    it('should return 400 email has already been confirmed.', async () => {

        const user = await authTestManager.userEmailRegistration(dataTestUserCreate01)

        await authTestManager.userEmailConfirmation(user.createEntity!)

        await authTestManager.userEmailConfirmation(
            user.createEntity!,
            HTTP_STATUSES.BAD_REQUEST_400,
            [ERRORS_MESSAGES.AUTH_CODE])
    })

    it('should return 204 email was verified. Account was activated', async () => {

        const user = await authTestManager.userEmailRegistration(dataTestUserCreate01)

        await authTestManager.userEmailConfirmation(user.createEntity!)
    })

    it('should return 400 with old code', async () => {

        const user = await authTestManager.userEmailRegistration(dataTestUserCreate01)

        await authTestManager.userEmailConfirmationResending(user.createEntity!)

        await authTestManager.userEmailConfirmation(
            user.createEntity!,
            HTTP_STATUSES.BAD_REQUEST_400,
            [
                ERRORS_MESSAGES.AUTH_CODE
            ]
        )
    })

    it('should return 204 email resending.', async () => {

        const user = await authTestManager.userEmailRegistration(dataTestUserCreate01)

        const userNewCode = await authTestManager.userEmailConfirmationResending(user.createEntity!)

        await authTestManager.userEmailConfirmation(userNewCode.createEntity!)
    })

})
