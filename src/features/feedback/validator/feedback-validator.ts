import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";

export const commentContentValidation = body('content').isString().trim().isLength({
    min:20,
    max:300
}).withMessage('Incorrect content!')

export const commentValidation = () => [ commentContentValidation, inputValidation]