export declare global {
    namespace Blog {
        interface Profile {
            cover: string
        }
        interface Author {
            username: string,
            first_name: string,
            last_name: string,
            profile: Profile
        }
        interface Tag {
            name: string,
            id: string
        }
        interface Post {
            id: string,
            title: string,
            cover: string
            tags: Tag[],
            author: Author,
            created_at: string,
            updated_at: string,
            status: string,
            content: string,
        }
        interface Comment {
            id: string,
            user: Author,
            comment: string,
            parent: null | Comment,
            replies: Comment[],
            post: Post | number,
            created_at: string,
            updated_at: string,
        }
    }
}