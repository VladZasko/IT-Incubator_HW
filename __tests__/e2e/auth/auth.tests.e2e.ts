import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {ERRORS_MESSAGES} from "../../../src/utils/errors";
import {usersTestManager} from "../users/utils/usersTestManager";
import {dataTestUserCreate01, dataTestUserCreate02} from "../users/dataForTest/dataTestforUser";
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

        await usersTestManager.createUser(dataTestUserCreate01)

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

    it('should return 200 and token', async () => {

        const user = await usersTestManager.createUser(dataTestUserCreate01)

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

    it('should return 401 with Basic authorization ', async () => {

        await usersTestManager.createUser(dataTestUserCreate01)

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
})




