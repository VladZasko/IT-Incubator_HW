import request from 'supertest'
import {app} from "../src/app";
import {HTTP_STATUSES} from "../src/utils";
import {CreateBlogModel} from "../src/features/blogs/models/CreateBlogModel";
import {CreatePostModel} from "../src/features/posts/models/CreatePostModel";
import {RouterPaths} from "../src/routerPaths";


const getRequest = () => {
    return request(app)
}
describe('/posts', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 fot not existing posts', async () => {
        await getRequest()
            .get(`${RouterPaths.posts}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create post with UNAUTHORIZED`, async () => {
        await request(app)
            .post(RouterPaths.posts)
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
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with title more than 15 characters`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPostTestPost',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with shortDescription title`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost',
                shortDescription: '',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with shortDescription more than 100 characters`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPostTestPost',
                shortDescription: 'TestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with empty content`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost',
                shortDescription: 'TestPost',
                content: '',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with content more than 1000 characters`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPostTestPost',
                shortDescription: 'TestPost',
                content: 'TestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPostTestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with empty blogId`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with incorrect blogId`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost',
                shortDescription: 'TestPost',
                content: 'TestPost',
                blogId: 'TestPost'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdNewPost01: any = null
    let createdNewBlog01: any= null
    it(`should create post with correct input data`, async () => {

        const dataCreate: CreateBlogModel = {
            name: 'BlogForPost',
            description: 'BlogForPost',
            websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
        }

        const createResponseBlog = await request(app)
            .post(RouterPaths.blogs)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(dataCreate)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewBlog01 = createResponseBlog.body;
        const data: CreatePostModel = {
            title: 'TestPost',
            shortDescription: 'TestPost',
            content: 'TestPost',
            blogId: createdNewBlog01.id
        }

        const createResponse = await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewPost01 = createResponse.body;

        expect(createdNewPost01).toEqual({
            ...createdNewPost01,
            id: expect.any(String),
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId
        })

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [createdNewPost01])
    })

    let createdNewPost02:any = null
    let createdNewBlog02: any= null
    it(`created one more posts`, async () => {
        const dataCreate: CreateBlogModel = {
            name: 'BlogForPost2',
            description: 'BlogForPost2',
            websiteUrl: 'https://ibpg10OVF2B4QRlTzRi65UjXsbrgFh3OHmUX1nDrbyqEoKFyK2hFxl._BUVCPEEnX_ldiwp9uDYI0XMDiwUWalUNGNh_'
        }

        const createResponseBlog = await request(app)
            .post(RouterPaths.blogs)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(dataCreate)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewBlog02 = createResponseBlog.body;

        const data: CreatePostModel = {
            title: 'TestPost2',
            shortDescription: 'TestPost2',
            content: 'TestPost2',
            blogId:  createdNewBlog02.id
        }

        const createResponse = await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewPost02 = createResponse.body;

        expect(createdNewPost02).toEqual({
            ...createdNewPost02,
            id: expect.any(String),
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId
        })

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [createdNewPost01, createdNewPost02])
    })

    it ('should return 404 fot not existing posts for update', async () => {
        const data = {
            title: 'TestPost2',
            shortDescription: 'TestPost2',
            content: 'TestPost2',
            blogId: createdNewBlog02.id
        }

        await getRequest()
            .put(`${RouterPaths.posts}/11515`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't update posts with UNAUTHORIZED`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW')
            .send({
                title: 'TestPost2',
                shortDescription: 'TestPost2',
                content: 'TestPost2',
                blogId: createdNewBlog02.id
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't update posts with empty title`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: '',
                shortDescription: 'TestPost2',
                content: 'TestPost2',
                blogId: createdNewBlog01.id
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blog with name more than 30 characters`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2TestPost2TestPost2TestPost2',
                shortDescription: 'TestPost2',
                content: 'TestPost2',
                blogId: createdNewBlog01.id
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty shortDescription`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2',
                shortDescription: '',
                content: 'TestPost2',
                blogId: createdNewBlog01.id
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with shortDescription more than 100 characters`, async () => {
        await request(app)
            .put(`/posts/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2',
                shortDescription: 'TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2',
                content: 'TestPost2',
                blogId: createdNewBlog01.id
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty content`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2',
                shortDescription: '',
                content: '',
                blogId: createdNewBlog01.id
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with content more than 1000 characters`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2',
                shortDescription: 'TestPost2',
                content: 'TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2TestPost2',
                blogId: createdNewBlog01.id
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty blogId`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2',
                shortDescription: 'TestPost2',
                content: 'TestPost2',
                blogId: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with incorrect blogId`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'TestPost2',
                shortDescription: 'TestPost2',
                content: 'TestPost2',
                blogId: '123'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`should update blog with correct input module`, async () => {
        const data = {
            title: 'TestPost2',
            shortDescription: 'TestPost2',
            content: 'TestPost2',
            blogId: createdNewBlog01.id
        }

        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdNewPost01,
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId
            })

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost02.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost02)
    })

    it(`shouldn't delete  blog`, async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/7779161`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should delete both blog`, async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.posts}/${createdNewPost02.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost02.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })


})




