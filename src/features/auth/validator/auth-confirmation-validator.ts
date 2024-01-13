import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {authQueryRepository} from "../repositories/auth-query-repository";

export const codeValidation = body('code').isString().trim().withMessage('Incorrect code!')
    .custom(async (value) => {
        const user = await authQueryRepository.findUserByConfirmationCode(value)
        if (user?.emailConfirmation?.isConfirmed) {
            throw Error('email is already confirmed')
        }
        if (user?.emailConfirmation?.isConfirmed !== value) {
            throw Error('Incorrect code')
        }
        return true
    }).withMessage('email is already confirmed')

export const authConfirmationValidator = () => [codeValidation, inputValidation]

