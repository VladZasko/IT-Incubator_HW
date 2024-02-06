import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {authQueryRepository} from "../repositories/auth-query-repository";

export const passwordValidation = body('newPassword').isString().trim().isLength({min:6, max:20})
    .withMessage('Incorrect password!')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect password!')
export const recoveryCodeValidation = body('recoveryCode').isString().trim().withMessage('Incorrect code!')
    .custom(async (value) => {
        const user = await authQueryRepository.findUserByRecoveryCode(value)
        if (!user) {
            throw Error('RecoveryCode is incorrect')
        }
        if (user?.passwordRecovery?.recoveryCode !== value) {
            throw Error('RecoveryCode is incorrect')
        }
        if (user.passwordRecovery!.expirationDate < new Date()) {
            throw Error('RecoveryCode is expired')
        }
        return true
    }).withMessage('Incorrect code!')

export const newPasswordValidator = () => [ passwordValidation, recoveryCodeValidation, inputValidation]


