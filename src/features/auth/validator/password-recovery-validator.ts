import {body, ValidationError, validationResult} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {authQueryRepository} from "../repositories/auth-query-repository";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../../utils/utils";
import {inputRecoveryValidation} from "./input-recovery-validation";

export const emailValidation = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$').withMessage('Incorrect email!')



export const authPasswordRecoveryValidator = () => [ emailValidation, inputValidation]

