import {
    RequestWithBody,
    RequestWithParams,
    RequestWithQuery
} from "../../utils/types";
import {Response} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../../utils/utils";
import {QueryUserModel} from "./models/input/QueryUserModule";
import {UsersViewModel, UsersViewModelGetAllUsers} from "./models/output/UsersViewModel";
import {userQueryRepository} from "./repositories/user-query-repository";
import {CreateUserModel} from "./models/input/CreateUserModel";
import {URIParamsUserIdModel} from "./models/input/URIParamsUserIdModule";
import {UsersService} from "./domain/users-service";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: RequestWithQuery<QueryUserModel>,
                   res: Response<UsersViewModelGetAllUsers>) {

        const sortData: QueryUserModel = {
            searchLoginTerm: req.query.searchLoginTerm,
            searchEmailTerm: req.query.searchEmailTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        }

        const users: UsersViewModelGetAllUsers = await userQueryRepository.getAllUsers(sortData)

        res.send(users)
    }

    async createUser(req: RequestWithBody<CreateUserModel>,
                     res: Response<UsersViewModel>) {

        const createData: CreateUserModel = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        }

        const newUser: UsersViewModel = await this.usersService.createUser(createData)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newUser)

    }

    async deleteUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const deleteUser = await this.usersService.deleteUserById(id)
        if (!deleteUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}