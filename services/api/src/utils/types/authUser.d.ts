export { }

declare module 'equipped/lib/utils/authUser' {
    interface AuthUser {
        email: string
        isVerified: boolean
    }
}