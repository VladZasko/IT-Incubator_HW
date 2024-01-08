import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {blogsTestManager} from "./utils/blogsTestManager";
import {dataTestBlogCreate01, dataTestPostByBlogCreate} from "./dataForTest/dataTestforBlog";


const getRequest = () => {
    return request(app)
}
describe('test for query /blogs', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })

    let createdNewBlog01: any = []
    it(`should create 12 blogs with correct input data`, async () => {

        for (let i = 0; i < 12; i++) {
            const data = {
                name: `${dataTestBlogCreate01.name}${i}`,
                description: `${dataTestBlogCreate01.description}${i}`,
                websiteUrl: dataTestBlogCreate01.websiteUrl
            }

            const result = await blogsTestManager.createBlog(data)

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
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 4,
                    page: 3,
                    pageSize: 3,
                    totalCount: 12,
                    items: createdNewBlog01.slice(6, 9)
                })
    })

    it('should return blog with "me9" ', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/?searchNameTerm=me9`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [createdNewBlog01[2]]
                })
    })

    it('should return blogs "asc" ', async () => {
        let blog = []
        for (let i = 0; i < createdNewBlog01.length; i++) {
            blog.unshift(createdNewBlog01[i])
        }

        await getRequest()
            .get(`${RouterPaths.blogs}/?pageSize=15&sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: blog
                })
    })

    let createdNewPostByBlog: any = []
    it(`should create 10 posts by blogs with correct input data`, async () => {

        for (let i = 0; i < 12; i++) {
            const data = {
                title: `${dataTestPostByBlogCreate.title}${i}`,
                shortDescription: `${dataTestPostByBlogCreate.shortDescription}${i}`,
                content: `${dataTestPostByBlogCreate.content}${i}`,
            }

            const result =
                await blogsTestManager.createPostByBlog(createdNewBlog01[0], data)

            createdNewPostByBlog.unshift(result.createdEntity)
        }

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01[0].id}/posts/?pageSize=15`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: createdNewPostByBlog
                })
    })

    it('should return page 3 and page size 3', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/${createdNewBlog01[0].id}/posts/?pageSize=3&pageNumber=3`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 4,
                    page: 3,
                    pageSize: 3,
                    totalCount: 12,
                    items: createdNewPostByBlog.slice(6, 9)
                })
    })

    it('should return posts by blogs "asc" ', async () => {
        let postByBlog = []
        for (let i = 0; i < createdNewPostByBlog.length; i++) {
            postByBlog.unshift(createdNewPostByBlog[i])
        }

        await getRequest()
            .get(`${RouterPaths.blogs}/${createdNewBlog01[0].id}/posts/?pageSize=15&sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: postByBlog
                })
    })
})




