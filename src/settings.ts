import express, {Request, Response} from "express";

export const app = express()

app.use(express.json())

const AvailableResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160"]

export type VideoDBType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}

let videos :VideoDBType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-12-11T08:40:46.569Z",
        publicationDate: "2023-12-11T08:40:46.569Z",
        availableResolutions: [
            "P144"
        ]
    }
]

type RequestWithParams<P> = Request<P>
type RequestWithBody<B> = Request<{}, {}, B>
export type CreateVideoType = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
type ErrorMessageType = {
    message: string
    field: string
}
type ErrorType = {
    errorsMessages: ErrorMessageType[]
}
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.get('/videos/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    const id = +req.params.id

    const video = videos.find(v => v.id === id)

    if(!video) {
        res.sendStatus(404);
        return;
    }

    res.send(video)
})

app.post('/videos', (req:RequestWithBody<CreateVideoType> , res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body

    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message:'Invalid title', field:'title'})
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({message:'Invalid author', field:'author'})
    }
    if (!availableResolutions || availableResolutions.length === 0) {
        errors.errorsMessages.push({message:'Invalid availableResolutions', field:'availableResolutions'})
    }
    if (availableResolutions && Array.isArray(availableResolutions)){
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message:'Invalid availableResolutions!', field:'availableResolutions'})
        })
    } else {
        availableResolutions = []
    }
    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return;
    }

    const createdAt = new Date()
    const publicationDate = new Date()

    publicationDate.setDate(createdAt.getDate()+1)

    const newVideo: VideoDBType = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions

    }

    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.put ('/videos/:id', (req: Request, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message:'Invalid title', field:'title'})
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({message:'Invalid author', field:'author'})
    }
    if (!availableResolutions || availableResolutions.length === 0) {
        errors.errorsMessages.push({message:'Invalid availableResolutions', field:'availableResolutions'})
    }
    if (availableResolutions && Array.isArray(availableResolutions)){
        availableResolutions.forEach((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message:'Invalid availableResolutions!', field:'availableResolutions'})
        })
    } else {
        availableResolutions = []
    }
    if (!canBeDownloaded) {
        errors.errorsMessages.push({message:'Invalid canBeDownloaded', field:'canBeDownloaded'})
    }
    if (!minAgeRestriction || !minAgeRestriction === null || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errors.errorsMessages.push({message:'Invalid minAgeRestriction', field:'minAgeRestriction'})
    }
    if (!publicationDate) {
        errors.errorsMessages.push({message:'Invalid publicationDate', field:'publicationDate'})
    }
    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return;
    }

    let foundVideo = videos.find(i => i.id === +req.params.id);
    if(!foundVideo) {
        res.sendStatus(404);
        return;
    }

    foundVideo.title = req.body.title;
    foundVideo.author = req.body.author;
    foundVideo.availableResolutions = req.body.availableResolutions;
    foundVideo.canBeDownloaded = req.body.canBeDownloaded;
    foundVideo.minAgeRestriction = req.body.minAgeRestriction;
    foundVideo.publicationDate = req.body.publicationDate;

    // foundVideo = {
    //     ...foundVideo,
    //     title: req.body.title,
    //     author: req.body.author,
    //     availableResolutions: req.body.availableResolutions,
    //     canBeDownloaded: req.body.canBeDownloaded,
    //     minAgeRestriction: req.body.minAgeRestriction,
    //     publicationDate: req.body.publicationDate
    // }



    res.sendStatus(204)

})

app.delete('/videos/:id', (req, res) => {

    videos = videos.filter(c => c.id !== +req.params.id)
    res.sendStatus(204)
})

app.delete('/testing/all_data', (req, res) => {
    videos = [];
    res.sendStatus(204)
})

