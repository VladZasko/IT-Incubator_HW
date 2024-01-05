import request from 'supertest'
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils/utils";
import {RouterPaths} from "../../src/routerPaths";
import {usersTestManager} from "./users/utils/usersTestManager";
import {dataTestUserCreate01} from "./users/dataForTest/dataTestforUser";




const getRequest = () => {
    return request(app)
}
describe('/auth', () => {
    // beforeAll(async() => {
    //     await getRequest().delete('/testing/all-data')
    // })
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

    it('should return 204 ', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
            loginOrEmail:'NewLog',
                password: 'Qwerty123'
        })
            .expect(HTTP_STATUSES.CREATED_201, {})
    })

    it('should return 200 ', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/me`)
            .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTk3NDZmZTE1YmVjMmFmZDhjMGE5ZGUiLCJpYXQiOjE3MDQ0MTI5MjYsImV4cCI6MTcwNDQxNjUyNn0.nccPRUWrm8kbjN4biQ5NLFN2h35I2qqLyZBBG5OnsFE')
            .expect(HTTP_STATUSES.OK_200, {})
    })

    it('should return 404 incorrect login', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:'Twon',
                password: 'Qwerty123'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401, {})
    })
    it('should return 404 incorrect password', async () => {
        await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:'NewLog',
                password: 'qwrty'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401, {})
    })


})




