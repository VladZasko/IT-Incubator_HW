import request from 'supertest'
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {RouterPaths} from "../../src/routerPaths";




const getRequest = () => {
    return request(app)
}
describe('/auth', () => {

    it('should return 204 ', async () => {
        await getRequest()
            .post(RouterPaths.auth)
            .send({
            loginOrEmail:'TwoLon',
                password: 'qwerty'
        })
            .expect(HTTP_STATUSES.NO_CONTENT_204, {})
    })

    it('should return 404 incorrect login', async () => {
        await getRequest()
            .post(RouterPaths.auth)
            .send({
                loginOrEmail:'Twon',
                password: 'qwerty'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401, {})
    })
    it('should return 404 incorrect password', async () => {
        await getRequest()
            .post(RouterPaths.auth)
            .send({
                loginOrEmail:'TwoLon',
                password: 'qwrty'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401, {})
    })


})




