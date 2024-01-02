import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {ErrorMessage, ERRORS_MESSAGES} from "../../../src/utils/errors";
import {dataTestUserCreate01, dataTestUserCreate02, incorrectUserData} from "./dataForTest/dataTestforUser";
import {usersTestManager} from "./utils/usersTestManager";



const getRequest = () => {
    return request(app)
}
describe('/user', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 fot not existing users', async () => {
        await getRequest()
            .get(`${RouterPaths.users}/1`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create user with UNAUTHORIZED`, async () => {
        await request(app)
            .post(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW')
            .send(dataTestUserCreate01)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create user with empty login`, async () => {

        const data = {
            ...dataTestUserCreate01,
            login: incorrectUserData.emptyLogin
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_LOGIN]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create user with login more than 10 characters`, async () => {
        const data = {
            ...dataTestUserCreate01,
            login: incorrectUserData.tooLongLogin
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_LOGIN]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create user with empty email`, async () => {
        const data = {
            ...dataTestUserCreate01,
            email: incorrectUserData.emptyEmail
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_EMAIL]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create user with incorrect email`, async () => {
        const data = {
            ...dataTestUserCreate01,
            email: incorrectUserData.incorrectEmail
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_EMAIL]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create user with empty password`, async () => {
        const data = {
            ...dataTestUserCreate01,
            password: incorrectUserData.emptyPassword
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_PASSWORD]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create user with password more than 20 characters`, async () => {
        const data = {
            ...dataTestUserCreate01,
            password: incorrectUserData.tooLongPassword
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_PASSWORD]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with password that does not match the pattern`, async () => {
        const data = {
            ...dataTestUserCreate01,
            password: incorrectUserData.incorrectPassword
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_PASSWORD]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with incorrect data`, async () => {
        const data = {
            ...dataTestUserCreate01,
            login: incorrectUserData.emptyLogin,
            email: incorrectUserData.emptyEmail,
            password: incorrectUserData.incorrectPassword
        }
        const error:ErrorMessage = [
            ERRORS_MESSAGES.POST_LOGIN,
            ERRORS_MESSAGES.POST_PASSWORD,
            ERRORS_MESSAGES.POST_EMAIL
        ]

        await usersTestManager
            .createUser(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdNewUser01:any = null
    it(`should create user with correct input data`, async () => {

        const result = await usersTestManager.createUser(dataTestUserCreate01)

        createdNewUser01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewUser01] })
    })

    let createdNewUser02:any = null
    it(`created one more users`, async () => {
        const result = await usersTestManager.createUser(dataTestUserCreate02)

        createdNewUser02 = result.createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [createdNewUser02,createdNewUser01 ]})
    })

    it(`shouldn't delete  user UNAUTHORIZED`, async () => {

        await request(app)
            .delete(`${RouterPaths.users}/${createdNewUser01.id}`)
            .set('authorization', 'Basic YWRtaW')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't delete  user`, async () => {

        await request(app)
            .delete(`${RouterPaths.users}/7779161`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should delete both user`, async () => {

        await request(app)
            .delete(`${RouterPaths.users}/${createdNewUser01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdNewUser01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.users}/${createdNewUser02.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.users}/${createdNewUser02.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

})




