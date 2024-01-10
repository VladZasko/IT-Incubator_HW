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
import {dbControl} from "../../../src/db/db";


const getRequest = () => {
    return request(app)
}
describe('/feedback tests', () => {
    beforeAll(async () => {
        await dbControl.run()
    })

    beforeEach(async () => {
        await getRequest().delete('/testing/all-data')
    })

    afterAll(async () => {
        await dbControl.stop()
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
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

        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blog with name more than 15 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            name: incorrectBlogData.tooLongName
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blog with empty description`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            description: incorrectBlogData.emptyDescription
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blogs with description more than 500 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            description: incorrectBlogData.tooLongDescription
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blogs with empty websiteUrl`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectBlogData.emptyWebsiteUrl
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blogs with websiteUrl more than 100 characters`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectBlogData.tooLongWebsiteUrl
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blogs with websiteUrl that does not match the pattern`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create blogs with incorrect data`, async () => {
        const data = {
            ...dataTestBlogCreate01,
            name: incorrectBlogData.emptyName,
            description: incorrectBlogData.emptyDescription,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error: ErrorMessage = [
            ERRORS_MESSAGES.BLOG_WEBSITE_URL,
            ERRORS_MESSAGES.BLOG_NAME,
            ERRORS_MESSAGES.BLOG_DESCRIPTION
        ]

        await blogsTestManager
            .createBlog(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`should create blog with correct input data`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [blog.createdEntity]
                })


    })

    it(`created one more blogs`, async () => {
        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const blog2 = await blogsTestManager.createBlog(dataTestBlogCreate02)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [blog2.createdEntity, blog.createdEntity]
                })
    })

    it(`shouldn't create post by blogId with empty title`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            title: incorrectPostData.emptyTitle
        }

        const error: ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create post by blogId with incorrect title`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            title: incorrectPostData.tooLongTitle
        }

        const error: ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create post by blogId with empty short description`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            shortDescription: incorrectPostData.emptyShortDescription
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create post by blogId with incorrect short description`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            shortDescription: incorrectPostData.tooLongShortDescription
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create post by blogId with empty content`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            content: incorrectPostData.emptyContent
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create post by blogId with incorrect title`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            content: incorrectPostData.tooLongContent
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create post by blogId with incorrect data`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const data = {
            ...dataTestPostsCreate01,
            title: incorrectPostData.emptyTitle,
            content: incorrectPostData.emptyContent,
            shortDescription: incorrectPostData.emptyShortDescription
        }
        const error: ErrorMessage = [
            ERRORS_MESSAGES.POST_SHORT_DESCRIPTION,
            ERRORS_MESSAGES.POST_TITLE,
            ERRORS_MESSAGES.POST_CONTENT]

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`should create post by blogId`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const postByBlog = await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [postByBlog.createdEntity]
                })
    })

    it('should return post for blog', async () => {
        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const postByBlog = await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        await getRequest()
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}/posts`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [postByBlog.createdEntity]
                })
    })

    it(`shouldn't update blog with UNAUTHORIZED`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const postByBlog = await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        await request(app)
            .put(`${RouterPaths.blogs}/${postByBlog.createdEntity.id}`)
            .set('authorization', 'Basic YWRtaW')
            .send(dataTestBlogUpdate01)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't update blog with empty name`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager.createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectBlogData.emptyName
        }

        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blog with name more than 15 characters`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectBlogData.tooLongName
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_NAME]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blog with empty description`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            description: incorrectBlogData.emptyDescription
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blogs with description more than 500 characters`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            description: incorrectBlogData.tooLongDescription
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_DESCRIPTION]


        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blogs with empty websiteUrl`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectBlogData.emptyWebsiteUrl
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blogs with websiteUrl more than 100 characters`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectBlogData.tooLongWebsiteUrl
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blogs with websiteUrl that does not match the pattern`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error: ErrorMessage = [ERRORS_MESSAGES.BLOG_WEBSITE_URL]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`shouldn't update blogs with incorrect data`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        const data = {
            ...dataTestBlogUpdate01,
            name: incorrectBlogData.emptyName,
            description: incorrectBlogData.emptyDescription,
            websiteUrl: incorrectBlogData.incorrectWebsiteUrl
        }
        const error: ErrorMessage = [
            ERRORS_MESSAGES.BLOG_WEBSITE_URL,
            ERRORS_MESSAGES.BLOG_NAME,
            ERRORS_MESSAGES.BLOG_DESCRIPTION
        ]

        await blogsTestManager
            .updateBlog(blog.createdEntity, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog.createdEntity)
    })

    it(`should create 12 blogs with correct input data`, async () => {

        const blogs = await blogsTestManager.createBlogs(dataTestBlogCreate01)

        await request(app)
            .get(`${RouterPaths.blogs}/?pageSize=15`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: blogs
                })
    })

    it('should return page 3 and empty page size 3', async () => {

        const blogs = await blogsTestManager.createBlogs(dataTestBlogCreate01)

        await getRequest()
            .get(`${RouterPaths.blogs}/?pageSize=3&pageNumber=3`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 4,
                    page: 3,
                    pageSize: 3,
                    totalCount: 12,
                    items: blogs.slice(6, 9)
                })
    })

    it('should return blog with "me9" ', async () => {

        const blogs = await blogsTestManager.createBlogs(dataTestBlogCreate01)

        await getRequest()
            .get(`${RouterPaths.blogs}/?searchNameTerm=me9`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [blogs[2]]
                })
    })

    it('should return blogs "asc" ', async () => {

        const blogs = await blogsTestManager.createBlogs(dataTestBlogCreate01)

        await getRequest()
            .get(`${RouterPaths.blogs}/?pageSize=15&sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: blogs.reverse()
                })
    })

    let createdNewPostByBlog: any = []
    it(`should create 10 posts by blogs with correct input data`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const postsByBlogs = await blogsTestManager.createPostsByBlog(blog.createdEntity,dataTestPostByBlogCreate)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}/posts/?pageSize=15`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: postsByBlogs
                })
    })

    it('should return page 3 and page size 3', async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const postsByBlogs = await blogsTestManager.createPostsByBlog(blog.createdEntity,dataTestPostByBlogCreate)

        await getRequest()
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}/posts/?pageSize=3&pageNumber=3`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 4,
                    page: 3,
                    pageSize: 3,
                    totalCount: 12,
                    items: postsByBlogs.slice(6, 9)
                })
    })

    it('should return posts by blogs "asc" ', async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const postsByBlogs = await blogsTestManager.createPostsByBlog(blog.createdEntity,dataTestPostByBlogCreate)

        await getRequest()
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}/posts/?pageSize=15&sortDirection=asc`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 15,
                    totalCount: 12,
                    items: postsByBlogs.reverse()
                })
    })

    it(`should update blog with correct input module`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const blog2 = await blogsTestManager.createBlog(dataTestBlogCreate02)

        await blogsTestManager
            .createPostByBlog(blog.createdEntity, dataTestPostByBlogCreate)

        await blogsTestManager.updateBlog(blog.createdEntity, dataTestBlogUpdate01)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog2.createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, blog2.createdEntity)
    })

    it(`shouldn't delete  blog UNAUTHORIZED`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        await request(app)
            .delete(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
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

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        const blog2 = await blogsTestManager.createBlog(dataTestBlogCreate02)

        await request(app)
            .delete(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.blogs}/${blog.createdEntity.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.blogs}/${blog2.createdEntity.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.blogs}/${blog2.createdEntity.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })
})





