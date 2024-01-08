import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {blogsTestManager} from "../blogs/utils/blogsTestManager";
import {postsTestManager} from "./utils/postsTestManager";
import {dataTestBlogCreate01} from "../blogs/dataForTest/dataTestforBlog";
import {dataTestPostsCreate01} from "./dataForTest/dataTestforPost";


const getRequest = () => {
    return request(app)
}
describe('/posts', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })

    let createdNewBlog01: any= null
    it(`should create blog for tests post with correct input data`, async () => {

        const resultBlog01 =
            await blogsTestManager.createBlog(dataTestBlogCreate01)

        createdNewBlog01 = resultBlog01.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewBlog01]
            })
    })

    let createdNewPost:any = []
    it(`should create 12 posts with correct input data`, async () => {

        for (let i = 0; i < 12; i++){
            const data = {
                title: `${dataTestPostsCreate01.title}${i}`,
                shortDescription: `${dataTestPostsCreate01.shortDescription}${i}`,
                content: `${dataTestPostsCreate01.content}${i}`,
                blogId: createdNewBlog01.id
            }
            const result = await postsTestManager.createPost(data)
            createdNewPost.unshift(result.createdEntity)
        }

        await request(app)
            .get(`${RouterPaths.posts}/?pageSize=15`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: createdNewPost
                })
    })
    it('should return page 3 and page size 3', async () => {
        await getRequest()
            .get(`${RouterPaths.posts}/?pageSize=3&pageNumber=3`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 4,
                    page: 3,
                    pageSize: 3,
                    totalCount: 12,
                    items: createdNewPost.slice(6,9) })
    })

    it('should return posts "asc" ', async () => {
        let posts = []
        for (let i = 0; i < createdNewPost.length; i++){
            posts.unshift(createdNewPost[i])
        }
        await getRequest()
            .get(`${RouterPaths.posts}/?pageSize=15&sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 15, totalCount: 12, items:posts })
    })

})




