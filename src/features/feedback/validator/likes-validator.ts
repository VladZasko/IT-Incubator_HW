import {body, check} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {FeedbackStatus} from "../models/FeedbackViewModel";

export const likesValidation = body('likeStatus').notEmpty().isIn(Object.values(FeedbackStatus)).withMessage('Incorrect like data!')

export const likeValidation = () => [ likesValidation, inputValidation]