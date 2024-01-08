import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {usersTestManager} from "./utils/usersTestManager";


const getRequest = () => {
    return request(app)
}
describe('query tests for /users', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    let createdNewUsers:any = []
    it(`should create 12 users with correct input data`, async () => {

        for (let i = 0; i < 12; i++){
            const data = {
                login: `NewLog${i}`,
                email: `newemail${i}@gmail.com`,
                password: `Qwerty${i}23`
            }
            const result = await usersTestManager.createUser(data)
            createdNewUsers.unshift(result.createdEntity)
        }

        await request(app)
            .get(`${RouterPaths.users}/?pageSize=15`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: createdNewUsers
                })
    })
    it('should return page 3 and page size 3', async () => {
        await getRequest()
            .get(`${RouterPaths.users}/?pageSize=3&pageNumber=3`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 4,
                    page: 3,
                    pageSize: 3,
                    totalCount: 12,
                    items: createdNewUsers.slice(6,9) })
    })

    it('should return posts "asc" ', async () => {
        let users = []
        for (let i = 0; i < createdNewUsers.length; i++){
            users.unshift(createdNewUsers[i])
        }
        await getRequest()
            .get(`${RouterPaths.users}/?pageSize=15&sortDirection=asc`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items:users
                })
    })

    it('should return user with "og9" in login ', async () => {
        await getRequest()
            .get(`${RouterPaths.users}/?searchLoginTerm=og9`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items:[ createdNewUsers[2] ]})
    })

    it('should return user with "il8" in email ', async () => {
        await getRequest()
            .get(`${RouterPaths.users}/?searchEmailTerm=il8`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items:[ createdNewUsers[3] ]})
    })

})




