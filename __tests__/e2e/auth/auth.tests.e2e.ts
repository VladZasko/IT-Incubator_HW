import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {ERRORS_MESSAGES} from "../../../src/utils/errors";
import {usersTestManager} from "../users/utils/usersTestManager";
import {dataTestUserCreate01, dataTestUserCreate02} from "../users/dataForTest/dataTestforUser";
import {blogsTestManager} from "../blogs/utils/blogsTestManager";
import {dataTestBlogCreate01} from "../blogs/dataForTest/dataTestforBlog";
import {authTestManager} from "./utils/authTestManager";
import {dataTestUserAuth} from "./dataForTest/dataTestforAuth";

const getRequest = () => {
    return request(app)
}
describe('/auth', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    let createdNewUser01:any = null
    it(`should create user for auth tests`, async () => {

        const result = await usersTestManager.createUser(dataTestUserCreate01)

        createdNewUser01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewUser01] })
    })

    it('should return 400 with empty login Or Email', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:'',
                password: dataTestUserCreate01.password
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400,{errorsMessages: [ERRORS_MESSAGES.AUTH_LOGIN_OR_EMAIL]})
    })

    it('should return 400 with empty password', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:dataTestUserCreate01.login,
                password: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400,{errorsMessages: [ERRORS_MESSAGES.AUTH_PASSWORD]})
    })
    it('should return 401 incorrect password', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:dataTestUserCreate01.login,
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

    let token:any = null
    it('should return 200 and token', async () => {

        const result = await authTestManager.createToken(dataTestUserAuth)

        token = result.createdEntity.accessToken

        const responseData = {
            email: createdNewUser01.email,
            login: createdNewUser01.login,
            userId: createdNewUser01.id
        }

        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer ${token}`)
            .expect(HTTP_STATUSES.OK_200, responseData)
    })

    it('should return 401 with Basic authorization ', async () => {
        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Basic ${token}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should return 401 with not corresponding to JWT token ', async () => {
        await getRequest()
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer YWRtaW46cXdlcnR5`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
})




