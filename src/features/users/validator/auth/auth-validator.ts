import {body} from "express-validator";
import {inputValidation} from "../../../../middlewares/input-modul-validation/input-validation";

export const loginOrEmailValidation = body('loginOrEmail').isString().notEmpty().withMessage('empty loginOrEmail')
export const passwordValidation = body('password').isString().notEmpty().withMessage('empty password')

export const authValidation = () => [  loginOrEmailValidation, passwordValidation, inputValidation]

