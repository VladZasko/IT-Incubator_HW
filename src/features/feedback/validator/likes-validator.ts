import {body, check} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {LikesStatus} from "../models/FeedbackViewModel";

export const likesValidation = body('likeStatus').notEmpty().isIn(Object.values(LikesStatus)).withMessage('Incorrect like data!')

export const likeValidation = () => [ likesValidation, inputValidation]