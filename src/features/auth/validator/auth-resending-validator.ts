import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {authQueryRepository} from "../repositories/auth-query-repository";

export const emailValidation = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$').withMessage('Incorrect email!')
    .custom(async (value) => {
        const user = await authQueryRepository.findByLoginOrEmail(value)
        if (user?.emailConfirmation?.isConfirmed) {
            throw Error('email is already confirmed')
        }
        return true
    }).withMessage('email is already confirmed')

export const authResendingValidator = () => [ emailValidation, inputValidation]

