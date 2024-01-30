import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";

export const emailValidation = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$').withMessage('Incorrect email!')



export const authPasswordRecoveryValidator = () => [ emailValidation, inputValidation]

