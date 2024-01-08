import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {blogsTestManager} from "./utils/blogsTestManager";
import {dataTestBlogCreate, dataTestPostByBlogCreate} from "./dataForTest/dataTestforFeedbacks";
import {dataTestPostCreate01} from "../posts/dataForTest/dataTestforPost";
import {postsTestManager} from "../posts/utils/postsTestManager";
import {usersTestManager} from "../users/utils/usersTestManager";
import {dataTestUserCreate01} from "../users/dataForTest/dataTestforUser";



const getRequest = () => {
    return request(app)
}
describe('test for query /feedbacks', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    let createdNewBlog01:any = null
    let createdNewPost01: any = null
    let createdNewUser01:any = null
    let token:any = null

    it(`should create post, blog and user for feedback tests`, async () => {

        const resultBlog = await blogsTestManager.createBlog(dataTestBlogCreate[0])

        createdNewBlog01 = resultBlog.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewBlog01]
            })

        const data = {
            ...dataTestPostCreate01,
            blogId: createdNewBlog01.id
        }


        const resultPost = await postsTestManager.createPost(data)

        createdNewPost01 = resultPost.createdEntity;

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewPost01]
            })

        const resultUser = await usersTestManager.createUser(dataTestUserCreate01)

        createdNewUser01 = resultUser.createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [createdNewUser01] })

        const resultToken = await getRequest()
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:dataTestUserCreate01.login,
                password: dataTestUserCreate01.password
            })
            .expect(HTTP_STATUSES.OK_200)

        token = resultToken.body.accessToken

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

    it(`should create 12 feedbacks with correct input data`, async () => {

        for (let i = 0; i < dataTestBlogCreate.length; i++){
            const result = await blogsTestManager.createBlog(dataTestBlogCreate[i])
            createdNewBlog01.unshift(result.createdEntity)
        }

        await request(app)
            .get(`${RouterPaths.blogs}/?pageSize=15`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: createdNewBlog01
                })
    })

    it('should return page 3 and empty page size 3', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/?pageSize=3&pageNumber=3`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 4, page: 3, pageSize: 3, totalCount: 12, items: createdNewBlog01.slice(6,9) })
    })

    it('should return blog with "eW" ', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/?searchNameTerm=eW`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items:[ createdNewBlog01[0] ]})
    })

    it('should return blogs "asc" ', async () => {
        let blog = []
        for (let i = 0; i < createdNewBlog01.length; i++){
            blog.unshift(createdNewBlog01[i])
        }
        await getRequest()
            .get(`${RouterPaths.blogs}/?pageSize=15&sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 15, totalCount: 12, items:blog })
    })

    let createdNewPostByBlog:any = []
    it(`should create 10 posts by blogs with correct input data`, async () => {

        for (let i = 0; i < dataTestPostByBlogCreate.length; i++){
            const result = await blogsTestManager.createPostByBlog(createdNewBlog01[0],dataTestPostByBlogCreate[i])
            createdNewPostByBlog.unshift(result.createdEntity)
        }

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01[0].id}/posts`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 10,
                    items: createdNewPostByBlog
                })
    })

    it('should return page 3 and page size 3', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/${createdNewBlog01[0].id}/posts/?pageSize=3&pageNumber=3`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 4, page: 3, pageSize: 3, totalCount: 10, items: createdNewPostByBlog.slice(6,9) })
    })

    it('should return posts by blogs "asc" ', async () => {
        let postByBlog = []
        for (let i = 0; i < createdNewPostByBlog.length; i++){
            postByBlog.unshift(createdNewPostByBlog[i])
        }
        await getRequest()
            .get(`${RouterPaths.blogs}/${createdNewBlog01[0].id}/posts/?sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 10, items:postByBlog })
    })
})




