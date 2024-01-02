import {
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery
} from "../../types";
import { QueryUserModel} from "./models/input/QueryUserModule";
import express, {Response} from "express";
import {HTTP_STATUSES} from "../../utils";
import {URIParamsUserIdModel} from "./models/input/URIParamsUserIdModule";
import {UsersViewModelGetAllBlogs} from "./models/output/UsersViewModel";
import {CreateUserModel} from "./models/input/CreateUserModel";
import {DBType} from "../../db/memory-db";
import {userValidation} from "./validator/user-validator";
import {userRepository} from "./repositories/user-db-repository";
import {authMiddleware} from "../../middlewares/auth/auth-middleware";
import {ObjectId} from "mongodb";
import {userService} from "./domain/user-service";




export const getUsersRoutes = () => {
    const router = express.Router()
    router.get('/', authMiddleware, async (req: RequestWithQuery<QueryUserModel>,
                        res: Response) => {

        const sortData:QueryUserModel = {
            searchLoginTerm: req.query.searchLoginTerm,
            searchEmailTerm: req.query.searchEmailTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        }

        const users:UsersViewModelGetAllBlogs = await userRepository.getAllUsers(sortData)

        res.send(users)
    })

    router.post('/', authMiddleware, userValidation(),
        async (req:RequestWithBody<CreateUserModel>,
               res: Response) => {

        const createData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }

        const newUser = await userService.createUser(createData)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newUser)

    })

    router.delete('/:id',authMiddleware,
        async (req: RequestWithParams<URIParamsUserIdModel>,
               res) => {

        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const deleteUser = await userRepository.deleteUserById(id)
        if(!deleteUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    return router;
}