import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {authQueryRepository} from "../repositories/auth-query-repository";

export const codeValidation = body('code').isString().trim().withMessage('Incorrect code!')
    .custom(async (value) => {
        const user = await authQueryRepository.findUserByConfirmationCode(value)
        if (!user) {
            throw Error('user not found')
        }
        if (user?.emailConfirmation?.isConfirmed) {
            throw Error('email is already confirmed')
        }
        if (user?.emailConfirmation?.confirmationCode !== value) {
            throw Error('Incorrect code!')
        }
        return true
    }).withMessage('Incorrect code!')

export const authConfirmationValidator = () => [codeValidation, inputValidation]

