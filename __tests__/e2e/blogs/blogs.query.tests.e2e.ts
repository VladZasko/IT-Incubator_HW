// import request from 'supertest'
// import {app} from "../../../src/app";
// import {HTTP_STATUSES} from "../../../src/utils/utils";
// import {RouterPaths} from "../../../src/routerPaths";
// import {blogsTestManager} from "./utils/blogsTestManager";
// import {
//     dataTestBlogCreate,
//     dataTestBlogCreate01,
//     dataTestBlogCreate02, dataTestBlogCreate2,
//     dataTestBlogUpdate01, dataTestPostByBlogCreate01,
//     incorrectBlogData, queryExpect
// } from "./dataForTest/dataTestforBlog";
// import {ErrorMessage, ERRORS_MESSAGES} from "../../../src/utils/errors";
// import {dataTestPostCreate01, incorrectPostData} from "../posts/dataForTest/dataTestforPost";
// import {CreateBlogServiceModel} from "../../../src/features/blogs/models/input/CreateBlogModel";
// import {BlogType} from "../../../src/db/types/blogs.types";
//
//
//
// const getRequest = () => {
//     return request(app)
// }
// describe('test for query /blogs', () => {
//     beforeAll(async() => {
//         await getRequest().delete('/testing/all-data')
//     })
//
//     let createdNewBlog01:Array<Object> = []
//     it(`should create blog with correct input data`, async () => {
//
//         for (let i = 0; i < dataTestBlogCreate2.length; i++){
//             const result = await blogsTestManager.createBlog(dataTestBlogCreate2[i])
//             createdNewBlog01.push(result.createdEntity)
//         }
//
//
//         await request(app)
//             .get(RouterPaths.blogs)
//             .expect(HTTP_STATUSES.OK_200,
//                 { pagesCount: 2, page: 1, pageSize: 10, totalCount: 12, items: queryExpect })
//     })
//     //
//     // it('should return 200 and empty array', async () => {
//     //     await getRequest()
//     //         .get(RouterPaths.blogs)
//     //         .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
//     // })
//     //
//     // it('should return 404 fot not existing blogs', async () => {
//     //     await getRequest()
//     //         .get(`${RouterPaths.blogs}/1`)
//     //         .expect(HTTP_STATUSES.NOT_FOUND_404)
//     // })
//     //
//     // it('should return post for blog', async () => {
//     //     await getRequest()
//     //         .get(`${RouterPaths.blogs}/${createdNewBlog01.id}/posts`)
//     //         .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewPostByBlog01] })
//     // })
//     //
//     // it('should return page 2 and page size 1', async () => {
//     //     await getRequest()
//     //         .get(`${RouterPaths.blogs}/?pageSize=1&pageNumber=2`)
//     //         .expect(HTTP_STATUSES.OK_200,
//     //             { pagesCount: 2, page: 2, pageSize: 1, totalCount: 2, items: [createdNewBlog01] })
//     // })
//     //
//     // it('should return Blog02', async () => {
//     //     await getRequest()
//     //         .get(`${RouterPaths.blogs}/?searchNameTerm=02`)
//     //         .expect(HTTP_STATUSES.OK_200,
//     //             { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdNewBlog02] })
//     // })
//     //
//     // it('should return Blog01 after Blog02', async () => {
//     //     await getRequest()
//     //         .get(`${RouterPaths.blogs}/?sortDirection=asc`)
//     //         .expect(HTTP_STATUSES.OK_200,
//     //             { pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [createdNewBlog01, createdNewBlog02] })
//     // })
//     //
//     // it('should return 404 fot not existing blogs for update', async () => {
//     //
//     //     await getRequest()
//     //         .put(`${RouterPaths.blogs}/11515`)
//     //         .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//     //         .send(dataTestBlogUpdate01)
//     //         .expect(HTTP_STATUSES.NOT_FOUND_404)
//     // })
//
// })
//
//
//
//
