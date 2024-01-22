import {NextFunction, Request, Response} from "express";
import {rateLimitType} from "../../db/db";
import {sub} from "date-fns";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const data = {
        IP: req.ip!,
        URL:req.originalUrl,
        date: new Date()
    }

    await rateLimitType.insertOne({...data})

    const countq = await rateLimitType.countDocuments({
        IP: {$regex: req.ip, $options: 'i'},
        URL: {$regex: req.originalUrl, $options: 'i'},
        date: {
            $gte: sub(new Date(), {
                seconds: 10
            }),
        },
    });

    if(countq > 5){
        res.sendStatus(429)
        return
    }

    next()
}