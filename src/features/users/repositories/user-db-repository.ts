import {UsersViewModel, UsersViewModelGetAllBlogs} from "../models/output/UsersViewModel";
import {usersCollection} from "../../../db/db";
import {userMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreateUserModel} from "../models/input/CreateUserModel";
import {QueryUserModel} from "../models/input/QueryUserModule";

export class UserRepository {
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
                login: {$regex: searchLoginTerm, $options: 'i'}
            }
        }
        if(searchEmailTerm){
            filter = {
                email: {$regex: searchEmailTerm, $options: 'i'}
            }
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

    static async createUser(createData : CreateUserModel):Promise<UsersViewModel> {
        const newUser = {
            ...createData,
            createdAt: new Date().toISOString()
        }

        const user = await usersCollection.insertOne({...newUser})

        return {
            ...newUser,
            id: user.insertedId.toString()
        }
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}