import request from 'supertest'
import {app, CreateVideoType} from "../src/settings";

// const getRequest = () => {
//     return request((app))
// }
describe('/videos', () => {
    beforeAll(async() => {
        await request(app).delete('/testing/all_data')
    })

    it ('should return 200 and empty array', async () => {
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    it ('should return 404 fot not existing videos', async () => {
        await request(app)
            .get('/videos/1')
            .expect(404)
    })

    it(`should'nt create video with incorrect title`, async () => {
        await request(app)
            .post('/videos')
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })
    it(`should'nt create video with incorrect author`, async () => {
        await request(app)
            .post('/videos')
            .send({author: ''})
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })
    it(`should'nt create video with incorrect availableResolutions`, async () => {
        await request(app)
            .post('/videos')
            .send({availableResolutions: ['']})
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })


    let createdNewVideos01:any = null
    it(`should create video with correct input data`, async () => {

        const data: CreateVideoType = { title: 'NewVideoTest',
            author: 'NewAuthorTest',
            availableResolutions: ["P144"]}

        const createResponse = await request(app)
            .post('/videos/')
            .send(data)
            .expect(201)

        createdNewVideos01 = createResponse.body;

        expect(createdNewVideos01).toEqual({
            ...createdNewVideos01,
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/videos/')
            .expect(200, [createdNewVideos01])
    })

})

