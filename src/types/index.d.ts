import {UsersViewModel} from "../features/users/models/output/UsersViewModel";


declare global {
    declare namespace Express {
        export interface Request {
            user: UsersViewModel | null
        }
    }
}