import {UsersViewModel} from "../features/users/models/output/UsersViewModel";
import {RefreshTokensMetaDBType} from "../db/types/token.types";


declare global {
    declare namespace Express {
        export interface Request {
            user: UsersViewModel | null,
            refreshTokenMeta: RefreshTokensMetaDBType | null
        }
    }
}