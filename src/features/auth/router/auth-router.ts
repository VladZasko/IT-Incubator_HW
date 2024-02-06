import {Router} from "express";
import {authValidation} from "../validator/auth-validator";
import {authAccessTokenMiddleware} from "../../../middlewares/auth/auth-accessToken-middleware";
import {authRegistrationValidator} from "../validator/auth-registration-validator";
import {authConfirmationValidator} from "../validator/auth-confirmation-validator";
import {authResendingValidator} from "../validator/auth-resending-validator";
import {authRefreshTokenMiddleware} from "../../../middlewares/auth/auth-refreshToken-middleware";
import {authPasswordRecoveryValidator} from "../validator/password-recovery-validator";
import {newPasswordValidator} from "../validator/new-password-validator";
import {rateLimitMiddleware} from "../../../middlewares/rate-limit/rate-limit-middleware";
import {authController} from "../../composition-root";

export const authRouter = Router({})

authRouter.use(rateLimitMiddleware)
authRouter.post('/login', authValidation(), authController.login.bind(authController))
authRouter.post('/password-recovery', authPasswordRecoveryValidator(), authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', newPasswordValidator(), authController.newPassword.bind(authController))
authRouter.post('/refresh-token', authRefreshTokenMiddleware, authController.refreshToken.bind(authController))
authRouter.post('/registration-confirmation', authConfirmationValidator(), authController.registrationConfirmation.bind(authController))
authRouter.post('/registration', authRegistrationValidator(), authController.registration.bind(authController))
authRouter.post('/registration-email-resending', authResendingValidator(), authController.registrationEmailResending.bind(authController))
authRouter.post('/logout', authRefreshTokenMiddleware, authController.logout.bind(authController))
authRouter.get('/me', authAccessTokenMiddleware, authController.me.bind(authController))

