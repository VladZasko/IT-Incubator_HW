import {UsersViewModel, UsersViewModelGetAllBlogs} from "../models/output/UsersViewModel";
import {usersCollection} from "../../../db/db";
import {userMapper} from "../mappers/mappers";
import {ObjectId} from "mongodb";
import {CreateUserModel} from "../models/input/CreateUserModel";
import {QueryUserModel} from "../models/input/QueryUserModule";
import bcrypt from 'bcrypt'
import {userRepository} from "../repositories/user-db-repository";

export class userService {
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

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(createData.password, passwordSalt)

        const newUser = {
            login: createData.login,
            email: createData.email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordSalt
        }

        const user = await usersCollection.insertOne({...newUser})

        return {
            createdAt: newUser.createdAt,
            email: newUser.email,
            login: newUser.login,
            id: user.insertedId.toString()
        }
    }
    static async checkCredentials(loginOrEmail: string, password: string){
        const user = await userRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }

        // const passwordHash = await this._generateHash(password, user.passwordSalt)
        // if(user.passwordHash !== passwordHash) {
        //     return false
        // }
        return true
    }
    static async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password,salt)
        return hash
    }
    static async deleteUserById(id: string): Promise<boolean> {
        const foundUser = await usersCollection.deleteOne({_id:new ObjectId(id)})

        return !!foundUser.deletedCount
    }
}