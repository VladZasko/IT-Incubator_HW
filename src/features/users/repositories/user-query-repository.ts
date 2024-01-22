import {UsersViewModel, UsersViewModelGetAllBlogs} from "../models/output/UsersViewModel";
import {userMapper} from "../mappers/mappers";
import {QueryUserModel} from "../models/input/QueryUserModule";
import {ObjectId} from "mongodb";
import {usersAuthCollection} from "../../../db/db";

export class userQueryRepository {
    static async getAllUsers(sortData: QueryUserModel): Promise<UsersViewModelGetAllBlogs>{
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber =  sortData.pageNumber ?? 1
        const pageSize =  sortData.pageSize ?? 10

        let filter = {}


        if(searchLoginTerm){
            filter = {
                'accountData.login': {$regex: searchLoginTerm, $options: 'i'}
            }
        }
        if (searchEmailTerm){
            filter = {
                'accountData.email': {$regex: searchEmailTerm, $options: 'i'}
            }
        }
        if (searchLoginTerm && searchEmailTerm){
            filter = {$or:
                    [{'accountData.email':{$regex: searchEmailTerm, $options: 'i'}},
                        {'accountData.login': {$regex: searchLoginTerm, $options: 'i'}}]}
        }

        const users = await usersAuthCollection
            .find(filter)
            .sort(`accountData.${sortBy}`, sortDirection)
            .skip((pageNumber-1)* +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount:number = await usersAuthCollection.countDocuments(filter)

        const pagesCount:number = Math.ceil(totalCount/ +pageSize)


        return {
            pagesCount,
            page: +pageNumber ,
            pageSize: +pageSize,
            totalCount,
            items: users.map(userMapper)
        }

    }
    static async getUserById(id: string): Promise<UsersViewModel | null> {
        const user = await usersAuthCollection.findOne({_id: new ObjectId(id)})

        if (!user){
            return null
        }

        return userMapper(user)
    }
    static async findByLoginOrEmail(loginOrEmail: string) {
        return await usersAuthCollection
            .findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
    }
}