import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {authQueryRepository} from "../repositories/auth-query-repository";

export const loginValidation = body('login').isString().trim().isLength({min:3, max:10}).withMessage('Incorrect login!')
    .custom(async (value) => {
    const login = await authQueryRepository.findByLoginOrEmail(value)
    if (login) {
        throw Error('Incorrect login!')
    }
    return true
}).withMessage('Incorrect login!')
export const passwordValidation = body('password').isString().trim().isLength({min:6, max:20})
    .withMessage('Incorrect password!')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect password!')
export const emailValidation = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$').withMessage('Incorrect email!')
    .custom(async (value) => {
        const email = await authQueryRepository.findByLoginOrEmail(value)
        if (email) {
            throw Error('Incorrect email!')
        }
        return true
    }).withMessage('Incorrect email!')
export const authRegistrationValidator = () => [  loginValidation, passwordValidation, emailValidation, inputValidation]

