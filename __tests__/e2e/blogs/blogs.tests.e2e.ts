import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {blogsTestManager} from "./utils/blogsTestManager";
import {
    dataTestBlogCreate01, dataTestBlogCreate02,
    dataTestBlogUpdate01, dataTestPostByBlogCreate,
    incorrectBlogData
} from "./dataForTest/dataTestforBlog";
import {ErrorMessage, ERRORS_MESSAGES} from "../../../src/utils/errors";
import {dataTestPostsCreate01, incorrectPostData} from "../posts/dataForTest/dataTestforPost";
import {CreateBlogServiceModel} from "../../../src/features/blogs/models/input/CreateBlogModel";



const getRequest = () => {
    return request(app)
}
describe('/blogs tests', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 fot not existing blogs', async () => {
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
            name: incorrectBlogData.emptyName
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blog with name more than 15 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            name: incorrectBlogData.tooLongName
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blog with empty description`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            description: incorrectBlogData.emptyDescription
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with description more than 500 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            description: incorrectBlogData.tooLongDescription
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with empty websiteUrl`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectBlogData.emptyWebsiteUrl
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with websiteUrl more than 100 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectBlogData.tooLongWebsiteUrl
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with websiteUrl that does not match the pattern`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create blogs with incorrect data`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            name: incorrectBlogData.emptyName,
            description: incorrectBlogData.emptyDescription,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error:ErrorMessage = [
            ERRORS_MESSAGES.BLOG_WEBSITE_URL,
            ERRORS_MESSAGES.BLOG_NAME,
            ERRORS_MESSAGES.BLOG_DESCRIPTION
        ]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdNewBlog01:any = null
    it(`should create blog with correct input data`, async () => {

        const result = await blogsTestManager.createBlog(dataTestBlogCreate01)

        createdNewBlog01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewBlog01] })


    })

    let createdNewBlog02:any = null
    it(`created one more blogs`, async () => {

        const data: CreateBlogServiceModel = dataTestBlogCreate02

        const result = await blogsTestManager.createBlog(data)

        createdNewBlog02 = result.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [createdNewBlog02,createdNewBlog01 ]})
    })

    it(`shouldn't create post by blogId with empty title`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            title: incorrectPostData.emptyTitle
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create post by blogId with incorrect title`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            title: incorrectPostData.tooLongTitle
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create post by blogId with empty short description`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            shortDescription: incorrectPostData.emptyShortDescription
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create post by blogId with incorrect short description`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            shortDescription: incorrectPostData.tooLongShortDescription
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create post by blogId with empty content`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            content: incorrectPostData.emptyContent
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create post by blogId with incorrect title`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            content: incorrectPostData.tooLongContent
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it(`shouldn't create post by blogId with incorrect data`, async () => {

        const data = {
            ...dataTestPostsCreate01,
            title: incorrectPostData.emptyTitle,
            content: incorrectPostData.emptyContent,
            shortDescription: incorrectPostData.emptyShortDescription
        }
        const error:ErrorMessage = [
            ERRORS_MESSAGES.POST_SHORT_DESCRIPTION,
            ERRORS_MESSAGES.POST_TITLE,
            ERRORS_MESSAGES.POST_CONTENT]

        await blogsTestManager
            .createPostByBlog(createdNewBlog01,data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdNewPostByBlog01 :any= null
    it(`should create post by blogId`, async () => {

        const result = await blogsTestManager.createPostByBlog(createdNewBlog01,dataTestPostByBlogCreate)

        createdNewPostByBlog01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewPostByBlog01] })
    })

    it('should return post for blog', async () => {
        await getRequest()
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}/posts`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewPostByBlog01] })
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
            name: incorrectBlogData.emptyName
            }

        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blog with name more than 15 characters`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectBlogData.tooLongName
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blog with empty description`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            description: incorrectBlogData.emptyDescription
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with description more than 500 characters`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            description: incorrectBlogData.tooLongDescription
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]


        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with empty websiteUrl`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectBlogData.emptyWebsiteUrl
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with websiteUrl more than 100 characters`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectBlogData.tooLongWebsiteUrl
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with websiteUrl that does not match the pattern`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with incorrect data`, async () => {
        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectBlogData.emptyName,
            description: incorrectBlogData.emptyDescription,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error:ErrorMessage = [
            ERRORS_MESSAGES.BLOG_WEBSITE_URL,
            ERRORS_MESSAGES.BLOG_NAME,
            ERRORS_MESSAGES.BLOG_DESCRIPTION
        ]

        await blogsTestManager
            .updateBlog(createdNewBlog01, data, HTTP_STATUSES.BAD_REQUEST_400,error)

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
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

})




