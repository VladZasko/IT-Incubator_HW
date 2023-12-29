export type QueryPostsModel = {
    /**
     * This title should be included in Title of found Posts
     */
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
}