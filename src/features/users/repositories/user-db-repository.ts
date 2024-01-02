import {UsersViewModel, UsersViewModelGetAllBlogs} from "../models/output/UsersViewModel";
import {usersCollection} from "../../../db/db";
import {userMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreateUserModel, CreateUserPassModel} from "../models/input/CreateUserModel";
import {QueryUserModel} from "../models/input/QueryUserModule";

export class userRepository {
    static async getAllUsers(sortData: QueryUserModel): Promise<UsersViewModelGetAllBlogs>{
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber =  sortData.pageNumber ?? 1
        const pageSize =  sortData.pageSize ?? 10

        let filter = {}


        if(searchLoginTerm||searchEmailTerm){
            filter = {$or:
                    [{email:{$regex: sortData.searchEmailTerm, $options: 'i'}},
                        {login: {$regex: sortData.searchLoginTerm, $options: 'i'}}]}
        }

        const users = await usersCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount:number = await usersCollection.countDocuments(filter)

        const pagesCount:number = Math.ceil(totalCount/ +pageSize)


        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: users.map(userMapper)
        }

    }

    static async createUser(createData : CreateUserPassModel):Promise<UsersViewModel> {


        const user = await usersCollection.insertOne({...createData})

        return {
            createdAt: createData.createdAt,
            email: createData.email,
            login: createData.login,
            id: user.insertedId.toString()
        }
    }
    static async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection
            .findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})

        return user
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}