// import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
// import {QueryVideosModel} from "./models/QueryVideosModule";
// import express, {Response} from "express";
// import {HTTP_STATUSES} from "../../utils";
// import {VideosViewModel} from "./models/VideosViewModel";
// import {CreateVideoModel} from "./models/CreateVideoModel";
// import {UpdateVideoModel} from "./models/UpdateVideoModule";
// import {DBType, ErrorType} from "../../db/memory-db";
// import {AvailableResolutions, VideoType} from "../../db/types/videos.types";
// import {URIParamsVideoIdModel} from "./models/URIParamsVideoIdModule";
//
// export const getVideosRoutes = () => {
//     const router = express.Router()
//     router.get('/', (req: RequestWithQuery<QueryVideosModel>,
//                         res: Response) => {
//         res
//             .status(HTTP_STATUSES.OK_200)
//             .send(db.videos)
//     })
//     router.get('/:id', (req: RequestWithParams<URIParamsVideoIdModel>,
//                             res: Response<VideosViewModel>) => {
//         const id = +req.params.id
//
//         const video = db.videos.find(v => v.id === id)
//
//         if(!video) {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
//             return;
//         }
//
//         res.send({
//             id: video.id,
//             title: video.title,
//             author: video.author,
//             canBeDownloaded: video.canBeDownloaded,
//             minAgeRestriction: video.minAgeRestriction,
//             createdAt: video.createdAt,
//             publicationDate: video.publicationDate,
//             availableResolutions: video.availableResolutions
//         })
//     })
//     router.post('/', (req:RequestWithBody<CreateVideoModel>,
//                          res: Response) => {
//         let errors: ErrorType = {
//             errorsMessages: []
//         }
//         let {title, author, availableResolutions} = req.body
//
//         if (!title || !title.trim() || title.trim().length > 40) {
//             errors.errorsMessages.push({message:'Invalid title', field:'title'})
//         }
//         if (!author || !author.trim() || author.trim().length > 20) {
//             errors.errorsMessages.push({message:'Invalid author', field:'author'})
//         }
//         if (!availableResolutions || availableResolutions.length === 0) {
//             errors.errorsMessages.push({message:'Invalid availableResolutions', field:'availableResolutions'})
//         }
//         if (availableResolutions && Array.isArray(availableResolutions)){
//             availableResolutions.forEach((r) => {
//                 !AvailableResolutions.includes(r) && errors.errorsMessages.push({message:'Invalid availableResolutions!', field:'availableResolutions'})
//             })
//         } else {
//             availableResolutions = []
//         }
//         if (errors.errorsMessages.length){
//             res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
//             return;
//         }
//
//         const createdAt = new Date()
//         const publicationDate = new Date()
//
//         publicationDate.setDate(createdAt.getDate()+1)
//
//         const newVideo: VideoType  = {
//             id: +(new Date()),
//             canBeDownloaded: false,
//             minAgeRestriction: null,
//             createdAt: createdAt.toISOString(),
//             publicationDate: publicationDate.toISOString(),
//             title,
//             author,
//             availableResolutions
//
//         }
//
//         db.videos.push(newVideo)
//         res
//             .status(HTTP_STATUSES.CREATED_201)
//             .send(newVideo)
//     })
//     router.put ('/:id', (req: RequestWithParamsAndBody<URIParamsVideoIdModel, UpdateVideoModel>,
//                              res: Response) => {
//         let errors: ErrorType = {
//             errorsMessages: []
//         }
//         let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
//
//         let foundVideo = db.videos.find(i => i.id === +req.params.id);
//         if(!foundVideo) {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
//             return;
//         }
//
//         if (!title || !title.trim() || title.trim().length > 40) {
//             errors.errorsMessages.push({message:'Invalid title', field:'title'})
//         }
//         if (!author || !author.trim() || author.length > 20) {
//             errors.errorsMessages.push({message:'Invalid author', field:'author'})
//         }
//         if (!canBeDownloaded || typeof (canBeDownloaded) !== "boolean") {
//             errors.errorsMessages.push({message:'Invalid canBeDownloaded', field:'canBeDownloaded'})
//         }
//         if (!availableResolutions || availableResolutions.length === 0) {
//             errors.errorsMessages.push({message:'Invalid availableResolutions', field:'availableResolutions'})
//         }
//
//         if (!minAgeRestriction || !minAgeRestriction === null || minAgeRestriction < 1 || minAgeRestriction > 18) {
//             errors.errorsMessages.push({message:'Invalid minAgeRestriction', field:'minAgeRestriction'})
//         }
//
//         const newDateISOString = new Date().toISOString()
//
//         if (!publicationDate || publicationDate.length < newDateISOString.length || typeof (publicationDate) !== "string" ) {
//             errors.errorsMessages.push({message:'Invalid publicationDate', field:'publicationDate'})
//         }
//         if (availableResolutions && Array.isArray(availableResolutions)){
//             availableResolutions.forEach((r) => {
//                 !AvailableResolutions.includes(r) && errors.errorsMessages.push({message:'Invalid availableResolutions!', field:'availableResolutions'})
//             })
//         } else {
//             availableResolutions = []
//         }
//         if (errors.errorsMessages.length){
//             res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
//             return;
//         }
//
//
//
//         foundVideo.title = req.body.title;
//         foundVideo.author = req.body.author;
//         foundVideo.availableResolutions = req.body.availableResolutions;
//         foundVideo.canBeDownloaded = req.body.canBeDownloaded;
//         foundVideo.minAgeRestriction = req.body.minAgeRestriction;
//         foundVideo.publicationDate = req.body.publicationDate;
//
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//
//     })
//     router.delete('/:id', (req: RequestWithParams<URIParamsVideoIdModel>,
//                                res) => {
//         let foundVideo = db.videos.find(i => i.id === +req.params.id);
//         if(!foundVideo) {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
//             return;
//         }
//         db.videos = db.videos.filter(c => c.id !== +req.params.id)
//
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     })
//     return router;
// }