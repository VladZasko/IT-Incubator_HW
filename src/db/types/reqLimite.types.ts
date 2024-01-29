import {WithId} from "mongodb";

export type RateLimiteType = WithId<{
    IP: string
    URL:string
    date: Date
}>

export type RateLimiteBDtype = Array<RateLimiteType>