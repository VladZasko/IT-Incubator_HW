
export type UsersViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UsersViewModelGetAllBlogs = {
    pagesCount: number
    page: number,
    pageSize: number
    totalCount: number
    items: UsersViewModel[]
}
