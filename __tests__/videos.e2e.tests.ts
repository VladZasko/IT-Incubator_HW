import request from 'supertest'
import {app} from "../src/app";
import {HTTP_STATUSES} from "../src/utils";
import {CreateVideoType} from "../src/db/db";
import {UpdateVideoModel} from "../src/models/UpdateVideoModule";



const getRequest = () => {
    return request(app)
}
describe('/videos', () => {
    beforeAll(async() => {
        await getRequest().delete('/testing/all-data')
    })

    it ('should return 200 and empty array', async () => {
        await getRequest()
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it ('should return 404 fot not existing videos', async () => {
        await getRequest()
            .get('/videos/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create video with empty title`, async () => {
        await request(app)
            .post('/videos')
            .send({
                title: '',
                author: 'NewAuthorTest',
                availableResolutions: ["P144"]
        })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create video with title more than 40 characters`, async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'NewVideosNewVideosNewVideosNewVideosNewVideos',
                author: 'NewAuthorTest',
                availableResolutions: ["P144"]
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create video with empty author`, async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'NewVideoTest',
                author: '',
                availableResolutions: ["P144"]
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create video with author more than 20 characters`, async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'NewVideoTest',
                author: 'NewAuthorTestNewAuthorTest',
                availableResolutions: ["P144"]
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create video with incorrect availableResolutions`, async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'NewVideoTest',
                author: 'NewAuthorTest',
                availableResolutions: ['P1']
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create video with empty availableResolutions`, async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'NewVideoTest',
                author: 'NewAuthorTest',
                availableResolutions: []
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdNewVideos01:any = null
    it(`should create video with correct input data`, async () => {

        const data: CreateVideoType = {
            title: 'NewVideoTest',
            author: 'NewAuthorTest',
            availableResolutions: ["P144"]
        }

        const createResponse = await request(app)
            .post('/videos/')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewVideos01 = createResponse.body;

        expect(createdNewVideos01).toEqual({
            ...createdNewVideos01,
            id: expect.any(Number),
            title: data.title,
            author: data.author,
            availableResolutions: data.availableResolutions
        })

        await request(app)
            .get('/videos/')
            .expect(HTTP_STATUSES.OK_200, [createdNewVideos01])
    })

    let createdNewVideos02: any = null
    it(`created one more videos`, async () => {
        const data: CreateVideoType = {
            title: 'NewVideoTest2',
            author: 'NewAuthorTest2',
            availableResolutions: ["P2160"]
        }

        const createResponse = await request(app)
            .post('/videos/')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdNewVideos02 = createResponse.body;

        expect(createdNewVideos02).toEqual({
            ...createdNewVideos02,
            id: expect.any(Number),
            title: data.title,
            author: data.author,
            availableResolutions: data.availableResolutions
        })

        await request(app)
            .get('/videos/')
            .expect(HTTP_STATUSES.OK_200, [createdNewVideos01, createdNewVideos02])
    })

    it ('should return 404 fot not existing videos for update', async () => {
        await getRequest()
            .put('/videos/11515')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't update video with empty title`, async () => {
        const data: UpdateVideoModel = {
            title: '',
            author: 'UpdateAuthor',
            availableResolutions: ["P1080"],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with title more than 40 characters`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitleUpdateTitleUpdateTitleUpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P1080"],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with empty author`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: '',
            availableResolutions: ["P1080"],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with author more than 20 characters`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthorUpdateAuthor',
            availableResolutions: ["P1080"],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with incorrect availableResolutions`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P1"],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with empty availableResolutions`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: [],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with incorrect canBeDownloaded`, async () => {
        const data = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P144"],
            canBeDownloaded: null,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with minAgeRestriction more than 18 characters`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P144"],
            canBeDownloaded: true,
            minAgeRestriction: 19,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with minAgeRestriction less than 1`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P144"],
            canBeDownloaded: true,
            minAgeRestriction: 0,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with incorrect minAgeRestriction`, async () => {
        const data = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P144"],
            canBeDownloaded: true,
            minAgeRestriction: null,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`shouldn't update video with incorrect publicationDate`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P144"],
            canBeDownloaded: true,
            minAgeRestriction: 15,
            publicationDate: ''
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos01)
    })

    it(`should update video with correct input module`, async () => {
        const data: UpdateVideoModel = {
            title: 'UpdateTitle',
            author: 'UpdateAuthor',
            availableResolutions: ["P1080"],
            canBeDownloaded: true,
            minAgeRestriction: 3,
            publicationDate: '2023-12-11T08:40:46.569Z'
        }

        await request(app)
            .put('/videos/' + createdNewVideos01.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdNewVideos01,
                title: data.title,
                canBeDownloaded: data.canBeDownloaded,
                minAgeRestriction: data.minAgeRestriction,
                publicationDate: data.publicationDate,
                author: data.author,
                availableResolutions: data.availableResolutions
            })

        await request(app)
            .get('/videos/' + createdNewVideos02.id)
            .expect(HTTP_STATUSES.OK_200, createdNewVideos02)
    })

    it(`shouldn't delete  video`, async () => {

        await request(app)
            .delete('/videos/7779161')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

        it(`should delete both video`, async () => {

        await request(app)
            .delete('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/videos/' + createdNewVideos01.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete('/videos/' + createdNewVideos02.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get('/videos/' + createdNewVideos02.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/videos/')
            .expect(HTTP_STATUSES.OK_200, [])
    })


})




