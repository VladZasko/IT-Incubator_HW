import {body, query} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";

export const loginValidation = body('login').isString().trim().isLength({min:3, max:10}).withMessage('Incorrect login!')
export const passwordValidation = body('password').isString().trim().isLength({min:6, max:20})
    .withMessage('Incorrect password!')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect password!')
export const emailValidation = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$\n").withMessage('Incorrect email!')

export const userValidation = () => [  loginValidation, passwordValidation, emailValidation, inputValidation]

