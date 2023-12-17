import request from 'supertest'
import {app} from "../src/app";
import {HTTP_STATUSES} from "../src/utils";
import {CreateBlogModel} from "../src/features/blogs/models/CreateBlogModel";


const getRequest = () => {
    return request(app)
}
describe('/posts', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    it ('should return 200 and empty array', async () => {
        await getRequest()
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it ('should return 404 fot not existing posts', async () => {
        await getRequest()
            .get('/posts/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create post with UNAUTHORIZED`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW')
            .send({
                title: 'TestPost',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create post with empty title`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with name more than 15 characters`, async () => {
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blog with empty description`, async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'NewName',
                description: '',
                websiteUrl: 'string'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with description more than 500 characters`, async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'NewName',
                description: 'Cartel talk does not allow modern research replicated from foreign sources to overcome the current difficult economic situation and appear as contenders for the role of key factors. By the way, basic settings for user behavior can be considered a social-democratic anathema. Here is a memorable example of a modern trend: high quality positional research predetermines our relevance and deep mental reasoning. But the development of modern methodology reveals the urgent need for a personnel training system that meets urgent needs.',
                websiteUrl: 'string'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with empty websiteUrl`, async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'NewName',
                description: 'NewDescription',
                websiteUrl: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it(`shouldn't create blogs with websiteUrl more than 100 characters`, async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'NewName',
                description: 'NewDescription',
                websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create blogs with websiteUrl that does not match the pattern`, async () => {
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'NewName',
                description: 'NewDescription',
                websiteUrl: 'NewTestWebsiteUrl'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdNewBlog01:any = null
    it(`should create blog with correct input data`, async () => {

        const data: CreateBlogModel = {
            name: 'NewTestName',
            description: 'NewTestDescription',
            websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
        }

        const createResponse = await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewBlog01 = createResponse.body;

        expect(createdNewBlog01).toEqual({
            ...createdNewBlog01,
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        })

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdNewBlog01])
    })

    let createdNewBlog02:any = null
    it(`created one more blogs`, async () => {

        const data: CreateBlogModel = {
            name: 'NewTestNameMore',
            description: 'NewTestDescriptionMore',
            websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
        }

        const createResponse = await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewBlog02 = createResponse.body;

        expect(createdNewBlog02).toEqual({
            ...createdNewBlog02,
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        })

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [createdNewBlog01, createdNewBlog02])
    })

    it ('should return 404 fot not existing blogs for update', async () => {
        const data = {
            name: 'UpdateTest',
            description: 'UpdateTest',
            websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
        }


        await getRequest()
            .put('/blogs/11515')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't update blog with UNAUTHORIZED`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW')
            .send({
                name: 'string',
                description: 'string',
                websiteUrl: 'string'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't update blog with empty name`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: '',
                description: 'string',
                websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blog with name more than 15 characters`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'UpdateNameUpdateName',
                description: 'string',
                websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blog with empty description`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'UpdateName',
                description: '',
                websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with description more than 500 characters`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'UpdateName',
                description: 'Cartel talk does not allow modern research replicated from foreign sources to overcome the current difficult economic situation and appear as contenders for the role of key factors. By the way, basic settings for user behavior can be considered a social-democratic anathema. Here is a memorable example of a modern trend: high quality positional research predetermines our relevance and deep mental reasoning. But the development of modern methodology reveals the urgent need for a personnel training system that meets urgent needs.',
                websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with empty websiteUrl`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'UpdateName',
                description: 'UpdateDescription',
                websiteUrl: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })
    it(`shouldn't update blogs with websiteUrl more than 100 characters`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'UpdateName',
                description: 'UpdateDescription',
                websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`shouldn't update blogs with websiteUrl that does not match the pattern`, async () => {
        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'UpdateName',
                description: 'UpdateDescription',
                websiteUrl: 'UpdateURLTest_UpdateURLTest_UpdateURLTest'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog01)
    })

    it(`should update blog with correct input module`, async () => {
        const data = {
            name: 'UpdateTest',
            description: 'UpdateTest',
            websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
        }

        await request(app)
            .put(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdNewBlog01,
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })

        await request(app)
            .get(`/blogs/${createdNewBlog02.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewBlog02)
    })

    it(`shouldn't delete  blog`, async () => {

        await request(app)
            .delete('/blogs/7779161')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should delete both blog`, async () => {

        await request(app)
            .delete(`/blogs/${createdNewBlog01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/blogs/${createdNewBlog01.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`/blogs/${createdNewBlog02.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`/blogs/${createdNewBlog02.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/blogs/')
            .expect(HTTP_STATUSES.OK_200, [])
    })


})




