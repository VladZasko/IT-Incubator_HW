export type CreateBlogModel = {
    /**
     * blog name, description, websiteUrl
     */
    name: string,
    description: string,
    websiteUrl: string
}

export type CreatePostBlogModel = {
    /**
     * blog name, description, websiteUrl
     */
    title: string,
    shortDescription: string,
    content: string
}

