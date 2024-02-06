import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {ERRORS_MESSAGES} from "../../../src/utils/errors";
import {usersTestManager} from "../users/utils/usersTestManager";
import {dataTestUserCreate01, dataTestUserCreate02, incorrectUserData} from "../users/dataForTest/dataTestforUser";
import {authTestManager} from "./utils/authTestManager";
import {dataTestUserAuth} from "./dataForTest/dataTestforAuth";
import {dbControl} from "../../../src/db/db";
const getRequest = () => {
    return request(app)
}
describe('/auth', () => {
    beforeAll(async () => {
        await dbControl.run()
    })

    beforeEach(async () => {
        await getRequest().delete('/testing/all-data')
    })

    afterAll(async () => {
        await dbControl.stop()
    })

    it('should return 400 with empty login Or Email', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: '',
                password: dataTestUserCreate01.password
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400,
                {
                    errorsMessages: [ERRORS_MESSAGES.AUTH_LOGIN_OR_EMAIL]
                })
    })

    it('should return 400 with empty password', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: dataTestUserCreate01.login,
                password: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {errorsMessages: [ERRORS_MESSAGES.AUTH_PASSWORD]})
    })

    it('should return 401 incorrect password', async () => {

        await usersTestManager.createUserAdmin(dataTestUserCreate01)

        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail: dataTestUserCreate01.login,
                password: 'qwrty'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`should return 401 incorrect login Or Email`, async () => {
        await request(app)
            .post(`${RouterPaths.auth}/login`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                loginOrEmail: dataTestUserCreate02.login,
                password: dataTestUserCreate01.password
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should return 401 with Basic authorization ', async () => {

        await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const token = await authTestManager.createToken(dataTestUserAuth)

        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Basic ${token.createdEntity.accessToken}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should return 401 with not corresponding to JWT token ', async () => {
        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer YWRtaW46cXdlcnR5`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should return 401 with old refresh token', async () => {

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

        await getRequest()
            .post(`${RouterPaths.auth}/refresh-token`)
            .set('Cookie', token.refreshToken!)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    })

    it('should return 200 and new access token and refresh token', async () => {

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

    it('should return 400 if the inputModel has invalid email ', async () => {

        await authTestManager.userEmailRecoveryPassword(
            incorrectUserData.incorrectEmail,
            HTTP_STATUSES.BAD_REQUEST_400,
            [ERRORS_MESSAGES.USER_EMAIL])

    })

    it('should return 429 More than 5 attempts from one IP-address during 10 seconds', async () => {
        const user = await usersTestManager.createUserAdmin(dataTestUserCreate02)

        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)
        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)
        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)
        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)
        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)
        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email, HTTP_STATUSES.TOO_MANY_REQUESTS_429)

    })

    it('should return 204 send email for change password', async () => {
        const user = await usersTestManager.createUserAdmin(dataTestUserCreate02)

        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)

    })

    it("shouldn't change password 400 recoveryCode is incorrect", async () => {
        const user = await usersTestManager.createUserAdmin(dataTestUserCreate01)

        await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)

        const newPassword = {
            newPassword: "string",
            recoveryCode: "incorrect code"
        }

        await getRequest()
            .post(`${RouterPaths.auth}/new-password`)
            .send(newPassword)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [ERRORS_MESSAGES.AUTH_RECOVERY_CODE]
            })

        await authTestManager.createToken(dataTestUserAuth)
    })

/*    it("shouldn't change password 400 recoveryCode is expired", async () => {
        const user = await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const recoveryCode = await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)

        const expiredCodeData = {
            _id:new ObjectId(user.createdEntity.id),
            recoveryCode: recoveryCode.createEntity!.passwordRecovery!.recoveryCode,
            expirationDate: sub(new Date(), {
                minutes: 15
            })
        }
        await AuthRepository.passwordRecovery(expiredCodeData._id, expiredCodeData.recoveryCode, expiredCodeData.expirationDate)

        const newPassword = {
            newPassword: "string",
            recoveryCode: expiredCodeData.recoveryCode
        }

        await getRequest()
            .post(`${RouterPaths.auth}/new-password`)
            .send(newPassword)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [ERRORS_MESSAGES.AUTH_RECOVERY_CODE]
            })

        await authTestManager.createToken(dataTestUserAuth)
    })*/

    it('should return 204 change password', async () => {
        const user = await usersTestManager.createUserAdmin(dataTestUserCreate01)

        const recoveryCode = await authTestManager.userEmailRecoveryPassword(user.createdEntity.email)

        const newPassword = {
            newPassword: "string",
            recoveryCode: recoveryCode.createEntity!.passwordRecovery!.recoveryCode
        }

        await getRequest()
            .post(`${RouterPaths.auth}/new-password`)
            .send(newPassword)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await authTestManager.createToken(
            dataTestUserAuth,
            HTTP_STATUSES.UNAUTHORIZED_401
        )

        const userWithNewPassword = {
            ...dataTestUserAuth,
            password: newPassword.newPassword
        }

        await authTestManager.createToken(userWithNewPassword)
    })



})




