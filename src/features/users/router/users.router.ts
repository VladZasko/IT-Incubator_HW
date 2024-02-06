import  {Router} from "express";import {userValidation} from "../validator/user-validator";
import {authMiddleware} from "../../../middlewares/auth/auth-middleware";
import {usersController} from "../../composition-root";

export const usersRouter = Router({})


usersRouter.get('/', authMiddleware, usersController.getUsers.bind(usersController))
usersRouter.post('/', authMiddleware, userValidation(), usersController.createUser.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser.bind(usersController))
