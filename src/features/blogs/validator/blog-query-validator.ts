import {query} from "express-validator";

export const pageSizeValidation = query('pageSize').toFloat()
export const pageNumberValidation = query('pageNumber').toFloat()

export const queryValidation = () => [ pageSizeValidation, pageNumberValidation ]
