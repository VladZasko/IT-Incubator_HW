import request from 'supertest'
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {CreateBlogModel} from "../../src/features/blogs/models/CreateBlogModel";
import {RouterPaths} from "../../src/routerPaths";
import {blogsTestManager} from "./utils/blogsTestManager";
import {
    dataTestBlogCreate01,
    dataTestBlogCreate02,
    dataTestBlogUpdate01,
    incorrectData
} from "./dataForTest/dataTestforBlog";


const getRequest = () => {
    return request(app)
}
describe('/blogs', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    it ('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it ('should return 404 fot not existing blogs', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create blog with UNAUTHORIZED`, async () => {
        await request(app)
            .post(RouterPaths.blogs)
            .set('authorization', 'Basic YWRtaW')
            .send(dataTestBlogCreate01)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create blog with empty name`, async () => {

        const data = {
            ...dataTestBlogCreate01,
            name: incorrectData.emptyName
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blog with name more than 15 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            name: incorrectData.tooLongName
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blog with empty description`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            description: incorrectData.emptyDescription
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with description more than 500 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            description: incorrectData.tooLongDescription
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with empty websiteUrl`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectData.emptyWebsiteUrl
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with websiteUrl more than 100 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectData.tooLongWebsiteUrl
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with websiteUrl that does not match the pattern`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectData.incorrectWebsiteUrl
        }
        await blogsTestManager.createBlog(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdNewBlog01:any = null
    it(`should create blog with correct input data`, async () => {

        const result = await blogsTestManager.createBlog(dataTestBlogCreate01)

        createdNewBlog01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [createdNewBlog01])
    })

    let createdNewBlog02:any = null
    it(`created one more blogs`, async () => {

        const data: CreateBlogModel = dataTestBlogCreate02

        const result = await blogsTestManager.createBlog(data)

        createdNewBlog02 = result.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [createdNewBlog01, createdNewBlog02])
    })

    it ('should return 404 fot not existing blogs for update', async () => {

        await getRequest()
            .put(`${RouterPaths.blogs}/11515`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(dataTestBlogUpdate01)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't update blog with UNAUTHORIZED`, async () => {

        await request(app)
            .put(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW')
            .send(dataTestBlogUpdate01)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't update blog with empty name`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectData.emptyName
            }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blog with name more than 15 characters`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectData.tooLongName
        }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blog with empty description`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            description: incorrectData.emptyDescription
        }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with description more than 500 characters`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            description: incorrectData.tooLongDescription
        }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with empty websiteUrl`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectData.emptyWebsiteUrl
        }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with websiteUrl more than 100 characters`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectData.tooLongWebsiteUrl
        }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with websiteUrl that does not match the pattern`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectData.incorrectWebsiteUrl
        }

        await blogsTestManager.updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`should update blog with correct input module`, async () => {
        await blogsTestManager.updateBlog(createdNewBlog01, dataTestBlogUpdate01)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog02.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog02)
    })

    it(`shouldn't delete  blog UNAUTHORIZED`, async () => {

        await request(app)
            .delete(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't delete  blog`, async () => {

        await request(app)
            .delete(`${RouterPaths.blogs}/7779161`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should delete both blog`, async () => {

        await request(app)
            .delete(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.blogs}/${createdNewBlog02.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog02.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

})




