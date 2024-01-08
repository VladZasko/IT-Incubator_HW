import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {createDBforFeedbackTest} from "./utils/createDBforFeedbackTest";
import {dataTestPostsCreate01} from "../posts/dataForTest/dataTestforPost";
import {postsTestManager} from "../posts/utils/postsTestManager";
import {dataTestFeedbackUpdate} from "./dataForTest/dataTestforFeedbacks";
import {commentatorInfoModel} from "../../../src/features/feedback/models/FeedbackViewModel";


const getRequest = () => {
    return request(app)
}
describe('/feedback tests', () => {
    let DBForTests: any = null
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')

        DBForTests = await createDBforFeedbackTest.createDB()
    })

    let createdNewComment01: any = null
    it(`should create comment`, async () => {

        const result = await request(app)
            .post(`${RouterPaths.posts}/${DBForTests.createdNewPost01.id}/comments` )
            .set('authorization', `Bearer ${DBForTests.tokenForUser01}`)
            .send(dataTestFeedbackUpdate)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewComment01 =  result.body

        await request(app)
            .get(`${RouterPaths.posts}/${DBForTests.createdNewPost01.id}/comments`)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewComment01]
            })
    })
})




